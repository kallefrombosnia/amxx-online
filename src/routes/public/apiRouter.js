const express = require('express');
const router = express.Router();

// Serve default api response 
router.get('/', (req, res, next) =>{
    res.json({
        "status_code": 200,
        "message": "Default API page, see app documentation."
    });    
});

// Serve compiler info
router.get('/info', (req, res, next) =>{
    res.json({
        "status_code": 200,
        "message": "AMXX online compiler API info.",
        "info": {
            "version": "0.1.0",
            "total_compile_times": 1000,
            "total_compile_seconds": 100000,
            "amxx_versions_supported": [
                "1.8.3",
                "1.1.0",
                "1.9"
            ]
        }
    });    
});

router.post('/compile', (req, res, next) =>{

    
    console.log(req.body)
    
    res.json({
        "status_code": 200,
        "message": "Its working."
    });    
});

module.exports = router;