const { PrismaClient } = require("@prisma/client");
const { filterFlight } = require("../libs/flights");
const prisma = new PrismaClient();
const { addNotification } = require("../libs/notification");

// Controller to update payment status
exports.updatePayment = async (req, res, next) => {
  try {
    const { payment_id } = req.params;

    // Check if payment_id is provided
    if (!payment_id) {
      return res.status(400).json({
        status: false,
        message: "Missing required field",
        data: null,
      });
    }

    // Fetch payment details including related booking and flight information
    const payment = await prisma.payment.findUnique({
      where: {
        id: payment_id,
      },
      include: {
        booking: {
          include: {
            flight_class: {
              include: {
                flight: {
                  include: {
                    to: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // If payment not found, return 404 response
    if (!payment) {
      return res.status(404).json({
        status: false,
        message: "Payment data not found",
        data: null,
      });
    }

    // Check if payment is expired
    const isExpired = payment.status === "UNPAID" && new Date(payment.expiredAt) < Date.now();

    // If payment is cancelled or expired, update status to CANCELLED and notify user
    if (payment.status === "CANCELLED" || isExpired) {
      if (isExpired) {
        const response = await prisma.payment.update({
          where: {
            id: payment_id,
          },
          data: {
            status: "CANCELLED",
          },
        });

        await addNotification("Payment Cancelled", "Your payment has been cancelled due to expiration.", response.user_id);
      }

      return res.status(400).json({
        status: false,
        message: "Payment already expired",
        data: null,
      });
    }

    // Update payment status to ISSUED and adjust related booking and flight details
    const [updatePayment] = await prisma.$transaction([
      prisma.payment.update({
        where: {
          id: payment_id,
        },
        data: {
          status: "ISSUED",
          booking: {
            update: {
              flight_class: {
                update: {
                  available_seats: payment.booking.flight_class.available_seats - payment.booking.total_seat,
                  flight: {
                    update: {
                      to: {
                        update: {
                          visited: payment.booking.flight_class.flight.to.visited + 1,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ]);

    // Notify user of successful payment
    await addNotification("Payment Success", "Your payment has been successfully issued.", updatePayment.user_id);

    // Send response with updated payment data
    return res.status(200).json({
      status: true,
      message: "Successfully paid",
      data: updatePayment,
    });
  } catch (error) {
    // Pass error to the next middleware
    next(error);
  }
};
