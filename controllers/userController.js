const User = require('../models/user');

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get Profile error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const updateCurrentUser = async (req, res) => {
    try {
        const updates = { ...req.body };
        delete updates.email;
        delete updates.password;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User nor found',
            });
        }
        res.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Update profile error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};  

const getUserById = async (req, res) => {
    if (req.user._id.toString() !=  req.params.id) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to access this user',
        });
    }

    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).json({
                success: false, 
                message: 'User not found',
            });
        }
        res.json({
            success: true,
            user,
        });
    }catch (error) {
        console.error('Get user error : ', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};


module.exports = {
    getCurrentUser,
    updateCurrentUser,
    getUserById,
};


