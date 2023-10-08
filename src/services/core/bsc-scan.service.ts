import { BscScanResponseInterface } from '../../interfaces/bsc-scan-response.interface';
import { Inject, Service } from 'typedi';
import { CustomRequest } from './axios.service';
import { BSC_SCAN_API_KEY, BSC_SCAN_API_URL } from '../../tokens';
import CustomError from '../../errors/custom-error';

@Service()
export class BscScanService {
  @Inject(BSC_SCAN_API_URL)
  private readonly apiUrl: string;

  @Inject(BSC_SCAN_API_KEY)
  private readonly apiKey: string;

  constructor(@Inject() private readonly requestService: CustomRequest) {}

  async getBalanceOfWalletAddress(
    address: string
  ): Promise<BscScanResponseInterface> {
    const url = `${this.apiUrl}?module=account&action=balance&apikey=${this.apiKey}&address=${address}`;
    const response = await this.requestService.get(url);
    const data: BscScanResponseInterface = response.data;
    if (data.status != '1') {
      throw new CustomError(400, data.result || data.message);
    }
    return data;
  }
}
