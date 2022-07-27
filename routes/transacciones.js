const express = require('express');
const router = express.Router();
const mysqlConnection = require('../database');
const jwt = require('jsonwebtoken');
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

router.get('/transacciones', verifyToken, (req, res) => {
      mysqlConnection.query('call SELECT_TRANSACCIONESS()', (err, rows, fields) => {
        if (!err)
          res.json(rows);
        else
          console.log(err);
      })
});


router.get('/transacciones/:CODTRANSACCION', verifyToken, (req, res) => {
  const { CODTRANSACCION } = req.params;
  const consulta = 'CALL SELECT_TRANSACCION(?)';
  mysqlConnection.query(consulta, [CODTRANSACCION], (err, rows, fields) => {
    if (!err)
      res.json(rows);
    else
      res.send({ Status: "Transacción no existe" });
  })
});

router.delete('/transacciones/:CODTRANSACCION', (req, res) => {
  const { CODTRANSACCION } = req.params;
  const consulta = 'CALL DELETE_TRANSACCION(?)';
  mysqlConnection.query(consulta, [CODTRANSACCION], (err, rows, fields) => {
    if (!err)
      res.send('Transacción eliminada correctamente')
    else
      res.send(err);
  })
});


router.post('/transacciones', (req, res) => {
  const { CODCUENTA, TIP_TRANSACCION, MONTO } = req.body;
  const consulta = ' CALL INSERT_TRANSACCIONES(?,?,?)';
  mysqlConnection.query(consulta, [CODCUENTA, TIP_TRANSACCION, MONTO], (error, rows, fields) => {
    if (!error) {
      res.json({ Status: "Insertion Completed" });
    }

    else {
      console.log(error);

    }


  });
});


router.put('/transacciones/:CODTRANSACCION', verifyToken, (req, res) => {
  const { CODTRANSACCION } = req.params;
  const { CODCUENTA, TIP_TRANSACCION, MONTO, FEC_TRANSACCION } = req.body;
  const consulta = ' CALL UPDATE_TRANSACCION(?,?,?,?,?)';
  mysqlConnection.query(consulta, [CODTRANSACCION, CODCUENTA, TIP_TRANSACCION, MONTO, FEC_TRANSACCION], (error, rows, fields) => {
    if (!error) {
      res.json({ Status: "Transacción Actualizada" });
    }

    else {
      console.log(error);

    }


  });
});



module.exports = router;
