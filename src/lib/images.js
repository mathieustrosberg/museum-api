/**
 * URL des images. Deux sources :
 * - les photographies de l'archive, servies par l'API depuis `public/images`
 *   (chemin commençant par « / ») : l'URL complète est construite à partir de
 *   l'adresse publique de l'API (déploiement Vercel, sinon localhost:4000) ;
 * - les œuvres de la collection, encore hébergées par Unsplash (identifiant de
 *   photo) : URL recadrée par le CDN au format du site, 3:4 pour les feuilles.
 */
const UNSPLASH = "https://images.unsplash.com/photo-";

/** Adresse publique de l'API, pour les fichiers de `public`. */
export const PUBLIC_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT ?? 4000}`;

export const SIZES = {
  portrait: { w: 1440, h: 1920 },
  landscape: { w: 1920, h: 1440 },
};

export function imageUrl(id, orientation = "portrait") {
  if (id.startsWith("/")) return `${PUBLIC_URL}${id}`;
  const { w, h } = SIZES[orientation] ?? SIZES.portrait;
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(w),
    h: String(h),
    q: "80",
  });
  return `${UNSPLASH}${id}?${params}`;
}
