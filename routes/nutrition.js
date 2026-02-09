const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
    createNutritionLog,
    getNutritionLogs,
    getNutritionLogById,
    updateNutritionLog,
    deleteNutritionLog,
} = require('../controllers/nutritionController');
const { route } = require('./exercises');

const router = express.Router();

// @route   POST /api/nutrition
// @desc    Create newtrition log
// access   Private
router.post(
    '/',
    protect,
    [body('data').optional().isISO8601(), body('meals').optional().isArray()],
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return  createNutritionLog(req, res, next);
    }
);

// @route   GET /api/nutrition
// @desc    Get nutrition log for current user
// access Private
router.get('/', protect, getNutritionLogs);

// @route GET /api/nutrition/:id
// @desc GET Nutrition log by id
// @access Private
router.get('/:id', protect, getNutritionLogById);

// @route PUT /api/nutrition/:id
// @desc UPDATE Nutrition log
// @access Private
router.put('/:id', protect, updateNutritionLog);

// @route DELETE /api/nutrition/:id
// @desc DELETE Nutrition log 
// @access Private
router.delete('/:id', protect, deleteNutritionLog);

module.exports = router;