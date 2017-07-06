var logging = require("./app.js");

logging.log("test.js", "This is a test", 1) // returns a promise
    .then(function(res) {
        console.log(res);
    })
    .catch(function(err) {
        console.log(err);
    });