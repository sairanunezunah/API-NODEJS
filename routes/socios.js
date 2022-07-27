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
//LLAMAR TODOS LOS SOCIOS

router.get('/socios',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TABLAS(1)', (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
        console.log(err);
    })
  });

  //LLAMAR un SOCIO
  router.get('/socios/:PI_CODPERSONA',verifyToken, (req, res) => {
    const {  PI_CODPERSONA  } = req.params;
    const consulta = 'CALL SELECT_PERSONASOCIO(?)';
    mysqlConnection.query(consulta, [ PI_CODPERSONA], (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
      res.send({Status:"Transacción no existe"});
    })
  });

//INSERTAR SOCIOS
router.post('/socios',verifyToken, (req, res) => {
    const {  PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO, PD_AFILICIACION, PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF } = req.body;
    const consulta =' call INSERT_PERSONASOCIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(consulta, [PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO, PD_AFILICIACION, PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Insertion Completed"});
       }
     else {
        console.log(error);
     } 
    });
  });

  //ACTUALIZAR SOCIOS
  router.put('/socios',verifyToken, (req, res) => {
   
    const {  PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO, PD_AFILICIACION, PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF,PI_CODPERSONA} = req.body;
    const consulta =' CALL UPDATE__PERSONASOCIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(consulta, [PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, 
      PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO,
       PV_DOMINIOCORREO, PD_AFILICIACION, PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF
       ,PI_CODPERSONA ], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Transacción Actualizada"});
       }
     else {
        console.log(error);
     }  
    });
  });
  
//Eliminar un SOCIO
router.delete('/socios/:PI_CODPERSONA',verifyToken, (req, res) => {//VERIFICAR
    const {PI_CODPERSONA} = req.params;
    const consulta = 'CALL DELETE_PERSONASOCIO(?)';
    mysqlConnection.query(consulta, [PI_CODPERSONA], (err, rows, fields) => {
      if (!err)
         res.send('Transacción eliminada correctamente')
      else
        res.send(err);
    })
  });


  module.exports = router;