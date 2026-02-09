const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    createWorkout,
    getWorkouts,
    getWorkoutById,
    updateWorkout,
    deleteWorkout,
} = require('../controllers/workoutsController');

const router = express.Router();

// @route   POST /api/workouts
// @desc    Create a workout
// @access  Private
router.post(
    '/',
    protect,
    [
        body('name').trim().notEmpty(),
        body('date').optional().isISO8601(),
        body('type').optional().isIn(['strength', 'cardio', 'hiit', 'flexibility', 'custom']),
        body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return createWorkout(req, res, next);
    }
);

// @route   GET /api/workouts
// @desc    Get workouts for current user
// @access  Private
router.get('/', protect, getWorkouts);

// @route   GET /api/workouts/:id
// @desc    Get a workout by id
// @access  Private
router.get('/:id', protect, getWorkoutById);

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', protect, updateWorkout);

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', protect, deleteWorkout);

module.exports = router;