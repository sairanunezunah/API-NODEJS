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


//LLAMAR TODOS LOS USUARIOS

router.get('/usuarios',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TABLAS(4)', (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
        console.log(err);
    })
  });


  router.get('/usuarios/:PI_CODUSUARIO',verifyToken, (req, res) => {
    const { PI_CODUSUARIO  } = req.params;
    const consulta = 'CALL SELECT_USUARIO(?)';
    mysqlConnection.query(consulta, [PI_CODUSUARIO], (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
      res.send({Status:"Transacción no existe"});
    })
  });


  router.delete('/usuarios/:PI_CODUSUARIO',verifyToken, (req, res) => {
    const { PI_CODUSUARIO} = req.params;
    const consulta = 'CALL DELETE_USUARIO(?)';
    mysqlConnection.query(consulta, [PI_CODUSUARIO], (err, rows, fields) => {
      if (!err)
         res.send('Transacción eliminada correctamente')
      else
        res.send(err);
    })
  });


  router.post('/usuarios',verifyToken, (req, res) => {
    const { PV_NOMBREACC, PV_NOMROL, PV_ESTADO, PV_NOMUSUARIO, PV_PASSUSUARIO, PV_ESTADOUSUARIO, PV_PREGUNTA1, PV_RESPUESTA1, PV_PREGUNTA2, PV_RESPUESTA2, PV_PREGUNTA3, PV_RESPUESTA3, PV_VALACTUAL, PV_VALANTERIOR, PV_PREGUNTA, PV_RESPUESTA } = req.body;
    const consulta =' call INSERT_USUARIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(consulta, [PV_NOMBREACC, PV_NOMROL, PV_ESTADO, PV_NOMUSUARIO, PV_PASSUSUARIO, PV_ESTADOUSUARIO, PV_PREGUNTA1, PV_RESPUESTA1, PV_PREGUNTA2, PV_RESPUESTA2, PV_PREGUNTA3, PV_RESPUESTA3, PV_VALACTUAL, PV_VALANTERIOR, PV_PREGUNTA, PV_RESPUESTA], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Insertion Completed"});
       }
   
     else {
        console.log(error);
     
     }
  
       
    });
  });


  router.put('/usuarios/:PI_CODUSUARIO',verifyToken, (req, res) => {

    const { PI_CODACCESO,PV_NOMBREACC,PV_CODROL, PV_NOMROL, PV_ESTADO, PV_NOMUSUARIO, PV_PASSUSUARIO, PV_ESTADOUSUARIO, PV_PREGUNTA1, PV_RESPUESTA1, PV_PREGUNTA2, PV_RESPUESTA2, PV_PREGUNTA3, PV_RESPUESTA3, PV_VALACTUAL, PV_VALANTERIOR, PV_PREGUNTA, PV_RESPUESTA,PI_CODPREGUNTA,PI_CODPERSONA,PI_CODUSUARIO } = req.body;
    const consulta =' CALL UPDATE__PERSONAUSUARIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(consulta, [PI_CODACCESO,PV_NOMBREACC,PV_CODROL, PV_NOMROL, PV_ESTADO, PV_NOMUSUARIO, PV_PASSUSUARIO, PV_ESTADOUSUARIO, PV_PREGUNTA1, PV_RESPUESTA1, PV_PREGUNTA2, PV_RESPUESTA2, PV_PREGUNTA3, PV_RESPUESTA3, PV_VALACTUAL, PV_VALANTERIOR, PV_PREGUNTA, PV_RESPUESTA,PI_CODPREGUNTA,PI_CODPERSONA,PI_CODUSUARIO], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Transacción Actualizada"});
       }
   
     else {
        console.log(error);
     
     }
  
       
    });
  });

  module.exports = router;