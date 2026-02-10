const Progress = require('../models/Progress');
// const { findOneAndUpdate } = require('../models/user');

const createProgressEntry = async (req, res) => {
    try {
        const progress = await Progress.create({
            ...req.body,
            userId: req.user._id,
        });
        res.status(201).json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error('Create Progress error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

const getProgressEntries = async (req, res) => {
    try {
        const progress = await Progress.find({userId: req.user._id}).sort({date: -1});
        res.json({success: true, progress});
    } catch (error) {
        console.error('Get progress error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const getProgressEntryById = async (req,res) => {
    try {
        const progress = await Progress.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });
        if(!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress Entry not found',
            });     
        }
        res.json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error('Get progress entry error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const updateProgressEntry = async (req, res) => {
    try {
        const progress = await Progress.findOneAndUpdate(
            {_id: req.params.id, userId: req.user._id},
            req.body,
            {new: true, runValidators: true}
        );
        if(!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found',
            });
        }
        res.json({
            success: true,
            progress,
        });
    } catch (error) {
        console.error('Update progress entry error');
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const deleteProgressEntry = async (req, res) => {
    try {
        const progress = await Progress.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if(!progress) {
            return res.status(404).json({
                success: false,
                message: 'Progress entry not found',
            });
        }
        res.json({
            success: true,
            message: 'Progress entry deleted',
        });
    } catch (error) {
        console.error('Delete progress error : ',error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

module.exports = {
    createProgressEntry,
    getProgressEntries,
    getProgressEntryById,
    updateProgressEntry,
    deleteProgressEntry,
};

