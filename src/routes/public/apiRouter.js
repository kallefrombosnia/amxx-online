const express = require('express');
const router = express.Router();
const AMXX_Object = require('../../amxx/amxx');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('db/db.json')

const db = low(adapter);

db.defaults({ compiles: [], total_compile_times: 0, total_compile_time: 0, log_error: [], log_success: []}).write();

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
            "amxx_versions_supported": global.config.SUPPORTED_AMXX_VERSIONS
        }
    });    
});

router.post('/compile', (req, res, next) =>{

    // Get values from body
    const {version, plugin, includes} = req.body;
    
    //console.log(req.body)

    // Check if version is set, if not return bad request status code and error message
    if(!version){
        return res.status(400).json({
            "status_code": 400,
            "message": "AMXX version must be set in request body",
        });
    } 

    if(!global.config.SUPPORTED_AMXX_VERSIONS.includes(version)){
        return res.status(400).json({
            "status_code": 400,
            "message": "AMXX version must be valid, check supported versions on site.",
        });
    }

    // Generate unique id for this compile time 
    let id = amxx.generateUniqueID();

    // Get current record in compiles
    const compiles = db.get('compiles').value();

    // Check if record exists, if yes assign new id
    compiles.forEach(compileRecord => {
        if(compileRecord && compileRecord.id === id){
            // If it already exists, assign new id - but this should never happen
            id = amxx.generateUniqueID();
        }
    });



    let tempIncNameArray = [];

    // Save includes
    if(includes && includes.length > 0){

        includes.forEach(include =>{

            //const fileName = amxx.filePathGenerator(id, include.incName);

            const fileName = include.incName;

            // Current working dir
            const path = `${process.cwd()}/amxx/${version}/include/${fileName}`
         
            // Proccess .inc file  
            amxx.processInclude(path, include.value, version);
            
            // Save include path
            tempIncNameArray.push(path);
          
        })
    }

    if(!plugin){
        return res.status(400).json({
            "status_code": 400,
            "message": "AMXX plugin must be set in request body",
        });
    }

    const pluginName = plugin[0].pluginName;

    const pluginPath = `${process.cwd()}/amxx/${version}/${pluginName}`;
         
    // Proccess .inc file  
    amxx.processPlugin(pluginPath, plugin[0].value, version);


    db.get('compiles').push({
        id,
        includes: tempIncNameArray,
        plugin: pluginName
    })
    



    
});

module.exports = router;