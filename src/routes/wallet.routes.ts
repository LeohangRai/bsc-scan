import express from 'express';
import Container from 'typedi';
import { WalletController } from '../wallets/wallet.controller';
import {
  addWalletSchema,
  updateWalletSchema,
  walletIdParamSchema
} from '../wallets/schemas/wallet.schema';
import wrapNext from '../middlewares/wrap-next';
import { validate } from '../middlewares/validate';
import { authenticateJWT } from '../middlewares/authenticate-jwt';

const router = express.Router();

const walletController = Container.get(WalletController);

router.use(authenticateJWT);
router.get('/', wrapNext(walletController.get));
router.post('/', validate(addWalletSchema), wrapNext(walletController.add));
router.get(
  '/:id',
  validate(walletIdParamSchema),
  wrapNext(walletController.getOneById)
);
router.patch(
  '/:id',
  validate(walletIdParamSchema),
  validate(updateWalletSchema),
  wrapNext(walletController.updateOneById)
);

export default router;
