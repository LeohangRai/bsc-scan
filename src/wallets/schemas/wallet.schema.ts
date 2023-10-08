import Container from 'typedi';
import { object, array, string } from 'zod';
import { WalletService } from '../wallet.service';

const walletService = Container.get(WalletService);

async function areWalletAddressesUnique(addresses: string[]) {
  for (const address of addresses) {
    const wallet = await walletService.findOneBy({ address });
    if (wallet) {
      return false;
    }
  }
  return true;
}

function areElementsUniqueIntheAddressesArray(addresses: string[]) {
  const uniqueElements = new Set();
  for (const address of addresses) {
    if (uniqueElements.has(address)) {
      return false;
    }
    uniqueElements.add(address);
  }
  return true;
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
