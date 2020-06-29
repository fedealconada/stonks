import { Router } from 'express';
import auth from './auth/auth.route';
import users from './users/user.route';
import webhooks from './webhooks/webhook.route';

const router = Router();

router.use('/auth', auth);
router.use('/webhooks', webhooks);
router.use('/users', users);

export default router;
