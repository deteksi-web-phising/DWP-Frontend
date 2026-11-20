import axios from 'axios';
import type {
  BenchmarkResponse,
  EdaSummaryResponse,
  ExtractUrlResponse,
  ModelName,
  PhishingFeatures,
  PredictResponse,
} from '../types/phishing';
import { FEATURES_METADATA } from '../data/featuresMetadata';
import { MOCK_BENCHMARK_DATA, MOCK_EDA_DATA } from './mockData';

// Dikontrol via file .env (VITE_USE_MOCK=false untuk live backend, true untuk paksa mock)
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  timeout: 8000,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const phishingService = {
  // 1. POST /api/v1/extract-url
  async extractUrl(url: string): Promise<ExtractUrlResponse> {
    if (!USE_MOCK) {
      try {
        const { data } = await api.post<ExtractUrlResponse>('/extract-url', { url });
        return data;
      } catch (err) {
        console.warn('[phishingService] Live backend unreachable for /extract-url, falling back to mock data.', err);
      }
    }

    await sleep(300);
    const lower = url.toLowerCase();
    const isPhishSample =
      lower.includes('login') ||
      lower.includes('.xyz') ||
      lower.includes('@') ||
      /\d+\.\d+\.\d+\.\d+/.test(lower);

    const features = {} as PhishingFeatures;
    FEATURES_METADATA.forEach((f) => {
      features[f.key] = (f.key === 'Redirect' ? 0 : -1) as never;
    });

    if (isPhishSample) {
      features.URL_Length = url.length > 35 ? 1 : 0;
      features.Prefix_Suffix = lower.includes('-') ? 1 : -1;
      features.SSLfinal_State = lower.includes('.xyz') ? 1 : 0;
      features.having_At_Symbol = lower.includes('@') ? 1 : -1;
      features.having_IP_Address = /\d+\.\d+\.\d+\.\d+/.test(lower) ? 1 : -1;
      features.Domain_registeration_length = 1;
      features.URL_of_Anchor = 1;
      features.Abnormal_URL = 1;
      features.age_of_domain = 1;
      features.web_traffic = 1;
    } else {
      features.SSLfinal_State = lower.startsWith('https') ? -1 : 1;
      features.URL_Length = url.length > 54 ? 1 : -1;
      features.Prefix_Suffix = lower.includes('-') ? 1 : -1;
    }

    return { url, features };
  },

  // 2. POST /api/v1/predict
  async predict(model_name: ModelName, features: PhishingFeatures): Promise<PredictResponse> {
    if (!USE_MOCK) {
      try {
        const { data } = await api.post<PredictResponse>('/predict', { model_name, features });
        return data;
      } catch (err) {
        console.warn('[phishingService] Live backend unreachable for /predict, falling back to mock data.', err);
      }
    }

    await sleep(120);
    const riskFactors = FEATURES_METADATA.filter((f) => features[f.key] === 1).map((f) => f.key);
    const neutralCount = FEATURES_METADATA.filter(
      (f) => f.key !== 'Redirect' && features[f.key] === 0
    ).length;

    let riskScore = riskFactors.length + neutralCount * 0.4;
    if (features.SSLfinal_State === 1) riskScore += 2.5;
    if (features.URL_of_Anchor === 1) riskScore += 2.0;
    if (features.having_IP_Address === 1) riskScore += 1.5;

    const isPhishing = riskScore >= 4.5;
    const modelOffset: Record<ModelName, number> = {
      random_forest: 0.0,
      decision_tree: -0.028,
      knn: -0.041,
      kmeans: -0.085,
    };

    const rawConfidence = isPhishing
      ? Math.min(0.992, 0.78 + riskScore * 0.018 + modelOffset[model_name])
      : Math.min(0.985, 0.95 - riskScore * 0.03 + modelOffset[model_name]);

    return {
      prediction: isPhishing ? 'Phishing' : 'Legitimate',
      label: isPhishing ? 1 : -1,
      confidence: Math.max(0.55, Number(rawConfidence.toFixed(3))),
      risk_factors: riskFactors,
    };
  },

  // 3. GET /api/v1/models/benchmark
  async getBenchmark(): Promise<BenchmarkResponse> {
    if (!USE_MOCK) {
      try {
        const { data } = await api.get<BenchmarkResponse>('/models/benchmark');
        return data;
      } catch (err) {
        console.warn('[phishingService] Live backend unreachable for /models/benchmark, falling back to mock data.', err);
      }
    }
    await sleep(200);
    return MOCK_BENCHMARK_DATA;
  },

  // 4. GET /api/v1/dataset/eda-summary
  async getEdaSummary(): Promise<EdaSummaryResponse> {
    if (!USE_MOCK) {
      try {
        const { data } = await api.get<EdaSummaryResponse>('/dataset/eda-summary');
        return data;
      } catch (err) {
        console.warn('[phishingService] Live backend unreachable for /dataset/eda-summary, falling back to mock data.', err);
      }
    }
    await sleep(200);
    return MOCK_EDA_DATA;
  },
};
