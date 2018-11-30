module.exports = function() {
    var express = require('express');
    var router = express.Router();

    /* Removes entries that are just spaces with no text*/
    function cleanData(res, mysql, context, complete) {
        mysql.pool.query("DELETE FROM whosit WHERE name LIKE ' %'", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            //context.whosit = results;
            //complete();
        });
    }

    /* SELECT Whosits to populate table */
    function getWhosits(res, mysql, context, complete) {
        mysql.pool.query("SELECT whosit.id, whosit.name AS name, wheresit.name AS home, description AS destiny FROM whosit INNER JOIN wheresit ON wheresit.id = home INNER JOIN whysit ON whysit.id = destiny ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    function getOneWhosit(res, mysql, context, id, complete) {
        var sql = "SELECT id, name, home, destiny FROM whosit WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results[0];
            complete();
        });
    }

    /* SELECT Wheresits to populate dropdowns 'Home of Whosit', 'Filter by Wheresit' */
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

    /* SELECT Whysits to populate dropdown 'Destiny of Whosit' */
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

    /* SELECT Whosits based on Wheresit id */
    function search(req, res, mysql, context, complete) {
        mysql.pool.query("SELECT whosit.id, whosit.name AS name, wheresit.name AS home, description AS destiny FROM whosit INNER JOIN wheresit ON wheresit.id = home INNER JOIN whysit ON whysit.id = destiny WHERE wheresit.id = " + req.query.home + " ORDER BY name", function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.whosit = results;
            complete();
        });
    }

    /* Display Whosit info to populate table: Name, Home, Destiny */
    router.get('/', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        cleanData(res, mysql, context, complete);
        getWhosits(res, mysql, context, complete);
        getWheresits(res, mysql, context, complete);
        getWhysits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {  // Update for each asynchronous call
                res.render('whosit', context);
            }
        }
    });

    /* Search by Home */
    router.get('/search', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        search(req, res, mysql, context, complete);
        getWheresits(res, mysql, context, complete);
        getWhysits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {  // Update for each asynchronous call
                res.render('whosit', context);
            }
        }
    });

    /* Delete a Whosit */
    router.delete('/:id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM whosit WHERE id = ?";
        var inserts = [req.params.id];
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

    /* Get one Whosit to update */
    router.get('/:id', function(req, res) {
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["prepopulate.js", "updateWhosit.js"];
        var mysql = req.app.get('mysql');
        getOneWhosit(res, mysql, context, req.params.id, complete);
        getWheresits(res, mysql, context, complete);
        getWhysits(res, mysql, context, complete);
        function complete() {
            callbackCount++;
            if (callbackCount >= 3) {
                res.render('update', context);
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

    router.put('/:id', function(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "UPDATE whosit SET name=?, home=?, destiny=? WHERE id=?";
        var inserts = [req.body.name, req.body.home, req.body.destiny, req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.send();
            } else {
                res.status(200);
                res.end();
            }
        });
    });

    return router;
}();
