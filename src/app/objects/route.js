import { getObjects } from "@/lib/data";
import { ERRORS, json, preflight, query, serverError } from "@/lib/http";

/** GET /objects — toutes les œuvres de la collection, filtrables (type, artist, exhibition, onView, q). */
export async function GET(request) {
  try {
    return json(getObjects(query(request)));
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
