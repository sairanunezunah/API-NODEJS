const mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: '142.44.161.115',
    user: 'CALAPAL',
    password: 'Calapal##567',
    database: 'CALAPAL',
    multipleStatements: true
});


mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;
