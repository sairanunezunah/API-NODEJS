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

//Mostrar todos los articulos a credito
router.get('/articuloscredito/',(req,res)=>{  
    mysqlConnection.query('call SELECT_TBL_ACREDITO;',verifyToken,(err,rows,fields)=>{  
    if(!err)   
    res.send(rows[0]);  
    else  
        console.log(err);
    })
});

//Buscar un articulo a credito
router.get('/articuloscredito/:CODARTICULO_CREDITO',verifyToken, (req,res)=>{  
    const {CODARTICULO_CREDITO} = req.params;
    mysqlConnection.query('SELECT * FROM SCTACREDITOS WHERE  CODARTICULO_CREDITO = ?',[CODARTICULO_CREDITO],(err,rows,fields)=>{  
    if(!err)   
    res.send(rows[0]);  
    else  
        console.log(err);
    })
});

//Insertar un articulo a credito
router.post('/articuloscredito',verifyToken, (req, res) => {
    const {PRIMA, SAL_ACTUAL, INT_MENSUAL, PLAZO_MESES, 
        GARANTIA_ART} = req.body;
    const query = 
    `CALL INSERT_ARTICULOS_CREDITO(?, ?, ?, ?, ?);`;
    mysqlConnection.query(query, [PRIMA, SAL_ACTUAL, INT_MENSUAL, PLAZO_MESES, 
        GARANTIA_ART], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'Solicitud agregado'});
        } else {
            console.log(err);
        }
    });
});


//Actualizar un articulo a credito
router.put('/articuloscredito/:CODARTICULO_CREDITO',verifyToken, (req, res) => {
    const {PRIMA, SAL_ACTUAL, INT_MENSUAL, PLAZO_MESES,GARANTIA_ART} = req.body;
    const {CODARTICULO_CREDITO} = req.params
    const query = 'CALL UPDATE_ARTICULO_CREDITO(?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [PRIMA, SAL_ACTUAL, INT_MENSUAL, PLAZO_MESES,
        GARANTIA_ART,CODARTICULO_CREDITO], (err, rows, fields) => {
            if(!err) {
                res.json({Status: 'Solicitud actualizada'})
            } else {
                
                console.log(err);
            }
        });
});

//Eliminar un articulo a credito
router.delete('/articuloscredito/:COD_PRODUCTOS_TEMP',verifyToken, (req, res) => {
    const {COD_PRODUCTOS_TEMP} = req.params;
    const query = 'call DELETE_ARTICULO_CREDITO(?);';
    mysqlConnection.query(query, [COD_PRODUCTOS_TEMP], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'Solicitud eliminada'});
        } else {
            console.log(err);
        }
    });    
});





module.exports = router;