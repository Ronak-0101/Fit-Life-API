const express = require('express');
const { body, validationResult } = require('express-validator')
const { protect } = require('../middleware/auth');
const {
    getProgressEntries,
    getProgressEntryById,
    createProgressEntry,
    updateProgressEntry,
    deleteProgressEntry,
} = require('../controllers/progressController');

const router = express.Router();


// @route   POST /api/progress
// @desc    Create progress entry
// access   Private
router.post(
    '/',
    protect,
    [body('data').optional().isISO8601(), body('weight').optional().isFloat({min: 0})],
    async (req, res, next ) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        return createProgressEntry(req, res, next);
    }
);

// @route   GET /api/progress
// @desc    Get progress entry for current user
// access   Private
router.get('/', protect, getProgressEntries);

// @route   GET /api/progress/:id
// @desc    Get progress entry by id
// access   Private
router.get('/:id', protect, getProgressEntryById);

// @route   PUT /api/progress/:id
// @desc    Update progress entry
// access   Private
router.put('/:id', protect, updateProgressEntry);


// @route   DELETE /api/progress/:id
// @desc    Delete progress entry
// access   Private
router.delete('/:id', protect, deleteProgressEntry);

module.exports = router;


