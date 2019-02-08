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

    let sql = `select user_name, password, user_status
               from md_users where user_id = 
               ? AND password = ?`;

    db.query(sql, [data.user_id, data.password],(err, result) => {
        
        if(err){
            throw err;
        }
        else if(typeof result[0] == 'object'){
            
            jwt.sign({user: data}, 'loggedin', (err, token) =>{
                if (err) throw err;
                res.json({ token: token});
            });

        }
        else{
            res.json({ token: "No Data Found"} );
        }
        
    });

});

//For Authentication
router.get('/clients', verifyToken, (req, res) => {
    
    db.query("SELECT sl_no, client_name, location, pin_no FROM md_client", (err, result) => {

        if(err){
            return false;
        }
        else{
            
            res.send(result);

        }

    });

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
            if (err) 
                res.json({ token: "No Data Found"} );
            res.json({
                data: data
            });

            next();
            
        });

    }
    else{

        res.sendStatus(403);

    }

}

module.exports = router;