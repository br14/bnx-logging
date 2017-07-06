/**
 * logging
 * 
 * Module to assist with logging
 * 
 * At "require" time (first one) this routine will prepare the database for this module.
 * 
  * The module exposes methods to log an entry into the database for ease of future access.
 * 
 */


    // Module set up.
    process.on('unhandledRejection', function(e) {
        console.log(e.message, e.stack);
    });

    /**
     * Handle database errors
     *
     * @param {any} err
     */
    var onError = function(err) {
        console.log(err.message);
    };

    var fs = require("fs");

    // namespace for the Module
    var logging = {};

    // Pool for database
    var pool = null;

    //*************** Common functions
    String.prototype.padStart = function(lth, chr) {

        var l = lth - this.length;
        var s = this;
        for (var i = 0; i < l; i++) {
            s = chr + s;
        }
        return s;

    }

    Date.prototype.formatYYYMMDD = function() {

        var y = this.getFullYear();
        var m = this.getMonth();
        m++;
        m = new Number(m).toString();
        m = m.padStart(2, "0");
        var d = ("" + this.getDate());
        d = d.padStart(2, "0");
        return y + "-" + m + "-" + d;

    }
    //*****************************************

    // Connect to the DB
    pool = dbConnect();
    // Run the DDL to initialise the database tables for logging
    dbCreateTable();
    // Log that we created the table
    //log("Logging database table created");

function dbConnect() {

    var Pool = require('pg-pool');
    var dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
    logging.dbConfig = dbConfig;

    return new Pool(logging.dbConfig);

}

function dbCreateTable() {

    var sql = "";
    // Load the ddl script
    if (fs.existsSync("./sql/ddl.sql")) {
        sql = fs.readFileSync("./sql/ddl.sql").toString();
        var p1 = new Promise(
            function(resolve, reject) {
                pool.query(sql,
                    function(err, res) {
                        if (err) reject(err);
                        console.log(res);
                        resolve();
                    });
            });
        p1.then(function(){return;})
            .catch(
                function(err) {
                    onError(err);
                }
            );

    }

}

function log(name, content, level){

    return new Promise(function(resolve, reject) {
        pool.query("INSERT INTO logging (name, content, level) VALUES ($1, $2, $3);", [name, content, 1],
            function(err, res) {
                if (err) throw new Error(err);
                if (res.rowCount && res.rowCount > 0) {
                    resolve(res);
                } else {
                    var str = "";
                    if (name) {
                        str = name;
                    } else {
                        str = id;
                    }
                    reject("Unable to insert [" + str + "] into logging table.");
                }
            });
    });

}

module.exports.log = function(name, content, level /* optional */ ) {

    return log(name, content, level);

}

