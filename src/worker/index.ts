export default {
  async fetch(_request: Request, _env: unknown): Promise<Response> {
    return new Response(null, { status: 404 })
  },
}
