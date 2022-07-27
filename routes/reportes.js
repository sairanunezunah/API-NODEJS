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
router.get('/reportes/:CODREPORTE',verifyToken, (req, res) => {

    const { CODREPORTE } = req.params;
    const query = 'call SELECT_REPORTE(?);';
    mysqlConnection.query(query, [CODREPORTE], (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});


//Mostrar todos los reportes
router.get('/reportes/',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TBLREPORTES;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

//Insertar un Reporte
router.post('/reportes',verifyToken, (req, res) => {

    const { TITULO, TIPO, FORMATO, PERIODO, FECHAINICIO, FECHAFINAL, CORREO } = req.body;
    const query = 'call INSERTAR_REPORTES(?, ?, ?, ?, ?, ?, ?);';
    mysqlConnection.query(query, [TITULO, TIPO, FORMATO, PERIODO, FECHAINICIO, FECHAFINAL, CORREO], (err, rows, fields) => {
        if (!err)
            res.json({ Status: 'Reporte Agregado' })
    })

});

//Actualizar un reporte
router.put('/reportes/:CODREPORTE',verifyToken, (req, res) => {
   
            const { TITULO, TIPO, FORMATO, PERIODO, FECHAINICIO, FECHAFINAL, CORREO } = req.body;
            const { CODREPORTE } = req.params;
            const query = 'call UPDATE_REPORTE(?, ?, ?, ?, ?, ?, ?, ?);';
            mysqlConnection.query(query, [CODREPORTE, TITULO, TIPO, FORMATO, PERIODO, FECHAINICIO, FECHAFINAL, CORREO], (err, rows, fields) => {
                if (!err)
                    res.json({ Status: 'Reporte Actualizado' })
            })
    
});

//Eliminar Reporte
router.delete('/reportes/:CODREPORTE',verifyToken, (req, res) => {//revisar
   
            const { CODREPORTE } = req.params;
            const query = 'call DELETE_REPORTE(?);';
            mysqlConnection.query(query, [CODREPORTE], (err, rows, fields) => {
                if (!err)
                    res.json({ Status: 'Reporte Eliminado' })
                else
                    console.log(err);
            })
      
});


module.exports = router;