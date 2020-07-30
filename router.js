module.exports = {
    //路由模块
    route(pathname, handle, request, response, configs, form) {
        if (typeof handle[pathname] === 'function') {
            handle[pathname](request, response, configs, form);
        }
        else {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 not found.");
            response.end();
        }
    }
}