import * as restify from 'restify';

// class abstrata usada para mapear as rotas
export abstract class Router {
    abstract applyRouter(application: restify.Server);
}