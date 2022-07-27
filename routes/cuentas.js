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


router.get('/cuentas', verifyToken,(req, res) => {
  mysqlConnection.query('call SELECT_CUENTASS', (err, rows, fields) => {
    if (!err)
      res.json(rows);
    else
      console.log(err);
  })
});

router.get('/cuentas/:CODCUENTA',verifyToken, (req, res) => {
  const { CODCUENTA } = req.params;
  const consulta = 'CALL SELECT_CUENTAS(?)';
  mysqlConnection.query(consulta, [CODCUENTA], (err, rows, fields) => {
    if (!err)
      res.json(rows);
    else
    res.json({Status:"Cuenta no existe"});
  })
});

router.delete('/cuentas/:CODCUENTA',verifyToken, (req, res) => {
  const { CODCUENTA } = req.params;
  const consulta = 'CALL DELETE_CUENTAS(?)';
  mysqlConnection.query(consulta, [CODCUENTA], (err, rows, fields) => {
    if (!err)
       res.send('Cuenta eliminada correctamente')
    else
      res.send(err);
  })
});

router.post('/cuentas',verifyToken, (req, res) => {
  const { CODSOCIO,SALDO } = req.body;
  const consulta =' CALL INSERT_CUENTAS(?,?)';
  mysqlConnection.query(consulta, [CODSOCIO,SALDO], (error, rows, fields) => {
   if (!error) {
     res.json({Status:"Insertion Completed"});
     }
 
   else {
      console.log(error);
   
   }

     
  });
});

router.put('/cuentas/:CODCUENTA',verifyToken, (req, res) => {
  const {CODCUENTA}=req.params;
  const { CODSOCIO,SALDO,FEC_CREACION } = req.body;
  const consulta =' CALL UPDATE_CUENTAS(?,?,?,?)';
  mysqlConnection.query(consulta, [CODCUENTA,CODSOCIO,SALDO,FEC_CREACION], (error, rows, fields) => {
   if (!error) {
     res.json({Status:"Cuenta Actualizada"});
     }
 
   else {
      console.log(error);
   
   }

     
  });
});


module.exports = router;







