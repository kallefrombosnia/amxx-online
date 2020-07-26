const express = require('express');
const router = express.Router();
const GistClient = require('gist-client');
const gist = new GistClient()


router.get('/compiler', (req, res, next) =>{
    
    res.render('pages/compile');
    
});

router.get('/compiler/gist/:id', (req, res, next) =>{
    const id = req.params.id;
    gist.getOneById(id)
    .then(response => {
        console.log(response)
    }).catch(err => {
        console.log(err)
    })
});



module.exports = router;