const Split = require('../models/Split');
const Exercise = require('../models/Exercise');

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const titleForDay = (day) => day.charAt(0).toUpperCase() + day.slice(1);

const getOrCreateActiveSplit = async (userId) => {
    let split = await Split.findOne({ userId, isActive: true, type: 'manual' }).sort({ updatedAt: -1 });

    if (!split) {
        split = await Split.create({
            userId,
            name: 'My Workout Split',
            type: 'manual',
            weeklyPlan: DAYS.map((day) => ({
                day,
                title: titleForDay(day),
                exercises: [],
            })),
        });
    }

    return split;
};

const getOrCreateDayPlan = (split, day) => {
    let dayPlan = split.weeklyPlan.find((item) => item.day === day);

    if (!dayPlan) {
        split.weeklyPlan.push({
            day,
            title: titleForDay(day),
            exercises: [],
        });
        dayPlan = split.weeklyPlan.find((item) => item.day === day);
    }

    return dayPlan;
};

const exerciseSelect = 'name description prescription bodyPart muscleGroup equipment difficulty type imageUrl videoUrl';

const formatSelectedExercise = (item) => {
    const exercise = item.exerciseId;

    if (!exercise) {
        return null;
    }

    return {
        exerciseId: exercise._id,
        name: exercise.name,
        description: exercise.description,
        bodyPart: exercise.bodyPart,
        muscleGroup: exercise.muscleGroup,
        equipment: exercise.equipment,
        difficulty: exercise.difficulty,
        type: exercise.type,
        imageUrl: exercise.imageUrl,
        videoUrl: exercise.videoUrl,
        sets: item.sets,
        reps: item.reps,
        order: item.order,
    };
};

const getSelectedExercisesForDay = async (req, res) => {
    try {
        const { day } = req.params;
        const split = await getOrCreateActiveSplit(req.user._id);
        const dayPlan = getOrCreateDayPlan(split, day);

        if (split.isModified('weeklyPlan')) {
            await split.save();
        }

        await split.populate({
            path: 'weeklyPlan.exercises.exerciseId',
            select: exerciseSelect,
        });

        const populatedDayPlan = split.weeklyPlan.find((item) => item.day === day);
        const exercises = populatedDayPlan.exercises
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(formatSelectedExercise)
            .filter(Boolean);

        return res.json({
            success: true,
            splitId: split._id,
            day,
            title: populatedDayPlan.title,
            exerciseCount: exercises.length,
            exercises,
        });
    } catch (error) {
        console.error('Get selected split exercises error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAvailableExercisesForDay = async (req, res) => {
    try {
        const { day } = req.params;
        const { search, bodyPart, muscleGroup } = req.query;
        const split = await getOrCreateActiveSplit(req.user._id);
        const dayPlan = getOrCreateDayPlan(split, day);

        if (split.isModified('weeklyPlan')) {
            await split.save();
        }

        const selectedIds = dayPlan.exercises.map((item) => item.exerciseId);
        const filters = {
            _id: { $nin: selectedIds },
        };

        if (search) {
            filters.name = { $regex: search, $options: 'i' };
        }

        if (bodyPart) {
            filters.bodyPart = bodyPart;
        }

        if (muscleGroup) {
            filters.muscleGroup = muscleGroup;
        }

        const exercises = await Exercise.find(filters)
            .select(exerciseSelect)
            .sort({ bodyPart: 1, name: 1 });

        return res.json({
            success: true,
            splitId: split._id,
            day,
            exerciseCount: exercises.length,
            exercises,
        });
    } catch (error) {
        console.error('Get available split exercises error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addExerciseToDay = async (req, res) => {
    try {
        const { day } = req.params;
        const { exerciseId, sets, reps } = req.body;

        const exercise = await Exercise.findById(exerciseId);
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }

        const split = await getOrCreateActiveSplit(req.user._id);
        const dayPlan = getOrCreateDayPlan(split, day);
        const alreadySelected = dayPlan.exercises.some((item) => item.exerciseId.toString() === exerciseId);

        if (alreadySelected) {
            return res.status(409).json({ success: false, message: 'Exercise already selected for this day' });
        }

        dayPlan.exercises.push({
            exerciseId,
            sets: sets || exercise?.prescription?.sets || 3,
            reps: reps || exercise?.prescription?.reps || '8-12',
            order: dayPlan.exercises.length,
        });

        await split.save();

        return res.status(201).json({
            success: true,
            message: 'Exercise added to day',
            splitId: split._id,
            day,
        });
    } catch (error) {
        console.error('Add split exercise error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const removeExerciseFromDay = async (req, res) => {
    try {
        const { day, exerciseId } = req.params;
        const split = await getOrCreateActiveSplit(req.user._id);
        const dayPlan = getOrCreateDayPlan(split, day);
        const originalLength = dayPlan.exercises.length;

        dayPlan.exercises = dayPlan.exercises.filter((item) => item.exerciseId.toString() !== exerciseId);

        if (dayPlan.exercises.length === originalLength) {
            return res.status(404).json({ success: false, message: 'Exercise is not selected for this day' });
        }

        dayPlan.exercises.forEach((item, index) => {
            item.order = index;
        });

        await split.save();

        return res.json({
            success: true,
            message: 'Exercise removed from day',
            splitId: split._id,
            day,
        });
    } catch (error) {
        console.error('Remove split exercise error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    getSelectedExercisesForDay,
    getAvailableExercisesForDay,
    addExerciseToDay,
    removeExerciseFromDay,
};
