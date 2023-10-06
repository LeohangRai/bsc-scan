import Container from 'typedi';
import { BSC_SCAN_CONFIGS } from '../configs';
import { BSC_SCAN_API_KEY, BSC_SCAN_API_URL } from '../tokens';

Container.set(BSC_SCAN_API_URL, BSC_SCAN_CONFIGS.API_URL);
Container.set(BSC_SCAN_API_KEY, BSC_SCAN_CONFIGS.API_KEY);
