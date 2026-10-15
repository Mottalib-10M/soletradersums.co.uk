# Ajouter ou réécrire une page de Sole Trader Sums

Notice pour l'agent qui prolonge le site (impôts des indépendants au Royaume-Uni, exercice 2026/27, anglais britannique seul). À lire avec `~/Documents/GitHub/RECETTE-SITE.md` (§5, §6, §7, §9.3, §11, §17.4, §21, §26).

## Principe : une page = un fichier de données

- **Une page** = `src/content/pages/<id>.ts` (`definePage`, types dans `src/lib/guide-types.ts`). Le fichier porte tout : URL (`slug`), `title`, `description`, `h1`, `intro` (une phrase), le bloc citable `resume(h)` (≥ 120 mots, un seul paragraphe), la FAQ `faqs(h)`, le corps `body(h)` (HTML), l'outil (`tool` en premier écran pour une page outil, ou `mini` après le bloc citable pour une page de lecture), les `sources` (clés de `src/data/params-2026.json`) et les pages liées (`related`).
- Le registre `src/lib/guides.ts` charge tous les fichiers ; la route, le menu (groupes de `src/i18n/nav.ts`), le pied de page, `llms.txt` et le sommaire de l'accueil suivent sans autre modification.
- **Outils** (`ToolDef`) :
  - `se` : calculateur complet (props : `turnover`, `expenses`, `region`, `wages`, `plan`) ;
  - `compare` : sole trader ou société (props : `profit`, `region`, `draw`) ;
  - `ir35` : contractor (props : `rate`, `days`) ;
  - `mtd` : date d'entrée dans Making Tax Digital (props : `se`) ;
  - `mini:<spec>` : mini-calculateur de `src/lib/mini-specs.ts` (props = valeurs par défaut des champs, mêmes `id`).
  Un outil secondaire se place dans le corps avec `<!--tool:mini:poa-->` ou `<!--tool:se|{"turnover":20000}-->`.
- Une page outil (`tool`) est marquée `data-outil` : 500 à 700 mots suffisent. Une page de lecture (`mini`) vise 1 200 mots ou plus. Une page « par bénéfice » (groupe `amounts`) : 520 mots ou plus et un tableau.

## Les chiffres : jamais en dur

- Tout taux, seuil, montant ou date réglementaire vient de `params-2026.json` par les aides : `h.P` (paramètres), `h.T` (seuils dérivés : `h.T.basicTo` = 50 270 £, `h.T.scotHigherFrom` = 43 663 £, `h.T.paGone` = 125 140 £…), `h.E` (moteur testé : `selfEmployed`, `compareStructures`, `corporationTax`, `ir35`, `mtdStart`, `saCalendar`…).
- Mise en forme : `h.m()` (£12,570), `h.m2()` (£3.65), `h.pc()` (20 %, 10.75 %), `h.date()` (31 January 2028), `h.table()`, `h.box()`, `h.a(id, texte)` (lien interne, l'id doit exister), `h.src(clé)` (lien vers la source officielle).
- Un montant d'exemple choisi (« un bénéfice de 35 000 £ ») peut s'écrire, mais son résultat vient toujours du moteur.
- Un chiffre absent du fichier de paramètres ne se publie pas avant d'avoir été lu sur GOV.UK, un manuel HMRC, legislation.gov.uk ou gov.scot / mygov.scot, puis ajouté au fichier avec sa source et sa date, et testé dans `tests/tax.test.ts`.

## Règles d'écriture (vérifiées par `tests/pages.test.ts`)

- `title` 50 à 60 caractères, terme-clé d'abord, puis pays ou région, puis le reste ; jamais « UK », « How », « Calculator »… en tête ; aucun tiret cadratin ; pas d'espace avant « : ».
- `description` 150 à 160 caractères, unique.
- FAQ : 3 à 5 questions (8 au plus sur un long guide), réponses de 40 à 90 mots, chiffre et condition dans la réponse ; **une question n'apparaît que sur une page du site**.
- Anglais britannique, voix humaine, phrases de longueur variable ; pas de « it's important to note », « delve », « in today's world », ni de triplets en série ; pas de tiret cadratin.
- Chaque page a son angle : les pages par bénéfice partent du seuil propre au montant et ont leurs propres H2 (§6.2). Ne pas reprendre une phrase d'une autre page du site, ni d'un autre site du portefeuille, ni recopier GOV.UK.
- Aucun lien vers un cabinet, une banque, un logiciel ou un autre site du portefeuille ; liens sortants seulement vers les sources officielles (`h.src`).

## Contrôles

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-self-employed
export NODE_PATH=$(npm root -g):$PWD/node_modules
npx vitest run                       # moteur + règles éditoriales de chaque page
npm run build                        # typo-nbsp + check-snippets (bloquant)
python3 scripts/check-seo.py . ; python3 scripts/check-unique.py dist ; python3 scripts/check-trame.py .
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
python3 scripts/check-cookies.py . ; node scripts/check-legal.mjs ; node scripts/check-sources.mjs .
node scripts/typo-nbsp.mjs dist --check ; node scripts/check-contraste.mjs dist ; node scripts/check-nombres.mjs dist
node scripts/check-saisie.mjs dist --max=60 ; node scripts/check-url-propre.mjs dist ; node scripts/check-premier-ecran.mjs .
node scripts/check-layout.mjs .
```

Serveur local : `npx astro preview --port 4384` ; l'arrêter par son port (`lsof -ti tcp:4384 | xargs kill`), jamais `pkill -f`.

## Mise à jour annuelle (avril 2027)

1. Copier `params-2026.json` en `params-2027.json`, relire chaque source (clé `sources`, URL et date), changer `taxYear`, les dates de `selfAssessment` et les étapes `mtd`.
2. Mettre à jour les cas de `tests/tax.test.ts` avec les exemples GOV.UK de la nouvelle année.
3. `npx vitest run`, puis tous les contrôles ; relire les pages qui citent une réforme datée (taux des dividendes, MTD, pénalités).

## Droits de réutilisation

Taux, seuils et textes de GOV.UK, des manuels HMRC et de legislation.gov.uk : informations du secteur public sous Open Government Licence v3.0, reprises comme faits avec la source et la date de lecture. Le site est statique : tout calcul tourne dans le navigateur, aucune donnée en direct.
