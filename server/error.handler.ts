import * as restify from 'restify'

export const handleError = (req: restify.Request, resp: restify.Response, err, done) => {
    
    // RESTIFY USA O TOJSON PARA ESCREVER O CORPO DO OBJETO
    err.toJSON = () => {
        return {
            message: err.message
        }
    };

    // mudando o status code conforme erro 
    switch (err.name) {
        case 'MongoError':
            if(err.code === 11000) {
                err.statisCode = 400;
            }
            break;
        case 'ValidationErro':
            err.statisCode = 400;
            const messages: any[] = [];

            // percorrendo o array de erros listados pelo mongoose
            err.errors.forEach((msg) => {
                messages.push({message: msg.message});
            });            
                   
            err.toJSON = () => ({
                errors: messages
            });
            break;
        default:
            break;
    }
    done()
}