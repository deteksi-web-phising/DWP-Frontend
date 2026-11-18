import axios from 'axios';
import type {
  ExtractUrlResponse,
  ModelName,
  PhishingFeatures,
  PredictResponse,
} from '../types/phising';

const USE_MOCK = true; // Ubah ke false saat FastAPI lokal sudah siap
const api = axios.create({ baseURL: 'http://localhost:8000/api/v1' });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const phishingService = {
  async extractUrl(url: string): Promise<ExtractUrlResponse> {
    if (!USE_MOCK) {
      const { data } = await api.post('/extract-url', { url });
      return data;
    }

    await sleep(600);
    const isSuspicious = url.includes('login') || url.includes('.xyz') || url.includes('@');
    return {
      url,
      features: {
        having_IP_Address: -1,
        URL_Length: url.length > 54 ? 1 : -1,
        Shortining_Service: url.includes('bit.ly') ? 1 : -1,
        having_At_Symbol: url.includes('@') ? 1 : -1,
        double_slash_redirecting: -1,
        Prefix_Suffix: url.includes('-') ? 1 : -1,
        having_Sub_Domain: 0,
        SSLfinal_State: url.startsWith('https') ? -1 : 1,
        Domain_registeration_length: isSuspicious ? 1 : -1,
        Favicon: -1,
        port: -1,
        HTTPS_token: -1,
        Request_URL: -1,
        URL_of_Anchor: isSuspicious ? 1 : 0,
        Links_in_tags: 0,
        SFH: -1,
        Submitting_to_email: -1,
        Abnormal_URL: isSuspicious ? 1 : -1,
        Redirect: 0,
        on_mouseover: -1,
        RightClick: -1,
        popUpWidnow: -1,
        Iframe: -1,
        age_of_domain: isSuspicious ? 1 : -1,
        DNSRecord: -1,
        web_traffic: 0,
        Page_Rank: -1,
        Google_Index: -1,
        Links_pointing_to_page: 0,
        Statistical_report: -1,
      },
    };
  },

  async predict(model_name: ModelName, features: PhishingFeatures): Promise<PredictResponse> {
    if (!USE_MOCK) {
      const { data } = await api.post('/predict', { model_name, features });
      return data;
    }

    await sleep(250);
    // Simulasi logika deteksi sederhana untuk testing UI
    const riskFactors = (Object.keys(features) as (keyof PhishingFeatures)[]).filter(
      (key) => features[key] === 1
    );
    const isPhishing = riskFactors.length >= 3;

    return {
      prediction: isPhishing ? 'Phishing' : 'Legitimate',
      label: isPhishing ? 1 : -1,
      confidence: isPhishing ? 0.94 : 0.91,
      risk_factors: riskFactors.slice(0, 5),
    };
  },
};