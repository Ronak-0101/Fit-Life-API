const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    getSelectedExercisesForDay,
    getAvailableExercisesForDay,
    addExerciseToDay,
    removeExerciseFromDay,
} = require('../controllers/splitsController');

const router = express.Router();

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    return next();
};

const validateDay = () => param('day').isIn(days);

router.get(
    '/days/:day/exercises',
    protect,
    [validateDay()],
    handleValidation,
    getSelectedExercisesForDay
);

router.get(
    '/days/:day/available-exercises',
    protect,
    [
        validateDay(),
        query('search').optional().trim().isLength({ min: 1 }),
        query('bodyPart').optional().trim().isLength({ min: 1 }),
        query('muscleGroup').optional().trim().isLength({ min: 1 }),
    ],
    handleValidation,
    getAvailableExercisesForDay
);

router.post(
    '/days/:day/exercises',
    protect,
    [
        validateDay(),
        body('exerciseId').isMongoId(),
        body('sets').optional().isInt({ min: 1, max: 20 }),
        body('reps').optional().trim().isLength({ min: 1 }),
    ],
    handleValidation,
    addExerciseToDay
);

router.delete(
    '/days/:day/exercises/:exerciseId',
    protect,
    [
        validateDay(),
        param('exerciseId').isMongoId(),
    ],
    handleValidation,
    removeExerciseFromDay
);

module.exports = router;
