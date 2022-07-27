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


router.get('/rolpago/',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TBLROLCUOTAS;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

//-----------------------------------Seleccionar un campo de Rol de Pago----------------------------
router.get('/rolpago/:CODHOJA',verifyToken, (req, res) => {
    const { CODHOJA } = req.params;
    const query = 'call SELECT_ROLCUOTAS(?);';
    mysqlConnection.query(query, [CODHOJA], (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});
module.exports = router;

//-------------------------------Insertar campo de Rol de Pago-----------------------------------
router.post('/rolpago',verifyToken,  (req, res) => {
    const { CODPRESTAMO, FECPAGAR, CUOTAMENSUAL, INTMENSUAL, CAPMENSUAL,
        SALPRESTAMO, INTMORA, DIASRETRASADOS, NCUOTAPAGADA } = req.body;

    const query = 'call INSERT_ROLCUOTAS(?, ?, ?, ?, ?, ?, ?, ?, ?);';

    mysqlConnection.query(query, [CODPRESTAMO, FECPAGAR, CUOTAMENSUAL, INTMENSUAL, CAPMENSUAL,
        SALPRESTAMO, INTMORA, DIASRETRASADOS, NCUOTAPAGADA], (err, rows, fields) => {
            if (!err)
                res.json({ Status: 'Rol de Pago Agregado' });
        })
});


//--------------------------------Actualizar un campo de Rol de Pago-------------------------------
router.put('/rolpago/:CODHOJA',verifyToken, (req, res) => {
    const { CODPRESTAMO, FECPAGAR, CUOTAMENSUAL, INTMENSUAL, CAPMENSUAL, SALPRESTAMO, INTMORA, DIASRETRASADOS, NCUOTAPAGADA } = req.body;
    const { CODHOJA } = req.params
    const query = 'call UPDATE_ROLCUOTAS(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    mysqlConnection.query(query, [CODHOJA, CODPRESTAMO, FECPAGAR, CUOTAMENSUAL, INTMENSUAL, CAPMENSUAL,
        SALPRESTAMO, INTMORA, DIASRETRASADOS, NCUOTAPAGADA], (err, rows, fields) => {
            if (!err)
                res.json({ Status: 'Rol de Pago Actualizado' });
        })
});

//--------------------------------------Eliminar un campo de rol de pago------------------------------
router.delete('/rolpago/:CODHOJA',verifyToken, (req, res) => {
    const { CODHOJA } = req.params;
    const query = 'call DELETE_ROLCUOTAS(?);';
    mysqlConnection.query(query, [CODHOJA], (err, rows, fields) => {
        if (!err)
            res.json({ Status: 'Rol de Pago Eliminado' });
        else
            console.log(err);
    })
});