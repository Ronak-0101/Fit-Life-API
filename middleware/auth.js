const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            if (decoded.tokenVersion !== req.user.tokenVersion) {
                return res.status(401).json({
                    success: false,
                    message: 'Token has been invalidated',
                });
            }

            next();
        } catch (error) {
            console.error('Auth Error : ',error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, Token failed",
            });
        }
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token',
        });
    }
};

const generateToken = (id, tokenVersion = 0) => {
    return jwt.sign({ id, tokenVersion },process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required',
        });
    }
    next();
};

module.exports = {protect, generateToken, adminOnly};