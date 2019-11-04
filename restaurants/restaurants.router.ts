import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { Restaurant } from './restaurants.model';

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant);
    }

    // método para disponibilizar o hypermedia do menu
    envelope(document) {
        let resource = super.envelope(document);
        resource._links.menu = `${this.basePath}/${resource._id}/menu`;
        return resource;
    }

    findMenu = (req, resp, next) => {
        // +menu informa que deseja que o campo que foi setado o select como false sejá devolvido neste find
        Restaurant.findById(req.params.id, "+menu")
            .then(rest => {
                if(!rest) {
                    throw new NotFoundError('Restaurant not found');
                }else {
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
    }

    replaceMenu = (req, resp, next) => {
        Restaurant.findById(req.params.id)
            .then(rest => { 

                // atualização dos dados
                if(!rest) {
                    throw new NotFoundError('Restaurant not found');
                }else {    
                    rest.menu = req.body; // ARRAY de MenuItem
                    return rest.save(); // retornando os dados novos
                }
            }).then(rest => {
                resp.json(rest.menu); // retornando os dados novos
                return next();
            }).catch(next);
    }

    applyRouter(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);

        application.get(`${this.basePath}/:id/menu`, [this.validateId, this.findMenu]);
        application.put(`${this.basePath}/:id/menu`, [this.validateId, this.replaceMenu]);
    }
}

export const restaurantRouter = new RestaurantsRouter();