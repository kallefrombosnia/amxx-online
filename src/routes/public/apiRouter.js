const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const AMXX_Object = require('../../amxx/amxx');

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

    // Get statistics from db
    const total_compile_time = global.db.get('total_compile_time').value();
    const total_compile_times = global.db.get('total_compile_times').value();

    
    res.json({
        "status_code": 200,
        "message": "AMXX online compiler API info.",
        "info": {
            "version": global.config.VERSION,
            "total_compile_times": total_compile_times,
            "total_compile_seconds": total_compile_time,
            "amxx_versions_supported": global.config.SUPPORTED_AMXX_VERSIONS
        }
    });    
});

router.post('/compile', (req, res, next) =>{

    amxx.once('compile_end_good', async compile =>{

        // Emit event to clean plugin files 
        amxx.emit('cleanup_files', compile.plugin_id);

        // Get plugin name and path 
        const pluginName = `${compile.plugin_id}.amxx`;
        const pluginPath = path.join(global.config.AMXX_PATH + '/plugins/' + pluginName);

        // Get plugin hashes
        const md5 = await amxx.fileHash(pluginPath);
        const sha256 = await amxx.fileHash(pluginPath, 'sha256');

        return res.status(200).json({
            "status_code": 200,
            "message": "Plugin is succesfully compiled",
            "output_log": compile.output_log,
            "elapsed_time": compile.elapsed_time,
            "plugin_id": compile.plugin_id,
            "file_hash": {
                "md5": md5,
                "sha256": sha256
            }
        });
    });

    amxx.once('compile_end_bad', compile =>{
        console.log('compiled bad')
        return res.status(400).json({
            "status_code": 400,
            "message": "Plugin is not succesfully compiled",
            "output_log": compile.output_log,
            "elapsed_time": compile.elapsed_time
        });
    });

    // Get values from body
    const {version, plugin, includes} = req.body;

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

        console.log('length', includes.length)

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

    // Plugin paths
    const pluginName = plugin[0].pluginName;
    const pluginPath = `${process.cwd()}/amxx/${version}/${pluginName}`;
         
    // Proccess .sma file  
    amxx.processPlugin(pluginPath, plugin[0].value, version);

    // Save file names 
    global.db.get('compiles').push({
        id,
        includes: tempIncNameArray,
        plugin: pluginPath,
        plugin_name: pluginName
    }).write();

    // Call compile function
    amxx.compilePlugin(pluginName, version, id);


});

router.get('/download/:id', (req, res) =>{

    const id = req.params.id;

    // Check if id exists
    if(!id){        
        return res.status(400).json({
            "status_code": 400,
            "message": "Valid plugin id is required.",
        });
    }

    // Get info from db; find by id 
    const pluginInfo = global.db.get('compiles').find({ id }).value();

    // Check if record id exists
    if(pluginInfo){

        // Get plugin name and path 
        const pluginName = `${id}.amxx`;
        const pluginPath = path.join(global.config.AMXX_PATH + '/plugins/' + pluginName);

        // Name of the compiled plugin 
        const fileName = pluginInfo.plugin_name.split('.')[0] + '.amxx';

        // Return file download 
        return  res.download(pluginPath, fileName, err =>{

            // Check if express throws error  
            if(err){
                // Save error
                this.emit('error', {name: 'delete_file', customtext: 'Error while downloading plugin file', error: err});
            }else{

                // Remove db entry
                global.db.get('compiles').remove({id}).write()

                // Remove compiled plugin
                fs.unlink(pluginPath, err =>{
                    if (err) amxx.emit('error', {name: 'delete_file', customtext: 'Error while deleting compiled plugin file', error: err});
                })
            }
        
        })
    }

    return res.status(404).json({
        "status_code": 404,
        "message": "Plugin id does not exists.",
    });
});

router.get('*', (req, res) =>{
    return res.status(404).json({
        "status_code": 404,
        "message": "Unknown route.",
    });
});

module.exports = router;