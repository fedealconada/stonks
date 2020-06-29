import { Router } from 'express';
import Controller from './user.controller';
import { authCheck } from '../../helpers/authCheck';

const user = Router();
const controller = new Controller();

user.get('/', authCheck, controller.search);

export default user;
