const express = require('express');
const router = express.Router();



router.get('/docs', (req, res, next) =>{
    
    res.render('pages/docs');
    
});


module.exports = router;