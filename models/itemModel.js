
const db = require('../config/database');

var Item = {};

Item.getItems = function(cb){

    db.query("SELECT sl_no, item_name FROM md_item", (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });
}

Item.getItem = (id, cb) => {

    let sql = `SELECT sl_no, 
               item_name as name
               FROM md_item WHERE sl_no = ?`;

    db.query(sql, [id], (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }
        
    });

}

Item.addItem = (inputArray) => {

    let sql = `INSERT INTO md_item (item_name,  
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

Item.editItem = (inputArray) => {

    let sql = `UPDATE md_item SET item_name = ?,  
                                    modified_by = ?, modified_dt = ?
                WHERE sl_no = ?`;

    db.query(sql, [ inputArray.name,
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

module.exports = Item;