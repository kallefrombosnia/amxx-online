const express = require('express');
const router = express.Router();



router.get('/', (req, res, next) =>{
    res.render('pages/dashboard');
});

module.exports = router;