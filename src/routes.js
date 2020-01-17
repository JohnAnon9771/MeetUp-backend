import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';

import userAuthenticate from './app/middlewares/auth';

import uploadConfig from './config/upload';

const routes = Router();
const upload = multer(uploadConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(userAuthenticate);

routes.put('/users', UserController.update);
routes.post('/meetups', MeetupController.store);

routes.post('/files', upload.single('banner'), FileController.store);

export default routes;
