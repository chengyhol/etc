module.exports = {
    correspond(response, statusCode, content, contentType = 'application/json') {
        response.writeHead(statusCode, { 'content-type': contentType });
        if (contentType == 'application/json') {
            if (typeof content == 'string')
                response.write(content)
            else if (typeof content == 'object')
                response.write(JSON.stringify(content))
        }
        else
            response.write(content);
        response.end();
    }
}

