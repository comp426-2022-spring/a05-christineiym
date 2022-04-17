// Place your server entry point code here

/***** Creating the server *****/
// Define named constants
const START_ARG_NUM = 2
const EXIT_SUCCESS = 0
const DEFAULT_PORT = 3000
const HTTP_STATUS_OK = 200
const HTTP_STATUS_NOT_FOUND = 404
const CONTENT_TYPE_TEXT_PLAIN = 'text/plain'
const HEADS = 'heads'
const TAILS = 'tails'

// Require minimist module to process arguments.
const minimist = require('minimist')
const { exit } = require('process')
const allArguments = minimist(process.argv.slice(START_ARG_NUM))

// Print help message if asked for.
if (allArguments['help']) {
    console.log(`server.js [options]

    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.
  
    --debug	If set to \`true\`, creates endpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                \`false\`.
  
    --log	If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
  
    --help	Return this message and exit.`)
    exit(EXIT_SUCCESS)
}

// Define a const `port` using the argument from the command line. 
// Make this const default to port 3000 if there is no argument given for `--port`.
const port = allArguments['port'] || process.env.PORT || DEFAULT_PORT

// Require Express.js
const express = require('express')
const app = express()

// Start an app server
const server = app.listen(port, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%', port))
})

// Serve static HTML files
app.use(express.static('./public'));

// Require database SCRIPT file
const db = require('./src/services/database.js')

// Make Express use its own built-in body parser for both urlencoded and JSON body data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging middleware
app.use(require('./src/middleware/logging.js'))

// Additional (combined format) logging middleware, if log is true
if (allArguments['log'] == true) {
    // Require the fs and morgan modules
    const fs = require('fs') // TODO: should I put this at the top?
    const morgan = require('morgan')
    // Use morgan for logging to files
    // Create a write stream to append (flags: 'a') to a file
    const loggingStream = fs.createWriteStream('./data/log/access.log', { flags: 'a' })
    // Set up the access logging middleware
    app.use(morgan('combined', { stream: loggingStream }))
}


/***** API endpoints *****/
// Check endpoint
app.get('/app/', (req, res, next) => {
    res.status(HTTP_STATUS_OK).json({
        'message': "Your API works! (" + HTTP_STATUS_OK + ")"
    })
});

//Coin-flipping
app.use(require("./src/routes/flipRoutes"))

// Logging and error testing, if debug is true
if (allArguments['debug'] == true) {
    app.use(require("./src/routes/debugRoutes"))
}

// Default response for any request not addressed by the defined endpoints
app.use(function (req, res, next) {
    res.json({ "message": "Endpoint not found. (404)" });
    res.status(HTTP_STATUS_NOT_FOUND);
});


/***** Closing server *****/
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server stopped')
    })
})