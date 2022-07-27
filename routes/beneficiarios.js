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

router.get('/beneficiarios',verifyToken,(req, res) => {
    mysqlConnection.query('call CALAPAL.SELECT_TABLAS(3)', (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
        console.log(err);
    })
  });
  
  router.get('/beneficiarios/:PI_CODPERSONA',verifyToken, (req, res) => {
    const { PI_CODPERSONA  } = req.params;
    const consulta = 'CALL SELECT_BENEFICIARIO(?)';
    mysqlConnection.query(consulta, [PI_CODPERSONA], (err, rows, fields) => {
      if (!err)
        res.json(rows);
      else
      res.json({Status:"Cuenta no existe"});
    })
  });
   
  router.delete('/beneficiarios/',verifyToken, (req, res) => {
    const { PI_CODPERSONA} = req.body;
    const consulta = 'CALL DELETE_PERSONABENEFICIARIO(?)';
    mysqlConnection.query(consulta, [PI_CODPERSONA], (err, rows, fields) => {
      if (!err)
         res.send('Cuenta eliminada correctamente')
      else
        res.send(err);
    })
  });
  
  //INSERTAR BENEFICIARIOS
  router.post('/beneficiarios',verifyToken, (req, res) => {
    const {  PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO,
        PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO,
         PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO, PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF  } = req.body;

    const consulta ='call INSERT_PERSONABENEFICIARIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(consulta, [PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI,
        PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO, 
        PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO,
         PC_NOMDEPARTAMENTO, PC_NOMMUNICIPIO, PC_NOMALDEA, PC_PUNTOREF], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Insertion Completed"});
       }
     else {
        console.log(error);
     }
    });
  });
  

  //ACTUALIZAR BENEFICIARIOS
  router.put('/beneficiarios/:PI_CODPERSONA',verifyToken, (req, res) => {
    const {PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL,
        PV_ESTADOCIVIL, PI_DNI, PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, 
        PV_ESTADOPERSONA, PI_NUMTELEFONO, PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, 
        PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO, PI_CODPERSONA } = req.body;
    const consulta ='call UPDATE__PERSONABENEFICIARIO(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

    mysqlConnection.query(consulta, [PV_PRIMERNOM, PV_SEGUNDONOM, PV_PRIMERAPELL, PV_SEGUNDOAPEL, PV_ESTADOCIVIL, PI_DNI, 
        PD_FECNACIMIENTO, PV_PROFESION, PV_NIVELEDUCATIVO, PV_ESTADOPERSONA, PI_NUMTELEFONO,
         PV_TIPOTELEFONO, PC_INDICADORTELEFONO, PC_ESTADO, PV_DIRCORREO, PV_NOMCORREO, PV_DOMINIOCORREO,
         PI_CODPERSONA], (error, rows, fields) => {
     if (!error) {
       res.json({Status:"Cuenta Actualizada"});
       }
     else {
        console.log(error);
     }       
    });
  });
  
  
  
  
  module.exports = router;
  
  
  
  