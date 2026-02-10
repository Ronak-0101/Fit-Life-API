const Nutrition = require('../models/Nutrition');

const createNutritionLog = async (req, res) => {
    try {
        const nutrition = await Nutrition.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json({
            success: true,
            nutrition,
        });
    } catch (error) {
        console.error('Create nutrition error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const getNutritionLogs = async (req, res) => {
    try {
        const nutritionLogs = await Nutrition.find({ userId: req.user._id }).sort({ date: -1 });
        res.json({ success: true, nutritionLogs });
    } catch (error) {
        console.log('Get nutrition error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const getNutritionLogById = async (req, res) => {
    try {
        const nutrition = await Nutrition.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!nutrition) {
            res.status(404).json({
                success: false,
                message: 'Nutrition Log not found',
            });
        }
        res.json({
            success: true,
            nutrition,
        })
    } catch (error) {
        console.error('Get nutrition log error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const updateNutritionLog = async (req, res) => {
    try {
        const nutrition = await Nutrition.findByIdAndUpdate({
            _id: req.params.id,
            userId: req.user._id,
        },
        req.body,
        { new: true, runValidators: true }
    );
    if(!nutrition) {
        return res.status(404).json({
            success: false,
            message: 'Nutrition log not found',
        });
    }
    res.json({
        success: true,
        nutrition,
    });
    } catch (error) {
        console.error('Update nutrition error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const deleteNutritionLog = async (req, res) => {
    try {
        const nutrition = await Nutrition.findByIdAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if(!nutrition) {
            return res.status(404).json({
                success: false,
                message: 'Nutrition log not found',
            });
        }
        res.json({
            success: true,
            message: 'Nutrition log deleted',
        });
    }catch (error) {
        console.error('Delete nutrition error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    createNutritionLog,
    getNutritionLogs,
    getNutritionLogById,
    updateNutritionLog,
    deleteNutritionLog,
};
