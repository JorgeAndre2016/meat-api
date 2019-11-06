import * as restify from 'restify';
import { Router } from './common/router';


class MainRouter extends Router {
    applyRouter(application: restify.Server) {
        application.get('/', (req, resp, next) => {
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews'
            });
            return next();
        })
    }
}

export const mainRouter = new MainRouter();