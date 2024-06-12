const { PrismaClient } = require("@prisma/client");
const { filterFlight } = require("../libs/flights");
const prisma = new PrismaClient();
const { addNotification } = require('../libs/notification');

exports.updatePayment = async (req, res, next) => {
  try {
    const { payment_id } = req.params;

    if (!payment_id) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id: payment_id,
        user_id: req.user_data.id,
      },
      include: {
        booking: {
          include: {
            flight_class: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment data not found",
        data: null,
      });
    }

    const isExpired = payment.status === "UNPAID" && new Date(payment.expiredAt) < Date.now();

    if (payment.status === "CANCELLED" || isExpired) {
      if (isExpired) {
        await prisma.payment.update({
          where: {
            id: payment_id,
            user_id: req.user_data.id,
          },
          data: {
            status: "CANCELLED",
          },
        });

        await addNotification("Payment Cancelled", "Your payment has been cancelled due to expiration.", req.user_data.id);
      }

      return res.status(400).json({
        status: false,
        message: "Payment already expired",
        data: null,
      });
    }

    const [updatePayment] = await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment_id,
          user_id: req.user_data.id,
        },
        data: {
          status: "ISSUED",
          booking: {
            update: {
              flight_class: {
                update: {
                  available_seats: payment.booking.flight_class.available_seats - payment.booking.total_seat,
                },
              },
            },
          },
        },
      }),
    ]);

    await addNotification("Payment Success", "Your payment has been successfully issued.", req.user_data.id);

    return res.status(200).json({
      status: true,
      message: "Successfully paid",
      data: updatePayment,
    });
  } catch (error) {
    next(error);
  }
};
