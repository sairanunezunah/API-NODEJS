const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const jwt = require('jsonwebtoken');

router.post("/token/login", (req, res) =>{
    const user ={
        id: 1,
        nombre: "Jessica",
        email: "jessica.alas@unah.hn"
    }

    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({
            token
        });
    });
});


module.exports= router;