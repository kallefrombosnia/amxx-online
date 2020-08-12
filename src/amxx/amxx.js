const EventEmitter = require("events");
const crypto = require("crypto");
const fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');


const adapter = new FileSync('db/db.json')
const db = low(adapter);

const config = require('../../config.json');

class AMXX extends EventEmitter{

    constructor(){
        super();

        this.config = config;

        // Listen for error events
        this.on('error', async err =>{
            await db.get('log_error').push({name: err.name, customtext: err.text, error: err.error}).write();
            const logs = db.get('log_error').value();

            console.log(logs)
        });
       
    }

    /*
        processPlugin(includes: array)

        parsed_name - parsed filename with id
        plugin_value - plugin which needs to be proccessed

        Process plugin into specific version of amx 

    */

    processPlugin(name, plugin_value){ 
        try {
            this.createFileFromString(name, plugin_value);     
        } catch (error) {
            this.emit('error', {name: 'plugin_file_save', text: 'there was an problem with saving plugin', error})
        }
    }   

    /*
        processInclude(includes: array)

        parsed_name - parsed filename with id
        include_value - include which needs to be proccessed

        Process include into specific version of amx includes 

    */

    processInclude(name, include_value, version){ 
        try {
            this.createFileFromString(name, include_value);
        } catch (error) {
            this.emit('error', {name: 'include_file_save', text: 'there was an problem with saving custom include', error})
        }
    }


  
    /*
        createFileFromString(name: string, string: string)

        name - filepath with filename and file suffix
        string - actual value of file

        Creates a new file in a specific directory, returns true on succesfull task or 
        false on unseccesfull task.

    */

    createFileFromString(name, string){  

        fs.writeFile(name, string, (err) =>{   
            return new Error('Cannot write the file', err);
        });
        
        return;
    }

    /*
        generateUniqueID()

        Generates random string using crypto module

    */

    generateUniqueID(){
        return crypto.randomBytes(20).toString('hex');
    }

    
}



module.exports = AMXX;