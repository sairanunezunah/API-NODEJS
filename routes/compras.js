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


// GET Todas las Compras
router.get('/compras',verifyToken, (req, res) => {
    mysqlConnection.query('SELECT * FROM SCTBCOMPRAS', (err, rows, fields) => {
        if (!err) {
            res.json(rows);

        } else {
            console.log(err);
        }
    });
});

// GET Una Compra
router.get('/compras/:CODCOMPRA',verifyToken, (req, res) => {
    const { CODCOMPRA } = req.params;
    mysqlConnection.query('SELECT * FROM SCTBCOMPRAS WHERE CODCOMPRA = ?', [CODCOMPRA], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

// DELETE Una Compra
router.delete('/compras/:CODCOMPRA',verifyToken, (req, res) => {
    const { CODCOMPRA } = req.params;
    mysqlConnection.query('DELETE FROM SCTBCOMPRAS WHERE CODCOMPRA = ?', [CODCOMPRA], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Compra Eliminada' });
        } else {
            console.log(err);
        }
    });
});

// INSERT Una Compra
router.post('/compras',verifyToken, (req, res) => {
    const { CODCOMPRA, CODPRODUCTO, FECCOMPRA, CANTPRODUCTO, UNDPRODUCTO, MNTCOMPRA } = req.body;
    console.log(CODCOMPRA, CODPRODUCTO, FECCOMPRA, CANTPRODUCTO, UNDPRODUCTO, MNTCOMPRA);
    const query = `
    SET @CODCOMPRA = ?;
    SET @CODPRODUCTO = ?;
    SET @FECCOMPRA = ?;
    SET @CANTPRODUCTO = ?;
    SET @UNDPRODUCTO = ?;
    SET @MNTCOMPRA = ?;
    CALL INSERT_COMPRA(@CODCOMPRA, @CODPRODUCTO, @FECCOMPRA, @CANTPRODUCTO, @UNDPRODUCTO, @MNTCOMPRA);
  `;
    mysqlConnection.query(query, [CODCOMPRA, CODPRODUCTO, FECCOMPRA, CANTPRODUCTO, UNDPRODUCTO, MNTCOMPRA], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Compra Insertada' });
        } else {
            console.log(err);
        }
    });

});

module.exports = router;