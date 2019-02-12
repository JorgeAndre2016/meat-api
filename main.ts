import * as restify from 'restify';

const server = restify.createServer({
    name: 'meat-api',
    version: '1.0.0'
});

server.use(restify.plugins.queryParser());

server.get('/info', [
    (req, res, next) => {

        if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
            // res.status(400);
            // res.json({message: 'Please, update your browser'});
            let error: any = new Error();
            error.statusCode = 400;
            error.message = 'Please, update your browser';
            // return next(false);
            return next(error);
        };
        return next();
    },
    (req, res, next) => {
        // res.contentType = 'application/json';
        // res.status(400);
        // res.setHeader('Content-Type', 'application/json');
        // res.send({message: 'hello'});
        res.json({
            browser: req.userAgent(),
            method: req.method,
            url: req.url,
            path: req.path(),
            query: req.query
        });
        return next;
    }])

server.listen(3000, () => {
    console.log("API is running on http://localhost:3000");

});