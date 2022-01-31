const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'statistics',
    multipleStatements:true
});

con.connect(function (err){
    if (err) {
        console.log(err);
    }else {
        console.log('connection is successfull');
    };
});

exports.connection = con;