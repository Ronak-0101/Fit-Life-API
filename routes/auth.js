const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { generateToken } = require('../middleware/auth');

router.get('/test', (req, res) => {
    res.send('Auth route working');
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
    body('name').trim().notEmpty().withMessage('Name is required')
], async (req, res) => {
    //Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { email, password, name } = req.body;

        //Checks if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        //Create user
        const user = await User.create({
            email,
            password,
            name,
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
            }
        });
    } catch (error) {
        console.error('Registration Error : ', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration',
        })
    }
});

// @route   POST /api/auth/login
// @desc    Login user 
// @access  Public

router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
], async (req, res) => {
    //Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            })
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profilePicture: user.profilePicture,
                fitnessGoal: user.fitnessGoal,
                dailyCalorieTarget: user.dailyCalorieTarget,
            }
        });
    } catch (error) {
        console.error('Login Error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
});

// @route   POST /api/auth/me
// @desc    get current user
// @access  Private
router.get('/me', require('../middleware/auth').protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    };
});

module.exports = router;