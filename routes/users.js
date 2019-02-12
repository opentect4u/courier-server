const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const Clients = require('../models/clientModel');

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
            
            jwt.sign({user: result[0]}, 'loggedin', (err, token) =>{
                if (err) throw err;
                res.json({ token: token});
            });
        }
        else{
            res.json({ token: "No Data Found"} );
        }
        
    });

});

//For Clients Details
router.get('/clients', verifyToken, (req, res) => {
    
    Clients.getClients((data)=>{
        res.send(data);
    });

});

//For One Client's Details
router.get('/client/:id', verifyToken, (req, res) => {

    let sl_no = req.params.id;

    Clients.getClient(sl_no, (data)=>{
        res.send(data);
    });

});

//For Clint Addition
router.post('/addclient', verifyToken, (req, res) => {
    
    let clientDetails = [
        req.body.name,
        req.body.address,
        req.body.location,
        req.body.pin,
        req.data.user.user_name,
        formatDate(new Date())

    ];

    Clients.addClient(clientDetails);

    res.json({"status": 'OK'});

});

//For Clint Modification
router.put('/editclient', verifyToken, (req, res) => {
    
    let clientDetails = {
        name: req.body.name,
        address: req.body.address,
        location: req.body.location,
        pin: req.body.pin,
        user: req.data.user.user_name,
        date: formatDate(new Date()),
        slno: req.body.id

    };
    
    Clients.editClient(clientDetails);

    res.json({"status": 'OK'});

});

//For Profile
router.get('/profile', verifyToken, (req, res) => {
    
    res.json({'data': 1});

});


//Token Verification
function verifyToken(req, res, next){

    //Get Auth Header
    const beareHeader = req.headers['authorization'];

    if(typeof beareHeader !== 'undefined'){

        const beare = beareHeader.split(' ');

        req.token = beare[1];

        jwt.verify(req.token, 'loggedin', (err, data) => {
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