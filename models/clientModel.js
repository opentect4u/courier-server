
const db = require('../config/database');

var Client = {};

Client.getClients = function(cb){

    db.query("SELECT sl_no, client_name, location, pin_no FROM md_client", (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });

    db.end(); 
}

module.exports = Client;