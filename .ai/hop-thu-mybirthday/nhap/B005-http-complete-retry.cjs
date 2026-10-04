// Validation transport: fresh HTTP responses, including complete bodies.
// Retries apply to network errors and HTTP500/502/503/504.
// No mocked responses, cache, source exemptions or changed content checks.
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, options = {}) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await realFetch(input, {...options, signal: AbortSignal.timeout(30000)});
      if ([500, 502, 503, 504].includes(response.status) && attempt < 3) {
        console.error(`[RETRY ${attempt}] HTTP ${response.status} ${String(input)}`);
        await response.body?.cancel();
      } else {
        const isPdf = (response.headers.get('content-type') || '').includes('application/pdf') || new URL(String(input)).pathname.toLowerCase().endsWith('.pdf');
        if (isPdf) return response;
        const body = await response.arrayBuffer();
        const headers = new Headers(response.headers);
        headers.delete('content-encoding');
        headers.set('content-length', String(body.byteLength));
        const complete = new Response(body, {status: response.status, statusText: response.statusText, headers});
        Object.defineProperty(complete, 'url', {value: response.url});
        return complete;
      }
    } catch (error) {
      console.error(`[RETRY ${attempt}] ${String(error)} ${String(input)}`);
      if (attempt === 3) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
};
