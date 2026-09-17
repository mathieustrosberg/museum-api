# API Fondation César Manrique — museum-api

API du site de la Fondation César Manrique (Tahíche, Lanzarote), projet d'étude : Next.js 16 (App Router, Route Handlers), données JSON versionnées, photographies servies depuis le dossier `public`. Elle alimente le site `museum-website`.

La documentation complète (endpoints, champs, exemples générés à partir des données) est la page d'accueil de l'API : `http://localhost:4000/` en local, la racine du déploiement en production.

## Commandes

```bash
npm run dev      # développement sur http://localhost:4000
npm run build    # build de production
npm run start    # serveur de production sur le port 4000
npm run lint     # Biome (lint + format)
npm run format   # Biome, écriture
npm run similar  # recalcule le champ `similar` des fiches (tools/similar-works.mjs)
```

Stack : Next.js 16.3.5, React 19, JavaScript, Biome, React Compiler, Tailwind CSS v4 (page de documentation), dossier `src/`, alias `@/*`, npm.

## Endpoints

| Méthode | Route | Contenu |
|---|---|---|
| GET | `/objects` | la collection : espaces conçus par César Manrique et tableaux photographiés par Vladimir Kysela (filtres `category`, `type`, `artist`, `q`) |
| GET | `/objects/{slug}` | une fiche |
| GET | `/archive` | les photographies de l'archive : maison, atelier, œuvres, détails, île (filtre `type`) |
| GET | `/archive/{slug}` | une photographie |
| GET | `/artists`, `/artists/{slug}` | les artistes |
| GET | `/visit` | adresse, horaires, tarifs, jours d'ouverture à venir |
| POST | `/tickets` | demande de billets, référence de retrait (démonstration) |

Erreurs : `{ "error": "…" }` avec 404 (objet inconnu), 400 (requête invalide, `fields` par champ pour les billets) ou 500.

## Architecture

```
src/
  app/page.js             documentation (Server Component, exemples issus des données)
  app/*/route.js          Route Handlers, un fichier par ressource
  lib/data.js             mise en forme des données : URL d'images, liens, filtres
  lib/images.js           URL des photographies, servies depuis le dossier public de l'API
  lib/http.js             réponses JSON : CORS, Cache-Control, erreurs
  lib/visit.js            jours d'ouverture, validation d'une demande, référence
  data/*.json             objects, archive, artists, visit
public/images/            photographies de la collection et de l'archive (2000 px)
tools/similar-works.mjs   fiches proches (type, artiste, matériaux, année)
```

## Décisions

- **Données en JSON versionné, pas de base de données.** Un fichier par ressource, relu à chaque build. Les images sont des chemins `/images/…` servis par l'API, dont l'URL complète est construite à partir de l'adresse publique du déploiement (`VERCEL_PROJECT_PRODUCTION_URL`, sinon `localhost:4000`).
- **Collection par catégorie.** Chaque fiche porte `category` : `space` pour un lieu conçu par César Manrique (Taro de Tahíche, Jameos del Agua, Jardín de Cactus, Casa-Museo del Campesino, Lago Martiánez), `work` pour un tableau. Les faits viennent des sites officiels (fcmanrique.org, cactlanzarote.com) ; les notices citent les photographes, et l'identification des photographies Pexels s'appuie sur le titre et le lieu indiqués sur leur page. Les tableaux sont des photographies de Vladimir Kysela sans légende : titre descriptif, `year` à `null`, technique observée, ce que la notice dit.
- **Route Handlers plutôt que pages.** Chaque ressource est un `route.js` qui renvoie `Response.json`. Les listes acceptent des filtres en query string ; un slug inconnu renvoie 404 avec un message explicite.
- **Cache CDN et CORS.** Les lectures portent `Cache-Control: public, s-maxage=3600, stale-while-revalidate` (dix minutes pour `/visit`, dont la liste des jours dépend de la date) ; toutes les réponses autorisent n'importe quelle origine.
- **Billetterie de démonstration, sans persistance.** `POST /tickets` valide la demande (jour ouvert, quantités, nom, email), calcule le total et émet une référence `FCM-AAMMJJ-XXXX` ; rien n'est transmis à la Fondation. Les erreurs sont des codes par champ, le client les traduit.
- **Documentation vivante.** La page d'accueil importe les mêmes fonctions que les routes : les exemples de réponse sont toujours ceux des données réelles.

## Déploiement

Projet Vercel sans configuration particulière (`npm run build`). L'URL de base affichée dans la documentation et les URL d'images viennent de `VERCEL_PROJECT_PRODUCTION_URL`. Côté site, renseigner `FCM_API_URL` avec l'URL du déploiement.

## Crédits

Photographies : Vladimir Kysela (maison, atelier, tableaux et détails, vues de l'île), photographes Pexels cités dans chaque notice. Informations sur la Fondation : fcmanrique.org ; sur les Centres d'art, de culture et de tourisme : cactlanzarote.com. Billetterie : démonstration, projet d'étude.
