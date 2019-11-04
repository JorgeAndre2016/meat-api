import { ModelRouter } from '../common/model-router';
import * as restify from 'restify';
import { NotFoundError } from 'restify-errors';
import { Restaurant } from './restaurants.model';

class RestaurantsRouter extends ModelRouter<Restaurant> {
    constructor() {
        super(Restaurant);
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
        application.get('/restaurants', this.findAll);
        application.get('/restaurants/:id', [this.validateId, this.findById]);
        application.post('/restaurants', this.save);
        application.put('/restaurants/:id', [this.validateId, this.replace]);
        application.patch('/restaurants/:id', [this.validateId, this.update]);
        application.del('/restaurants/:id', [this.validateId, this.delete]);

        application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
        application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
    }
}

export const restaurantRouter = new RestaurantsRouter();