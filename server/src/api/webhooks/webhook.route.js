import { Router } from 'express';
import Controller from './webhook.controller';
import { authCheck } from '../../helpers/authCheck';

const webhook = Router();
const controller = new Controller();

webhook.post('/', controller.callback);
webhook.put('/', authCheck, controller.subscribe);
webhook.get('/', controller.verify);

export default webhook;
