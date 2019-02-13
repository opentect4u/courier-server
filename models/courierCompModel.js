
const db = require('../config/database');

var CourierComp = {};

CourierComp.getCourierComps = function(cb){

    db.query("SELECT sl_no, name, contact_no, contact_person FROM md_courier_cmop", (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });
}

CourierComp.getCourierComp = (id, cb) => {

    let sql = `SELECT sl_no, 
                      name, 
                      address,
                      contact_no, 
                      contact_person FROM md_courier_cmop WHERE sl_no = ?`;

    db.query(sql, [id], (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }
        
    });

}

CourierComp.addCourierComp = (inputArray) => {

    let sql = `INSERT INTO md_courier_cmop (name, address,
                                            contact_no, contact_person,  
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

CourierComp.editCourierComp = (inputArray) => {

    let sql = `UPDATE md_courier_cmop SET name = ?, address = ?,
                                    contact_no = ?, contact_person = ?,  
                                    modified_by = ?, modified_dt = ?
                WHERE sl_no = ?`;

    db.query(sql, [ inputArray.name, 
                    inputArray.address, 
                    inputArray.contact_no, 
                    inputArray.contact_person,
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

module.exports = CourierComp;