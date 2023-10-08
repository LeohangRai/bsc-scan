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
