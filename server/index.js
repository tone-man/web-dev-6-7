/**
 * This is my node server code with helper withods for project 3.
 * I am using it to do this small practice because it is easier IMO.
 * 
 * I lied, its way harder.
 */
const PORT_NUM = 5008;
const doTrace = true;

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const server = http.createServer(handleRequest);
server.listen(PORT_NUM, () => {
    console.log(`Server is running on port ${PORT_NUM}.`)
});

/**
 * Entry point for handling client requests.
 * 
 * @param {Object} req - The client request object.
 * @param {Object} res - The server response object.
 */
function handleRequest(req, res) {
    const { pathname } = url.parse(req.url, true)

    const pathnameParts = pathname.split('/');

    // Get the first part of the pathname
    const firstPathPart = pathnameParts[1];

    console.log(`the first part of the path is ${firstPathPart}.`); // 'path'

    trace(`Handling request from client for ${pathname}`);

    switch (firstPathPart) {
        case '':
            handleHomePage(req, res);
            break;
        case 'pets':
            handlePets(req, res);
            break;
        case 'assets':
            handleAssets(req, res);
            break;

        default:
            sendNotFound(res);
    }

    trace(`Completed request for ${pathname}`);
}

/** Handles client requests to the home page.
 *  
 * @param {object} req - The client request object
 * @param {object} res - The client response object
 */
function handleHomePage(req, res) {

    trace('Handling homepage request.');

    if (req.method == "GET") {
        trace('Writing index.html as response.');

        fs.readFile("index.html", (err, data) => {
            if (err) {
                sendInternalServerError(res);
            } else {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            }

            trace('index.html response written.')
        });
    } else
        sendMethodNotAllowed(res);

    trace('Completed hompage request.')
}

/**
 * Handles client requests to the assets directory.
 * 
 * @param {object} req - The client request object
 * @param {object} res - The client response object
*/
function handleAssets(req, res) {
    trace('Handling asset request.')

    if (req.method == "GET") {
        //Generate the dir so I can access the file types
        const assetPath = path.join(__dirname, req.url);

        fs.readFile(assetPath, (err, data) => {
            if (err) {
                sendNotFound(res);
            } else {
                const ext = assetPath.extname(assetPath);
                let contentType = 'text/plain';

                switch (ext) {
                    case '.html':
                        contentType = 'text/html';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                    case '.png':
                        contentType = 'image/png';
                        break;
                }

                res.setHeader('Content-Type', contentType);
                res.writeHead(200);
                res.end(data);

            }
        });
    }
    else
        sendMethodNotAllowed(res);

    trace('Completed homepage request.')
}

/**
 * Handles client requests to the assets directory.
 * 
 * @param {object} req - The client request object
 * @param {object} res - The client response object
 */
function handlePets(req, res) {

}


/**
 * Sends a "Bad Request" response to the client.
 * @param {object} res - The HTTP response object to send the response.
 */
function sendBadRequest(res) {

    trace(`Writing bad request response.`);

    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("Bad Request.");

    trace(`Bad request response written.`);
}

/**
 * Sends a "Resource Not Found" response to the client.
 * @param {object} res - The HTTP response object to send the response.
 */
function sendNotFound(res) {

    trace(`Writing resource not found response.`);

    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("Resource not found.");

    trace(`Resource not found response written.`);
}

/**
 * Sends a "Method Not Allowed" response to the client.
 * @param {object} res - The HTTP response object to send the response.
 */
function sendMethodNotAllowed(res) {

    trace(`Writing method not allowed response.`);

    res.writeHead(405, { "Content-Type": "text/html" });
    res.end("Method not allowed.");

    trace(`Method not allowed response written.`);
}


/**
 * Sends an "Internal Server Error" response to the client.
 * @param {object} res - The HTTP response object to send the response.
 */
function sendInternalServerError(res) {

    trace(`Writing intrenal server error response.`);

    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("Internal Server Error");

    trace(`Internal server error response written.`)
}

/**
 * This prints a message to the screen on if {@code doTracing} is true.
 * 
 * @param msg the message to display to the screen.
 */
function trace(msg) {
    if (doTrace)
        console.log(msg);
}