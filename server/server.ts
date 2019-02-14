import * as restify from 'restify';
import * as mongoose from 'mongoose';

import { environment } from '../common/environment';
import { Router } from '../common/router';
import { mergePatchBodyParser } from './merge-patch.parser';

export class Server {

    application: restify.Server;

    initializeDb() {
        (<any>mongoose).Promise = global.Promise
        // url de conexão + opções de conexões
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(mergePatchBodyParser);
                // routes

                for (let router of routers) {
                    router.applyRouter(this.application);
                }
                // this.application.get('/info', [
                //     (req, res, next) => {

                //         if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
                //             // res.status(400);
                //             // res.json({message: 'Please, update your browser'});
                //             let error: any = new Error();
                //             error.statusCode = 400;
                //             error.message = 'Please, update your browser';
                //             // return next(false);
                //             return next(error);
                //         };
                //         return next();
                //     },
                //     (req, res, next) => {
                //         // res.contentType = 'application/json';
                //         // res.status(400);
                //         // res.setHeader('Content-Type', 'application/json');
                //         // res.send({message: 'hello'});
                //         res.json({
                //             browser: req.userAgent(),
                //             method: req.method,
                //             url: req.url,
                //             path: req.path(),
                //             query: req.query
                //         });
                //         return next;
                //     }])

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

                // this.application.on('error', (error)=>{}) get erro do listen
            } catch (error) {
                reject(error);
            }
        });
    };

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
        );
    };
}