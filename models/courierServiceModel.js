
const db = require('../config/database');
const d  = new Date();
const cur_month = d.getMonth() + 1;
const cur_year  = d.getFullYear();

var CourierServ = {};

CourierServ.getMaxServNo = function(cb){

    

    let sql = `SELECT ifnull(MAX(sl_no) + 1, 1) AS sl_no 
               FROM td_courier_service 
               WHERE month(trans_dt) = ${cur_month}
               AND year(trans_dt) = ${cur_year}`;

    db.query(sql, (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });

}

CourierServ.getCourierServs = function(cb){

    let sql = `SELECT t.sl_no, 
                      t.doc_no, 
                      c.client_name, 
                      c.location,
                      t.trans_dt as date,
                      i.item_name,
                      cc.name as courier_name,
                      t.status,
                      t.receiver_remarks
                FROM td_courier_service t, md_item i,
                     md_client c, md_courier_cmop cc
                WHERE t.client_id = c.sl_no
                AND   t.item_id = i.sl_no
                AND   t.courier_comp_id = cc.sl_no
                AND   month(t.trans_dt) = ${cur_month}
                AND   year(t.trans_dt)  = ${cur_year}
                ORDER BY t.sl_no DESC`;

    db.query(sql, (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });
}

CourierServ.getCourierServ = (id, cb) => {

    let sql = `SELECT sl_no, 
                      name, 
                      address,
                      contact_no, 
                      contact_person FROM td_courier_service WHERE sl_no = ?`;

    db.query(sql, [id], (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }
        
    });

}

CourierServ.addCourierServ = (inputArray) => {

    let sql = `INSERT INTO td_courier_service (sl_no, client_id, trans_dt,
                                               trans_type, doc_no, item_id, 
                                               courier_comp_id,
                                               phn_no, received_by,
                                               receiver_remarks,  
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

CourierServ.editCourierServ = (inputArray) => {

    let sql = `UPDATE td_courier_service SET name = ?, address = ?,
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

module.exports = CourierServ;