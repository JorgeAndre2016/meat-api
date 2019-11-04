import * as restify from 'restify';
import { EventEmitter } from 'events';
import { NotFoundError } from 'restify-errors';

// class abstrata usada para mapear as rotas
export abstract class Router extends EventEmitter {
     // recebe uma instância da aplicação restify
    abstract applyRouter(application: restify.Server);

    envelope(document: any): any {
        return document;
    }

    render(response: restify.Response, next: restify.Next){
        return (document) => {
            if(document){
                // emit um documento antes de ser mostrado
                // emite o documento antes da resposta
                this.emit('beforeRender', document);
                response.json(this.envelope(document));
            }else {
                // response.send(404); OLD
                throw new NotFoundError('Documento não encontrado');
            };
            return next();
        }
    }

    renderAll(response: restify.Response, next: restify.Next){
        return (documents: any[]) => {            
            if(documents) {
                documents.forEach((document, index, array) => {
                    // elemento, indice do element, array total
                    
                    this.emit('beforeRender', document);
                    // alterando o elemento 
                    array[index] = this.envelope(document);
                })                
                response.json(documents);
            } else {
                response.json([]);
            }
            return next();
        }
    }
}