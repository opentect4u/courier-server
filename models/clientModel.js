
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
}

Client.getClient = (id, cb) => {

    let sql = `SELECT sl_no, 
                      client_name as name, 
                      client_addr as address,
                      location, 
                      pin_no pin FROM md_client WHERE sl_no = ?`;

    db.query(sql, [id], (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }
        
    });

}

Client.addClient = (inputArray) => {

    let sql = `INSERT INTO md_client (client_name, client_addr,
                                      location, pin_no,  
                                      created_by, created_dt)
                                values (?)`;

    db.query(sql, [inputArray], (err, result)=>{
        if(err){
            return false;
        }
        else{
            return true;
        }
    });

}

Client.editClient = (inputArray) => {

    let sql = `UPDATE md_client SET client_name = ?, client_addr = ?,
                                    location    = ?, pin_no      = ?,  
                                    modified_by = ?, modified_dt = ?
                WHERE sl_no = ?`;

    let data = db.query(sql, [  inputArray.name, 
                                inputArray.address, 
                                inputArray.location, 
                                inputArray.pin,
                                inputArray.user,
                                inputArray.date,
                                inputArray.slno
                             ], (err, result)=>{
        if(err){
            return false;
        }
        else{
            return true;
        }
    });
    
}

module.exports = Client;