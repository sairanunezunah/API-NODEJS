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

// GET Todos los Productos
router.get('/productos',verifyToken, (req, res) => {
    mysqlConnection.query('SELECT * FROM SCPRODUCTOS', (err, rows, fields) => {
        if (!err) {
            res.json(rows);

        } else {
            console.log(err);
        }
    });
});

// GET Un Producto
router.get('/productos/:CODPRODUCTO',verifyToken, (req, res) => {
    const { CODPRODUCTO } = req.params;
    mysqlConnection.query('SELECT * FROM CALAPAL.SCPRODUCTOS WHERE CODPRODUCTO = ?', [CODPRODUCTO], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
        } else {
            console.log(err);   
        }
    });
});

// DELETE Un Producto
router.delete('/productos/:CODPRODUCTO',verifyToken (req, res) => {
    const { CODPRODUCTO } = req.params;
    mysqlConnection.query('DELETE FROM SCPRODUCTOS WHERE CODPRODUCTO = ?', [CODPRODUCTO], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Producto Eliminado' });
        } else {
            console.log(err);
        }
    });
});

// INSERT Un Producto
router.post('/productos',verifyToken, (req, res) => {
    const { CODPRODUCTO, CODCATEGORIA, CODMARCA, NOMPRODUCTO, PRCPRODUCTO } = req.body;
    console.log(CODPRODUCTO, CODCATEGORIA, CODMARCA, NOMPRODUCTO, PRCPRODUCTO);
    const query = `
    SET @CODPRODUCTO = ?;
    SET @CODCATEGORIA = ?;
    SET @CODMARCA = ?;
    SET @NOMPRODUCTO = ?;
    SET @PRCPRODUCTO = ?;
    CALL INSERT_PRODUCTO(@CODPRODUCTO, @CODCATEGORIA, @CODMARCA, @NOMPRODUCTO, @PRCPRODUCTO);
  `;
    mysqlConnection.query(query, [CODPRODUCTO, CODCATEGORIA, CODMARCA, NOMPRODUCTO, PRCPRODUCTO], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Producto Insertado' });
        } else {
            console.log(err);
        }
    });

});

// UPDATE Un Producto
router.put('productos/:CODPRODUCTO',verifyToken, (req, res) => {
    const { CODCATEGORIA, CODMARCA, NOMPRODUCTO, PRCPRODUCTO } = req.body;
    const { CODPRODUCTO } = req.params;
    const query = `
    SET @CODPRODUCTO = ?;
    SET @CODCATEGORIA = ?;
    SET @CODMARCA = ?;
    SET @NOMPRODUCTO = ?;
    SET @PRCPRODUCTO = ?;
    CALL UPDATE_PRODUCTO(@CODPRODUCTO, @CODCATEGORIA, @CODMARCA, @NOMPRODUCTO, @PRCPRODUCTO);
  `;
    mysqlConnection.query(query, [CODPRODUCTO, CODCATEGORIA, CODMARCA, NOMPRODUCTO, PRCPRODUCTO], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'Producto Actualizado' });
        } else {
            console.log(err);
        }
    });
});


module.exports = router;
  