const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const imagekit = require("../libs/imagekit");
const qr = require('qr-image');
const { v4: uuidv4 } = require('uuid');

exports.createBookings = async (req, res, next) => {
    try {
        const {
            flight_class_id,
            total_price,
            include_return,
            passangers
        } = req.body;

        // Validasi flight_class_id
        // const flightClass = await prisma.flight_Class.findUnique({
        //     where: { id: flight_class_id }
        // });

        // if (!flightClass) {
        //     return res.status(404).json({
        //         status: false,
        //         message: 'Flight class not found',
        //         data: null
        //     });
        // }

        const category_baby = await prisma.category.findFirst({
            where: {
                type: "baby"
            }
        });

        if (!category_baby) {
            return res.status(404).json({
                status: false,
                message: 'Category "baby" not found',
                data: null
            });
        }

        // Menghitung total seat berdasarkan category yang bukan baby
        const total_seat = passangers.filter(passanger => passanger.category_id !== category_baby.id).length;

        // Mengambil FE_URL, ubah menjadi QR code, dan upload ke imagekit
        const qrCodeData = process.env.FE_URL;
        const qrCode = qr.imageSync(qrCodeData, { type: 'png' });
        const uploadedImage = await imagekit.upload({
            file: qrCode.toString('base64'),
            fileName: `${uuidv4()}_qrcode.png` // Random string
        });

        const qr_url = uploadedImage.url;

        // Menghitung waktu expiredAt
        const expired = new Date(Date.now() + 15 * 60 * 1000);

        // Membuat booking
        const createdBooking = await prisma.booking.create({
            data: {
                flight_class_id,
                total_seat,
                total_price,
                include_return,
                passengers: {
                    create: passangers.map(passanger => ({
                        name: passanger.name,
                        birthdate: new Date(passanger.birthdate),
                        identity_id: passanger.identity_id,
                        citizenship: passanger.citizenship,
                        category_id: passanger.category_id
                    }))
                },
                payment: {
                    create: {
                        total_payment: total_price,
                        qr_url: qr_url,
                        expiredAt: expired
                    }
                }
            },
            include: {
                passengers: true,
                payment: true,
                flight_class: true
            }
        });

        if (!createdBooking) {
            return res.status(404).json({
                status: false,
                message: 'Created Booking Failed.',
                data: null
            });
        }

        return res.status(201).json({
            status: true,
            message: 'Successfully created booking',
            data: createdBooking
        });

    } catch (error) {
        next(error);
    }
};

// tambahin logic jika pada saat mengambil semua data bookings, bookings yang sudah expired tapi payment nya masih dalam kondisi unpaid, padahal sudah expired, makanya perlu update payment nya jadi canceled
exports.getBookings = async (req, res, next) => {
    try {
        const { page = 1 } = req.query;
        const limit = 5;
        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                skip: parseInt(skip),
                take: parseInt(limit),
                where: {
                    payment: {
                        user_id: req.user_data.id
                    }
                },
                include: {
                    payment: true,
                    passengers: true,
                    flight_class: true,
                },
            }),

            prisma.booking.count({
                where: {
                    payment: {
                        user_id: req.user_data.id
                    }
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            status: true,
            message: "Successfully retrieved bookings data",
            data: {
                bookings,
                page: parseInt(page),
                total_pages: totalPages,
                total_items: total
            }
        });

    } catch (error) {
        next(error);
    }
};

exports.getBookingsById = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}