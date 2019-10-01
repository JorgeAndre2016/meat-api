import * as restify from 'restify';
import { ModelRouter } from '../common/model-router';
import { NotFoundError } from 'restify-errors';
import { Review } from './reviews.model';

class ReviewRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    applyRouter(application: restify.Server) {
        application.get('/reviews', this.findAll);
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.save);
    }
}

export const reviewsRouter = new ReviewRouter();