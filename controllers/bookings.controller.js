const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const qr = require("qr-image");
const { v4: uuidv4 } = require("uuid");
const { addNotification } = require("../libs/notification");

exports.createBookings = async (req, res, next) => {
  try {
    const { flight_class_id, total_price, include_return, passangers } = req.body;

    const category_baby = await prisma.category.findFirst({
      where: {
        type: "baby",
      },
    });

    if (!category_baby) {
      return res.status(404).json({
        status: false,
        message: 'Category "baby" not found',
        data: null,
      });
    }

    // Menghitung total seat berdasarkan category yang bukan baby
    const total_seat = passangers.filter((passanger) => passanger.category_id !== category_baby.id).length;

    // // Mengambil FE_URL, ubah menjadi QR code, dan upload ke imagekit
    const qrCodeData = process.env.FE_URL;
    const qrCode = qr.imageSync(qrCodeData, { type: "png" });
    const uploadedImage = await imagekit.upload({
      file: qrCode.toString("base64"),
      fileName: `${uuidv4()}_qrcode.png`, // Random string
    });

    const qr_url = uploadedImage.url;

    // Menghitung waktu expiredAt
    const expired = new Date(Date.now() + 15 * 60 * 1000);

    // Membuat booking
    const createdBooking = await prisma.booking.create({
      data: {
        total_seat,
        total_price,
        include_return,
        passengers: {
          create: passangers.map((passanger) => ({
            name: passanger.name,
            birthdate: new Date(passanger.birthdate),
            identity_id: passanger.identity_id,
            citizenship: passanger.citizenship,
            category_id: passanger.category_id,
          })),
        },
        payment: {
          create: {
            total_payment: total_price,
            qr_url: qr_url,
            expiredAt: expired,
            user_id: req.user_data.id,
          },
        },
        flight_class: {
          connect: {
            id: flight_class_id,
          },
        },
      },
      include: {
        passengers: true,
        payment: true,
        flight_class: true,
      },
    });

    await addNotification("Ticket Bookings", "Your Ticket has been successfully created. Please completed the payment.", req.user_data.id);

    if (!createdBooking) {
      return res.status(404).json({
        status: false,
        message: "Created Booking Failed.",
        data: null,
      });
    }

    return res.status(201).json({
      status: true,
      message: "Successfully created booking",
      data: createdBooking,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const { page = 1, status } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    // kondisi filter untuk status_payment jika ada
    let filterStatus = {
      user_id: req.user_data.id,
    };

    if (status) {
      filterStatus.status = status.toUpperCase();
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        skip: parseInt(skip),
        take: parseInt(limit),
        where: {
          payment: {
            user_id: req.user_data.id,
            status: status ? status.toUpperCase() : undefined,
          },
        },
        include: {
          payment: true,
          passengers: true,
          flight_class: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),

      prisma.booking.count({
        where: {
          payment: {
            user_id: req.user_data.id,
            status: status ? status.toUpperCase() : undefined,
          },
        },
      }),
    ]);

    // looping untuk cek pada saat tiket expired, status paid menjadi cancelled
    for (const booking of bookings) {
      if (booking.payment.status === "UNPAID" && booking.payment.expiredAt < new Date()) {
        await prisma.payment.update({
          where: { id: booking.payment.id },
          data: { status: "CANCELLED" },
        });
        booking.payment.status = "CANCELLED";
      }
    }

    const totalPages = Math.ceil(total / limit);

    // if (!bookings) {
    //   return res.status(404).json({
    //     status: false,
    //     message: "Data bookings not found.",
    //     data: null,
    //   });
    // }
    if (!bookings.length) {
      return res.status(404).json({
        status: false,
        message: status ? `Data bookings not found with status ${status.toUpperCase()}.` : "Data bookings not found.",
        data: null,
      });
    }

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved bookings data",
      data: {
        bookings,
        page: parseInt(page),
        total_pages: totalPages,
        total_items: total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookingsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const bookings = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        payment: true,
        passengers: true,
        flight_class: true,
      },
    });

    if (!bookings) {
      return res.status(404).json({
        status: false,
        message: "Data bookings not found.",
        data: null,
      });
    }

    // looping untuk cek pada saat tiket expired, status paid menjadi cancelled
    if (bookings.payment.status === "UNPAID" && bookings.payment.expiredAt < new Date()) {
      await prisma.payment.update({
        where: { id: bookings.payment.id },
        data: { status: "CANCELLED" },
      });
      bookings.payment.status = "CANCELLED";
    }

    return res.status(200).json({
      status: true,
      message: "Successfully retrieved booking data",
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};
