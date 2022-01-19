var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/analyze/:id', function(req, res, next) {
          let date_ob =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
          let id = req.params.id;
          let ip = req.socket.remoteAddress ? req.socket.remoteAddress : req.connection.localAddress;
          if (ip == '::1')
          {
              ip = '127.0.0.1';
          }
          let sql= `INSERT INTO \`analyze_logs\` (\`id\`, \`analyze_id\`, \`ip\`, \`created_at\`, \`updated_at\`) VALUES (NULL,'${id}','${ip}','${date_ob}','${date_ob}')`;
          db.connection.query(sql,function (error, results, fields) {
              if (error) {
                  console.log(error.code);
                  return res.status(500).json({'error':error.code});
              }
              res.header("Cache-Control", "no-cache, no-store, must-revalidate");
              return res.status(200).json({'status':'ok'});
          });



          // return res.send('sds');


});
module.exports = router;
