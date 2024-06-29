const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller to get tax information
exports.getTax = async (req, res, next) => {
    try {
        // Fetch the first tax record from the database
        const getTax = await prisma.tax.findFirst();

        // Send response with tax data
        return res.status(200).json({
            status: true,
            message: 'Get tax successful.',
            data: getTax
        });
    } catch (error) {
        // Pass error to the next middleware
        next(error);
    }
}