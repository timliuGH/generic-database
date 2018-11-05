module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getWhysits(res, mysql, context, complete) {
        mysql.pool.query("SELECT description FROM whysit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whysit = results;
            complete();
        });
    }

    /* Display Whysit info */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getWhysits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 1) {  // Update for each asynchronous call
                res.render('whysit', context);
            }
        }
    });

    /* Add a Whysit; redirects to /whysit after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO whysit (description) VALUES (?)";
        var inserts = [req.body.description];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/whysit');
            }
        });
    });
    return router;
}();
