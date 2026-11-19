export type FeatureValue = -1 | 0 | 1;
export type ModelName = 'random_forest' | 'decision_tree' | 'knn' | 'kmeans';

// 1. Sesuai 30 atribut di Bagian 4.2 PRD
export interface PhishingFeatures {
  having_IP_Address: FeatureValue;
  URL_Length: FeatureValue;
  Shortining_Service: FeatureValue;
  having_At_Symbol: FeatureValue;
  double_slash_redirecting: FeatureValue;
  Prefix_Suffix: FeatureValue;
  having_Sub_Domain: FeatureValue;
  SSLfinal_State: FeatureValue;
  Domain_registeration_length: FeatureValue;
  Favicon: FeatureValue;
  port: FeatureValue;
  HTTPS_token: FeatureValue;
  Request_URL: FeatureValue;
  URL_of_Anchor: FeatureValue;
  Links_in_tags: FeatureValue;
  SFH: FeatureValue;
  Submitting_to_email: FeatureValue;
  Abnormal_URL: FeatureValue;
  Redirect: 0 | 1;
  on_mouseover: FeatureValue;
  RightClick: FeatureValue;
  popUpWidnow: FeatureValue;
  Iframe: FeatureValue;
  age_of_domain: FeatureValue;
  DNSRecord: FeatureValue;
  web_traffic: FeatureValue;
  Page_Rank: FeatureValue;
  Google_Index: FeatureValue;
  Links_pointing_to_page: FeatureValue;
  Statistical_report: FeatureValue;
}

// 2. Response POST /api/v1/extract-url
export interface ExtractUrlResponse {
  url: string;
  features: PhishingFeatures;
}

// 3. Response POST /api/v1/predict
export interface PredictResponse {
  prediction: 'Legitimate' | 'Phishing';
  label: -1 | 1;
  confidence: number; // 0.0 - 1.0
  risk_factors: (keyof PhishingFeatures)[];
}

// 4. Response GET /api/v1/models/benchmark
export interface SupervisedMetric {
  model_name: Exclude<ModelName, 'kmeans'>;
  display_name: string;
  short_name: string;
  algorithm_type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  latency_ms: number;
  confusion_matrix: [[number, number], [number, number]]; // [[TN, FP], [FN, TP]]
}

export interface BenchmarkResponse {
  supervised: SupervisedMetric[];
  unsupervised: {
    model_name: 'kmeans';
    display_name: string;
    silhouette_score: number;
    pca_clusters: { x: number; y: number; cluster: 0 | 1 }[];
  };
}

// 5. Response GET /api/v1/dataset/eda-summary
export interface KeyFeatureStat {
  name: keyof PhishingFeatures;
  neg: number; // persentase -1
  zero: number; // persentase 0
  pos: number; // persentase 1
}

export interface EdaSummaryResponse {
  total_rows: number;
  total_features: number;
  class_distribution: {
    legitimate: { count: number; percentage: number };
    phishing: { count: number; percentage: number };
  };
  key_features_stats: KeyFeatureStat[];
  correlation_matrix: {
    features: string[];
    matrix: number[][];
  };
}