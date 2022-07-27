const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const token = require('../routes/token');


//Autorización 
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.send("Acceso Denegado")
    }
}

//Buscar un reporte en especifíco
router.get('/reportesprogra/:CODREPORTE',verifyToken, (req,res)=>{  
  
    const {CODREPORTE} = req.params;
    const query = 'call SELECT_REPORTEPROGRA(?);';
    mysqlConnection.query(query, [CODREPORTE],(err,rows,fields)=>{ 
        if(!err)   
        res.send(rows);  
    })

    
    });
    

//Mostrar todos los reportes programados
router.get('/reportesprogra/',verifyToken,(req,res)=>{  

    mysqlConnection.query('call SELECT_TBLREPORTESPROGRA;',(err,rows,fields)=>{  
        if(!err)   
        res.send(rows);  
    })
   
    
    });
    

//Insertar un Reporte Programado
router.post('/reportesprogra',verifyToken, (req,res)=>{
  
    const {CODREPORTE, TITULO, TIPO, FECHAINICIAL, FECHAFINAL} = req.body;
    const query = 'call INSERT_REPORTEPROGRA(?, ?, ?, ?, ?);';
    mysqlConnection.query(query, [CODREPORTE, TITULO, TIPO, FECHAINICIAL, FECHAFINAL],(err,rows,fields)=>{  
        if(!err)   
        res.json({Status: 'Reporte Programado Agregado'})
    })


});

//Eliminar Reporte Programados
router.delete('/reportesprogra/:CODREPORTE', verifyToken, (req,res)=>{
  
    const {CODREPORTE} = req.params;
    const query = 'call DELETE_REPORTEPROGRA(?);';
    mysqlConnection.query(query, [CODREPORTE],(err,rows,fields)=>{  
        if(!err)   
        res.json({Status: 'Reporte Programado Eliminado'})
    })


});
module.exports = router;