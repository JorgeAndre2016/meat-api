import * as restify from 'restify'

export const handleError = (req, resp, err, done) => {
    err.toJSON = () => {
        return {
            message: err.message
        }
    };
    switch (err.name) {
        case 'MongoError':
            if(err.code === 11000) {
                err.statisCode = 400;
            }
            break;
        case 'ValidationErro':
            err.statisCode = 400;
            const messages: any[] = [];
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