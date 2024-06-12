const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getTax = async (req, res, next) => {
    try {
        const getTax = await prisma.tax.findFirst()

        return res.status(200).json({
            status: true,
            message: 'Get tax successfull.',
            data: getTax
        });
    } catch (error) {
        next(error)
    }
}