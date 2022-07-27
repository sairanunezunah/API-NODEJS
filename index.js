
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const { json, text } = require('body-parser');

app.use(bodyParser.json()); //le decimos que vamos a utilizar JSON en toda la aplicación
app.use(express.json());

// Settings
app.set('port', process.env.PORT || 3000);

// Routes
app.use(require('./routes/cuentas'));
app.use(require('./routes/transacciones'));
app.use(require('./routes/usuarios'));
app.use(require('./routes/socios'));
app.use(require('./routes/beneficiarios'));
app.use(require('./routes/articuloscredito'));
app.use(require('./routes/avales'));
app.use(require('./routes/solicitudprestamo'));
app.use(require('./routes/rolpago'));
app.use(require('./routes/historialprestamo'));
app.use(require('./routes/bitacora'));
app.use(require('./routes/reportes'));
app.use(require('./routes/reporteshisto'));
app.use(require('./routes/reportesprogra'));
app.use(require('./routes/productos'));
app.use(require('./routes/ventas'));
app.use(require('./routes/compras'));
app.use(require('./routes/token'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});










