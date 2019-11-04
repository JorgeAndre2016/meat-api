import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
import * as mongoose from 'mongoose';
import { Review } from './reviews.model';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    // findById = (req, resp, next) => {
    //     this.model.findById(req.params.id)
    //         .populate('user', 'name') // popular o nome do user apenas
    //         .populate('restaurant') // popular o restaurante inteiro
    //         .then(this.render(resp, next))
    //         .catch(next);
    // }

    protected prepareOne(query: mongoose.DocumentQuery<Review, Review>): 
        mongoose.DocumentQuery<Review, Review> {
        
            return query.populate('user', 'name')
                    .populate('restaurant');
    }

    // hypermedia de restaurant
    envelope(document) {
        let resource = super.envelope(document);
        const restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = `/restaurants/${restId}`;
        return resource;
    }

    applyRouter(application: restify.Server) {
        application.get(`${this.basePath}`, this.findAll);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
    }
}

export const reviewsRouter = new ReviewRouter();