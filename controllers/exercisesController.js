const Exercise = require('../models/Exercise');

const getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find().sort({ name: 1 });
        res.json({
            success: true,
            exercises,
        });
    } catch (error) {
        console.error('Get exercises error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
}

const getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found',
            })
        }
        res.json({
            success: true,
            exercise,
        });
    } catch (error) {
        console.error('Get Exercise error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const createExercise = async (req, res) => {
    try {
        const exercise = await Exercise.create(req.body);
        res.status(201).json({
            success: true,
            exercise,
        });
    } catch (error) {
        console.error('Create Exercise error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const updateExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!exercise) {
            res.status(401).json({
                success: false,
                message: 'Exercise not found',
            });
        }
        res.json({
            success: true,
            exercise,
        });
    } catch (error) {
        console.error('Update Exercise error : ', error);
        res.status(500).json({
            success: false, 
            message: 'Server error',
        });
    }
};

const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id);
        if (!exercise) {
            return res.status(404).json({
                success: false,
                message: 'Exercise not found',
            });
        }
        res.json({
            success: true,
            message: 'Exercise deleted successfully',
        });
    } catch (error) {
        console.error('Delete Exercise error : ', error);
        res.Status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,

};


