const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
// router.use('/users', require('./users'));
// router.use('/workouts', require('./workouts'));
router.use('/exercises', require('./exercises'));
// router.use('/nutrition', require('./nutrition'));
// router.use('/progress', require('./progress'));

module.exports = router;