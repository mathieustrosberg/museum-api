# Halbton API — museum-api

API du musée fictif Halbton, centre for the printed image à Berlin : Next.js 16 (App Router, Route Handlers), données JSON versionnées, photographies Unsplash. Elle alimente le site `museum-website`.

La documentation complète (endpoints, champs, exemples générés à partir des données) est la page d'accueil de l'API : `http://localhost:4000/` en local, la racine du déploiement en production.

## Commandes

```bash
npm run dev      # développement sur http://localhost:4000
npm run build    # build de production
npm run start    # serveur de production sur le port 4000
npm run lint     # Biome (lint + format)
npm run format   # Biome, écriture
npm run similar  # recalcule le champ `similar` des œuvres (tools/similar-works.mjs)
```

Stack : Next.js 16.3.5, React 19, JavaScript, Biome, React Compiler, Tailwind CSS v4 (page de documentation), dossier `src/`, alias `@/*`, npm.

## Endpoints

| Méthode | Route | Contenu |
|---|---|---|
| GET | `/objects` | les œuvres de la collection (filtres `type`, `artist`, `exhibition`, `onView`, `q`) |
| GET | `/objects/{slug}` | une œuvre |
| GET | `/archive` | le journal de l'atelier (filtre `type`) |
| GET | `/archive/{slug}` | une entrée du journal |
| GET | `/artists`, `/artists/{slug}` | les artistes |
| GET | `/exhibitions`, `/exhibitions/{slug}` | le programme (filtre `status`) |
| GET | `/visit` | adresse, horaires, tarifs, jours d'ouverture à venir |
| POST | `/tickets` | demande de billets, référence de retrait |

Erreurs : `{ "error": "…" }` avec 404 (objet inconnu), 400 (requête invalide, `fields` par champ pour les billets) ou 500.

## Architecture

```
src/
  app/page.js             documentation (Server Component, exemples issus des données)
  app/*/route.js          Route Handlers, un fichier par ressource
  lib/data.js             mise en forme des données : URL d'images, liens, filtres
  lib/images.js           URL Unsplash recadrées par le CDN (3:4 ou 4:3)
  lib/http.js             réponses JSON : CORS, Cache-Control, erreurs
  lib/visit.js            jours d'ouverture, validation d'une demande, référence
  data/*.json             objects, archive, artists, exhibitions, visit
tools/similar-works.mjs   œuvres proches (médium, artiste, exposition, technique, année)
```

## Décisions

- **Données en JSON versionné, pas de base de données.** Le contenu est fictif et stable ; un fichier par ressource, relu à chaque build. Les images sont des identifiants de photos Unsplash, l'URL complète (protocole, domaine, recadrage) est construite par l'API.
- **Route Handlers plutôt que pages.** Chaque ressource est un `route.js` qui renvoie `Response.json`. Les listes acceptent des filtres en query string ; un slug inconnu renvoie 404 avec un message explicite.
- **Cache CDN et CORS.** Les lectures portent `Cache-Control: public, s-maxage=3600, stale-while-revalidate` (dix minutes pour `/visit`, dont la liste des jours dépend de la date) ; toutes les réponses autorisent n'importe quelle origine.
- **Billetterie sans persistance.** `POST /tickets` valide la demande (jour ouvert, quantités, nom, email), calcule le total et émet une référence `HB-AAMMJJ-XXXX` ; le paiement a lieu à l'entrée. Les erreurs sont des codes par champ, le client les traduit.
- **Documentation vivante.** La page d'accueil importe les mêmes fonctions que les routes : les exemples de réponse sont toujours ceux des données réelles.

## Déploiement

Projet Vercel sans configuration particulière (`npm run build`). L'URL de base affichée dans la documentation vient de `VERCEL_PROJECT_PRODUCTION_URL`. Côté site, renseigner `HALBTON_API_URL` avec l'URL du déploiement.

## Crédits

Photographies : Unsplash, sous licence Unsplash. Contenu, œuvres, artistes et lieu : fictifs.
