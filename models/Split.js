const mongoose = require('mongoose');

const dayPlanExerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    sets: {
        type: Number,
        min: 1,
        max: 20,
        default: 3,
    },
    reps: {
        type: String,
        trim: true,
        default: '8-12',
    },
    order: {
        type: Number,
        min: 0,
        default: 0,
    },
}, { _id: false });

const dayPlanSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    exercises: [dayPlanExerciseSchema],
}, { _id: false });

const splitSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['template', 'manual'],
        default: 'manual',
    },
    weeklyPlan: {
        type: [dayPlanSchema],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Split', splitSchema);
