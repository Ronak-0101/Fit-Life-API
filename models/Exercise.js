const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: String,
    instructions: [String],
    bodyPart: {
        type: String,
        enum: [
            'chest', 'back', 'shoulders', 'biceps','triceps', 'legs', 'core', 'full-body',
        ],
        required: true,
    },
    muscleGroup: {
        type: [String],
        enum: [
            'chest', 'back', 'shoulders', 'biceps', 'triceps',
            'quadriceps', 'hamstrings', 'glutes', 'calves',
            'abs', 'full-body', 'cardio', 'flexibility',
        ]
    },
    equipment: {
        type: [String],
        enum: [
            'barbell', 'dumbbell','weight-plates',  'kettlebell', 'machine', 'bench', 
            'cable', 'bodyweight', 'resistance-bands',
            'stability-ball', 'medicine-ball', 'none',
        ],
        // alias: 'equipment'  
    },
    difficulty: {
        type: String,
        enum: ['beginner','intermediate','advanced'],
        default: 'intermediate'
    },
    type: {
        type: String,
        enum: ['strength','cardio','flexibility','balance'],
        default: 'strength'
    },
    videoUrl: String,
    imageUrl: [String],
    averageCaloriesBurned: Number, // Per hour
    isPopular: {
        type: Boolean,
        default: false
    },
    isGlobal: {
        type: Boolean,
        default: true,
        index: true,
    },
    createdBy: {
        type: String,
        default: 'system'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);