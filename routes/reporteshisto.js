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
router.get('/reporteshisto/:CODREPORTE',verifyToken, (req, res) => {
    const { CODREPORTE } = req.params;
    const query = 'call SELECT_REPORTEHISTO(?);';
    mysqlConnection.query(query, [CODREPORTE], (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

//Mostrar todos los reportes históricos
router.get('/reporteshisto/', (req, res) => {
    mysqlConnection.query('call SELECT_TBLREPORTESHISTO;',verifyToken, (err, rows, fields) => {
        if (!err)
            res.send(rows);
    });
});
module.exports = router;