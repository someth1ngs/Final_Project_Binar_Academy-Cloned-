const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// function get Category
exports.getCategory = async (req, res, next) => {
    try {
        // Fetch all categories from the database, selecting specific fields
        const category = await prisma.category.findMany({
            select: {
                id: true,
                type: true,
                discount: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        // If no categories are found, return a 404 response
        if (!category) {
            return res.status(404).json({
                status: false,
                message: 'Data Category not found.',
                data: null
            });
        }

        // Return the categories data with a 200 status
        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved categories data',
            data: category
        });

    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};

// function get Category by id
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params; // Extract the category ID from the request parameters

        // Fetch the category by its ID, including associated passengers
        const getCategory = await prisma.category.findUnique({
            where: { id: id },
            include: { passengers: true }
        });

        // If no category is found, return a 404 response
        if (!getCategory) {
            return res.status(404).json({
                status: false,
                message: 'Data Category not found.',
                data: null
            });
        }

        // Return the category data with a 200 status
        return res.status(200).json({
            status: true,
            message: 'Successfully retrieved categories data by id.',
            data: getCategory
        });

    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
};
