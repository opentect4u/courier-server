
const db = require('../config/database');
const d  = new Date();
const cur_month = d.getMonth() + 1;
const cur_year  = d.getFullYear();

var CourierServ = {};

CourierServ.getMaxServNo = function(date, cb){
    
    if(date.length == 4){
        var sql = `SELECT ifnull(MAX(sl_no) + 1, 1) AS sl_no 
                    FROM td_courier_service 
                    WHERE month(trans_dt) = ${cur_month}
                    AND year(trans_dt) = ${cur_year}`;
    }
    else{

        let dateArr = date.split('-');

        var sql = `SELECT ifnull(MAX(sl_no) + 1, 1) AS sl_no 
                    FROM td_courier_service 
                    WHERE month(trans_dt) = ${dateArr[1]}
                    AND year(trans_dt) = ${dateArr[0]}`;
    }

    db.query(sql, (err, result) => {

        if(err){
            return false;
        }
        else{
            cb(result);
        }

    });

}

CourierServ.getCourierServs = function(year, month, cb){

    let sql = `SELECT t.sl_no, 
                      t.doc_no, 
                      t.client_name, 
                      t.location,
                      t.trans_dt as date,
                      i.item_name,
                      cc.name as courier_name,
                      t.status,
                      t.receiver_or_sender
                FROM td_courier_service t, md_item i,
                     md_courier_cmop cc
                WHERE t.item_id = i.sl_no
                AND   t.courier_comp_id = cc.sl_no
                AND   month(t.trans_dt) = ${month}
                AND   year(t.trans_dt)  = ${year}
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

    let sql = `SELECT sl_no, client_name, location, DATE_FORMAT(trans_dt,\'%Y-%m-%d\') as trans_dt,
                      trans_type, doc_no, DATE_FORMAT(receive_dt,\'%Y-%m-%d\') as receive_dt,
                      item_id, courier_comp_id,
                      phn_no, status, receiver_or_sender,
                      remarks FROM td_courier_service WHERE sl_no = ?`;

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

    let sql = `INSERT INTO td_courier_service (sl_no, client_name, location, trans_dt,
                                               trans_type, doc_no, receive_dt,
                                               item_id, courier_comp_id,
                                               phn_no, status, receiver_or_sender,
                                               remarks,  
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

    let sql = `UPDATE td_courier_service SET client_name = ?, location = ?, trans_dt = ?,
                                            trans_type = ?, doc_no = ?, receive_dt = ?,
                                            item_id = ?, courier_comp_id = ?,
                                            phn_no = ?, status = ?, receiver_or_sender = ?,
                                            remarks = ?,  
                                            modified_by = ?, modified_dt = ?
                WHERE sl_no = ?`;

    db.query(sql, [ inputArray.client_name,
                    inputArray.location,
                    inputArray.trans_dt,
                    inputArray.trans_type,
                    inputArray.doc_no,
                    inputArray.receive_dt,
                    inputArray.item_id,
                    inputArray.courier_comp_id,
                    inputArray.phn_no,
                    inputArray.status,
                    inputArray.receiver_or_sender,
                    inputArray.remarks,
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

CourierServ.deleteCourierServ = (id) => {

    db.query('DELETE FROM td_courier_service WHERE sl_no = ?', [id], (err, res)=> {
        if(err){
            return false;
        }
        else{
            return true;
        }
    });

}
module.exports = CourierServ;