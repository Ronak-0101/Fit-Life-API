const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const { getTemplates, createSplit, getSplits, addExerciseToDay } = require('../controllers/splitsController');

const router = express.Router();

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    return next();
};

router.get('/templates', protect, getTemplates);
router.get('/', protect, getSplits);
router.post('/', protect, [body('name').trim().notEmpty(), body('type').optional().isIn(['template', 'manual']), body('weeklyPlan').optional().isArray()], handleValidation, createSplit);

router.post('/:splitId/days/:day/exercises', protect, [param('splitId').isMongoId(), param('day').isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']), body('exerciseId').isMongoId(), body('sets').optional().isInt({ min: 1, max: 20 }), body('reps').optional().isString()], handleValidation, addExerciseToDay);

module.exports = router;
