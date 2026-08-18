# Japan Trip 2026 — Microsite Build Instructions

Build a React site presenting a personal Japan trip itinerary: the day-by-day plan,
the destinations, and researched recommendations for each. Content is provided as
structured JSON in `/data` — use it as the single source of truth. Don't invent
recommendations not present in the data; if something's missing, leave it out rather
than filling in generic content.

## Tech stack

- React (Vite recommended for a fast, simple setup — `npm create vite@latest` with
  the React template)
- React Router for the multi-page structure below
- Plain CSS or CSS modules is fine — no need for a component library

## Site structure (multi-page, not a single scrolling page)

- `/` — Itinerary home page: the full day-by-day timeline from `data/itinerary.json`.
  Each day that has a `destinationSlug` renders as a clickable card. Clicking it does
  NOT navigate directly to the destination page — it opens a **summary sheet**
  (see "Destination summary sheet" below) as a preview layer, with a link inside
  that sheet to go to the full page.
- `/destinations` — index grid of all 9 destinations (one card per file in
  `data/destinations/`), each showing name, days, a one-line teaser (derived from
  `overview`), and a pulled photo.
- `/destinations/:slug` — one destination's full overview, photo, and its
  `recommendations` grouped by `category`. Clicking a recommendation opens a
  **recommendation sheet** (see below) rather than navigating to a separate page —
  this replaces the earlier plan of a full page per recommendation, since
  individual recommendations don't have enough content to justify their own page;
  a sheet keeps the person on the destination page while still surfacing the full
  `body` text and photo.

Every recommendation used to get its own page — that's been reversed. The one
exception to "click = navigate" is now twofold: the itinerary home page's
destination cards open a preview sheet (see below), and the destination page's
recommendation cards open a detail sheet (see below) — neither navigates to a new
URL.

## Destination summary sheet (itinerary home page only)

Clicking a destination card on the itinerary home page (`/`) opens a sheet/drawer —
slides in from the side on desktop, or up from the bottom on mobile — showing a
condensed preview rather than the full destination page:

- The destination's photo (same `imageQuery` used on the full page)
- The destination `name` and `days`
- The `overview` text
- A compact list of its `recommendations` (title + one-line `summary` each, grouped
  by `category` same as the full page, but without the full `body` text — this is a
  preview, not a duplicate of the full page)
- A clear "View full [destination name] page" button/link at the bottom, navigating
  to `/destinations/:slug`

The sheet closes via a close button, clicking outside it, or pressing Escape — it
should feel lightweight and quick to dismiss, since its purpose is a fast preview
while scanning the itinerary, not a destination. Clicking an individual
recommendation inside this sheet should open the recommendation sheet described
below (same behavior as clicking a recommendation on the full destination page) —
so recommendation content is reachable from either the preview sheet or the full
destination page, consistently.

## Recommendation sheet (triggered from destination page or destination summary sheet)

Clicking any recommendation card — whether on the full `/destinations/:slug` page
or inside the destination summary sheet above — opens its own sheet/drawer (stacks
on top if the destination summary sheet is already open) showing:

- The recommendation's photo (`imageQuery`)
- `title` and `category`
- The full `body` text (not just `summary`)

No further page to navigate to from here — this is the deepest layer for
recommendation content. Keep it as lightweight as the destination summary sheet:
same slide-in behavior, same easy-dismiss pattern (close button, click outside,
Escape).

## Data

- `data/itinerary.json` — the day-by-day plan. Each day has `day`, `date`,
  `location`, `plan`, `friend` (who's present that day), and `destinationSlug`
  (nullable — travel days like arrival/departure have no destination page).
- `data/destinations/*.json` — one file per destination. Shape:
  ```
  {
    "slug": string,
    "name": string,
    "days": string (free text, e.g. "3 (Day 1 arrival/jet lag...)"),
    "imageQuery": string (search keywords for the destination's own photo),
    "overview": string,
    "recommendations": [
      {
        "slug": string,
        "title": string,
        "category": string (e.g. "food", "nature", "historic", "pop-culture",
          "art-design", "nightlife", "iconic", "traditional-experience",
          "wildlife", "logistics", "if-time-allows", "ghibli-park"),
        "imageQuery": string,
        "summary": string (one line, for card views),
        "body": string (full paragraph, shown in the recommendation sheet)
      }
    ],
    "openQuestions": [string] (optional — display as a small "still deciding" note
      on the destination page, not hidden)
  }
  ```
- At build time, import all files in `data/destinations/` (e.g. with
  `import.meta.glob` in Vite) rather than hardcoding a list of 9 filenames — this
  keeps the destinations index page automatically in sync if a file is added or
  removed.

## Image integration — Pixabay

Images are pulled automatically via the Pixabay API using each item's `imageQuery`
field (destinations have one at the top level; each recommendation has its own).

- API key goes in `.env` as `PIXABAY_API_KEY` (already set up — see `.env.example`
  for the shape). Never hardcode the key in source files; read it via Vite's
  `import.meta.env.VITE_PIXABAY_API_KEY` (note: Vite requires env vars exposed to
  client code to be prefixed `VITE_` — rename the key in `.env` to
  `VITE_PIXABAY_API_KEY` if using Vite's default client-side env handling, or proxy
  the request through a small server function if you'd rather keep the key
  server-side only).
- Pixabay endpoint: `https://pixabay.com/api/?key=YOUR_KEY&q=SEARCH_TERMS&image_type=photo&per_page=3`
  — take the first result's `webformatURL` for display.
- Cache results per query (e.g. in a simple in-memory map, or localStorage) so the
  same destination/recommendation doesn't re-fetch on every page visit.
- Always have a graceful fallback (a neutral placeholder image or solid color
  block with the item's name) if a query returns no results or the API call fails
  — don't let a missing photo break the layout.

## Design direction

This is a personal trip site for a small group, built around a real, structured
rail-and-ferry journey across Japan. Lean into that: the itinerary is a genuine
linear path with real stops in a real order, so the home page's signature element
should be a route line — a connected line of station-style markers (like a transit
map) running through the day-by-day list, with each marker linking to its
destination page. This is a content-accurate device, not decoration — the actual
trip runs shinkansen-to-shinkansen-to-ferry-to-ferry in exactly this order.

**Color palette** (named, not defaults):
- Ai-iro (indigo) `#2C3E66` — primary color, referencing traditional Japanese
  indigo-dyed textiles (aizome)
- Washi cream `#F3EDE0` — background, referencing handmade paper
- Shu-iro (vermillion) `#C1440E` — accent color, referencing torii gates; use
  sparingly (active states, the route line itself, key CTAs) — not as a background
  or large fill
- Sumi ink `#201F1D` — primary text color
- Moss `#6B7A5E` — used specifically to tag/accent the "nature" category
  throughout, so nature recommendations are visually recognizable at a glance
- Mist blue `#AAC0C6` — secondary/muted tone, good for the ferry-leg portions of
  the route line (visually distinct from the train legs)

**Typography:**
- Display face: "Shippori Mincho" (Google Fonts) for page titles and destination
  names — a serif with real Japanese-print character, used with restraint (titles
  and headers only, not body text)
- Body face: "Zen Kaku Gothic New" or "Noto Sans JP" (Google Fonts) — clean,
  readable, pairs well with the display face without competing
- Utility face: a monospace (e.g. "JetBrains Mono") for day numbers and dates on
  the itinerary page — ties into a "ticket stub" motif (see below)

**Signature element — day cards as ticket stubs:**
Since the underlying content is literally a sequence of train and ferry legs, each
day entry on the itinerary page should read like a boarding pass or ticket stub:
large stamped-looking day number in the monospace face, a perforated-edge visual
treatment on one side, date and route info laid out like ticket fields. This is a
real signature device drawn from the content itself, not an arbitrary numbered-list
treatment — it works because the content actually is a sequence of tickets.

**What to avoid:** the generic AI-design defaults — a warm cream page with a
high-contrast serif and a terracotta accent near `#D97757` (this palette
intentionally uses indigo as primary and vermillion only as a sparing accent to
avoid reading as that default, even though the background is also a warm cream);
a near-black page with a single neon accent; or a hairline-rule broadsheet layout
with zero border-radius. None of those fit a warm, personal trip-planning site.

**Motion:** Keep it restrained — a subtle reveal as the route line draws in on the
itinerary page load is worth doing (it reinforces the "journey" framing), but avoid
scattered hover animations elsewhere. Respect `prefers-reduced-motion`. Both the
destination summary sheet and the recommendation sheet should slide in/out smoothly
(from the side on desktop, from the bottom on mobile) rather than appearing
instantly — this is the one other place motion earns its keep, since both sheets'
whole purpose is feeling like a quick, lightweight preview rather than a full page
transition. If the recommendation sheet opens on top of an already-open destination
summary sheet, keep both visually distinguishable (e.g. slight offset or a subtle
depth/shadow difference) so it's clear which is which.

**Responsive & accessibility floor:** Mobile-responsive down to a narrow viewport
(the route line should switch to a vertical orientation on mobile rather than
overflowing), visible keyboard focus states throughout, and alt text on every
pulled image using the item's `title`/`name`.

## File structure to create

```
japan-trip-site/
├── .env                          (already created — has the real key)
├── .env.example                  (already created — safe to commit)
├── .gitignore                    (already created)
├── data/
│   ├── itinerary.json            (already created)
│   └── destinations/
│       ├── tokyo.json            (already created)
│       ├── kyoto.json            (already created)
│       ├── nara.json             (already created)
│       ├── osaka.json            (already created)
│       ├── nagoya.json           (already created)
│       ├── hiroshima.json        (already created)
│       ├── matsuyama-shikoku.json (already created)
│       ├── beppu-yufuin.json     (already created)
│       └── fukuoka.json          (already created)
├── src/
│   ├── main.jsx
│   ├── App.jsx                   (router setup)
│   ├── pages/
│   │   ├── ItineraryHome.jsx
│   │   ├── DestinationsIndex.jsx
│   │   └── DestinationDetail.jsx
│   ├── components/
│   │   ├── RouteLine.jsx         (the signature transit-map element)
│   │   ├── DayTicketCard.jsx     (the boarding-pass-style day card; opens the
│   │   │                          destination summary sheet)
│   │   ├── DestinationSummarySheet.jsx  (preview sheet/drawer, triggered from
│   │   │                                 DayTicketCard on the itinerary home page)
│   │   ├── RecommendationSheet.jsx  (detail sheet, triggered from a
│   │   │                             RecommendationCard on either the
│   │   │                             DestinationDetail page or from inside
│   │   │                             DestinationSummarySheet — can stack on top)
│   │   ├── DestinationCard.jsx
│   │   ├── RecommendationCard.jsx
│   │   └── PulledImage.jsx       (wraps the Pixabay fetch + fallback)
│   ├── lib/
│   │   └── pixabay.js            (fetch + cache logic)
│   └── styles/
│       └── tokens.css            (the color/type variables from Design Direction)
└── package.json
```

The `data/` folder and env files are already built — start from setting up the
Vite project structure and wiring the pages/components to read from that data.
