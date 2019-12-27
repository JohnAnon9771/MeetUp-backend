import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import userAuthenticate from './app/middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(userAuthenticate);

routes.put('/users', UserController.update);

export default routes;
