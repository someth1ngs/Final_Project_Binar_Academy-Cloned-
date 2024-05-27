const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getCategory = async (req, res, next) => {
    try {
        const category = await prisma.category.findMany({
            select: {
                id: true,
                type: true,
                discount: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Data Category not found.',
                data: null
            });
        };

        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved categories data',
            data: category
        });

    } catch (error) {
        next(error);
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const getCategory = await prisma.category.findUnique({
            where: { id: id },
            include: { passengers: true }
        });

        if (!getCategory) {
            return res.status(404).json({
                status: false,
                message: 'Data Category not found.',
                data: null
            });
        };

        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved categories data by id.',
            data: getCategory
        });

    } catch (error) {
        next(error);
    }
}