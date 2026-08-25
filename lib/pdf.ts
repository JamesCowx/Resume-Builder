export async function urlToPdf(_url: string): Promise<Buffer> {
  throw new Error("Server-side PDF generation is not available. Use the client-side fallback.");
}
