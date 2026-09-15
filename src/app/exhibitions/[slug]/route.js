import { getExhibition } from "@/lib/data";
import { ERRORS, json, notFound, preflight, serverError } from "@/lib/http";

/** GET /exhibitions/{slug} — une exposition. */
export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const exhibition = getExhibition(slug);
    return exhibition ? json(exhibition) : notFound(ERRORS.exhibition);
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
