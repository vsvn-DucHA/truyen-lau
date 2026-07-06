import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug
  const num = params.num

  if (!slug || !num) {
    return new Response(JSON.stringify({ error: 'Missing slug or chapter number' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const workerUrl = import.meta.env.PUBLIC_WORKER_URL
  const workerApiKey = import.meta.env.WORKER_API_KEY

  if (!workerUrl || !workerApiKey) {
    return new Response(JSON.stringify({ error: 'Worker configuration is missing' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    const res = await fetch(`${workerUrl}/${slug}/${num}.txt`, {
      headers: { 'x-api-key': workerApiKey },
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch chapter content' }), {
        status: res.status,
        headers: { 'content-type': 'application/json' },
      })
    }

    const content = await res.text()
    return new Response(JSON.stringify({ content }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ error: 'Unable to refresh chapter content' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }
}
