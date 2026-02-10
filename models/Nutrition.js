const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        enum: ['g', 'ml', 'cup', 'tbsp', 'tsp', 'piece', 'serving'],
        default: 'g'
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protein: {
        type: Number,
        min: 0
    },
    carbs: {
        type: Number,
        min: 0
    },
    fat: {
        type: Number,
        min: 0
    },
    fiber: Number,
    sugar: Number,
});

const mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'snack', 'pre-workout', 'post-workout']
    },
    items: [foodItemSchema],
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFat: Number,
    notes: String,
});

const nutritionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    meals: [mealSchema],
    waterIntake: {
        type: Number,
        default: 0,
        min: 0
    },
    dailyTotals: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number
    },
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate totals before saving
nutritionSchema.pre('save', function (next) {
    const totals = this.meals.reduce((acc, meal) => {
        const mealTotals = meal.items.reduce((mealAcc, item) => ({
            calories: mealAcc.calories + (item.calories || 0),
            protein: mealAcc.protein + (item.protein || 0),
            carbs: mealAcc.carbs + (item.carbs || 0),
            fat: mealAcc.fat + (item.fat || 0),
            fiber: mealAcc.fiber + (item.fiber || 0)
        }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

        meal.totalCalories = mealTotals.calories;
        meal.totalProtein = mealTotals.protein;
        meal.totalCarbs = mealTotals.carbs;
        meal.totalFat = mealTotals.fat;

        return {
            calories: acc.calories + mealTotals.calories,
            protein: acc.protein + mealTotals.protein,
            carbs: acc.carbs + mealTotals.carbs,
            fat: acc.fat + mealTotals.fat,
            fiber: acc.fiber + mealTotals.fiber
        };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    this.dailyTotals = totals;
    next();
});

module.exports = mongoose.model('Nutrition', nutritionSchema);

