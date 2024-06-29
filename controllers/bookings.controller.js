const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const qr = require("qr-image");
const { v4: uuidv4 } = require("uuid");
const { addNotification } = require("../libs/notification");
const { getTotalPricing } = require("../libs/bookings");

// function create bookings
exports.createBookings = async (req, res, next) => {
  try {
    const { flight_class_id, total_price, include_return, passengers } = req.body;

    // Calculate total ticket price using a helper function
    const totalTicketPrice = await getTotalPricing(req);

    // Retrieve all categories from the database
    const categories = await prisma.category.findMany();

    // Create a map of category types to category IDs
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.type] = category.id;
      return acc;
    }, {});

    // Calculate total seats excluding "baby" category passengers
    const total_seat = passengers.filter((passenger) => passenger.category !== "baby").length;

    // Set expiration time for the booking to 15 minutes from now
    const expired = new Date(Date.now() + 15 * 60 * 1000);

    // Create a new booking record in the database
    const createdBooking = await prisma.booking.create({
      data: {
        total_seat,
        total_price: totalTicketPrice,
        include_return,
        passengers: {
          create: passengers.map((passenger) => ({
            name: passenger.name,
            birthdate: new Date(passenger.birthdate),
            identity_id: passenger.identity_id,
            citizenship: passenger.citizenship,
            category_id: categoryMap[passenger.category],
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
        passengers: {
          include: {
            category: true,
          },
        },
        flight_class: {
          include: {
            flight: true,
          },
        },
      },
    });

    // Generate QR code data and upload it to ImageKit
    const qrCodeData = `${process.env.FE_URL}/payments/${createdBooking.payment_id}`;
    const qrCode = qr.imageSync(qrCodeData, { type: "png" });
    const uploadedImage = await imagekit.upload({
      file: qrCode.toString("base64"),
      fileName: `${uuidv4()}_qrcode.png`,
    });

    // Update the payment record with the QR code URL
    const qr_url = uploadedImage.url;
    const updatedPayment = await prisma.payment.update({
      where: {
        id: createdBooking.payment_id,
      },
      data: {
        qr_url: qr_url,
      },
    });

    // Send a notification to the user about the successful booking
    await addNotification("Ticket Bookings", "Your Ticket has been successfully created. Please complete the payment.", req.user_data.id);

    // Respond with the created booking and payment details
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


// function get bookings
exports.getBookings = async (req, res, next) => {
  try {
    // Extract query parameters with default values for page and limit
    const { page = 1, status, startDate, endDate } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Initialize filter for user's bookings
    let filterStatus = {
      user_id: req.user_data.id,
    };

    // Add status filter if provided
    if (status) {
      filterStatus.status = status.toUpperCase();
    }

    // Initialize date range filter
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

    // Fetch bookings and count total records with the applied filters
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
          passengers: {
            include: {
              category: true,
            },
          },
          flight_class: {
            include: {
              flight: {
                include: {
                  from: true,
                  to: true,
                  plane: true,
                },
              },
            },
          },
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

    // Loop through bookings to update the status of unpaid and expired tickets to cancelled
    for (const booking of bookings) {
      if (booking.payment.status === "UNPAID" && booking.payment.expiredAt < new Date()) {
        await prisma.payment.update({
          where: { id: booking.payment.id },
          data: { status: "CANCELLED" },
        });
        booking.payment.status = "CANCELLED";
      }
    }

    // Calculate total pages for pagination
    const totalPages = Math.ceil(total / limit);

    // Return 404 response if no bookings found
    if (!bookings.length) {
      return res.status(404).json({
        status: false,
        message: status ? `Data bookings not found with status ${status.toUpperCase()}.` : "Data bookings not found.",
        data: null,
      });
    }

    // Return successful response with booking data and pagination info
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

// function get bookings by id
exports.getBookingsById = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract the booking ID from request parameters

    // Fetch booking details by ID, including payment, passengers, and flight class details
    const bookings = await prisma.booking.findUnique({
      where: { id: id },
      include: {
        payment: true,
        passengers: {
          include: {
            category: true,
          },
        },
        flight_class: true,
      },
    });

    // If no booking found, return a 404 response
    if (!bookings) {
      return res.status(404).json({
        status: false,
        message: "Data bookings not found.",
        data: null,
      });
    }

    // Check if the payment is unpaid and expired, then update the status to cancelled
    if (bookings.payment.status === "UNPAID" && bookings.payment.expiredAt < new Date()) {
      await prisma.payment.update({
        where: { id: bookings.payment.id },
        data: { status: "CANCELLED" },
      });
      bookings.payment.status = "CANCELLED";
    }

    // Return the booking details with a 200 status
    return res.status(200).json({
      status: true,
      message: "Successfully retrieved booking data",
      data: bookings,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

