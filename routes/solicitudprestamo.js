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

//Mostrar todos los avales
router.get('/solicitudprestamo/',verifyToken,(req, res) => {
    mysqlConnection.query('call SELECT_TBL_PRESTAMO;', (err, rows, fields) => {
        if (!err)
            res.send(rows[0]);
        else
            console.log(err);
    })
});

//Buscar un aval
router.get('/solicitudprestamo/:CODPRESTAMO', verifyToken,(req, res) => {
    const { CODPRESTAMO } = req.params;
    mysqlConnection.query('SELECT * FROM SCTPRESTAMS WHERE  CODPRESTAMO = ?', [CODPRESTAMO], (err, rows, fields) => {
        if (!err)
            res.send(rows[0]);
        else
            console.log(err);
    })
});

//Insertar un articulo a credito
router.post('/solicitudprestamo',verifyToken, (req, res) => { //revisarrrr
    const { NOMBRE, TESTADO, MON_SOLICITADO, MON_APROBADO, PLAZO_PRESTAMO,
        DESTINO_PRESTAMO, TASA_INTERES, ESTADO, FEC_PRESTAMOS, SESTADO } = req.body;
    const query = `CALL INS_PRESTAMO_PRUEBA(?,?,?,?,?,?,?,?,?,?);`;
    mysqlConnection.query(query, [NOMBRE, TESTADO, MON_SOLICITADO, MON_APROBADO,
        PLAZO_PRESTAMO, DESTINO_PRESTAMO, TASA_INTERES, ESTADO, FEC_PRESTAMOS, SESTADO
    ], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Solicitud Prestamo agregado' });
        } else {
            console.log(err);
        }
    });
});

//Actualizar un articulo a credito
router.put('/solicitudprestamo/:CODTIPOPRESTAMO/:CODPRESTAMO',verifyToken, (req, res) => {
    const { NOMBRE, TESTADO, MON_SOLICITADO, MON_APROBADO,
        PLAZO_PRESTAMO, DESTINO_PRESTAMO, TASA_INTERES, ESTADO, FEC_PRESTAMOS, SESTADO } = req.body;
    const { CODTIPOPRESTAMO, CODPRESTAMO } = req.params
    const query = 'CALL UPDATE_PRESTAMO(?,?,?,?,?,?,?,?,?,?,?,?)';
    mysqlConnection.query(query, [NOMBRE, TESTADO, MON_SOLICITADO, MON_APROBADO,
        PLAZO_PRESTAMO, DESTINO_PRESTAMO, TASA_INTERES, ESTADO, FEC_PRESTAMOS, SESTADO, CODTIPOPRESTAMO, CODPRESTAMO], (err, rows, fields) => {
            if (!err) {
                res.json({ Status: 'Solicitud Prestamo actualizada' })
            } else {
                console.log(err);
            }
        });
});

//Eliminar un articulo a credito
router.delete('/solicitudprestamo/:CODAVALES',verifyToken, (req, res) => {
    const { CODAVALES } = req.params;
    const query = 'call DELETE_PRESTAMO(?);';
    mysqlConnection.query(query, [CODAVALES], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Solicitud prestamo eliminado' });
        } else {
            console.log(err);
        }
    });
});

module.exports = router;