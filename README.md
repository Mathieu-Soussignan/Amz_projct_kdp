# Atelier CaroTine — Collection Officielle Amazon KDP

Site vitrine éditorial des livres de coloriage *Bold & Easy* créés par **Anne-Caroline** (530K+ sur TikTok) et **Clémentine** (*CaroTine*), disponibles sur Amazon KDP.

## Stack Technique

- **Framework** : Next.js 15 (App Router, TypeScript)
- **UI & Typographie** : Tailwind CSS (`Fraunces` & `Plus Jakarta Sans`)
- **Animations & Scroll** : `motion/react` (Framer Motion) + `lenis` (Smooth Scroll)
- **Traitement d'images** : `next/image` (AVIF / WebP) & `sharp`

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrez ensuite [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

- `data/books.ts` : Catalogue officiel des 6 livres KDP (Automne, Noël, Classique) et liens Amazon.
- `components/hero/HeroVisual.tsx` : Scène Hero interactive avec bascule saisonnière (Automne / Noël) et livre 3D.
- `components/catalog/BookGrid.tsx` & `BookCard.tsx` : Grille de la collection avec aperçu intérieur au survol.
- `components/preview/FlipbookModal.tsx` : Feuilleteur interactif plein écran (4ème de couverture officielle, extrait intérieur et couverture) avec bruissement papier ASMR.
- `components/story/DuoStory.tsx` : L'histoire du duo Anne-Caroline & Clémentine et aperçu TikTok 9:16.
