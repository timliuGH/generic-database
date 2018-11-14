module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function getHasAs(res, mysql, context, complete) {
        mysql.pool.query("SELECT whosit_id, whatsit_id, whosit.name AS whosit, whatsit.name AS whatsit FROM whosit INNER JOIN has_a H ON H.whosit_id = whosit.id INNER JOIN whatsit ON whatsit.id = H.whatsit_id ORDER BY whosit", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.entry = results;
            complete();
        });
    }

    function getWhosits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id AS whosit_id, name FROM whosit WHERE name NOT LIKE ' %' ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getWhatsits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id AS whatsit_id, name FROM whatsit WHERE name NOT LIKE ' %' ORDER BY name", function(error, results, fields) {
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
        context.jsscripts = ["delete.js"];
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

    router.delete('/whosit_id/:whosit_id/whatsit_id/:whatsit_id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM has_a WHERE whosit_id = ? AND whatsit_id = ?";
        var inserts = [req.params.whosit_id, req.params.whatsit_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            } else {
                res.status(202).end();
            }
        });
    });

    /* Add a Whatsit to a Whosit; redirects to /hasA after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO has_a (whosit_id, whatsit_id) VALUES (?, ?)";
        var inserts = [req.body.whosit_id, req.body.whatsit_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                if (error.code == "ER_DUP_ENTRY" ||
                    error.code == "ER_NO_REFERENCED_ROW_2") {
                    res.redirect('/hasA');
                } else {
                    res.write(JSON.stringify(error));
                    res.end();
                }
            } else {
                res.redirect('/hasA');
            }
        });
    });

    return router;
}();
