/**
 * Photographies hébergées par Unsplash (licence Unsplash, usage libre).
 * Les données ne stockent que l'identifiant de la photo ; l'API renvoie des
 * URL complètes, recadrées par le CDN d'Unsplash (paramètres imgix) au format
 * du site : 3:4 pour les feuilles de la collection, 3:4 ou 4:3 pour l'archive.
 */
const BASE = "https://images.unsplash.com/photo-";

export const SIZES = {
  portrait: { w: 1440, h: 1920 },
  landscape: { w: 1920, h: 1440 },
};

export function imageUrl(id, orientation = "portrait") {
  const { w, h } = SIZES[orientation] ?? SIZES.portrait;
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(w),
    h: String(h),
    q: "80",
  });
  return `${BASE}${id}?${params}`;
}
