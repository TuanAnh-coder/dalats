import { NextRequest } from "next/server";
import { handleMediaRequest } from "~/server/storage/media-serve";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  return handleMediaRequest(path);
}
