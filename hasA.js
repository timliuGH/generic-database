module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getHasAs(res, mysql, context, complete) {
        mysql.pool.query("SELECT whosit.name AS whosit, whatsit.name AS whatsit FROM whosit INNER JOIN has_a H ON H.whosit_id = whosit.id INNER JOIN whatsit ON whatsit.id = H.whatsit_id", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.entry = results;
            complete();
        });
    }

    function getWhosits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id AS whosit_id, name FROM whosit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getWhatsits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id AS whatsit_id, name FROM whatsit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whatsit = results;
            complete();
        });
    }

    /* Display Whatsits and Whosits */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getHasAs(res, mysql, context, complete);
        getWhosits(res, mysql, context, complete);
        getWhatsits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {  // Update for each asynchronous call
                res.render('hasA', context);
            }
        }
    });

    /* Add a Whatsit to a Whosit; redirects to /hasA after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO has_a (whosit_id, whatsit_id) VALUES (?, ?)";
        var inserts = [req.body.whosit_id, req.body.whatsit_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/hasA');
            }
        });
    });

    return router;
}();
