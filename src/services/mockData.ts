import type { BenchmarkResponse, EdaSummaryResponse } from '../types/phishing';

export const MOCK_BENCHMARK_DATA: BenchmarkResponse = {
  supervised: [
    {
      model_name: 'random_forest',
      display_name: 'Random Forest',
      short_name: 'RF',
      algorithm_type: 'Ensemble (100 Trees)',
      accuracy: 96.4,
      precision: 96.1,
      recall: 97.2,
      f1_score: 96.6,
      latency_ms: 18,
      confusion_matrix: [
        [2085, 92],
        [67, 2178],
      ],
    },
    {
      model_name: 'decision_tree',
      display_name: 'Decision Tree',
      short_name: 'DT',
      algorithm_type: 'CART Classifier',
      accuracy: 93.1,
      precision: 92.8,
      recall: 94.0,
      f1_score: 93.4,
      latency_ms: 4,
      confusion_matrix: [
        [2012, 165],
        [140, 2105],
      ],
    },
    {
      model_name: 'knn',
      display_name: 'k-Nearest Neighbors',
      short_name: 'k-NN',
      algorithm_type: 'Euclidean (k=5)',
      accuracy: 91.8,
      precision: 91.2,
      recall: 93.1,
      f1_score: 92.1,
      latency_ms: 64,
      confusion_matrix: [
        [1978, 199],
        [161, 2084],
      ],
    },
  ],
  unsupervised: {
    model_name: 'kmeans',
    display_name: 'K-Means Clustering',
    silhouette_score: 0.42,
    pca_clusters: [
      { x: -2.4, y: 1.5, cluster: 0 }, { x: -1.9, y: 2.1, cluster: 0 },
      { x: -2.8, y: 0.8, cluster: 0 }, { x: -1.5, y: 1.1, cluster: 0 },
      { x: -2.1, y: 0.4, cluster: 0 }, { x: -3.1, y: 1.9, cluster: 0 },
      { x: -1.7, y: 2.4, cluster: 0 }, { x: -2.5, y: 1.2, cluster: 0 },
      { x: -1.3, y: 1.7, cluster: 0 }, { x: -2.2, y: 2.0, cluster: 0 },
      { x: -2.9, y: 1.3, cluster: 0 }, { x: -1.8, y: 0.9, cluster: 0 },
      { x: 1.8, y: -1.4, cluster: 1 }, { x: 2.4, y: -0.9, cluster: 1 },
      { x: 1.5, y: -2.1, cluster: 1 }, { x: 2.9, y: -1.7, cluster: 1 },
      { x: 2.1, y: -0.5, cluster: 1 }, { x: 1.6, y: -1.1, cluster: 1 },
      { x: 2.6, y: -2.2, cluster: 1 }, { x: 3.1, y: -1.2, cluster: 1 },
      { x: 1.9, y: -1.8, cluster: 1 }, { x: 2.3, y: -1.3, cluster: 1 },
      { x: 1.4, y: -0.7, cluster: 1 }, { x: 2.7, y: -1.5, cluster: 1 },
    ],
  },
};

export const MOCK_EDA_DATA: EdaSummaryResponse = {
  total_rows: 22110,
  total_features: 30,
  class_distribution: {
    legitimate: { count: 9795, percentage: 44.3 },
    phishing: { count: 12315, percentage: 55.7 },
  },
  key_features_stats: [
    { name: 'SSLfinal_State', neg: 36.2, zero: 11.4, pos: 52.4 },
    { name: 'URL_of_Anchor', neg: 31.8, zero: 24.5, pos: 43.7 },
    { name: 'Prefix_Suffix', neg: 86.7, zero: 0, pos: 13.3 },
    { name: 'having_IP_Address', neg: 68.5, zero: 0, pos: 31.5 },
    { name: 'URL_Length', neg: 79.1, zero: 1.8, pos: 19.1 },
  ],
  correlation_matrix: {
    features: [
      'SSLfinal_State',
      'URL_of_Anchor',
      'Prefix_Suffix',
      'web_traffic',
      'having_Sub_Domain',
      'Request_URL',
      'age_of_domain',
      'Result',
    ],
    matrix: [
      [1.0, 0.42, 0.28, 0.35, 0.21, 0.19, 0.24, 0.71],
      [0.42, 1.0, 0.24, 0.31, 0.18, 0.29, 0.17, 0.69],
      [0.28, 0.24, 1.0, 0.15, 0.12, 0.14, 0.11, 0.35],
      [0.35, 0.31, 0.15, 1.0, 0.16, 0.22, 0.27, 0.35],
      [0.21, 0.18, 0.12, 0.16, 1.0, 0.13, 0.19, 0.3],
      [0.19, 0.29, 0.14, 0.22, 0.13, 1.0, 0.15, 0.25],
      [0.24, 0.17, 0.11, 0.27, 0.19, 0.15, 1.0, 0.12],
      [0.71, 0.69, 0.35, 0.35, 0.3, 0.25, 0.12, 1.0],
    ],
  },
};