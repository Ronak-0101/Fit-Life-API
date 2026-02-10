const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
} = require('../controllers/exercisesController');

const router = express.Router();

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Public
router.get('/', getExercises);

// @route   GET /api/exercises/:id
// @desc    Get exercise by ID
// @access  Public
router.get('/:id', getExerciseById);

// @route POST /api/exercises
// desc Create exercise
// @access Private
router.post('/', 
    protect, [
        body('name').trim().notEmpty(),
        body('difficulty').optional().isIn(['beginner', 'intermediate', 'advance']),
        body('type').optional().isIn(['strength', 'cardio', 'flexibility', 'balanced']),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return createExercise(req, res, next);
    }
);


// @route   POST /api/exercises/seed
// @desc    Seed exercises in bulk
// @access  Private
router.post(
    '/seed',
    protect,
    [
        body().custom((value, { req }) => {
            const payload = Array.isArray(req.body) ? req.body : req.body.exercises;
            if (!Array.isArray(payload) || payload.length === 0) {
                throw new Error('Exercises array is required');
            }
            return true;
        }),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return seedExercises(req, res, next);
    }
);


router.get('/muscle/:group', async (req, res) => {
    try {
        const exercises = await Exercise.find({ 
            muscleGroup: req.params.group 
        });
        res.json({ success: true, exercises });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});






// @route PUT /api/exercise/:id
// @desc Update exercise
// @ access Private
router.put('/:id',protect,updateExercise);

// @route DELETE /api/exercise/:id
// desc Delete exercise
// @access Private
router.delete('/:id',protect,deleteExercise);

module.exports = router;
