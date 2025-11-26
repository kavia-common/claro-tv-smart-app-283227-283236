import { createApiClient } from './apiClient';

const api = createApiClient();

// PUBLIC_INTERFACE
export async function getUserSubscriptions() {
  /**
   * Placeholder: Fetches user subscription list from backend.
   * The endpoint path is configurable server-side; using a safe default path.
   */
  try {
    return await api.get('/subscriptions'); // implement server to match
  } catch (e) {
    // graceful fallback with mock
    return [
      { id: 'sub-1', name: 'Claro Plus', status: 'active' },
      { id: 'sub-2', name: 'Sports HD', status: 'inactive' },
    ];
  }
}

// PUBLIC_INTERFACE
export async function manageSubscription(id, action) {
  /**
   * Placeholder: Sends a management request (e.g., cancel/resume).
   */
  try {
    return await api.post(`/subscriptions/${encodeURIComponent(id)}`, { action });
  } catch (e) {
    return { ok: false, error: e?.message || 'unknown' };
  }
}
