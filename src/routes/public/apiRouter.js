const express = require('express');
const router = express.Router();
const AMXX_Object = require('../../amxx/amxx');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('db/db.json')

const db = low(adapter);

db.defaults({ compiles: [], total_compile_times: 0, total_compile_time: 0}).write();

const amxx = new AMXX_Object();

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
                "1.8.2",
                "1.10",
                "1.9.0"
            ]
        }
    });    
});

router.post('/compile', (req, res, next) =>{

    // Get values from body
    const {version, plugin, includes} = req.body;

    // Check if version is set, if not return bad request status code and error message
    if(!version){
        return res.status(400).json({
            "status_code": 400,
            "message": "AMXX version must be set in request body",
        });
    } 

    // Generate unique id for this compile time 
    let id = amxx.generateUniqueID();

    // Get current record in compiles
    const compiles = db.get('compiles').value();

    // Check if record exists, if yes assign new id
    compiles.forEach(compileRecord => {
        if(compile && compile.id === id){
            // If it already exists, assign new id - but this should never happen
            id = amxx.generateUniqueID();
        }
    });


    // Save includes
    if(includes && includes.length > 0){

        let tempIncNameArray = [];

        includes.forEach(include =>{

            //const fileName = amxx.filePathGenerator(id, include.incName);

            const fileName = include.incName;
            
            // Proccess .inc file
            amxx.processInclude(fileName, include.value, version);

            tempIncNameArray.push(fileName);
            

        })
    }

    /*
    db.get('compiles').push({
        id,
        includes: tempIncNameArray,
        plugin: plugin
    })
    */



    
});

module.exports = router;