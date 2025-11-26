//
// PUBLIC_INTERFACE
export function createApiClient() {
  /**
   * Creates a simple fetch-based API client with environment-based base URL.
   * Uses REACT_APP_API_BASE or REACT_APP_BACKEND_URL. Does not hardcode keys.
   */
  const baseUrl =
    process.env.REACT_APP_API_BASE ||
    process.env.REACT_APP_BACKEND_URL ||
    '';

  // Basic wrapper around fetch applying base URL and JSON handling
  async function request(path, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s safety
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });
      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json() : await res.text();
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.data = data;
        throw err;
      }
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  // PUBLIC_INTERFACE
  return {
    /** GET helper */
    get: (path) => request(path, { method: 'GET' }),
    /** POST helper */
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body || {}) }),
    /** Placeholder for stream/websocket hookup via REACT_APP_WS_URL if needed later */
    getBaseUrl: () => baseUrl,
  };
}
