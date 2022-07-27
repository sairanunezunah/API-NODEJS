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

router.get('/historialprestamo',verifyToken, (req, res) => {
    mysqlConnection.query('call SELECT_TBLHISTPRESTAMO;', (err, rows, fields) => {
        if (!err)
            res.send(rows);
    })
});

router.get('/historialprestamo/:CODPRESTAMO',verifyToken, (req, res) => {
    const { CODPRESTAMO } = req.params;
    const query = 'call SELECT_HISPRESTAMO(?);';
    mysqlConnection.query(query, [CODPRESTAMO], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
})

//--------------------------Insertar campo de Rol de Pago-----------------------------------
router.post('/historialprestamo',verifyToken, (req, res) => {
    const { CODPRESTAMO, PRESTATARIO, ABONOACUMULADO, INTACUMULADOS, TOTINTMORA, CUOTASPENDIENTES } = req.body;
    const query = 'call INSERT_HISPRESTAMO(?, ?, ?, ?, ?, ?);';
    mysqlConnection.query(query, [CODPRESTAMO, PRESTATARIO, ABONOACUMULADO, INTACUMULADOS, TOTINTMORA,
        CUOTASPENDIENTES], (err, rows, fields) => {
            if (!err)
                res.json({ Status: 'Campo de Historial de Prestamo Agregado' });
        })

});

//--------------------Actualizar un campo de Historial de Prestamo-------------------------
router.put('/historialprestamo/:CODPRESTAMO',verifyToken, (req, res) => {
    const { PRESTATARIO, ABONOACUMULADO, INTACUMULADOS, TOTINTMORA, CUOTASPENDIENTES } = req.body;
    const { CODPRESTAMO } = req.params
    const query = 'call UPDATE_HISPRESTAMO(?,?,?,?,?,?);';
    mysqlConnection.query(query, [CODPRESTAMO, PRESTATARIO, ABONOACUMULADO, INTACUMULADOS, TOTINTMORA,
        CUOTASPENDIENTES], (err, rows, fields) => {
            if (!err)
                res.json({ Status: 'Campo Historial de Prestamo Actualizado' });
        })

});


//----------------------------Eliminar un campo de Historial de Prestamo-------------------------
router.delete('/historialprestamo/:CODPRESTAMO',verifyToken, (req, res) => {
    const { CODPRESTAMO } = req.params;
    const query = 'call DELETE_HISPRESTAMO(?);';
    mysqlConnection.query(query, [CODPRESTAMO], (err, rows, fields) => {
        if (!err)
            res.json({ Status: 'Campo Eliminado' });
        else
            console.log(err);
    })

});
module.exports = router;