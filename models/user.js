const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Enter valid Email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    profilePicture: {
        type: String,
        default: 'default-profile.png'
    },
    age: {
        type: Number,
        min: 13,
        max: 120
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', 'Prefer-not-to-say']
    },
    height: {
        type: Number,
        min: 100,
        max: 250
    },
    weight: {
        type: Number,
        min: 30,
        max: 300
    },
    fitnessGoal: {
        type: String,
        enum: ['weight-loss', 'muscle-gain', 'endurance', 'maintenance', 'general-fitness']
    },
    activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very-active']
    },
    dailyCalorieTarget: Number,
    dailyProteinTarget: Number,
    dailyCarbsTarget: Number,
    dailyFatTarget: Number,
    lastLogin: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, { timestamps: true },
)

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// hide Password
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', userSchema);