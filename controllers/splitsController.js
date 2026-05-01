const Split = require('../models/Split');
const Exercise = require('../models/Exercise');

const SPLIT_TEMPLATES = [
    {
        key: 'push-pull-legs',
        name: 'Push / Pull / Legs',
        description: 'Classic 6-day split with push, pull, and leg sessions.',
        days: [
            { day: 'monday', title: 'Push' },
            { day: 'tuesday', title: 'Pull' },
            { day: 'wednesday', title: 'Legs' },
            { day: 'thursday', title: 'Push' },
            { day: 'friday', title: 'Pull' },
            { day: 'saturday', title: 'Legs' },
            { day: 'sunday', title: 'Rest' },
        ],
    },
    {
        key: 'upper-lower',
        name: 'Upper / Lower',
        description: 'Balanced 4-day split with upper and lower training days.',
        days: [
            { day: 'monday', title: 'Upper Body' },
            { day: 'tuesday', title: 'Lower Body' },
            { day: 'wednesday', title: 'Rest' },
            { day: 'thursday', title: 'Upper Body' },
            { day: 'friday', title: 'Lower Body' },
            { day: 'saturday', title: 'Conditioning' },
            { day: 'sunday', title: 'Rest' },
        ],
    },
    {
        key: 'bro-split',
        name: 'Bro Split',
        description: 'One major muscle group focus per day.',
        days: [
            { day: 'monday', title: 'Chest' },
            { day: 'tuesday', title: 'Back' },
            { day: 'wednesday', title: 'Shoulders' },
            { day: 'thursday', title: 'Arms' },
            { day: 'friday', title: 'Legs' },
            { day: 'saturday', title: 'Core & Cardio' },
            { day: 'sunday', title: 'Rest' },
        ],
    },
    {
        key: 'full-body',
        name: 'Full Body',
        description: '3 full-body sessions weekly for beginners and busy schedules.',
        days: [
            { day: 'monday', title: 'Full Body A' },
            { day: 'tuesday', title: 'Rest' },
            { day: 'wednesday', title: 'Full Body B' },
            { day: 'thursday', title: 'Rest' },
            { day: 'friday', title: 'Full Body C' },
            { day: 'saturday', title: 'Optional Cardio' },
            { day: 'sunday', title: 'Rest' },
        ],
    },
];

const getTemplates = async (req, res) => {
    res.json({ success: true, templates: SPLIT_TEMPLATES });
};

const createSplit = async (req, res) => {
    try {
        const split = await Split.create({ ...req.body, userId: req.user._id });
        res.status(201).json({ success: true, split });
    } catch (error) {
        console.error('Create split error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getSplits = async (req, res) => {
    try {
        const splits = await Split.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json({ success: true, splits });
    } catch (error) {
        console.error('Get splits error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addExerciseToDay = async (req, res) => {
    try {
        const { splitId, day } = req.params;
        const { exerciseId, sets, reps } = req.body;

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }

        const split = await Split.findOne({ _id: splitId, userId: req.user._id });
        if (!split) {
            return res.status(404).json({ success: false, message: 'Split not found' });
        }

        let dayPlan = split.weeklyPlan.find((item) => item.day === day);
        if (!dayPlan) {
            dayPlan = { day, title: day[0].toUpperCase() + day.slice(1), exercises: [] };
            split.weeklyPlan.push(dayPlan);
            dayPlan = split.weeklyPlan.find((item) => item.day === day);
        }

        dayPlan.exercises.push({
            exerciseId,
            sets: sets || exercise?.prescription?.sets || 3,
            reps: reps || exercise?.prescription?.reps || '8-12',
            order: dayPlan.exercises.length,
        });

        await split.save();
        return res.json({ success: true, split });
    } catch (error) {
        console.error('Add exercise to split day error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { getTemplates, createSplit, getSplits, addExerciseToDay };
