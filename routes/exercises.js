const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const {
    getExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
    updateExercisesByBodyPart,
    updateExerciseByBodyPartAndId
} = require('../controllers/exercisesController');

const router = express.Router();

// @route   GET /api/exercises
// @desc    Get all exercises
// @access  Public
router.get('/', getExercises);

router.get('/muscle/:group', async (req, res) => {
    try {
        const exercises = await Exercise.find({
            muscleGroup: req.params.group,
        });
        res.json({ success: true, exercises });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// @route   GET api/exercises/bodyparts/:part
// @desc    Get exercise by podypart
// @access  Public
router.get('/bodyparts/:part', async (req, res) => {
    try {
        const exercises = await Exercise.find({
            bodyPart: req.params.part,
        });
        res.json({ success: true, exercises });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/exercises/bodyparts/:part
// @desc    Bulk update exercises by bodypart
// @access  Private
router.put('/bodyparts/:part', protect, updateExercisesByBodyPart);

// @route   PUT /api/exercises/bodyparts/:part/:id
// @desc    Update one exercise by bodypart and exercise id
// @access  Private
router.put('/bodyparts/:part/:id', protect, updateExerciseByBodyPartAndId);


// @route   GET /api/exercises/:id
// @desc    Get exercise by ID
// @access  Public
router.get('/:id', getExerciseById);

// @route POST /api/exercises
// desc Create exercise
// @access Private
router.post(
    '/',
    protect,
    [
        body('name').trim().notEmpty(),
        body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
        body('type').optional().isIn(['strength', 'cardio', 'flexibility', 'balance']),
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


// @route PUT /api/exercise/:id
// @desc Update exercise
// @ access Private
router.put('/:id',protect,updateExercise);

// @route DELETE /api/exercise/:id
// desc Delete exercise
// @access Private
router.delete('/:id',protect,deleteExercise);

module.exports = router;
