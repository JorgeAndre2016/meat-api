import { Router } from '../common/router';
import * as restify from 'restify';
// import { User } from './users.model'; OLD MODEL
import { User } from './users.schema';
import { NotFoundError } from 'restify-errors';

class UsersRouter extends Router {

    constructor() {
        super();

        // capturando o event emitido pelo render e modificando o documento
        // listener = document
        this.on('beforeRender', document => {
            document.password = undefined;
            // delete document.password
        });
    }    

    // implementando o applyRoutes para disponibilização das rotas de usuário no bootstrap da aplicação
    applyRouter(application: restify.Server) {
        application.get('/users', (req, res, next) => {

            // retornando uma lista de usuário (mock)
            // User.findAll().then(users => { OLD MODEL

            // User.find().then(users => {
            //     res.json(users);
            //     return next();
            // });

            User.find()
                .then(this.render(res, next))
                .catch(next);
        });

        application.get('/users/:id', (req, res, next) => {
            // User.findById(req.params.id).then(user => {
            //     if (user) {
            //         res.json(user);
            //         return next();
            //     };
            //     res.send(404);
            //     return next();
            // })

            User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        });

        application.post('/users', (req, res, next) => {
            let user = new User(req.body);
            // user.save().then(user => {
            //     user.password = undefined;
            //     res.json(user);
            //     return next();
            // });

            user.save()
                .then(this.render(res, next))
                .catch(next);
        });

        // put usado para atualizado todo o documento
        application.put('/users/:id', (req, res, next) => {
            // overwrite: parâmetro for atualizar todos os campos 
//                                          // caso algum não sejá enviado logo não ira ser apresentado no doc
//                                          // runvalidators: informa ao mongoose que será necessário a 
//                                          // aplicação de validações neste momento

            // informa para o mongoose que desejá sobrescrever o documento completo
            // informa ao mongoose que desejá aplicar as validações
            const options = { overwrite: true, runValidators: true };

            // método retorna um objeto de query, com exec da query é realizado o comando
            // assim é possível se inscrever na promise
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    // UPDATE é um resultado de um comando
                    // contém um sumary de execução na onde existe o N que 
                    // (sumário contendo quantidade de registros afetados)
                    // contém a quantidade de linhas afetas pelo comando
                    if(result.n) {
                        return User.findById(req.params.id); // buscando o dado e retornando
                    } else {
                        // res.send(404); OLD
                        throw new NotFoundError('Document não encontrado');
                    }
                // }).then(user => {
                //     res.json(user);
                //     return next();
                // });
                })
                .then(this.render(res, next))
                .catch(next);
        });

        application.patch('/users/:id', (req, res, next) => {

            // indica para o mongoose que o documento a ser retornado tem que ser o novo
            const options = { new: true, runValidators: true };

            // primeiro parâmetro para localizar registro a ser modificado
            // segundo parâmetro novos dados para o documento
            // application/merge-path+json (PATH RECOMENTADO A SER ENVIADO NO HEADER)

            // User.findByIdAndUpdate(req.params.id, req.body, options).then(user => {
            //     if(user) {
            //         res.json(user);
            //         return next();
            //     } else {
            //         res.send(404);
            //         return next();
            //     }
            // })

            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        });

        application.del('/users/:id', (req, res, next) => {
            User.remove({ _id: req.params.id }).exec()
                .then((cmdResult: any) => {
                    if(cmdResult.result.n) {
                        res.send(204);
                    } else {
                        // res.send(404); OLD
                        throw new NotFoundError('Document não encontrado');
                    }
                    return next();
                })
                .catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();