module.exports = function() {
    var express = require('express');
    var router = express.Router();

    function cleanData(res, mysql, context, complete) {
        mysql.pool.query("DELETE FROM whosit WHERE name LIKE ' %'", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getWhosits(res, mysql, context, complete) {
        mysql.pool.query("SELECT whosit.name AS name, wheresit.name AS home, description AS destiny FROM whosit INNER JOIN wheresit ON wheresit.id = home INNER JOIN whysit ON whysit.id = destiny ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getWheresits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, name FROM wheresit WHERE name NOT LIKE ' %' ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.wheresit = results;
            complete();
        });
    }

    function getWhysits(res, mysql, context, complete) {
        mysql.pool.query("SELECT id, description FROM whysit WHERE description NOT LIKE ' %' ORDER BY description", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whysit = results;
            complete();
        });
    }

    /* Display Whosit info: Name, Home, Destiny */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        cleanData(res, mysql, context, complete);
        getWhosits(res, mysql, context, complete);
        getWheresits(res, mysql, context, complete);
        getWhysits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 4) {  // Update for each asynchronous call
                res.render('whosit', context);
            }
        }
    });

    /* Add a Whosit, redirects to /whosit after adding */
    router.post('/', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO whosit (name, home, destiny) VALUES (?, ?, ?)";
        var inserts = [req.body.name, req.body.home, req.body.destiny];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            } else if (!req.body.name.replace(/\s/g, '').length) {
                res.render('invalidWhosit');
            } else {
                res.redirect('/whosit');
            }
        });
    });
    return router;
}();
