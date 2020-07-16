const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/compiler', (req, res, next) =>{
    
    setTimeout(()=>{
        fs.readdir(global.config.INCLUDES_PATH, (err, files) => {
            res.render('pages/compile', {
                files
            });
        });

    },1200);
        
});

module.exports = router;