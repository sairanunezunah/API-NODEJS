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

//Buscar una Bitácora en especifíco
router.get('/bitacora/:CODBITACORA',verifyToken, (req, res) => {
    const { CODBITACORA } = req.params;
    const query = 'call SELECT_BITACORA(?);';
    mysqlConnection.query(query, [CODBITACORA], (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

//Mostrar todos las Bitácora
router.get('/bitacora/',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TBLBITACORA;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

//Insertar Bitácora
router.post('/bitacora',verifyToken, (req, res) => {

    const { USUARIO, OPERACION, MODIFICADO, NOM_TABLA } = req.body;
    const query = 'call INSERT_BITACORA(?, ?, ?, ?);';
    mysqlConnection.query(query, [USUARIO, OPERACION, MODIFICADO, NOM_TABLA], (err, rows, fields) => {
        if (!err)
            res.json({ Status: 'Bitácora Agregada' })
    })

});

//Actualizar Bitácora
router.put('/bitacora/:CODBITACORA',verifyToken, (req,res)=>{
    
    const {USUARIO, OPERACION, MODIFICADO, NOM_TABLA} = req.body;
    const {CODBITACORA} = req.params;
    const query = 'call UPDATE_BITACORA(?, ?, ?, ?, ?);';
    mysqlConnection.query(query, [CODBITACORA, USUARIO, OPERACION, MODIFICADO, NOM_TABLA],(err,rows,fields)=>{  
        if(!err)   
        res.json({Status: 'Bitácora Actualizado'})
    })

});

//Eliminar Bitácora
router.delete('/bitacora/:CODBITACORA',verifyToken,  (req,res)=>{
  
            const {CODBITACORA} = req.params;
    const query = 'call DELETE_BITACORA(?);';
    mysqlConnection.query(query, [CODBITACORA],(err,rows,fields)=>{  
        if(!err)   
        res.json({Status: 'Bitácora Eliminado'})
        else  
            console.log(err);
        })
  
});
    

module.exports = router;