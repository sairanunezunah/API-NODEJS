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

// GET Todas las Ventas
router.get('/ventas', verifyToken, (req, res) => {
    mysqlConnection.query('SELECT * FROM SCTBLVENTAS', (err, rows, fields) => {
        if (!err) {
            res.json(rows);

        } else {
            console.log(err);
        }
    });
});



// GET Una Venta
router.get('/ventas/:CODVENTA', verifyToken, (req, res) => {
    const { CODVENTA } = req.params;
    mysqlConnection.query('SELECT * FROM SCTBLVENTAS WHERE CODVENTA = ?', [CODVENTA], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});


// DELETE Una Venta
router.delete('/ventas/:CODVENTA', verifyToken, (req, res) => {
    const { CODVENTA } = req.params;
    mysqlConnection.query('DELETE FROM SCTBLVENTAS WHERE CODVENTA = ?', [CODVENTA], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Venta Eliminada' });
        } else {
            console.log(err);
        }
    });
});

// INSERT Una Venta
router.post('/ventas', verifyToken, (req, res) => {
    const { CODVENTA, CODPRODUCTO, FECVENTA, CANTVENTA, TIPOVENTA, MNTVENTA } = req.body;
    console.log(CODVENTA, CODPRODUCTO, FECVENTA, CANTVENTA, TIPOVENTA, MNTVENTA);
    const query = `
    SET @CODVENTA = ?;
    SET @CODPRODUCTO = ?;
    SET @FECVENTA = ?;
    SET @CANTVENTA = ?;
    SET @TIPOVENTA = ?;
    SET @MNTVENTA = ?;
    CALL INSERT_VENTA(@CODVENTA, @CODPRODUCTO, @FECVENTA, @CANTVENTA, @TIPOVENTA, @MNTVENTA);
  `;
    mysqlConnection.query(query, [CODVENTA, CODPRODUCTO, FECVENTA, CANTVENTA, TIPOVENTA, MNTVENTA], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Venta Insertada' });
        } else {
            console.log(err);
        }
    });

});

module.exports = router;