module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function cleanData(res, mysql, context, complete) {
        mysql.pool.query("DELETE FROM wheresit WHERE name LIKE ' %'", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wheresit = results;
            complete();
        });
    }

    function getWheresits(res, mysql, context, complete) {
        mysql.pool.query("SELECT name, temperature FROM wheresit ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wheresit = results;
            complete();
        });
    }

    /* Display Wheresit ifno: Name, Temperature */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        cleanData(res, mysql, context, complete);
        getWheresits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 2) {  // Update for each asynchronous call
                res.render('wheresit', context);
            }
        }
    });

    /* Add a Wheresit, redirects to /wheresit after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO wheresit (name, temperature) VALUES (?, ?)";
        var inserts = [req.body.name, req.body.temperature];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else if (!req.body.name.replace(/\s/g, '').length) {
                res.render('invalidWheresit');
            } else {
                res.redirect('/wheresit');
            }
        });
    });

    return router;
}();
