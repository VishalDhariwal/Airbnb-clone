# Airbnb Clone — Implementation Plan

**Assignment:** SDE Fullstack — build a functional Airbnb clone
**Stack (fixed by the brief):** Next.js + TypeScript · Python (FastAPI) · SQLite
**Estimated effort:** ~24 hours
**Deliverables:** public GitHub repo (`frontend/` + `backend/`), README, live deployed link

---

# PART 0 — HOW TO USE THIS PLAN (read this first, every agent)

## 0.1 The explain-first rule — this is not optional

Before you start **any** phase, post a short brief and **stop and wait for approval**.
Do not write code in the same message as the brief.

```
=== PHASE N BRIEF: <name> ===

WHY:   2–4 sentences. What problem does this phase solve? What breaks or stays
       impossible if we skip it? Why is it in this position in the order?

HOW:   The approach in plain language. Which files get created or changed.
       Which libraries. The one or two design decisions that matter, and the
       alternative you rejected and why.

DONE:  The exact checks that prove this phase works — "GET /api/listings?city=Goa
       returns 12 rows", "the card grid matches reference 03 at 1440px", etc.

RISK:  Anything that might not work, or where you're guessing.
```

After approval, build. Then post:

```
=== PHASE N REPORT ===
BUILT:      files created/changed, one line each
VERIFIED:   the DONE checks, with actual output pasted
DEVIATED:   anything you did differently from the plan, and why
NEXT:       what Phase N+1 needs from you
```

Why this rule exists: this project is graded on an interview where the human has to explain
every line. A phase that gets built without him understanding it first is a phase that costs
him marks later. Speed here is worth nothing without comprehension.

## 0.2 Rules that apply to every phase

1. **`/references` is the source of truth for UI.** Before styling any page, open the
   matching screenshot in `/references` and keep it beside you. If your output doesn't look
   like the screenshot, your output is wrong — not the screenshot.
2. **Read `DESIGN_SYSTEM.md` before writing CSS.** Never invent a colour, radius or font size.
3. **Never copy code from an existing Airbnb-clone repo.** The brief says plagiarism is an
   instant disqualification. Write it fresh. Using library docs and official examples is fine.
4. **No file over ~250 lines.** If a component or router grows past that, split it. "Code
   modularity" and "separation of concerns" are two of the seven graded criteria.
5. **Types are shared, not duplicated.** The FastAPI Pydantic schemas define the contract;
   the TypeScript types in `frontend/lib/types.ts` mirror them exactly. If you change one,
   change the other in the same commit.
6. **Money is computed on the server, always.** The frontend may display a price breakdown
   but must never be the thing that decides it.
7. **Commit per phase**, with a message like `feat(booking): overlap validation + quote endpoint`.
   A repo with one giant commit looks like generated code and invites suspicion.
8. **If a decision isn't covered here, ask.** Don't silently pick.

## 0.3 Scope discipline — what we are NOT building

The brief explicitly allows these as placeholders. Build a clean "Coming soon" screen for each,
styled properly, and move on. Do not spend time here:

- Real payment processing (mock checkout only)
- Guest ↔ host messaging
- Live-pricing map pins (a basic map with static markers is enough)
- Identity verification
- Experiences and Services tabs — the nav shows all four tabs because Airbnb's does, but
  clicking Experiences/Services lands on a styled "Coming soon" page. **Homes is the product.**

Two things in the brief look small and are not — budget for them:
availability/overlap validation, and making the property card pixel-correct.

## 0.4 One tension in the brief you should know about

The brief asks for a "category / filter row." Airbnb **removed** the icon category strip
(OMG!, Cabins, Treehouses…) from the live site in April 2025 — the current homepage is
horizontal carousels instead, which is what the reference screenshots show.

**Decision: build both.** The homepage gets carousels (matches the live site, matches our
screenshots). The **search results page** gets a horizontal category strip with icons plus a
"Filters" button opening a modal. That satisfies the brief's checklist *and* the "looks like
Airbnb" requirement. Note this reasoning in the README under Assumptions — it shows judgement
rather than a miss.

---

# PART 1 — ARCHITECTURE

## 1.1 Repo layout

```
airbnb-clone/
├── README.md
├── references/                  ← screenshots, committed to the repo
├── backend/
│   ├── app/
│   │   ├── main.py              ← FastAPI app, CORS, router mounting
│   │   ├── config.py            ← settings via pydantic-settings
│   │   ├── database.py          ← engine, SessionLocal, get_db dependency
│   │   ├── models/              ← SQLAlchemy ORM models, one file per entity
│   │   ├── schemas/             ← Pydantic request/response models
│   │   ├── routers/             ← listings.py, bookings.py, auth.py, host.py, ...
│   │   ├── services/            ← business logic: pricing.py, availability.py, search.py
│   │   ├── core/                ← security.py (JWT), deps.py (current_user), exceptions.py
│   │   └── seed/                ← seed.py + data/*.json
│   ├── tests/
│   ├── requirements.txt
│   └── app.db
└── frontend/
    ├── app/                     ← Next.js App Router
    ├── components/
    │   ├── ui/                  ← Button, Modal, Toast, Stepper, Skeleton
    │   ├── layout/              ← TopNav, Footer, AccountMenu
    │   ├── search/              ← SearchBar, WherePanel, DatePanel, GuestPanel, Filters
    │   ├── listing/             ← PropertyCard, Carousel, PhotoGallery, AmenityList
    │   ├── booking/             ← ReservationCard, PriceBreakdown, DatePicker
    │   └── host/                ← ListingForm, HostListingRow, ReservationRow
    ├── lib/                     ← api.ts, types.ts, format.ts, dates.ts, hooks/
    └── public/
```

**Why routers / services / models split:** the graders explicitly score "Backend / API design"
and "Code modularity". Routers should be thin — parse the request, call a service, return a
schema. All the interesting logic (does this date range overlap? what's the total price?)
lives in `services/` where it can be unit-tested without HTTP. If a router function is longer
than ~20 lines, logic has leaked into it.

## 1.2 Database schema

SQLite via SQLAlchemy 2.0. Design goals: proper foreign keys, no data duplication except two
deliberate denormalisations, and enough structure that the schema itself reads as considered.

### Tables

**`users`**
`id` PK · `name` · `email` UNIQUE · `avatar_url` · `is_host` BOOL · `is_superhost` BOOL ·
`bio` · `joined_at` · `response_rate` INT · `created_at`

**`listings`**
`id` PK · `host_id` FK→users · `title` · `description` TEXT · `property_type`
(house/flat/villa/room/hotel/bungalow) · `room_type` (entire/private/shared) ·
`address` · `city` · `state` · `country` · `latitude` REAL · `longitude` REAL ·
`price_per_night` INT (**store paise/cents as integer — never float for money**) ·
`cleaning_fee` INT · `max_guests` · `bedrooms` · `beds` · `bathrooms` REAL ·
`is_guest_favorite` BOOL · `is_active` BOOL · `avg_rating` REAL ⚑ · `review_count` INT ⚑ ·
`created_at` · `updated_at`

⚑ = denormalised, recomputed whenever a review is written. Justify this in the README:
every card in a 100-card grid shows a rating, and doing that as a live aggregate is a
needless N+1.

**`listing_photos`**
`id` PK · `listing_id` FK · `url` · `caption` · `position` INT
(one-to-many; `position=0` is the cover image)

**`amenities`**
`id` PK · `name` · `icon_key` · `category` (essentials/features/safety/kitchen)

**`listing_amenities`** — join table, composite PK `(listing_id, amenity_id)`

**`categories`**
`id` PK · `name` · `slug` · `icon_key`
(Beachfront, Cabins, Amazing views, Tiny homes, Trending, Rooms, Farms, Lakefront, Design, Mansions)

**`listing_categories`** — join table, composite PK `(listing_id, category_id)`

**`bookings`**
`id` PK · `confirmation_code` UNIQUE · `listing_id` FK · `guest_id` FK→users ·
`check_in` DATE · `check_out` DATE · `adults` · `children` · `infants` · `pets` ·
`nights` INT · `nightly_rate` INT ⚐ · `cleaning_fee` INT ⚐ · `service_fee` INT ⚐ ·
`taxes` INT ⚐ · `total_price` INT ⚐ · `status` ENUM(confirmed/cancelled/completed) ·
`created_at`

⚐ = **price snapshot**. Copy the prices in at booking time rather than joining to the listing
later. If a host raises their rate next week, an existing booking must not silently change
value. This is a small detail that reads as real-world thinking in an interview — be ready
to explain it.

**`reviews`**
`id` PK · `listing_id` FK · `author_id` FK→users · `booking_id` FK NULLABLE ·
`rating` INT 1–5 · `cleanliness` · `accuracy` · `check_in_rating` · `communication` ·
`location_rating` · `value_rating` · `comment` TEXT · `created_at`

**`wishlist_items`**
`id` PK · `user_id` FK · `listing_id` FK · `created_at` · UNIQUE`(user_id, listing_id)`

**`blocked_dates`**
`id` PK · `listing_id` FK · `date` DATE · UNIQUE`(listing_id, date)`
Host-set unavailability. Availability = "not in `blocked_dates`" AND "not covered by a
confirmed booking". Keeping these separate matters: cancelling a booking should free the
dates, but a host block should persist.

### Indexes (don't skip these — schema design is a graded criterion)

```sql
CREATE INDEX idx_listings_city         ON listings(city);
CREATE INDEX idx_listings_price        ON listings(price_per_night);
CREATE INDEX idx_listings_host         ON listings(host_id);
CREATE INDEX idx_bookings_listing_dates ON bookings(listing_id, check_in, check_out);
CREATE INDEX idx_reviews_listing       ON reviews(listing_id);
```

`idx_bookings_listing_dates` is the one that matters — the overlap query runs on every
availability check and every search with dates.

## 1.3 API surface

All under `/api`. JSON in, JSON out. Consistent error shape:
`{ "detail": "...", "code": "DATES_UNAVAILABLE" }`

### Auth (mocked but real-shaped)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/auth/login` | body `{email}` → issues JWT. No password: the brief permits mocked auth. |
| GET | `/api/auth/me` | current user from Bearer token |
| GET | `/api/auth/demo-users` | list of seeded users so a grader can switch between guest/host in one click |

### Listings (public)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/listings` | search + filter + paginate. See params below. |
| GET | `/api/listings/{id}` | full detail: photos, amenities, host, rating breakdown |
| GET | `/api/listings/{id}/availability?start=&end=` | array of unavailable dates for the calendar |
| GET | `/api/listings/{id}/reviews?page=` | paginated |
| POST | `/api/listings/{id}/quote` | body `{check_in, check_out, guests}` → server-computed price breakdown |
| GET | `/api/listings/home-sections` | the homepage carousels: `[{title, listings[]}]` |

`GET /api/listings` params:
`location` · `check_in` · `check_out` · `guests` · `min_price` · `max_price` ·
`property_type` (repeatable) · `room_type` · `amenities` (repeatable ids) · `category` ·
`bedrooms` · `beds` · `bathrooms` · `sort` (recommended|price_asc|price_desc|rating) ·
`page` · `limit` (default 18)

Response: `{ items: [...], total: 214, page: 1, limit: 18, has_more: true }`

**When `check_in`/`check_out` are supplied, results must exclude listings that are already
booked or blocked for that range.** This is core-feature #1 and it's the thing most clones
get wrong.

### Bookings (auth required)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/bookings` | validate → re-check availability → create. Returns confirmation code. |
| GET | `/api/bookings/me` | "My Trips", split into upcoming / past |
| GET | `/api/bookings/{id}` | confirmation page |
| POST | `/api/bookings/{id}/cancel` | sets status, frees the dates |

### Host (auth + ownership required)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/host/listings` | listings owned by current user |
| POST | `/api/host/listings` | create |
| PATCH | `/api/host/listings/{id}` | edit — 403 if not owner |
| DELETE | `/api/host/listings/{id}` | soft delete (`is_active=false`) if bookings exist, hard delete otherwise |
| GET | `/api/host/reservations` | all bookings across the host's listings |
| PUT | `/api/host/listings/{id}/blocked-dates` | set unavailability |

### Wishlist / reference data
`GET|POST|DELETE /api/wishlist` · `GET /api/amenities` · `GET /api/categories` ·
`GET /api/locations/suggest?q=`

## 1.4 Pricing model — one function, server side only

`backend/app/services/pricing.py`:

```
nights          = (check_out - check_in).days
subtotal        = nightly_rate * nights
cleaning_fee    = listing.cleaning_fee
service_fee     = round(subtotal * 0.14)     # Airbnb's guest service fee, ~14%
taxes           = round((subtotal + cleaning_fee) * 0.05)
total           = subtotal + cleaning_fee + service_fee + taxes
```

Every surface that shows money calls this: the quote endpoint, the booking creation, and the
card's trip-total display. **Never reimplement this in TypeScript.** If the frontend and
backend ever disagree about a total, we've built a bug that's very visible in a demo.

Display format: `₹7,400` — Indian grouping (`Intl.NumberFormat('en-IN')`), no decimals.

## 1.5 Availability logic — write this once, carefully

`backend/app/services/availability.py`

Two date ranges overlap when:

```python
existing.check_in < new.check_out AND existing.check_out > new.check_in
```

Strict inequalities, both sides. This is deliberate: check-out day and check-in day may be
the same date — one guest leaves in the morning, the next arrives in the afternoon. That is
a real booking, not a conflict. Write a unit test for exactly this adjacent-booking case;
it's the classic off-by-one and it's an easy interview question to fumble.

Also validate: `check_out > check_in`, `check_in >= today`, `guests <= max_guests`,
nights within a sane min/max.

**Re-check availability inside the POST /bookings transaction**, not just at quote time. The
user may have had the page open for ten minutes while somebody else booked those dates.

---

# PART 2 — THE PHASES

Fifteen phases. Each has a why, a how, and a done. Roughly 24 hours of work if you don't
gold-plate the placeholder screens.

---

## PHASE 0 — Recon and scaffold  *(~1h)*

**Why.** Everything downstream depends on two things being right: the reference material
being available to look at, and both apps booting. Doing this first means no agent later
has to guess what a page looks like or fight a broken toolchain while also trying to write
features.

**How.**
1. `git init`, create the repo structure from §1.1, add `.gitignore` (`.venv`, `__pycache__`,
   `node_modules`, `.next`, `.env`, `*.db`).
2. Copy `DESIGN_SYSTEM.md` and `IMPLEMENTATION_PLAN.md` into the repo root.
3. Commit `/references` with every screenshot from `REFERENCES_CHECKLIST.md`.
4. Backend: venv, `fastapi uvicorn sqlalchemy pydantic pydantic-settings python-jose passlib
   python-multipart`, a `main.py` with CORS open to `localhost:3000` and a `/api/health` route.
5. Frontend: `npx create-next-app@latest frontend --typescript --tailwind --app --eslint`.
   Wire Inter via `next/font/google`. Paste the Tailwind config from `DESIGN_SYSTEM.md` §10.
   Add the type-scale utility classes to `globals.css`.
6. `frontend/lib/api.ts` — a thin fetch wrapper reading `NEXT_PUBLIC_API_URL`, attaching the
   Bearer token, and throwing a typed error on non-2xx. Every network call in the app goes
   through this. No bare `fetch()` in components, ever.

**Done.** `uvicorn` serves `/api/health`; `next dev` serves a page rendering Inter with a
Rausch-coloured test button; a component can call `api.get('/health')` successfully.

---

## PHASE 1 — Data models and migrations  *(~1.5h)*

**Why.** The schema is a directly graded criterion, and it's the thing that's most painful to
change later — every model change ripples into schemas, routers, seed data and frontend types.
Getting the relationships right now saves hours.

**How.** Implement §1.2 as SQLAlchemy 2.0 declarative models, one file per entity in
`app/models/`, with an `__init__.py` re-exporting them. Set relationships explicitly with
`back_populates` and appropriate `cascade` (deleting a listing should delete its photos and
its `listing_amenities` rows, but **must not** delete its bookings — those are historical
records). Add the indexes. Use Alembic if comfortable; if not, `Base.metadata.create_all()`
is acceptable for SQLite and should be noted in the README as a deliberate simplification.

**Done.** `python -c "from app.database import init_db; init_db()"` creates `app.db`;
`sqlite3 app.db ".schema"` shows every table, FK and index.

---

## PHASE 2 — Seed data  *(~2h — do not rush this)*

**Why.** The brief says the app must be "immediately usable" on load, and the reference
screenshots show dense grids of real-looking Indian listings. A grader who opens the deployed
link and sees four lorem-ipsum listings has already formed an opinion. Good seed data is the
cheapest possible win on the UI/UX criterion.

**How.**
- **10 hosts** with real-sounding names, avatars (`i.pravatar.cc/150?img=N`), 4 marked superhost.
- **60–80 listings** across ~8 Indian cities — Goa, Noida, New Delhi, Gurugram, Dehradun,
  Manali, Jaipur, Mumbai. Match the reference screenshots' vocabulary: titles read
  "Flat in Sector 63", "Villa in Noida", "Home in Dehradun", "Bungalow in New Delhi" —
  `{property_type} in {locality}`, not marketing copy.
- **5–7 photos each.** Use stable hotlinkable Unsplash URLs
  (`https://images.unsplash.com/photo-XXXX?w=1200&q=80`) for interiors and villas. Build a
  pool of ~60 URLs in `seed/data/photos.json` and deal them out. **Verify every URL loads
  before committing** — a broken image grid destroys the demo.
- Realistic INR pricing: ₹1,800–₹25,000/night, cleaning fee ₹300–₹1,500.
- **30 amenities** with `icon_key`s mapping to lucide icons (wifi, kitchen, ac, parking,
  pool, tv, washer, workspace, geyser, pets_allowed…).
- **10 categories**, each listing tagged with 1–3.
- **~250 reviews** spread unevenly (some listings 40+, some 2) with sub-ratings that roughly
  average to the overall. Write ~30 distinct comment bodies and vary them — don't repeat one
  string 250 times.
- **~40 bookings**: a mix of past (status `completed`), current and future (`confirmed`),
  spread across guests so "My Trips" has content for the demo user, and `/hosting/reservations`
  has content for the demo host. **At least one future booking must sit on a listing you'll
  demo**, so the blocked dates are visibly greyed in the calendar.
- Recompute `avg_rating` / `review_count` at the end of the seed run.
- Make it idempotent: `python -m app.seed.seed --reset` drops and rebuilds.

**Done.** Fresh DB, run seed, and a SQL query confirms: 60+ listings, every listing has ≥5
photos and ≥1 category, ≥1 listing has a confirmed future booking, no listing has
`avg_rating` of 0 with reviews attached.

---

## PHASE 3 — Read APIs: search, detail, availability  *(~3h)*

**Why.** This is the backbone. Home, search results and listing detail are three of the five
core features and all three are read-only. Building them before auth means the frontend can
start immediately without a login dependency.

**How.**
- `services/search.py` — build the query with SQLAlchemy, applying filters conditionally.
  Location match should be forgiving: `ILIKE` against `city`, `state` and `address`.
  Date filtering uses a `NOT EXISTS` subquery against `bookings` and `blocked_dates` with
  the overlap predicate from §1.5. Sorting and pagination via `LIMIT`/`OFFSET`, with a
  separate `COUNT` for `total`.
- Use `selectinload` for photos/amenities to avoid N+1. Say so in the README — it's a
  specific, checkable claim about performance thinking.
- `GET /api/listings/{id}` returns the whole detail payload in one call: photos ordered by
  position, amenities grouped by category, host object, review count and the six sub-rating
  averages. One round trip per page.
- `home-sections` returns 4–5 carousel sections shaped like the screenshots:
  "Popular homes in Noida", "Available in Dehradun this weekend", "Stay in Gurgaon District",
  "Available in New Delhi this weekend". Derive them from seeded cities; hardcoding the
  section titles is fine and should be noted as a mock.
- Card price: each list item carries `total_price` for the requested range (or a 2-night
  default), because the card renders "₹7,400 for 2 nights".

**Done.** Every one of these returns correct data, verified in `/docs`:
`?location=goa` · `?min_price=&max_price=` · `?guests=6` · `?amenities=1&amenities=5` ·
`?check_in=&check_out=` (a listing with a known booking disappears) · `?page=2` ·
`?sort=price_asc`. Detail returns one listing with all relations. Availability returns the
seeded booking's dates.

---

## PHASE 4 — Auth, wishlist, and the demo-user switcher  *(~1.5h)*

**Why.** Bookings need an owner, host CRUD needs an ownership check, and the brief requires a
"notion of guest vs host". Real auth is out of scope — but the *shape* should be real (JWT,
`Depends(get_current_user)`, 401/403), because that's what gets discussed in the interview.

**How.**
- `POST /api/auth/login` takes an email, finds or creates the user, returns a JWT signed with
  a secret from env. Short and honest — document in the README that password verification is
  deliberately omitted per the brief.
- `core/deps.py`: `get_current_user` (401 if absent) and `get_current_host` (403 if
  `is_host` is false). One dependency, used everywhere. Don't hand-roll auth checks inside
  route bodies.
- Frontend: a `useAuth` hook + context, token in `localStorage`, auto-attached by `lib/api.ts`.
- The **demo-user switcher** is worth building: a small dropdown in the account menu listing
  seeded users, labelled Guest or Host, that logs in as them in one click. A grader with 90
  seconds should be able to see both sides of the product without hunting for credentials.
  Call it out in the README.
- Wishlist endpoints + optimistic heart toggle on the card.

**Done.** Login returns a token; `/api/auth/me` resolves it; a host-only route 403s for a
guest; the heart persists across a page refresh.

---

## PHASE 5 — Booking APIs  *(~2h)*

**Why.** The single most heavily weighted feature ("including search, availability, and the
booking flow") and the one with real logic in it. Everything else is CRUD.

**How.**
- `POST /api/listings/{id}/quote` → `services/pricing.py`. Returns
  `{nightly_rate, nights, subtotal, cleaning_fee, service_fee, taxes, total}` plus an
  `available: bool`. The reservation card calls this on every date change.
- `POST /api/bookings` in one transaction: validate the payload → re-check availability →
  snapshot prices → generate a confirmation code (`HMXK4P2R`-style, 8 chars) → commit.
  On conflict return `409` with `code: "DATES_UNAVAILABLE"`.
- `GET /api/bookings/me` returns `{upcoming: [], past: []}` already split — the Trips page
  shouldn't have to do date maths.
- Cancel sets `status='cancelled'`; the availability query must ignore cancelled rows so the
  dates free up. Test this explicitly.

**Done.** Unit tests pass for: exact overlap, partial overlap at each end, an enclosing
range, an enclosed range, and **adjacent bookings (check-out == check-in) which must be
allowed**. End to end: book a range → hit availability → the dates are now blocked → cancel →
they're free again.

---

## PHASE 6 — Host APIs  *(~1.5h)*

**Why.** "Full CRUD for listings as a host" is core feature #4 and CRUD is where ownership
bugs live. Doing it in one focused pass keeps the authorisation consistent.

**How.** Standard CRUD behind `get_current_host`. Every write path re-checks
`listing.host_id == current_user.id` and raises 403 otherwise — **never trust an id from the
request body to determine ownership.** Create accepts photos as an array of URLs and writes
`listing_photos` rows with positions. Delete is soft (`is_active=false`) when bookings exist,
hard otherwise; explain that choice in the README.
`GET /api/host/reservations` joins bookings → listings → guest, sorted by check-in.

**Done.** A host can create/edit/delete their own listing; editing someone else's returns
403; a deleted listing vanishes from search but its bookings survive.

---

## PHASE 7 — Frontend shell: nav, footer, layout  *(~2.5h)*

**Why.** The nav is on every screen and it's the first thing a grader compares against the
real site. Building it once, properly, means every subsequent page starts already looking right.

**References:** `01`, `02`, `07`, `08`.

**How.**
- `<TopNav>` per `DESIGN_SYSTEM.md` §7.1 — 80px, wordmark left, four tabs centred with the
  active underline, utilities right.
- **The scroll-collapse behaviour** (reference `02`) is the detail that sells it: past ~50px
  of scroll on the homepage, the big search bar shrinks into a compact pill inside the navbar
  showing `Anywhere | Anytime | Add guests`. Clicking it expands back. Use a scroll listener
  with a height/opacity transition. This is worth the hour it takes.
- `<Footer>` — three link columns (Support / Hosting / Airbnb) on white, then a legal band
  with `© 2026`, globe + "English (IN)", `₹ INR`, social icons. All links can be `#`.
- `<AccountMenu>` dropdown per reference `08`, including the demo-user switcher.
- `<LoginModal>` per reference `07` — logo, heading, one input, Rausch Continue, `or` divider,
  Google/Apple buttons (non-functional, styled).
- Root layout mounts nav + footer + toast container.

**Done.** Nav matches reference `01` side by side at 1440px. Scrolling reproduces reference
`02`. Login modal matches `07`. Account menu matches `08`. All responsive to 390px.

---

## PHASE 8 — Home page and the search bar  *(~3h)*

**Why.** The landing page. Also where the search bar — the most-used and most-recognisable
component in the product — gets built. Both the home page and the search results page depend
on it.

**References:** `01`, `02`, `03`, `04`, `05`.

**How.**
- `<PropertyCard>` first, exactly to `DESIGN_SYSTEM.md` §7.3. Square photo, no border, no
  card shadow, trip-total price, ink star. Build the in-card photo carousel (arrows on hover,
  dots at the bottom) — it's what makes the grid feel like Airbnb rather than a product list.
- `<Carousel>` row: `display-xl` heading with a circular `→`, prev/next arrows top-right,
  scroll-snap, six cards at 1440px.
- Home page renders 4–5 sections from `/api/listings/home-sections`. Server components for
  the fetch; the card's interactive bits are client components.
- `<SearchBar>` (§7.2): the three-segment pill, active-segment highlighting, and three
  dropdown panels — destinations, a 2-month calendar, guest steppers. Search navigates to
  `/s/{location}?check_in=&check_out=&adults=`. Keep the state in one `useSearchState` hook,
  not scattered across the panels.
- Add the "Prices include all fees" tooltip pill seen in reference `01`.
- Skeleton loaders for the carousels.

**Done.** Home matches references `01`/`02` at 1440px. Cards match `03`. Each search panel
matches `04`/`05`. Searching navigates with the right query string. Mobile at 390px shows
1-up cards and a collapsed search pill.

---

## PHASE 9 — Search results, filters, map  *(~3h)*

**Why.** Core feature #1's back half. It's also where the brief's "category / filter row",
"pagination or infinite scroll" and the bonus map all live.

**References:** `09`, `10`, `11`, `12`.

**How.**
- `/s/[location]/page.tsx` reads filters from the URL — the URL is the single source of truth
  for search state. Shareable, back-button-correct, and easy to explain in an interview.
- Category strip below the nav: horizontally scrollable icon+label tabs, active gets an ink
  underline (see §0.4 for why this exists here rather than on the homepage).
- "Filters" button opens a modal: price range slider, property type, room type, bedrooms/beds/
  baths steppers, amenities checkbox grid, "Clear all" + "Show N places". The count updates
  live — fire the query with `limit=0` as the user changes filters.
- 4-column grid, 18 per page. Choose **infinite scroll** via IntersectionObserver, and keep
  the total count line ("214 stays in Goa") above the grid.
- Map: `react-leaflet` + OpenStreetMap tiles. Split view — grid left, sticky map right —
  toggled by a "Show map" button. Markers are Rausch price pills; clicking one highlights the
  matching card. If time is tight, a static map with markers satisfies the brief.
- Empty state: "No exact matches. Try changing or removing some filters."

**Done.** Every filter narrows the results correctly and survives a refresh. Category tabs
filter. Infinite scroll loads page 2. Map markers correspond to visible listings. Matches
references `09`–`12`.

---

## PHASE 10 — Listing detail page  *(~3.5h)*

**Why.** The most component-dense page in the product and core feature #2 in full. It's also
where the design system gets its hardest test — the 64px rating display, the amenity list,
the sticky reservation rail.

**References:** `13`–`19`.

**How.** Top to bottom:
1. `h1` in `display-lg` (22px/500 — resist making it bigger), then a utility row with
   Share and Save on the right.
2. **Photo grid:** one large photo left (50%), four in a 2×2 right, 8px gaps, rounded outer
   corners only. A "Show all photos" button bottom-right opens a full-screen gallery modal.
3. Header block: "Entire villa in Goa, India" · guests · bedrooms · beds · baths, then a
   hairline.
4. Host row: avatar, "Hosted by Priya", Superhost badge, years hosting.
5. Highlights (Self check-in, Great location) with icons.
6. Description with a "Show more" that opens a modal.
7. **"What this place offers"** — 2-column amenity grid, 10 shown, "Show all 24 amenities"
   button → modal grouped by category. Unavailable amenities render struck through.
8. Availability calendar — 2 months, blocked dates disabled, selecting a range updates the
   reservation card.
9. **Rating block** — the 64px number flanked by laurel ornaments, "Guest favourite" line,
   then six sub-rating bars (Cleanliness, Accuracy, Check-in, Communication, Location, Value).
   This is the one place the design system shouts. Get it right.
10. Reviews — 2-column grid of 6, "Show all 214 reviews" → modal with pagination.
11. Static map + neighbourhood blurb.
12. Host card, then "Things to know" in three columns (House rules / Safety / Cancellation).
13. **Sticky `<ReservationCard>`** on the right, ~32% width: trip total, date range picker,
    guest stepper, full-width Rausch "Reserve", "You won't be charged yet", and the price
    breakdown with a hairline above the bold total. Every value comes from the quote endpoint.

Split this page into at least eight components. A 900-line `page.tsx` will be marked down
under Code Modularity.

**Done.** Matches references `13`–`19`. Blocked dates are visibly disabled. Changing dates
updates the breakdown from the server. Reservation card sticks on scroll and becomes a bottom
bar under 744px.

---

## PHASE 11 — Booking flow and Trips  *(~2.5h)*

**Why.** Core feature #3, end to end. This is the flow that will be demoed live, so it needs
to work first time with no console errors.

**References:** `20`, `21`, `22`.

**How.**
- Reserve → `/book/stays/{listingId}?check_in=&check_out=&guests=`.
- Checkout page, two columns: left has "Your trip" (dates + guests, both editable inline),
  a mocked payment section (card fields, styled, `disabled`, with a "Payments are mocked for
  this demo" note), and a Rausch "Confirm and pay". Right has a sticky summary card with the
  listing thumbnail, rating and the full breakdown.
- On submit: POST, handle `409 DATES_UNAVAILABLE` gracefully with a toast and a nudge back to
  the listing. On success → `/bookings/{id}/confirmation` with the code, a "You're going to
  Goa!" heading, and a "View trips" button. Fire a success toast.
- `/trips` — Upcoming and Past sections. Upcoming cards show a Cancel action with a confirm
  dialog. Past cards show a "Leave a review" button (bonus; wire it if time allows). Empty
  state per §9 of the design system.

**Done.** Full loop works: search → listing → dates → reserve → confirm → appears in Trips →
those dates are now blocked on the listing → cancel → they're free. Walk it twice.

---

## PHASE 12 — Host experience  *(~2.5h)*

**Why.** Core feature #4. Also the second half of "guest vs host", which the brief calls out
as required.

**References:** `23`, `24`, `25`.

**How.**
- `/hosting` dashboard: a greeting, three stat tiles (active listings, upcoming reservations,
  total earned), and a "Your reservations" table.
- `/hosting/listings`: table/grid of owned listings with thumbnail, title, status, price,
  bookings count, and an actions menu (Edit / Delete / Preview).
- `/hosting/listings/new`: a **multi-step form** styled after Airbnb's become-a-host flow —
  Basics → Location → Photos → Amenities → Title & description → Price → Review. One question
  per step, a progress bar at the bottom, Back/Next. Reuse the same component for `/edit`
  with a `mode` prop and prefilled values. Validate with `zod` + `react-hook-form`.
- Photos by URL is fine per the brief. Show live previews and allow reordering.
- `/hosting/reservations`: bookings across all owned listings, filterable by upcoming/past.
- Delete needs a confirm dialog and a toast.

**Done.** A host can complete the create flow and the listing appears immediately in search.
Edit persists. Delete is guarded. Bookings made by a guest appear on the host's reservations
page.

---

## PHASE 13 — Polish pass  *(~2h)*

**Why.** UI/UX is a graded criterion on its own, and polish is what separates "works" from
"feels like Airbnb". These are all small, all visible, and all cheap at this stage.

**How.**
- Skeleton loaders on every async surface. No spinners, no layout shift.
- Toasts wired for every mutation: saved, booked, cancelled, published, deleted.
- Empty states for trips, wishlists, host listings, zero search results.
- Error boundaries + a styled 404.
- **Responsive sweep at 390 / 744 / 1128 / 1440.** Bottom-bar reservation card on mobile,
  full-screen search overlay on mobile, 1-up cards.
- Accessibility: keyboard-navigable modals with focus trap and Escape-to-close, visible focus
  rings, `alt` text on every photo, `aria-label` on icon-only buttons, `prefers-reduced-motion`
  respected.
- `next/image` everywhere with correct `sizes`, `priority` on the above-fold hero images.
- Sweep the console. Zero errors, zero React key warnings.
- Optional bonus if time remains: dark mode. Skip it if anything above is unfinished — the
  real Airbnb has no dark mode on web, so it earns little.

**Done.** Clean console at every route, both breakpoints, both user roles.

---

## PHASE 14 — README, deploy, submit  *(~2h)*

**Why.** The README is an explicit deliverable and the deployed link is how the app gets
seen at all. A brilliant app with a broken deploy scores like a broken app.

**How — README.** Sections, in order:
1. What this is + the **live link** + a screenshot or GIF right at the top
2. Tech stack and why each piece
3. Setup: backend and frontend, copy-pasteable, including the seed command
4. **Architecture overview** with a diagram (Mermaid) and the reasoning for
   routers/services/models
5. **Database schema** — an ER diagram plus a table-by-table description. Explain the two
   denormalisations (`avg_rating`, price snapshots) — this is where you show judgement.
6. **API overview** — full endpoint table, plus a link to `/docs`
7. Feature checklist mapped to the brief's core features
8. **Assumptions and deliberate simplifications** — mocked auth, mocked payments, the
   category-row decision from §0.4, `create_all` instead of Alembic, hardcoded home-section
   titles. Naming your own shortcuts reads as confidence, not weakness.
9. What I'd build next with more time

**How — deploy.**
- Backend → **Render**. `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. SQLite on a free
  instance has an ephemeral filesystem, so **run the seed on startup if the DB is empty**.
  Better: attach a Render persistent disk and mount the DB there. Test that a redeploy
  doesn't produce an empty app.
- Frontend → **Vercel**. Set `NEXT_PUBLIC_API_URL` to the Render URL. Update backend CORS to
  the Vercel domain — this is the #1 cause of "works locally, dead in prod".
- Render free instances sleep. Add a line to the README: *first load may take ~30s while the
  backend wakes.*
- **Final check: open the deployed link in an incognito window on a phone** and complete a
  booking. Not localhost. Not your logged-in browser.

**Done.** Public repo, working live link, README complete, full booking flow verified in
production.

---

## PHASE 15 — Interview prep  *(~1h, do it before submitting)*

**Why.** "Code Understanding — ability to explain your code during evaluation" is one of the
seven criteria. It is worth as much as the database design. Everything above is wasted if
this step is skipped.

**How.** Write `NOTES_FOR_INTERVIEW.md` (keep it out of the repo) answering:
- Walk me through what happens when a user clicks Reserve. Every layer.
- How do you prevent double bookings? What's the race condition, and where would it still bite?
- Why strict inequalities in the overlap check? Draw the adjacent-booking case.
- Why is `avg_rating` a column instead of a computed aggregate? What's the cost?
- Why snapshot prices onto the booking row?
- Why is search state in the URL rather than React state?
- How would this change if it were Postgres and 10 million listings?
- Which parts are mocked, and what would the real version look like?
- Where's the weakest code in this repo, and what would you fix first?

Then, out loud, walk the whole booking flow through the actual files with them open.
If any file causes a pause, read it properly before submitting.

---

# PART 3 — QUICK REFERENCE

## Phase order and dependencies

```
0 scaffold
└─ 1 models
   └─ 2 seed
      └─ 3 read APIs ──────┬─ 7 shell ─┬─ 8 home + search
         └─ 4 auth ────────┤           ├─ 9 search results
            └─ 5 bookings ─┤           ├─ 10 listing detail
               └─ 6 host ──┘           ├─ 11 booking flow
                                       └─ 12 host UI
                                          └─ 13 polish → 14 ship → 15 prep
```

Phases 3–6 (backend) and 7–8 (frontend shell) can run in parallel by two agents once Phase 2
is done, provided the API contract in §1.3 is treated as frozen.

## The five things most likely to sink this

1. **Availability logic that allows double bookings or blocks adjacent ones.** Test it.
2. **Property cards with a border and a shadow.** Instantly reads as not-Airbnb. §7.3.
3. **Gold stars.** Airbnb's are `#222222`. It's the fastest tell.
4. **CORS / env vars breaking the deploy.** Test in production, incognito, on a phone.
5. **Seed images that 404.** Verify every URL before committing.

## Time budget

| Block | Hours |
|---|---|
| Phases 0–2 (setup, schema, seed) | 4.5 |
| Phases 3–6 (backend) | 8 |
| Phases 7–12 (frontend) | 17 |
| Phases 13–15 (polish, ship, prep) | 5 |

That's ~34 against a 24-hour estimate. Compress by: trimming the seed to 40 listings, doing a
static map instead of Leaflet, making the host create-listing form single-page instead of
multi-step, and skipping all bonus items. **Do not compress Phases 2, 5, 10 or 15** — those
are where the marks are.
