import dotenv from 'dotenv';
import requestService from './axios.service';
import { BscScanResponse } from '../../interfaces/bsc-scan-response.interface';
dotenv.config();
const API_URL = process.env.BSC_SCAN_API_URL ?? 'https://api.bscscan.com/api';
const API_KEY = process.env.BSC_SCAN_API_KEY ?? '';

class BscScanService {
  apiUrl = API_URL;
  apiKey = API_KEY;
  request = requestService;

  async getBalanceOfWalletAddress(address: string) {
    const url = `${this.apiUrl}?module=account&action=balance&apikey=${this.apiKey}&address=${address}`;
    const response = await this.request.get(url);
    const data: BscScanResponse = response.data;
    if (data.status != '1') {
      console.log(data.result);
      throw new Error(data.result);
    }
    return data;
  }
}

export default BscScanService;
