const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require('../config/database');

//For Registration
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
router.post('/auth', (req, res) => {
    res.send('Authentication');
});

//For Profile
router.get('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, 'loggedin', (err, data) => {
        if (err) 
            res.sendStatus(403);
        res.json({
            tesxt: 'This is protected',
            data: data
        });
    });
    
});

function verifyToken(req, res, next){

    //Get Auth Header
    const beareHeader = req.headers['authorization'];

    if(typeof beareHeader !== 'undefined'){

        const beare = beareHeader.split(' ');

        req.token = beare[1];

        next();

    }
    else{

        res.sendStatus(403);

    }

}

module.exports = router;