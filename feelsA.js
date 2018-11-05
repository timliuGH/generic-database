module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getFeelsAs(res, mysql, context, complete) {
        mysql.pool.query("SELECT name, emotion FROM whosit INNER JOIN feels_a F ON F.whosit_id = whosit.id INNER JOIN howsit ON howsit.id = F.howsit_id", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.entry = results;
            complete();
        });
    }

    function getWhosits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, name FROM whosit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getHowsits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, emotion FROM howsit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.howsit = results;
            complete();
        });
    }

    /* Display Whosits and Howsits */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getFeelsAs(res, mysql, context, complete);
        getWhosits(res, mysql, context, complete);
        getHowsits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {  // Update for each asynchronous call
                res.render('feelsA', context);
            }
        }
    });

    /* Add a Howsit to a Whosit; redirects to /feelsA after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO feels_a (whosit_id, howsit_id) VALUES (?, ?)";
        var inserts = [req.body.whosit_id, req.body.howsit_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/feelsA');
            }
        });
    });
    return router;
}();
