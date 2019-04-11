const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const Items = require('../models/itemModel');
const CourierComp = require('../models/courierCompModel');
const CourierServ = require('../models/courierServiceModel');

//For Login
router.post('/login', (req, res) => {

    let data = {

        "user_id": req.body.user_id,
        "password": req.body.password
        
    }

    let sql = `select user_name, user_status
               from md_users where user_id = 
               ? AND password = ?`;

    db.query(sql, [data.user_id, data.password],(err, result) => {
        
        if(err){
            throw err;
        }
        else if(typeof result[0] == 'object' && result[0].user_status == 'A'){
            
            jwt.sign({user: result[0]}, 'courier', (err, token) =>{
                if (err) throw err;
                res.json({ token: token});
            });
        }
        else{
            res.json({ token: "No Data Found"} );
        }
        
    });

});

//For Items Details
router.get('/items', verifyToken, (req, res) => {
    
    Items.getItems((data)=>{
        res.send(data);
    });

});

//For One Item's Details
router.get('/item/:id', verifyToken, (req, res) => {

    Items.getItem(req.params.id, (data)=>{
        res.send(data);
    });

});

//For Item Addition
router.post('/additem', verifyToken, (req, res) => {
    
    let itemDetails = [
        req.body.name,
        req.data.user.user_name,
        formatDate(new Date())

    ];

    Items.addItem(itemDetails);

    res.json({"status": 'OK'});

});

//For Item Modification
router.put('/edititem', verifyToken, (req, res) => {
    
    let itemDetails = {
        name: req.body.name,
        date: formatDate(new Date()),
        slno: req.body.id

    };
    
    Items.editItem(itemDetails);

    res.json({"status": 'OK'});

});


//For CourierComp Details
router.get('/couriercomps', verifyToken, (req, res) => {
    
    CourierComp.getCourierComps((data)=>{
        res.send(data);
    });

});

//For One CourierComp's Details
router.get('/couriercomp/:id', verifyToken, (req, res) => {

    CourierComp.getCourierComp(req.params.id, (data)=>{
        res.send(data);
    });

});

//For CourierComp Addition
router.post('/addcouriercomp', verifyToken, (req, res) => {
    
    let couriercompDetails = [
        req.body.name,
        req.body.address,
        req.body.contact_no,
        req.body.contact_person,
        req.data.user.user_name,
        formatDate(new Date())

    ];

    CourierComp.addCourierComp(couriercompDetails);

    res.json({"status": 'OK'});

});

//For CourierComp Modification
router.put('/editcouriercomp', verifyToken, (req, res) => {
    
    let couriercompDetails = {
        name: req.body.name,
        address: req.body.address,
        contact_no: req.body.contact_no,
        contact_person: req.body.contact_person,
        user: req.data.user.user_name,
        date: formatDate(new Date()),
        slno: req.body.id

    };
    
    CourierComp.editCourierComp(couriercompDetails);

    res.json({"status": 'OK'});

});

//Form Max Service No
router.get('/maxservid/:curdt', verifyToken, (req, res) => {
    
    CourierServ.getMaxServNo(req.params.curdt, (data) => {
        res.send(data);
    });
});

//For CourierServ Details
router.get('/courierservs/:year/:month', verifyToken, (req, res) => {

    CourierServ.getCourierServs(req.params.year,
                                req.params.month,
                                (data)=>{
                                    res.send(data);
                                });

});

//For One CourierServ's Details
router.get('/courierserv/:id/:date', verifyToken, (req, res) => {

    CourierServ.getCourierServ(req.params.id, req.params.date, (data)=>{
        res.send(data);
    });

});

//For CourierServ Addition
router.post('/addcourierserv', verifyToken, (req, res) => {

    let courierservDetails = [
        req.body.sl_no,
        req.body.cname,
        req.body.location,
        req.body.date,
        req.body.trans_type,
        req.body.doc_no,
        req.body.receive_dt,
        req.body.item,
        req.body.comp,
        req.body.phn_no,
        req.body.status,
        req.body.receiver_or_sender,
        req.body.remarks,
        req.data.user.user_name,
        formatDate(new Date())

    ];

    CourierServ.addCourierServ(courierservDetails);

    res.json({"status": 'OK'});

});

//For CourierServ Modification
router.put('/editcourierserv', verifyToken, (req, res) => {
    
    let courierservDetails = {
        
        client_name: req.body.cname,
        location: req.body.location,
        trans_dt: req.body.date,
        trans_type: req.body.trans_type,
        doc_no: req.body.doc_no,
        receive_dt: req.body.receive_dt,
        item_id: req.body.item,
        courier_comp_id: req.body.comp,
        phn_no: req.body.phn_no,
        status: req.body.status,
        receiver_or_sender: req.body.receiver_or_sender,
        remarks: req.body.remarks,
        user: req.data.user.user_name,
        date: formatDate(new Date()),
        slno: req.body.sl_no

    };

    CourierServ.editCourierServ(courierservDetails);

    res.json({"status": 'OK'});

});

//For Courier Service Detetion
router.delete('/deletecourierserv/:id', verifyToken, (req, res) => {

    CourierServ.deleteCourierServ(req.params.id);
    res.json({"status": 'OK'});

});

//Token Verification
function verifyToken(req, res, next){

    //Get Auth Header
    const beareHeader = req.headers['authorization'];

    if(typeof beareHeader !== 'undefined'){

        const beare = beareHeader.split(' ');

        req.token = beare[1];

        jwt.verify(req.token, 'courier', (err, data) => {
            if (err) {
                res.json({ token: "No Data Found"} );
            }
            else{
                req.data = data;
                next();
            }    
            
        });

    }
    else{
        res.json({ token: "No Data Found"} );
    }

}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
 }

//Current Date
function formatDate(date) {
    var d = new Date(date),
        dformat = [ d.getFullYear(),
                    (d.getMonth()+1).padLeft(),
                    d.getDate().padLeft()].join('-')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');

    return dformat;
}

module.exports = router;