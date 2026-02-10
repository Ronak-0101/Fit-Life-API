const mongoose = require('mongoose');

const measurementSchema = new mongoose.Schema({
    chest: Number,
    waist: Number,
    hips: Number,
    biceps: Number,
    thighs: Number,
    calves: Number,
}, { _id: false });

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    weight: {
        type: Number,
        min: 0,
    },
    bodyFatPercentage: {
        type: Number,
        min: 0,
        max: 100,
    },
    measurements: measurementSchema,
    notes:  String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Progress', progressSchema);
