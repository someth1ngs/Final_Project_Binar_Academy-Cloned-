const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const qr = require("qr-image");
const { v4: uuidv4 } = require("uuid");
const { addNotification } = require("../libs/notification");
const { getTotalPricing } = require("../libs/bookings");

exports.createBookings = async (req, res, next) => {
  try {
    const { flight_class_id, total_price, include_return, passengers } = req.body;

    const totalTicketPrice = await getTotalPricing(req);

    // if (total_price == totalTicketPrice) {
    //   return res.status(400).json({
    //     status: false,
    //     message: "Price invalid. Please input correctly",
    //     data: null,
    //   });
    // }

    const categories = await prisma.category.findMany();

    const categoryMap = categories.reduce((acc, category) => {
      acc[category.type] = category.id;
      return acc;
    }, {});

    // Menghitung total seat berdasarkan category yang bukan baby
    const total_seat = passengers.filter((passanger) => passanger.category !== "baby").length;

    // Menghitung waktu expiredAt
    const expired = new Date(Date.now() + 15 * 60 * 1000);

    // console.log('User ID:', req.user_data.id);

    // Membuat booking
    const createdBooking = await prisma.booking.create({
      data: {
        total_seat,
        total_price: totalTicketPrice,
        include_return,
        passengers: {
          create: passengers.map((passanger) => ({
            name: passanger.name,
            birthdate: new Date(passanger.birthdate),
            identity_id: passanger.identity_id,
            citizenship: passanger.citizenship,
            category_id: categoryMap[passanger.category],
          })),
        },
        payment: {
          create: {
            total_payment: totalTicketPrice,
            qr_url: "",
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
        flight_class: true,
      },
    });

    // // Mengambil FE_URL, ubah menjadi QR code, dan upload ke imagekit
    const qrCodeData = `${process.env.FE_URL}/payments/${createdBooking.payment_id}`;
    const qrCode = qr.imageSync(qrCodeData, { type: "png" });
    const uploadedImage = await imagekit.upload({
      file: qrCode.toString("base64"),
      fileName: `${uuidv4()}_qrcode.png`,
    });

    const qr_url = uploadedImage.url;

    const updatedPayment = await prisma.payment.update({
      where: {
        id: createdBooking.payment_id,
      },
      data: {
        qr_url: qr_url,
      },
    });

    await addNotification("Ticket Bookings", "Your Ticket has been successfully created. Please completed the payment.", req.user_data.id);

    return res.status(201).json({
      status: true,
      message: "Successfully created booking",
      data: {
        booking: createdBooking,
        payment: updatedPayment,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const { page = 1, status, startDate, endDate } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    // kondisi filter untuk status_payment jika ada
    let filterStatus = {
      user_id: req.user_data.id,
    };

    if (status) {
      filterStatus.status = status.toUpperCase();
    }

    // Filter date range if provided
    let dateRangeFilter = {};
    if (startDate && endDate) {
      dateRangeFilter = {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
        },
      };
    } else if (startDate) {
      dateRangeFilter = {
        createdAt: {
          gte: new Date(startDate),
        },
      };
    } else if (endDate) {
      dateRangeFilter = {
        createdAt: {
          lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), 
        },
      };
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
          ...dateRangeFilter,
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
          ...dateRangeFilter,
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

