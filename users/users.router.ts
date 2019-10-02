import { ModelRouter } from '../common/model-router'
import * as restify from 'restify';
import { User } from './users.model'
import { NotFoundError } from 'restify-errors';

class UsersRouter extends ModelRouter<User> {

    constructor() {
        super(User);
        this.on('beforeRender', document => { // esquema para ocultar o pwd
            document.password = undefined;
            // delete document.password;
        })
    }

    findByEmail = (req, resp, next) => {
        if(req.query.email) {
            User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(resp, next))
                .catch(next);
        } else {
            next();
        }
    }

    applyRouter(application: restify.Server) {
        // application.get('/users', (req, resp, next) => {
        //     // User.findAll().then(users => {
        //     User.find()
        //     // .then(users => {
        //     //     resp.json(users);
        //     //     return next();
        //     // });
        //     .then(this.render(resp, next))
        //     .catch(next);
        // });

        // accept-version:1.0.0 -> parâmetro que pode ser passado para apontar a versão
        application.get({ path: '/users', version: '2.0.0'}, [this.findByEmail, this.findAll]); // controle de versão
        application.get({ path: '/users', version: '1.0.0'}, this.findAll); // controle de versão

        // application.get('/users/:id', (req, resp, next) => {
        //     User.findById(req.params.id)
        //     // .then(user => {
        //     //     if (user) {
        //     //         resp.json(user);
        //     //         return next();
        //     //     }

        //     //     resp.send(404);
        //     //     return next();
        //     // });
        //     .then(this.render(resp, next))
        //     .catch(next);
        // });

        application.get('/users/:id', [this.validateId, this.findById]);

        // application.post('/users', (req, resp, next) => {
        //     let user = new User(req.body);
        //     user.save()
        //     // .then(user => {
        //     //     user.password = undefined;
        //     //     resp.json(user);
        //     //     return next();
        //     // })
        //     .then(this.render(resp, next))
        //     .catch(next);
        // });

        application.post('/users', this.save);

        // application.put('/users/:id', (req, resp, next) => {
        //     const options = { runvalidators: true, overwrite: true }; // overwrite: parâmetro for atualizar todos os campos 
        //                                          // caso algum não sejá enviado logo não ira ser apresentado no doc
        //                                          // runvalidators: informa ao mongoose que será necessário a 
        //                                          // aplicação de validações neste momento
        //     User.update({ _id: req.params.id }, req.body, options).exec()
        //         .then(result => {
        //             if (result.n) { // conferindo se houve successo (sumário contendo quantidade de registros afetados)
        //                 return User.findById(req.params.id); // buscando o dado e retornando
        //             } else {
        //             //    resp.send(404);
        //             throw new NotFoundError('Documento não encontrado');
        //             }
        //         // }).then(user => {
        //             //     resp.json(user);
        //             //     return next();
        //             // })
        //         }).then(this.render(resp, next))
        //         .catch(next);
        // });
        application.put('/users/:id', [this.validateId, this.replace]);

        // application.patch('/users/:id', (req, resp, next) => {
        //     // contenttype = application/merge-patch+json
        //     const options = { runvalidators: true, new : true}; // informando que deseja receber o documento já atualizado e que deve ser validado
        //     User.findByIdAndUpdate(req.params.id, req.body, options)
        //         // .then(user => {
        //         //     if(user) {
        //         //         resp.json(user);
        //         //         return next();
        //         //     }
        //         //     resp.send(404);
        //         //     return next();
        //         // });
        //         .then(this.render(resp, next))
        //         .catch(next);
        // });
        application.patch('/users/:id', [this.validateId, this.update]);

        // application.del('/users/:id', (req, resp, next) => {
        //     User.remove({_id: req.params.id}).exec()
        //         .then((cmdResult: any) => {
        //             if(cmdResult.result.n) {
        //                 resp.send(204);
        //             }else {
        //                 // resp.send(404);
        //                 throw new NotFoundError('Documento não encontrado');
        //             }
        //             return next();
        //         })
        //         .catch(next);
        // });
        application.del('/users/:id', [this.validateId, this.delete]);
    }
}

export const usersRouter = new UsersRouter();