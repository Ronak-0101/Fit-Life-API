const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    exerciseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    reps: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    weight: {
        type: Number,
        min: 0
    },
    duration: {
        type: Number,
        min: 0
    },
    distance: {
        type: Number,
        min: 0
    },
    notes: String,
    completed: {
        type: Boolean,
        default: false
    }
});

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        required: true,
        type: String,
        trim: true
    },
    description: String,
    exercises: [exerciseSchema],
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    duration: {
        type: Number,
        min: 0
    },
    caloriesBurned: {
        type: Number,
        min: 0
    },
    type: {
        type: String,
        enum: ['strength', 'cardio', 'hiit', 'flexibility', 'custom'],
        default: 'strength'
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    isTemplate: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Update timestamps on save
workoutSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// This ensures exercise names matches the referenced exercise
workoutSchema.pre('save', async function (next) {
    // Only validate if exercises array exists and has items
    if(this.exercises && this.exercises.length > 0) {
        try {
            // Import Exercise model (circular dependency safe)
            const Exercise = mongoose.model('Exercise');

            // Process each exercise in the workout
            for (const exerciseItem of this.exercises) {
                // Skip if no exerciseId
                if(!exerciseItem.exerciseId) continue;

                // Fetch the exercise from database
                const exerciseDoc = await Exercise.findById(exerciseItem.exerciseId);
                
                if (!exerciseDoc) {
                    // If exercise doesn't exist, throw error
                    const error = new Error(`Exercise with ID ${exerciseItem.exerciseId} not found`);
                    error.statusCode = 400;
                    throw error;
                }
                // Update the name to match the database
                // This ensures consistency even if client sends wrong name
                exerciseItem.name = exerciseDoc.name;
                
                // Optional: You could also copy other exercise properties
                // exerciseItem.muscleGroup = exerciseDoc.muscleGroup;
                // exerciseItem.equipment = exerciseDoc.equipment;
            }
            next();
        } catch (error) {
            next(error);
        }
    }else {
        next();
    }
})


module.exports = mongoose.model('Workout', workoutSchema);
