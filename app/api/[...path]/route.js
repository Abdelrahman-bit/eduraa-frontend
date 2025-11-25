// app/api/[...path]/route.js
export async function GET(request, { params }) {
   return proxyRequest(request, params);
}

export async function POST(request, { params }) {
   return proxyRequest(request, params);
}

export async function PUT(request, { params }) {
   return proxyRequest(request, params);
}

export async function DELETE(request, { params }) {
   return proxyRequest(request, params);
}

export async function PATCH(request, { params }) {
   return proxyRequest(request, params);
}

async function proxyRequest(request, params) {
   try {
      // Await params as it's a Promise in newer Next.js versions
      const awaitedParams = await params;
      const { path } = awaitedParams;

      if (!path) {
         return new Response(JSON.stringify({ error: 'Invalid path' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
         });
      }

      const pathString = path.join('/');
      const url = new URL(request.url);
      const backendUrl = `http://localhost:5000/api/${pathString}${url.search}`;

      const response = await fetch(backendUrl, {
         method: request.method,
         headers: request.headers,
         body:
            request.method !== 'GET' && request.method !== 'HEAD'
               ? await request.text()
               : undefined,
      });

      const responseData = await response.text();

      return new Response(responseData, {
         status: response.status,
         headers: response.headers,
      });
   } catch (error) {
      console.error('Proxy error:', error);
      return new Response(
         JSON.stringify({
            error: 'Proxy request failed',
            details: error.message,
         }),
         { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
   }
}
