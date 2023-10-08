import express from 'express';
import Container from 'typedi';
import { WalletController } from '../wallets/wallet.controller';
import { addWalletSchema } from '../wallets/schemas/wallet.schema';
import wrapNext from '../middlewares/wrap-next';
import { validate } from '../middlewares/validate';
import { authenticateJWT } from '../middlewares/authenticate-jwt';

const router = express.Router();

const walletController = Container.get(WalletController);

router.use(authenticateJWT);
router.post('/', validate(addWalletSchema), wrapNext(walletController.add));

export default router;
