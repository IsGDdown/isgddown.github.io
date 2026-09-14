export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/status") {
      try {
        const response = await fetch("https://boomlings.com/favicon.ico", {
          method: "GET",
          cf: {
            cacheTtl: 0,
            cacheEverything: false
          }
        });

        return new Response(
          JSON.stringify({
            online: response.ok,
            status: response.status
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store"
            }
          }
        );
      } catch {
        return new Response(
          JSON.stringify({
            online: false,
            status: 0,
            error: "request_failed"
          }),
          {
            status: 502,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "no-store"
            }
          }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
