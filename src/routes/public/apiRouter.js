const express = require('express');
const router = express.Router();

// Serve default api response 
router.get('/api', (req, res, next) =>{
    res.json({
        "status_code": 200,
        "message": "Default API page, see app documentation."
    });    
});

// Serve compiler info
router.get('/api/info', (req, res, next) =>{
    res.json({
        "status_code": 200,
        "message": "Default API page, see app documentation."
    });    
});

module.exports = router;