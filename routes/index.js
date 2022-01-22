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
          if (ip == '::1') {
              ip = '127.0.0.1';
          }
         let selectQuery = `SELECT \`id\`,\`link\` FROM \`analyzes\` WHERE id = '${id}';`
         db.connection.query(selectQuery,function (error, results, fields) {
            if (error) {
                return res.status(500).json({'error':error.code});
            }
            if (!results.length)
            {
                return res.status(500).json({'error':'not found'});
            }
            let link = results[0].link;
            let sql= `INSERT INTO \`analyze_logs\` (\`id\`, \`analyze_id\`, \`ip\`, \`created_at\`, \`updated_at\`) VALUES (NULL,'${results[0].id}','${ip}','${date_ob}','${date_ob}')`;
            db.connection.query(sql,function (error, results, fields) {
                if (error) {
                    return res.status(500).json({'error':error.code});
                }
                return res.redirect(link);
            });
         });
});
router.get('/analyze/create/link/:user/:order', function(req, res, next) {
    let date_ob =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    let user = req.params.user;
    let order = req.params.order;
    let url = req.query.url;
    let sql = `INSERT INTO \`analyzes\` (\`id\`, \`user_id\`, \`order_id\`, \`link\`, \`total\`, \`created_at\`, \`updated_at\`) VALUES (NULL, '${user}', '${order}', '${url}', '0', '${date_ob}','${date_ob}');`;
    db.connection.query(sql,function (error, results, fields) {
        if (error) {
            console.log(error.code);
            return res.status(500).json({'error':error.code});
        }
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.status(200).json({'status':'ok','id':results.insertId});
        //comment
    });
});
module.exports = router;
