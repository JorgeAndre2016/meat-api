import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mpContentType = 'application/merge-patch+json';

// código usado para realizar a conversão do dados para aceitar e dar suporte ao
// application/merge-patch+json
export const mergePatchBodyParser = (req: restify.Request, resp: restify.Response, next) => {
    if(req.getContentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawBody = req.body; // quardando o body original para um acesso em outro momento
        try {
            req.body = JSON.parse(req.body);
        } catch (error) {
            // return next(new Error(`Invalid context: ${error.message}`)); OLD
            // instanciando um erro do tipo BadRequestError usando o restify-errors
            return next(new BadRequestError(`Invalid content: ${error.message}`));
        }
    }
    return next();
}