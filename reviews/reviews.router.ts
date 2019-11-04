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


    applyRouter(application: restify.Server) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.save);
    }
}

export const reviewsRouter = new ReviewRouter();