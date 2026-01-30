export interface ScanResult {
  status: 'authentic' | 'deepfake' | 'error';
  confidence: number;
  confidence_range?: {
    min: number;
    max: number;
  };
  error?: string;
}

export async function scanFile(file: File): Promise<ScanResult> {
  const API_USER = '1292588433';
  const API_SECRET = 'VqFeAzwjp8Pn5nuJ5222DpxYJ93Ex8ct';
  const API_ENDPOINT = 'https://api.deepware.ai/api/v1/scan';

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_user', API_USER);
    formData.append('api_secret', API_SECRET);
    formData.append('models', 'genai_image_detection,deepfake');

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns a deepfake probability score between 0 and 1 at data.type.deepfake
    const deepfakeScore =
      typeof data?.type?.deepfake === 'number' && !Number.isNaN(data.type.deepfake)
        ? data.type.deepfake
        : 0;

    const status: ScanResult['status'] = deepfakeScore > 0.5 ? 'deepfake' : 'authentic';

    return {
      status,
      // Keep confidence as a 0–1 value so existing UI that multiplies by 100 still works
      confidence: deepfakeScore,
    };
  } catch (error) {
    return {
      status: 'error',
      confidence: 0,
      error: error instanceof Error ? error.message : 'Scan failed',
    };
  }
}
