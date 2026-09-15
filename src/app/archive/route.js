import { getArchive } from "@/lib/data";
import { ERRORS, json, preflight, query, serverError } from "@/lib/http";

/** GET /archive — le journal de l'atelier (épreuves, tests, feuilles, vues de presse), filtrable par type. */
export async function GET(request) {
  try {
    return json(getArchive(query(request)));
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
