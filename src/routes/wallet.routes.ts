import express from 'express';
import Container from 'typedi';
import { WalletController } from '../wallets/wallet.controller';
import {
  addWalletSchema,
  updateWalletSchema,
  walletIdParamSchema,
  walletTrendQuerySchema
} from '../wallets/schemas/wallet.schema';
import wrapNext from '../middlewares/wrap-next';
import { validate } from '../middlewares/validate';
import { authenticateJWT } from '../middlewares/authenticate-jwt';

const router = express.Router();

const walletController = Container.get(WalletController);

router.use(authenticateJWT);

/**
 * @openapi
 * /wallets:
 *   get:
 *     tags:
 *       - 'wallets'
 *     summary: Get a list of all the wallets you have added
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/WalletPostAndGetResponse'
 */
router.get('/', wrapNext(walletController.get));

/**
 * @openapi
 * /wallets:
 *   post:
 *     tags:
 *       - 'wallets'
 *     summary: Add one or more wallets
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddWalletsInput'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/WalletPostAndGetResponse'
 */
router.post('/', validate(addWalletSchema), wrapNext(walletController.add));

/**
 * @openapi
 * /wallets/{walletId}:
 *   get:
 *     tags:
 *       - 'wallets'
 *     summary: Get a wallet by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WalletIdParameter'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/SingleWalletResponse'
 */
router.get(
  '/:id',
  validate(walletIdParamSchema),
  wrapNext(walletController.getOneById)
);

/**
 * @openapi
 * /wallets/{walletId}:
 *   patch:
 *     tags:
 *       - 'wallets'
 *     summary: Update a wallet by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WalletIdParameter'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWalletInput'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/SingleWalletResponse'
 */
router.patch(
  '/:id',
  validate(walletIdParamSchema),
  validate(updateWalletSchema),
  wrapNext(walletController.updateOneById)
);

/**
 * @openapi
 * /wallets/{walletId}:
 *   delete:
 *     tags:
 *       - 'wallets'
 *     summary: Delete a wallet by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WalletIdParameter'
 *     responses:
 *       '200':
 *         $ref: '#/components/responses/SingleWalletResponse'
 */
router.delete(
  '/:id',
  validate(walletIdParamSchema),
  wrapNext(walletController.delete)
);

/**
 * @openapi
 * /wallets/trends/{walletId}:
 *   get:
 *     tags:
 *       - 'wallets'
 *     summary: Get the trend data of a Wallet by their ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/WalletIdParameter'
 *       - $ref: '#/components/parameters/TrendTypeParameter'
 */
router.get(
  '/trends/:id',
  validate(walletIdParamSchema),
  validate(walletTrendQuerySchema),
  wrapNext(walletController.getWalletBalanceTrend)
);
export default router;
