const Workout = require('../models/Workout');

const createWorkout = async (req, res) => {
    try {
        const workout = await Workout.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json({
            success: true,
            workout
        });
    } catch (error) {
        console.error('Create workout error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({
            userId: req.user._id,
        }).sort({ date: -1 });
        res.json({ success: true, workouts });
    } catch (error) {
        console.error('Get workout error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

const getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found',
            });
        }
        res.json({
            success: true,
            workout
        });
    } catch (error) {
        console.error('Get workout error:', error);
        res.status(500).json({
            success: false, message: 'Server error'
        });
    }
};


const updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found',
            });
        }
        res.json({ success: true, workout });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found',
            });
        }
        res.json({ success: true, message: 'Workout deleted' });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
};




