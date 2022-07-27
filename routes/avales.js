
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

router.get('/avales/api',verifyToken,(req,res)=>{  
    res.json({
    success: 1,
    message : 'this is rest apis working'
    });
});

router.get('/avales/', verifyToken,(req,res)=>{  
    mysqlConnection.query('call SELECT_TBL_AVALES;',(err,rows,fields)=>{  
    if(!err)   
    res.send(rows[0]);  
    else  
        console.log(err);
    })
});

//Buscar un aval
router.get('/avales/:CODAVALES',verifyToken,(req,res)=>{  

 
    const {CODAVALES} = req.params;
    mysqlConnection.query('SELECT * FROM SCTBDAVALES WHERE  CODAVALES = ?',[CODAVALES],(err,rows,fields)=>{  
    if(!err){
    res.send(rows[0]);  
    }else{ 
    res.send('SIN RESULTADOS');
    }
  });
     
 
});


//Insertar un articulo a credito
router.post('/avales', (req, res) => {
    const {FEC_INICIO_TRABAJO, SALARIO} = req.body;
    const query = `CALL INSERT_AVALES(?,?);`;
    mysqlConnection.query(query, [FEC_INICIO_TRABAJO, SALARIO], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'Aval agregado'});
        } else {
            console.log(err);
        }
    });
    
});

//Actualizar un articulo a credito
router.put('/avales/:CODAVALES', (req, res) => {
    const {FEC_INICIO_TRABAJO, SALARIO} = req.body;
    const {CODAVALES} = req.params;
    const query = 'CALL UPDATE_AVALES(?, ?, ?)';
    mysqlConnection.query(query, [CODAVALES,FEC_INICIO_TRABAJO, SALARIO], (err, rows, fields) => {
            if(!err) {
                res.json({Status: 'Aval actualizado'})
            } else {
                console.log(err);
            }
        });
});

//Eliminar un articulo a credito
router.delete('/avales/:CODAVALES', (req, res) => {
    const {CODAVALES} = req.params;
    const query = 'call DELETE_AVALES(?);';
    mysqlConnection.query(query, [CODAVALES], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'aval eliminado'});
        } else {
            console.log(err);
        }
    });    
});


module.exports = router;