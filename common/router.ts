import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

// class abstrata usada para mapear as rotas
export abstract class Router extends EventEmitter {
    abstract applyRouter(application: restify.Server);

    render(response: restify.Response, next: restify.Next){
        return (document) => {
            if(document){
                this.emit('beforeRender', document); // emit um documento antes de ser mostrado
                response.json(document);
            }else {
                // response.send(404);
                throw new NotFoundError('Documento não encontrado');
            };
            return next();
        }
    }
}