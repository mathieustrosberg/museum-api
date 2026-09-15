import { getExhibitions } from "@/lib/data";
import { ERRORS, json, preflight, query, serverError } from "@/lib/http";

/** GET /exhibitions — le programme, filtrable par status (on view, upcoming, past). */
export async function GET(request) {
  try {
    return json(getExhibitions(query(request)));
  } catch {
    return serverError(ERRORS.fetch);
  }
}

export function OPTIONS() {
  return preflight();
}
