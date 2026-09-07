# REFERENCES_CHECKLIST.md

Your job for this file: capture each screenshot below into `/references/` using the **exact
filename given**. The implementation plan cites these numbers directly ("matches reference
`13`"), so the names have to match or the agents can't follow it.

## Capture settings

- **Browser window 1440px wide**, zoom 100%, on `https://www.airbnb.co.in` (Indian locale —
  INR pricing matches what we're seeding, and that's what your uploaded screenshots show).
- Full-page capture where the shot covers a whole page: Firefox has it built in
  (right-click → Take Screenshot → Save full page). Chrome: `Cmd/Ctrl+Shift+P` in DevTools →
  type "screenshot" → "Capture full size screenshot".
- Log out first for the public views, so you get the "Log in or sign up" state we're cloning.
- PNG. Don't crop unless the item says "closeup".

## Already done ✅

You've given me these four — rename them and drop them in:

| Filename | What it is |
|---|---|
| `01-home-desktop-hero.png` | Homepage top: nav, expanded search bar, "Popular homes in Noida" carousel |
| `02-home-scrolled-compact-search.png` | Scrolled state — search collapsed into the navbar pill |
| `07-login-modal.png` | "Log in or sign up" modal over the Services tab |
| `08-hamburger-menu.png` | Account dropdown: Help Centre / Become a host / Refer a host / Find a co-host |

## Still needed

### Home page + search bar
| # | Filename | How to get it |
|---|---|---|
| 03 | `03-card-closeup.png` | Zoom into 2–3 property cards on the homepage. I need the exact badge position, heart, dot indicators, and the "₹X for 2 nights · ★5.0" line. Crop tight. |
| 04 | `04-search-where-panel.png` | Click "Where" on the homepage search bar → destination suggestions dropdown |
| 05 | `05-search-when-panel.png` | Click "When" → the 2-month calendar. Include the Dates/Months/Flexible tabs. |
| 06 | `06-search-who-panel.png` | Click "Who" → Adults / Children / Infants / Pets steppers |

### Search results
| # | Filename | How to get it |
|---|---|---|
| 09 | `09-search-results-grid.png` | Search "Goa" with any dates → full-page shot of the results grid |
| 10 | `10-search-results-map-split.png` | Same page, click "Show map" → the split grid+map view with price pins |
| 11 | `11-filters-modal.png` | Click "Filters" → the full modal. Scroll and take a second shot as `11b-filters-modal-lower.png` if it doesn't fit. |
| 12 | `12-search-header-strip.png` | Closeup of the row under the nav: the filter/type strip and the results count line |

### Listing detail — the biggest page, take your time
Open any listing from the Goa results. URL will look like
`https://www.airbnb.co.in/rooms/1504887427128416014?check_in=...&check_out=...`

| # | Filename | How to get it |
|---|---|---|
| 13 | `13-listing-full-page.png` | Full-page capture, top to bottom. This is the single most important reference. |
| 14 | `14-listing-photo-grid.png` | Closeup of the 1-large + 4-small photo grid and the "Show all photos" button |
| 15 | `15-listing-gallery-modal.png` | Click "Show all photos" → the full-screen gallery |
| 16 | `16-reservation-card.png` | Closeup of the sticky right-hand card: price, dates, guests, Reserve, fee breakdown |
| 17 | `17-listing-datepicker.png` | Click the dates in the reservation card → the 2-month calendar with **greyed unavailable dates** (important — I need to see how they render disabled dates) |
| 18 | `18-amenities-modal.png` | Click "Show all N amenities" → the grouped modal |
| 19 | `19-rating-and-reviews.png` | The big 64px rating number with the laurels, the six sub-rating bars, and the review grid below |

### Booking flow
| # | Filename | How to get it |
|---|---|---|
| 20 | `20-checkout-page.png` | Click Reserve. **You'll get bounced to login — that's fine, screenshot whatever you reach.** If you have a real account and are willing to log in, the actual `/book/stays/...` page is much more useful. Stop before entering any payment details. |
| 21 | `21-trips-page.png` | `https://www.airbnb.co.in/trips/v1` — logged out shows the empty state, which is also useful |
| 22 | `22-wishlists-page.png` | `https://www.airbnb.co.in/wishlists` |

### Host side
| # | Filename | How to get it |
|---|---|---|
| 23 | `23-become-a-host-landing.png` | `https://www.airbnb.co.in/host/homes` |
| 24 | `24-host-listing-flow-step.png` | Start the flow (click "Airbnb your home") and capture 2–3 steps — the one-question-per-screen layout with the bottom progress bar. Save extras as `24b`, `24c`. |
| 25 | `25-host-dashboard.png` | `https://www.airbnb.co.in/hosting` — logged-out redirect is fine, or search "airbnb host dashboard screenshot" and save a good one as reference |

### Mobile — DevTools device toolbar, iPhone 14 Pro (393px)
| # | Filename | How to get it |
|---|---|---|
| 26 | `26-mobile-home.png` | Homepage at 393px |
| 27 | `27-mobile-search-overlay.png` | Tap the search pill → the full-screen search overlay |
| 28 | `28-mobile-listing-detail.png` | A listing page at 393px — I specifically need the **sticky bottom price bar** |
| 29 | `29-mobile-search-results.png` | Results grid at 393px |

---

## Two extras that are worth five minutes each

**`NOTES.md`** in `/references` — jot down anything you notice that a screenshot won't
capture: hover behaviour, transition speeds, what happens when you click something. Free
information for the agents.

**Computed styles.** Right-click a property card title → Inspect → Computed panel. Screenshot
it as `30-devtools-card-computed.png`. Do the same for the Reserve button
(`31-devtools-reserve-button.png`). This gives us exact font sizes, weights, letter-spacing and
padding straight from the source rather than my estimates. Highest-value five minutes in this
whole list.

---

## What NOT to put in `/references`

Don't save Airbnb's actual photography, illustrated nav icons, or logo files for use *in the
build*. Screenshots as design reference are fine and normal — shipping their assets in our
repo is not. We use Unsplash photos, lucide icons, and our own logo mark.
