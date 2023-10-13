import Container from 'typedi';
import { object, array, string } from 'zod';
import { isValidObjectId } from 'mongoose';
import { WalletService } from '../wallet.service';

const walletService = Container.get(WalletService);

async function isWalletAddressUnique(address: string): Promise<boolean> {
  const wallet = await walletService.findOneBy({ address });
  if (wallet) {
    return false;
  }
  return true;
}

async function isNameTagUnique(name_tag: string): Promise<boolean> {
  const wallet = await walletService.findOneBy({
    name_tag
  });
  if (wallet) {
    return false;
  }
  return true;
}

async function areWalletAddressesUnique(addresses: string[]): Promise<boolean> {
  for (const address of addresses) {
    const wallet = await walletService.findOneBy({ address });
    if (wallet) {
      return false;
    }
  }
  return true;
}

function areElementsUniqueIntheAddressesArray(addresses: string[]): boolean {
  const uniqueElements = new Set();
  for (const address of addresses) {
    if (uniqueElements.has(address)) {
      return false;
    }
    uniqueElements.add(address);
  }
  return true;
}

function isValidMongooseObjectId(id: string): boolean {
  return isValidObjectId(id);
}

function isValidWalletTrendType(type: string): boolean {
  return ['daily', 'weekly', 'monthly'].includes(type);
}

/**
 * @openapi
 * components:
 *   schemas:
 *     AddWalletsInput:
 *       type: object
 *       properties:
 *         walletAddresses:
 *           type: array
 *           items:
 *             type: string
 *           example: ['0xe2e912F0b1b5961be7CB0D6dbb4A920ACe06Cd99', '0x3c783c21a0383057D128bae431894a5C19F9Cf06']
 */
export const addWalletSchema = object({
  body: object({
    walletAddresses: array(string(), {
      required_error: 'Wallet addresses are required',
      invalid_type_error: 'Wallet addresses must be provided in an array'
    })
      .nonempty({
        message: 'At least one wallet address must be provided'
      })
      .refine(areWalletAddressesUnique, {
        message: 'One of more of the addresses are already in use'
      })
      .refine(areElementsUniqueIntheAddressesArray, {
        message: 'Wallet addresses must be unique'
      })
  })
});

export const walletIdParamSchema = object({
  params: object({
    id: string({ invalid_type_error: 'Wallet ID must be a string' }).refine(
      isValidMongooseObjectId,
      {
        message: 'Invalid Wallet ID'
      }
    )
  })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateWalletInput:
 *       type: object
 *       properties:
 *         address:
 *           type: string
 *           default: ''
 *         name_tag:
 *           type: string
 *           default: ''
 */
export const updateWalletSchema = object({
  body: object({
    address: string()
      .refine(isWalletAddressUnique, {
        message: 'Wallet address must be unique'
      })
      .optional(),
    name_tag: string()
      .refine(isNameTagUnique, { message: 'Name tag must be unique' })
      .optional()
  })
});

/**
 * @openapi
 * components:
 *   schemas:
 *     WalletTrendType:
 *       type: string
 *       default: 'daily'
 *       enum:
 *         - daily
 *         - weekly
 *         - monthly
 */
export const walletTrendQuerySchema = object({
  query: object({
    type: string()
      .toLowerCase()
      .refine(isValidWalletTrendType, {
        message: "Type must be either 'daily', 'weekly' or 'monthly'"
      })
      .optional()
  })
});

/**
 * @openapi
 *   components:
 *     schemas:
 *       Wallet:
 *         type: object
 *         properties:
 *           address:
 *             type: string
 *             example: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3'
 *           name_tag:
 *             type: string
 *             example: 'Binance: Hot Wallet 6'
 *           balance:
 *             type: string
 *             example: '310278092763093082470656'
 *             readonly: true
 *     responses:
 *       WalletPostAndGetResponse:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Wallet'
 *       SingleWalletResponse:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 data:
 *                   $ref: '#/components/schemas/Wallet'
 *       WalletTrendResponse:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   default: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
