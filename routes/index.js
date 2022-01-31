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
    // res.header("Cache-Control", "no-cache, no-store, must-revalidate");

    //get user id and order id
    let user = parseInt(req.params.user);
    let order = parseInt(req.params.order);
    let url = req.query.url;

    // check if exitsts order update link and return id   
    let selectQuery = `SELECT \`id\`,\`link\` FROM \`analyzes\` WHERE \`user_id\` = '${user}' AND \`order_id\` = '${order}';`
    db.connection.query(selectQuery,function (error, results, fields) {
        if (error) {
            console.log(error.code);
            return res.status(500).json({'error':error.code});
        }
        if (!results.length)
        {
           //create a new row
           let date_ob =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
           let sql = `INSERT INTO \`analyzes\` (\`id\`, \`user_id\`, \`order_id\`, \`link\`, \`total\`, \`created_at\`, \`updated_at\`) VALUES (NULL, '${user}', '${order}', '${url}', '0', '${date_ob}','${date_ob}');`;
           db.connection.query(sql,function (error, resultsInsert, fields) {
               if (error) {
                   console.log(error.code);
                   return res.status(500).json({'error':error.code});
               }
               return res.status(200).json({'status':'okc','id':resultsInsert.insertId});
           });
        }else{
            let idRowExisits = results[0].id;
            let queryUpdate = `UPDATE \`analyzes\` SET \`link\` = '${url}' WHERE \`analyzes\`.\`id\` = ${results[0].id}`;
            db.connection.query(queryUpdate,function (error, resultsUpdate, fields) {
                if (error) {
                    console.log(error.code);
                    return res.status(500).json({'error':error.code});
                }
                console.log(resultsUpdate,fields)
                return res.status(200).json({'status':'oku','id':idRowExisits});
            });
        }


        //comment
    });










    // SELECT * FROM `analyzes` WHERE `user_id` = 1 AND `order_id` = 1
    //else create row and return id     



    // $link =  $order->visitSite->address;
    // $id = $order->id;
    // if(ActionAnalys::where('order_id', '=',$id)->exists())
    // {
    //     ActionAnalys::where('order_id', '=',$id)->update(['link' =>$link]);
    //     $amar = ActionAnalys::where('order_id', '=',$id)->first();
    // }else{
    //     $amar = ActionAnalys::create(['order_id'=>$id,'link'=>$link,'total'=>0]);   
    // }











    // let date_ob =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    // let url = req.query.url;
    // let sql = `INSERT INTO \`analyzes\` (\`id\`, \`user_id\`, \`order_id\`, \`link\`, \`total\`, \`created_at\`, \`updated_at\`) VALUES (NULL, '${user}', '${order}', '${url}', '0', '${date_ob}','${date_ob}');`;
    // db.connection.query(sql,function (error, results, fields) {
    //     if (error) {
    //         console.log(error.code);
    //         return res.status(500).json({'error':error.code});
    //     }
    //     res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    //     return res.status(200).json({'status':'ok','id':results.insertId});
    //     //comment
    // });
});
module.exports = router;
