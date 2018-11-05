module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getHowsits(res, mysql, context, complete) {
        mysql.pool.query("SELECT emotion FROM howsit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.howsit = results;
            complete();
        });
    }

    /* Display Howsit info */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getHowsits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {  // Update for each asynchronous call
                res.render('howsit', context);
            }
        }
    });

    /* Add a Howsit; redirects to /howsit after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO howsit (emotion) VALUES (?)";
        var inserts = [req.body.emotion];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/howsit');
            }
        });
    });
    return router;
}();
