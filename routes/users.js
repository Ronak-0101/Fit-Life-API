const express = require('express');
const {body, validationResult} = require('express-validator');
const {protect} = require('../middleware/auth');
const { 
    getCurrentUser,
    getUserById,
    updateCurrentUser,
} = require('../controllers/userController');

const router = express.Router();


// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, getCurrentUser);

// @route   PUT /api/users/me
// @desc    Update current user profile
// @access  Private
router.put(
    '/me',
    protect,
    [
        body('name').optional().trim().isLength({min: 2}),
        body('age').optional().isInt({min: 13, max: 120}),
        body('gender').optional().isIn(['Male', 'Female', "Other",'Prefer-not-to-say']),
        body('height').optional().isFloat({min:100, max: 250}),
        body('weight').optional().isFloat({min:30, max: 300}),
        body('fitnessGoal').optional().isIn([
            'weight-loss',
            'muscle-gain',
            'endurance',
            'maintenance',
            'general-fitness',
        ]),
        body('activityLevel').optional().isIn([
            'sedentary',
            'light',
            'moderate',
            'active',
            'very-active',
        ]),
        body('dailyCalorieTarget').optional().isFloat({min:0}),
        body('dailyProteinTarget').optional().isFloat({min:0}),
        body('dailyCarbsTarget').optional().isFloat({min:0}),
        body('dailyFatTarget').optional().isFloat({min:0}),
        body('profilePicture').optional().isString().trim(),
    ],
    async (req,res,next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return updateCurrentUser(req, res, next);
    }
);

// @route   GET /api/users/:id
// @desc    Get user by id (self only)
// @access  Private
router.get('/:id', protect, getUserById);


module.exports = router;


