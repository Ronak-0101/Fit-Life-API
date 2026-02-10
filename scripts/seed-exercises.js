const mongoose = require('mongoose');
require('dotenv').config();
const Exercise = require('../models/Exercise');

const exercises = [
  {
    name: "Push-ups",
    description: "Classic bodyweight exercise for chest, shoulders, and triceps",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Lower your body until your chest nearly touches the floor",
      "Push back up to starting position",
      "Keep your body straight throughout the movement"
    ],
    muscleGroup: ["chest", "shoulders", "triceps"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    type: "strength",
    isPopular: true
  },
  {
    name: "Squats",
    description: "Fundamental lower body exercise",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your hips back and down as if sitting in a chair",
      "Keep chest up and knees aligned with toes",
      "Return to standing position"
    ],
    muscleGroup: ["quadriceps", "hamstrings", "glutes"],
    equipment: ["bodyweight", "barbell", "dumbbell"],
    difficulty: "beginner",
    type: "strength",
    isPopular: true
  },
  {
    name: "Running",
    description: "Cardiovascular exercise",
    instructions: [
      "Start with a light warm-up walk",
      "Gradually increase pace to a comfortable run",
      "Maintain steady breathing",
      "Cool down with walking"
    ],
    muscleGroup: ["cardio"],
    equipment: ["none"],
    difficulty: "beginner",
    type: "cardio",
    averageCaloriesBurned: 600,
    isPopular: true
  },
  // Add 10 more common exercises
  {
    name: "Bench Press",
    description: "Classic chest exercise",
    muscleGroup: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "dumbbell"],
    difficulty: "intermediate",
    type: "strength"
  },
  {
    name: "Deadlift",
    description: "Full-body strength exercise",
    muscleGroup: ["back", "glutes", "hamstrings", "full-body"],
    equipment: ["barbell"],
    difficulty: "advanced",
    type: "strength"
  }
];

async function seedExercises() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');
    
    // Insert new exercises
    await Exercise.insertMany(exercises);
    console.log(`Seeded ${exercises.length} exercises`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedExercises();