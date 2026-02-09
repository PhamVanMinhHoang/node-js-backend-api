import express from 'express';  
import { AppError } from '../utils/appError.js';
import { ok } from '../utils/response.js';

const router = express.Router();

router.get('/', function(req, res){
    return ok(res, 'List users', null)
});

router.get('/boom', (req, res) => {
    throw new AppError('Boom!', 400, 'BAD_REQUEST')
});

router.get('/error-demo', (req, res) => {
    throw new AppError('Unauthorized', 401, 'UNAUTHORIZED')
});

router.get('/:id', function(req, res) {
    return ok(res, {id: `User id = ${req.params.id}`}, null)
});

export default router ;