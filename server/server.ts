import * as restify from 'restify';
import { environment } from '../common/environment';
import { Router } from '../common/router';
import * as mongoose from 'mongoose';
import { mergePatchBodyParser } from './merge-patch.parser';
import { handleError } from './error.handler';

export class Server {

    application: restify.Server;

    // método para conexão mongodb
    initializeDb(): mongoose.MongooseThenable {
        // informando biblioteca de promise disponibilizada pelo mongoose
        (<any>mongoose).Promise = global.Promise;

        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true // modo de conexão banco
        });
    }

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {

                this.application = restify.createServer({
                    name: 'test-api',
                    version: '1.0.0'
                });
                
                // configuração para preencher os valores do query (retorno dos dados)
                this.application.use(restify.plugins.queryParser());
                // por padão o restify não faz parse para objeto json neste caso deve ser configurado
                this.application.use(restify.plugins.bodyParser());
                // realizando a configuração no server para aceitar o application/merge-patch+json
                this.application.use(mergePatchBodyParser);
                
                // routes
                for (let router of routers) {
                    router.applyRouter(this.application);
                }

                // OLD ROUTES
                // this.application.get('/info', [
                //     (req, res, next) => {
                //         if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
                //             // res.status(400);
                //             // res.json({ message: 'Please, Update your browser' });
                //             // return next(false);
                
                //             const error: any = new Error();
                
                //             error.statusCode = 400;
                //             error.message = 'Please, Updade your browser';
                
                //             return next(error);
                //         }
                //         return next();
                //     },
                //     (req, res, next) => {
                //         // res.contentType = 'application/json';
                //         // res.setHeader('Context-Type', 'application/json');
                //         // res.status(200);
                //         // res.send({ message: 'Hello'});
                //         res.json({
                //             browser: req.userAgent(),
                //             method: req.method,
                //             url: req.url,
                //             path: req.path(),
                //             query: req.query
                //         });
                
                //         // usado em
                //         // 1ª Informar para o restofy que foi finalizado o processo da callback
                //         // 2ª Quando existe mais de uma callback associada com mais de um caminho (caso acima)
                //         // 3ª Quando é preciso passar um objeto de erro
                //         return next();
                //     }
                // ]);

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                    // console.log('API is running on localhost:3000');
                });

                // registrar evento para tratamento de erros
                this.application.on('restifyError', handleError);  
                
            } catch (error) { // caso ocorra algum erro de configuração do servidor restify
                reject(error);
            }
        });
    }

    // retorna uma processa da própria class Server
    // recebe uma array de rotas para ser aplicadas no bootstrap
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() => 
            this.initRoutes(routers).then(() => this));
    }
}