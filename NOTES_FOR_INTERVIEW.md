# System Architecture & Technical Interview Notes

> Detailed engineering rationale, concurrency models, data design trade-offs, and scaling considerations for the Airbnb Full-Stack Clone.

---

### Question 1: Walk me through what happens when a user clicks "Confirm and pay".

**Every layer in sequence:**
1. **Frontend State & Validation (`frontend/app/book/[id]/page.tsx`):**
   - User verifies their check-in, check-out, and guest counts.
   - Component initiates `handleConfirmBooking()`. The button enters a loading state (`submitting=true`) to prevent accidental duplicate clicks.
2. **HTTP API Request (`frontend/lib/api.ts`):**
   - Dispatches `POST /api/bookings` with payload `{ listing_id, check_in, check_out, adults, children, infants, pets }`.
   - Injects the `Authorization: Bearer <jwt_token>` header from `localStorage`.
3. **Gateway & Dependency Injection (`backend/app/routers/bookings.py`):**
   - FastAPI matches the route and invokes dependencies:
     - `get_db`: Yields an isolated SQLAlchemy session.
     - `get_current_user`: Decodes the JWT, validates expiration, and retrieves the authenticated `User` record from the DB (401 if missing/invalid).
   - Pydantic validates the request body using `BookingCreateRequest` (ensuring `check_out > check_in`, `adults >= 1`, etc.).
4. **Service Layer & Business Logic (`backend/app/services/booking.py`):**
   - Begins an **atomic database transaction**.
   - Fetches the `Listing` by ID and verifies `is_active == True` and host is not booking their own property.
   - Evaluates guest capacity: `(adults + children) <= listing.max_guests`.
   - Evaluates date conflict against existing non-cancelled bookings and host-blocked calendar dates using the strict overlap check:
     $$\text{check\_in} < \text{new\_checkout} \quad \text{AND} \quad \text{check\_out} > \text{new\_checkin}$$
     If any overlap is found, raises `HTTPException(409, "Selected dates are no longer available")`.
5. **Price Snapshotting & Code Generation:**
   - Computes stay duration in nights.
   - Snapshots prices: `price_per_night = listing.price_per_night`, `cleaning_fee = listing.cleaning_fee`, `service_fee = round(subtotal * 0.14)`, `total_price = subtotal + cleaning + service + tax`.
   - Generates a unique 8-character confirmation code: `HM` + 6 uppercase alphanumeric characters (e.g. `HM8K9P2X`) ensuring zero collision.
6. **Persistence & Commit:**
   - Instantiates `Booking` model and flushes to database within the transaction.
   - Commits transaction (`db.commit()`), releases DB lock, and returns `BookingConfirmation` schema.
7. **Client Feedback:**
   - Next.js receives HTTP 201 response.
   - Displays a success toast: *"Reservation confirmed! Code: HM..."*.
   - Navigates the user to `/trips` where the new booking appears immediately under "Upcoming".

---

### Question 2: How do you prevent double bookings? What is the race condition, and where would it bite?

**The Race Condition:**
If two users simultaneously attempt to book the same property for overlapping dates (e.g. within 50ms of each other):
- Without transaction isolation, Thread A checks availability and sees 0 conflicting bookings.
- Concurrently, Thread B checks availability before Thread A commits, and also sees 0 conflicting bookings.
- Thread A inserts its booking and commits.
- Thread B inserts its booking and commits.
- **Result:** Catastrophic double booking.

**How we protect against it here:**
- Availability check and booking insertion occur within the **same atomic database transaction**.
- In SQLite, the engine transitions from a shared read lock to an exclusive write lock during a transaction.
- On PostgreSQL in production, we would use:
  1. **Row-level locking (`SELECT ... FOR UPDATE`):**
     `SELECT id FROM listings WHERE id = :listing_id FOR UPDATE;`
     This serializes all booking attempts on that specific listing row until the active transaction finishes.
  2. **Exclusion Constraints (Postgres GiST):**
     ```sql
     ALTER TABLE bookings ADD CONSTRAINT no_overlapping_bookings
     EXCLUDE USING gist (
       listing_id WITH =,
       daterange(check_in, check_out, '[)') WITH &&
     ) WHERE (status != 'CANCELLED');
     ```
     This forces the database engine to reject overlapping date ranges at the B-tree/GiST index level, making double bookings physically impossible regardless of application concurrency.

---

### Question 3: Why strict inequalities in the overlap check? Draw the adjacent-booking case.

In hotel and holiday rental systems, checkout is typically 10:00 AM or 11:00 AM, while check-in is 2:00 PM or 3:00 PM on the same date. Therefore, **the check-out day of Booking A can be the exact check-in day of Booking B**.

**The Condition:**
```python
existing.check_in < new.check_out AND existing.check_out > new.check_in
```

**Scenario: Guest A stays Nov 5 to Nov 10. Guest B wants Nov 10 to Nov 15.**
- Existing check-in: Nov 5
- Existing check-out: Nov 10
- New check-in: Nov 10
- New check-out: Nov 15

Check condition 1: `existing.check_in < new.check_out` -> `Nov 5 < Nov 15` (TRUE)
Check condition 2: `existing.check_out > new.check_in` -> `Nov 10 > Nov 10` (**FALSE**)

Since condition 2 is **FALSE**, there is **NO CONFLICT**. The booking is allowed!

If we had mistakenly used `<=` and `>=`, `Nov 10 >= Nov 10` would evaluate to TRUE, falsely blocking adjacent back-to-back reservations.

---

### Question 4: Why is `avg_rating` a denormalized column on `Listing` instead of a computed aggregate? What is the cost?

**The Trade-Off:**
- **Normalized Approach:** `SELECT AVG(rating) FROM reviews WHERE listing_id = :id;`
  - *Cost:* When a user visits the homepage or searches with filters (e.g. "Beachfront", price under ₹10,000, 4.8+ stars), computing aggregates across reviews for hundreds of candidate listings requires massive table scans and joins. This destroys search latency at scale.
- **Denormalized Approach:** Store `avg_rating` and `review_count` directly as columns on `listings`.
  - *Benefit:* Querying listings with `WHERE avg_rating >= 4.8 ORDER BY avg_rating DESC LIMIT 20` is an instantaneous `O(1)` index scan.
  - *Write Cost:* Whenever a guest submits a new review, the application must run a transactional calculation updating both `avg_rating = (total_score + new_score) / (count + 1)` and `review_count = count + 1`.

---

### Question 5: Why snapshot prices onto the booking row?

Properties do not have static pricing:
- A host charges ₹5,000/night in off-season, then raises rates to ₹18,000/night for New Year's Eve.
- A host increases their cleaning fee from ₹500 to ₹1,500.

If a booking merely stored foreign keys and computed `nights * listing.price_per_night` dynamically on read:
1. Past trips would change prices retroactively whenever hosts edit their listings.
2. Invoices and financial accounting would desynchronize from actual payment captures.
3. Chargebacks and dispute resolution would have no immutable source of truth.

**Snapshotting captures the exact agreed price contract at the moment of reservation.**

---

### Question 6: Why is search state in the URL rather than React state?

All search parameters (`category`, `location`, `check_in`, `check_out`, `guests`, `min_price`, `max_price`) synchronize with the URL query parameters (`/listings?location=Goa&guests=2`):
1. **Shareability:** A user can copy and paste the URL to a partner or travel companion on WhatsApp and they will see the exact same filtered results.
2. **Browser History:** Back and Forward buttons navigate search states naturally without losing filters.
3. **Bookmarking & Reloading:** Hard-refreshing the page preserves all search filters instead of resetting to defaults.
4. **Server-Side Rendering (SSR) & SEO:** Next.js can pre-render search query pages for search engine crawlers.

---

### Question 7: How would this architecture scale to PostgreSQL and 10 million listings?

1. **Database Partitioning & PostGIS:**
   - Replace scalar `latitude`/`longitude` with PostGIS `GEOMETRY(Point, 4326)`.
   - Use spatial `R-Tree` indexing for lightning-fast bounding-box viewport queries (`ST_DWithin` / `ST_MakeEnvelope`).
   - Partition listings and bookings tables horizontally by geographic country/region (e.g. `listings_in`, `listings_us`).
2. **Distributed Caching (Redis):**
   - Cache popular location autocomplete queries, category listings, and static metadata in Redis with 10-minute TTLs.
   - Use Redis Bitmaps or HyperLogLog for real-time listing view counts.
3. **Availability Calendar via Inverted Index / Bitmap:**
   - For 10 million listings, querying date intervals across all rows is heavy.
   - Maintain a 365-day availability bitmap per listing in memory/Redis (where `1 = available`, `0 = booked`). A date search across a 4-night stay reduces to a bitwise `AND` operation across 4 bits.
4. **Read Replicas & Connection Pooling:**
   - Point 95% of traffic (search, room details, reviews) to read replicas via PgBouncer.
   - Reserve primary master DB strictly for write mutations (bookings, host creations).

---

### Question 8: Which parts are mocked, and what would the real version look like?

| Component | Current Mocked Implementation | Production Real-World Implementation |
|---|---|---|
| **Authentication** | Demo User Switcher issuing signed JWTs without password verification. | Supabase / Auth0 / Clerk with SMS OTP, OAuth 2.0 (Google/Apple), email magic links, and Argon2 password hashing. |
| **Payment Gateway** | Instant confirmation setting status to `CONFIRMED`. | Stripe Connect or Razorpay. Create payment intent, client renders Stripe Elements, listen to asynchronous webhook (`payment_intent.succeeded`) before confirming reservation. |
| **Image Storage** | Unsplash web URLs. | Direct-to-S3 pre-signed URLs with Cloudflare CDN, WebP image optimization pipeline via Sharp, and AWS Rekognition for moderation. |
| **Calendar Sync** | Internal `BlockedDate` model. | iCal (`.ics`) bi-directional feed synchronization with Google Calendar, Airbnb, and Booking.com via Celery background workers. |

---

### Question 9: Where is the technical debt or weakest code in this repo, and what would you fix first?

1. **SQLite Database Concurrency:**
   - SQLite uses file-level locking for writes. Under high write throughput, concurrent booking attempts can encounter database lock timeouts. Migrating to PostgreSQL with a migration framework (Alembic) is the highest-priority infrastructure upgrade.
2. **Static Category Icons:**
   - Categories and amenities currently rely on a predefined set of Lucide icon identifiers. In a full production system, icons would be served as CDN SVG assets linked dynamically in the CMS.
3. **Automated End-to-End Testing:**
   - While backend unit and integration tests are comprehensive (29/29 pytest cases covering all edge cases), adding Playwright automated browser E2E tests for the full reservation and checkout flow would provide end-to-end regression safety.
