--
-- PostgreSQL database dump
--

\restrict 4xCAELFwOpo9IcZL2vBZgM8DhQIaBRPg8wLdwvcGSW4BKhl9h35tV0qE09gO5Ga

-- Dumped from database version 16.13 (Homebrew)
-- Dumped by pg_dump version 16.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_role_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_booking_id_fkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_author_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listings DROP CONSTRAINT IF EXISTS listings_host_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listing_photos DROP CONSTRAINT IF EXISTS listing_photos_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listing_categories DROP CONSTRAINT IF EXISTS listing_categories_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listing_categories DROP CONSTRAINT IF EXISTS listing_categories_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listing_amenities DROP CONSTRAINT IF EXISTS listing_amenities_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.listing_amenities DROP CONSTRAINT IF EXISTS listing_amenities_amenity_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_listing_id_fkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_guest_id_fkey;
ALTER TABLE IF EXISTS ONLY public.blocked_dates DROP CONSTRAINT IF EXISTS blocked_dates_listing_id_fkey;
DROP INDEX IF EXISTS public.ix_users_email;
DROP INDEX IF EXISTS public.ix_roles_name;
DROP INDEX IF EXISTS public.ix_listing_photos_listing_id;
DROP INDEX IF EXISTS public.ix_categories_slug;
DROP INDEX IF EXISTS public.ix_bookings_confirmation_code;
DROP INDEX IF EXISTS public.idx_reviews_listing;
DROP INDEX IF EXISTS public.idx_listings_price;
DROP INDEX IF EXISTS public.idx_listings_host;
DROP INDEX IF EXISTS public.idx_listings_city;
DROP INDEX IF EXISTS public.idx_bookings_listing_dates;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS wishlist_items_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.wishlist_items DROP CONSTRAINT IF EXISTS uq_wishlist_user_listing;
ALTER TABLE IF EXISTS ONLY public.blocked_dates DROP CONSTRAINT IF EXISTS uq_blocked_listing_date;
ALTER TABLE IF EXISTS ONLY public.roles DROP CONSTRAINT IF EXISTS roles_pkey;
ALTER TABLE IF EXISTS ONLY public.reviews DROP CONSTRAINT IF EXISTS reviews_pkey;
ALTER TABLE IF EXISTS ONLY public.listings DROP CONSTRAINT IF EXISTS listings_pkey;
ALTER TABLE IF EXISTS ONLY public.listing_photos DROP CONSTRAINT IF EXISTS listing_photos_pkey;
ALTER TABLE IF EXISTS ONLY public.listing_categories DROP CONSTRAINT IF EXISTS listing_categories_pkey;
ALTER TABLE IF EXISTS ONLY public.listing_amenities DROP CONSTRAINT IF EXISTS listing_amenities_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
ALTER TABLE IF EXISTS ONLY public.bookings DROP CONSTRAINT IF EXISTS bookings_pkey;
ALTER TABLE IF EXISTS ONLY public.blocked_dates DROP CONSTRAINT IF EXISTS blocked_dates_pkey;
ALTER TABLE IF EXISTS ONLY public.amenities DROP CONSTRAINT IF EXISTS amenities_pkey;
ALTER TABLE IF EXISTS public.wishlist_items ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.roles ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.reviews ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.listings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.listing_photos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.categories ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.bookings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blocked_dates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.amenities ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.wishlist_items_id_seq;
DROP TABLE IF EXISTS public.wishlist_items;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_roles;
DROP SEQUENCE IF EXISTS public.roles_id_seq;
DROP TABLE IF EXISTS public.roles;
DROP SEQUENCE IF EXISTS public.reviews_id_seq;
DROP TABLE IF EXISTS public.reviews;
DROP SEQUENCE IF EXISTS public.listings_id_seq;
DROP TABLE IF EXISTS public.listings;
DROP SEQUENCE IF EXISTS public.listing_photos_id_seq;
DROP TABLE IF EXISTS public.listing_photos;
DROP TABLE IF EXISTS public.listing_categories;
DROP TABLE IF EXISTS public.listing_amenities;
DROP SEQUENCE IF EXISTS public.categories_id_seq;
DROP TABLE IF EXISTS public.categories;
DROP SEQUENCE IF EXISTS public.bookings_id_seq;
DROP TABLE IF EXISTS public.bookings;
DROP SEQUENCE IF EXISTS public.blocked_dates_id_seq;
DROP TABLE IF EXISTS public.blocked_dates;
DROP SEQUENCE IF EXISTS public.amenities_id_seq;
DROP TABLE IF EXISTS public.amenities;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.amenities (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    icon_key character varying(100) NOT NULL,
    category character varying(50) NOT NULL
);


--
-- Name: amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.amenities_id_seq OWNED BY public.amenities.id;


--
-- Name: blocked_dates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocked_dates (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    date date NOT NULL
);


--
-- Name: blocked_dates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blocked_dates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blocked_dates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blocked_dates_id_seq OWNED BY public.blocked_dates.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    confirmation_code character varying(32) NOT NULL,
    listing_id integer NOT NULL,
    guest_id integer NOT NULL,
    check_in date NOT NULL,
    check_out date NOT NULL,
    adults integer NOT NULL,
    children integer NOT NULL,
    infants integer NOT NULL,
    pets integer NOT NULL,
    nights integer NOT NULL,
    nightly_rate integer NOT NULL,
    cleaning_fee integer NOT NULL,
    service_fee integer NOT NULL,
    taxes integer NOT NULL,
    total_price integer NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    icon_key character varying(100) NOT NULL
);


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: listing_amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_amenities (
    listing_id integer NOT NULL,
    amenity_id integer NOT NULL
);


--
-- Name: listing_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_categories (
    listing_id integer NOT NULL,
    category_id integer NOT NULL
);


--
-- Name: listing_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_photos (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    url character varying(1000) NOT NULL,
    caption character varying(255),
    "position" integer NOT NULL
);


--
-- Name: listing_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listing_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: listing_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listing_photos_id_seq OWNED BY public.listing_photos.id;


--
-- Name: listings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    host_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    property_type character varying(50) NOT NULL,
    room_type character varying(50) NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    country character varying(100) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    price_per_night integer NOT NULL,
    cleaning_fee integer NOT NULL,
    max_guests integer NOT NULL,
    bedrooms integer NOT NULL,
    beds integer NOT NULL,
    bathrooms double precision NOT NULL,
    is_guest_favorite boolean NOT NULL,
    is_active boolean NOT NULL,
    avg_rating double precision NOT NULL,
    review_count integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    listing_id integer NOT NULL,
    author_id integer NOT NULL,
    booking_id integer,
    rating integer NOT NULL,
    cleanliness integer NOT NULL,
    accuracy integer NOT NULL,
    check_in_rating integer NOT NULL,
    communication integer NOT NULL,
    location_rating integer NOT NULL,
    value_rating integer NOT NULL,
    comment text NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(255)
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    user_id integer NOT NULL,
    role_id integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    hashed_password character varying(255),
    avatar_url character varying(500),
    is_host boolean NOT NULL,
    is_superhost boolean NOT NULL,
    bio text,
    joined_at timestamp without time zone NOT NULL,
    response_rate integer,
    created_at timestamp without time zone NOT NULL,
    role character varying(50) DEFAULT 'traveller'::character varying NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wishlist_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlist_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    listing_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlist_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlist_items_id_seq OWNED BY public.wishlist_items.id;


--
-- Name: amenities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities ALTER COLUMN id SET DEFAULT nextval('public.amenities_id_seq'::regclass);


--
-- Name: blocked_dates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_dates ALTER COLUMN id SET DEFAULT nextval('public.blocked_dates_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: listing_photos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_photos ALTER COLUMN id SET DEFAULT nextval('public.listing_photos_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wishlist_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items ALTER COLUMN id SET DEFAULT nextval('public.wishlist_items_id_seq'::regclass);


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.amenities (id, name, icon_key, category) FROM stdin;
1	Fast wifi	wifi	essentials
2	Air conditioning	wind	essentials
3	Dedicated workspace	briefcase	essentials
4	Washing machine	disc	essentials
5	Geyser / Hot water	flame	essentials
6	Iron	shirt	essentials
7	Hair dryer	wind	essentials
8	Bed linens	bed-double	essentials
9	Hangers	tag	essentials
10	Extra pillows and blankets	layers	essentials
11	Kitchen	utensils	kitchen
12	Refrigerator	refrigerator	kitchen
13	Microwave	microwave	kitchen
14	Cooking basics (pots, pans, oil)	soup	kitchen
15	Dishes and silverware	utensils-crossed	kitchen
16	Coffee maker	coffee	kitchen
17	Induction stove	flame	kitchen
18	Private swimming pool	waves	features
19	Free parking on premises	car	features
20	55 inch HDTV with Netflix	tv	features
21	Private patio or balcony	sun	features
22	Lush private garden	trees	features
23	Outdoor dining area	table	features
24	BBQ grill	flame	features
25	Beach access	umbrella	features
26	Pet friendly	paw-print	features
27	Smoke alarm	bell	safety
28	First aid kit	cross	safety
29	Fire extinguisher	shield-alert	safety
30	CCTV on property exterior	video	safety
\.


--
-- Data for Name: blocked_dates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocked_dates (id, listing_id, date) FROM stdin;
1	3	2026-09-27
2	3	2026-09-28
3	3	2026-09-29
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (id, confirmation_code, listing_id, guest_id, check_in, check_out, adults, children, infants, pets, nights, nightly_rate, cleaning_fee, service_fee, taxes, total_price, status, created_at) FROM stdin;
1	HM001302R	1	9	2026-09-11	2026-09-14	2	0	0	0	3	18500	1500	7770	2850	67620	confirmed	2026-09-07 13:49:12.665742
2	HM002947R	1	10	2026-09-19	2026-09-22	2	0	0	0	3	18500	1500	7770	2850	67620	confirmed	2026-09-07 13:49:12.665744
3	HM003799R	2	8	2026-09-12	2026-09-15	2	0	0	0	3	4680	500	1966	727	17233	confirmed	2026-09-07 13:49:12.665744
4	HM004618R	3	9	2026-09-14	2026-09-17	2	0	0	0	3	3200	400	1344	500	11844	confirmed	2026-09-07 13:49:12.665744
5	HM005841R	6	10	2026-06-07	2026-06-10	1	0	0	0	3	15000	1200	6300	2310	54810	completed	2026-09-07 13:49:12.665745
6	HM006470R	7	8	2026-06-26	2026-06-29	1	0	0	0	3	5500	600	2310	855	20265	completed	2026-09-07 13:49:12.665745
7	HM007614R	8	9	2026-05-28	2026-05-31	1	0	0	0	3	8900	800	3738	1375	32613	completed	2026-09-07 13:49:12.665745
8	HM008635R	9	10	2026-03-22	2026-03-25	4	0	0	0	3	14500	1100	6090	2230	52920	completed	2026-09-07 13:49:12.665746
9	HM009319R	10	8	2026-08-25	2026-08-28	3	0	0	0	3	3900	400	1638	605	14343	completed	2026-09-07 13:49:12.665746
10	HM010997R	11	9	2026-04-02	2026-04-05	1	0	0	0	3	3700	400	1554	575	13629	completed	2026-09-07 13:49:12.665746
11	HM011116R	12	10	2026-04-20	2026-04-23	2	0	0	0	3	4200	450	1764	652	15466	completed	2026-09-07 13:49:12.665746
12	HM012773R	13	8	2026-05-26	2026-05-29	2	0	0	0	3	3100	350	1302	482	11434	completed	2026-09-07 13:49:12.665747
13	HM013162R	14	9	2026-04-01	2026-04-04	1	0	0	0	3	11500	1000	4830	1775	42105	completed	2026-09-07 13:49:12.665747
14	HM014125R	15	10	2026-04-13	2026-04-16	2	0	0	0	3	2200	300	924	345	8169	completed	2026-09-07 13:49:12.665747
15	HM015700R	16	8	2026-07-16	2026-07-19	4	0	0	0	3	3400	400	1428	530	12558	completed	2026-09-07 13:49:12.665748
16	HM016965R	17	9	2026-03-08	2026-03-11	2	0	0	0	3	5800	600	2436	900	21336	completed	2026-09-07 13:49:12.665748
17	HM017621R	18	10	2026-05-21	2026-05-24	3	0	0	0	3	4100	450	1722	638	15110	completed	2026-09-07 13:49:12.665748
18	HM018718R	19	8	2026-08-02	2026-08-05	1	0	0	0	3	5100	500	2142	790	18732	completed	2026-09-07 13:49:12.665748
19	HM019817R	20	9	2026-08-18	2026-08-21	1	0	0	0	3	5900	600	2478	915	21693	completed	2026-09-07 13:49:12.665749
20	HM020412R	21	10	2026-05-18	2026-05-21	3	0	0	0	3	16500	1500	6930	2550	60480	completed	2026-09-07 13:49:12.665749
21	HM021729R	22	8	2026-06-28	2026-07-01	4	0	0	0	3	8500	800	3570	1315	31185	completed	2026-09-07 13:49:12.665749
22	HM022922R	23	9	2026-07-14	2026-07-17	3	0	0	0	3	6200	600	2604	960	22764	completed	2026-09-07 13:49:12.66575
23	HM023898R	24	10	2026-06-04	2026-06-07	4	0	0	0	3	4500	500	1890	700	16590	completed	2026-09-07 13:49:12.66575
24	HM024908R	25	8	2026-05-18	2026-05-21	2	0	0	0	3	11200	1000	4704	1730	41034	completed	2026-09-07 13:49:12.66575
25	HM025847R	26	9	2026-05-13	2026-05-16	1	0	0	0	3	4800	500	2016	745	17661	completed	2026-09-07 13:49:12.665751
26	HM026420R	27	10	2026-08-24	2026-08-27	3	0	0	0	3	4900	500	2058	760	18018	completed	2026-09-07 13:49:12.665751
27	HM027216R	28	8	2026-08-13	2026-08-16	2	0	0	0	3	7050	700	2961	1092	25903	completed	2026-09-07 13:49:12.665751
28	HM028829R	29	9	2026-05-16	2026-05-19	2	0	0	0	3	7399	700	3108	1145	27150	completed	2026-09-07 13:49:12.665752
29	HM029631R	30	10	2026-03-17	2026-03-20	1	0	0	0	3	3998	400	1679	620	14693	completed	2026-09-07 13:49:12.665752
30	HM030223R	31	8	2026-04-15	2026-04-18	3	0	0	0	3	9634	900	4046	1490	35338	completed	2026-09-07 13:49:12.665752
31	HM031790R	32	9	2026-05-04	2026-05-07	1	0	0	0	3	8522	800	3579	1318	31263	completed	2026-09-07 13:49:12.665752
32	HM032894R	33	10	2026-06-06	2026-06-09	4	0	0	0	3	6400	600	2688	990	23478	completed	2026-09-07 13:49:12.665753
33	HM033352R	34	8	2026-06-19	2026-06-22	3	0	0	0	3	4200	400	1764	650	15414	completed	2026-09-07 13:49:12.665753
34	HM034766R	35	9	2026-06-05	2026-06-08	3	0	0	0	3	4800	500	2016	745	17661	completed	2026-09-07 13:49:12.665753
35	HM035132R	36	10	2026-06-11	2026-06-14	3	0	0	0	3	3600	400	1512	560	13272	completed	2026-09-07 13:49:12.665753
36	HM036958R	37	8	2026-03-12	2026-03-15	1	0	0	0	3	5541	500	2327	856	20306	completed	2026-09-07 13:49:12.665754
37	HM037428R	38	9	2026-08-20	2026-08-23	3	0	0	0	3	7200	600	3024	1110	26334	completed	2026-09-07 13:49:12.665754
38	HM038446R	39	10	2026-04-27	2026-04-30	2	0	0	0	3	2950	350	1239	460	10899	completed	2026-09-07 13:49:12.665754
39	HM039354R	40	8	2026-08-13	2026-08-16	4	0	0	0	3	3300	400	1386	515	12201	completed	2026-09-07 13:49:12.665755
40	HM040117R	41	9	2026-08-20	2026-08-23	2	0	0	0	3	8900	800	3738	1375	32613	completed	2026-09-07 13:49:12.665755
41	HMNDGNWC	11	7	2026-09-10	2026-09-13	1	0	0	0	3	3700	400	1554	575	13629	confirmed	2026-09-07 16:05:42.697789
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, icon_key) FROM stdin;
1	Beachfront	beachfront	waves
2	Cabins	cabins	home
3	Amazing views	amazing-views	mountain
4	Tiny homes	tiny-homes	tent
5	Trending	trending	flame
6	Rooms	rooms	bed
7	Farms	farms	tractor
8	Lakefront	lakefront	anchor
9	Design	design	palette
10	Mansions	mansions	castle
\.


--
-- Data for Name: listing_amenities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listing_amenities (listing_id, amenity_id) FROM stdin;
5	27
7	27
10	27
11	27
13	27
14	27
19	27
21	27
22	27
27	27
28	27
30	27
33	27
34	27
36	27
38	27
39	27
40	27
41	27
45	27
46	27
49	27
52	27
53	27
55	27
60	27
65	27
67	27
68	27
2	6
5	6
6	6
8	6
10	6
12	6
13	6
17	6
18	6
19	6
20	6
22	6
23	6
26	6
28	6
31	6
32	6
34	6
35	6
37	6
41	6
42	6
46	6
47	6
48	6
49	6
55	6
56	6
57	6
61	6
62	6
65	6
66	6
1	8
6	8
7	8
9	8
10	8
11	8
15	8
17	8
18	8
19	8
22	8
23	8
25	8
26	8
31	8
32	8
34	8
37	8
38	8
40	8
42	8
44	8
46	8
47	8
48	8
51	8
52	8
56	8
61	8
63	8
64	8
65	8
66	8
67	8
4	13
5	13
7	13
10	13
11	13
12	13
13	13
14	13
18	13
20	13
22	13
23	13
27	13
29	13
33	13
34	13
35	13
36	13
37	13
38	13
42	13
43	13
44	13
45	13
46	13
48	13
51	13
52	13
54	13
55	13
59	13
61	13
65	13
66	13
67	13
68	13
1	22
3	22
5	22
7	22
13	22
15	22
18	22
22	22
24	22
26	22
29	22
32	22
39	22
40	22
44	22
45	22
46	22
49	22
52	22
54	22
55	22
57	22
58	22
59	22
60	22
64	22
66	22
67	22
3	28
4	28
6	28
8	28
9	28
13	28
15	28
16	28
23	28
26	28
31	28
32	28
33	28
34	28
40	28
41	28
42	28
43	28
44	28
46	28
48	28
49	28
50	28
53	28
57	28
59	28
60	28
63	28
67	28
68	28
5	29
7	29
8	29
11	29
13	29
16	29
20	29
21	29
22	29
25	29
26	29
29	29
30	29
31	29
32	29
34	29
37	29
40	29
42	29
44	29
45	29
47	29
48	29
49	29
50	29
53	29
54	29
56	29
58	29
62	29
63	29
64	29
66	29
68	29
1	21
2	21
6	21
7	21
8	21
9	21
11	21
13	21
14	21
15	21
17	21
19	21
25	21
26	21
27	21
28	21
29	21
30	21
36	21
38	21
39	21
43	21
50	21
51	21
54	21
58	21
61	21
63	21
64	21
67	21
68	21
2	23
4	23
6	23
7	23
9	23
11	23
12	23
14	23
16	23
17	23
18	23
19	23
20	23
21	23
22	23
23	23
24	23
28	23
29	23
30	23
33	23
35	23
36	23
42	23
43	23
52	23
55	23
61	23
62	23
64	23
66	23
1	30
2	30
3	30
6	30
7	30
8	30
10	30
11	30
12	30
13	30
14	30
18	30
19	30
25	30
26	30
28	30
29	30
31	30
38	30
43	30
44	30
54	30
56	30
58	30
59	30
63	30
65	30
67	30
68	30
1	17
2	17
3	17
10	17
15	17
16	17
18	17
19	17
21	17
22	17
25	17
27	17
30	17
31	17
33	17
35	17
36	17
39	17
40	17
41	17
42	17
43	17
44	17
47	17
48	17
49	17
50	17
58	17
60	17
61	17
68	17
1	12
2	12
6	12
8	12
12	12
13	12
14	12
15	12
18	12
19	12
21	12
23	12
24	12
25	12
27	12
28	12
32	12
34	12
37	12
41	12
44	12
45	12
46	12
47	12
50	12
51	12
53	12
57	12
60	12
61	12
64	12
66	12
68	12
4	10
5	10
7	10
16	10
26	10
28	10
31	10
32	10
35	10
36	10
37	10
38	10
40	10
42	10
49	10
50	10
53	10
59	10
60	10
61	10
63	10
65	10
67	10
2	1
5	1
8	1
9	1
13	1
14	1
15	1
16	1
17	1
18	1
19	1
21	1
24	1
26	1
28	1
29	1
30	1
32	1
33	1
35	1
37	1
39	1
44	1
45	1
47	1
49	1
51	1
53	1
56	1
57	1
58	1
60	1
61	1
62	1
65	1
66	1
2	20
4	20
5	20
9	20
11	20
16	20
20	20
21	20
24	20
25	20
27	20
28	20
33	20
35	20
37	20
38	20
39	20
42	20
46	20
50	20
52	20
53	20
55	20
57	20
58	20
60	20
63	20
65	20
66	20
68	20
2	7
3	7
5	7
8	7
14	7
15	7
16	7
17	7
19	7
20	7
22	7
27	7
30	7
31	7
32	7
33	7
34	7
35	7
36	7
37	7
39	7
44	7
48	7
49	7
50	7
51	7
52	7
53	7
59	7
60	7
64	7
66	7
1	15
2	15
3	15
4	15
5	15
9	15
11	15
14	15
16	15
18	15
22	15
26	15
29	15
33	15
35	15
38	15
41	15
44	15
47	15
48	15
51	15
55	15
56	15
59	15
62	15
67	15
1	18
2	18
3	18
4	18
5	18
7	18
10	18
11	18
12	18
19	18
21	18
24	18
25	18
27	18
28	18
29	18
32	18
34	18
36	18
40	18
41	18
43	18
46	18
47	18
48	18
51	18
52	18
54	18
63	18
64	18
68	18
1	3
10	3
11	3
12	3
14	3
16	3
17	3
18	3
20	3
24	3
25	3
31	3
33	3
34	3
36	3
37	3
39	3
40	3
41	3
45	3
46	3
47	3
49	3
52	3
53	3
58	3
60	3
62	3
63	3
64	3
65	3
66	3
68	3
1	14
2	14
5	14
7	14
9	14
10	14
12	14
14	14
15	14
18	14
24	14
26	14
28	14
29	14
30	14
31	14
32	14
33	14
38	14
39	14
45	14
46	14
48	14
49	14
51	14
52	14
54	14
55	14
57	14
64	14
4	24
7	24
15	24
16	24
18	24
22	24
24	24
27	24
28	24
30	24
31	24
35	24
36	24
37	24
40	24
43	24
45	24
49	24
51	24
54	24
57	24
58	24
59	24
61	24
62	24
63	24
65	24
67	24
5	4
7	4
10	4
12	4
14	4
15	4
19	4
27	4
29	4
32	4
34	4
38	4
40	4
41	4
44	4
45	4
46	4
48	4
51	4
53	4
56	4
58	4
59	4
61	4
64	4
66	4
3	11
4	11
6	11
11	11
14	11
17	11
20	11
23	11
26	11
33	11
36	11
39	11
45	11
46	11
50	11
52	11
53	11
56	11
59	11
61	11
67	11
2	19
3	19
6	19
11	19
13	19
17	19
19	19
22	19
23	19
24	19
27	19
28	19
30	19
33	19
35	19
37	19
38	19
39	19
41	19
42	19
45	19
46	19
50	19
56	19
57	19
58	19
59	19
60	19
61	19
62	19
63	19
64	19
66	19
68	19
1	2
2	2
7	2
10	2
12	2
15	2
18	2
20	2
21	2
22	2
23	2
25	2
26	2
31	2
33	2
34	2
36	2
37	2
39	2
44	2
51	2
53	2
54	2
59	2
61	2
63	2
67	2
68	2
1	9
5	9
8	9
10	9
13	9
14	9
15	9
16	9
17	9
18	9
20	9
21	9
24	9
26	9
29	9
30	9
34	9
38	9
39	9
41	9
43	9
44	9
45	9
48	9
52	9
53	9
54	9
56	9
57	9
58	9
61	9
63	9
64	9
66	9
68	9
3	25
4	25
8	25
10	25
11	25
12	25
17	25
18	25
20	25
27	25
28	25
31	25
32	25
37	25
38	25
39	25
40	25
51	25
53	25
54	25
55	25
57	25
59	25
61	25
62	25
63	25
64	25
65	25
66	25
6	5
7	5
9	5
10	5
14	5
15	5
16	5
20	5
22	5
24	5
27	5
31	5
32	5
35	5
37	5
38	5
39	5
43	5
46	5
48	5
51	5
52	5
55	5
56	5
57	5
60	5
62	5
64	5
67	5
68	5
1	16
3	16
4	16
6	16
9	16
11	16
13	16
15	16
16	16
17	16
26	16
28	16
29	16
33	16
35	16
37	16
38	16
40	16
42	16
44	16
47	16
48	16
50	16
52	16
53	16
55	16
56	16
58	16
59	16
60	16
1	26
2	26
3	26
4	26
5	26
7	26
8	26
13	26
14	26
16	26
17	26
20	26
23	26
26	26
27	26
30	26
33	26
34	26
35	26
40	26
42	26
43	26
48	26
49	26
52	26
53	26
56	26
58	26
60	26
62	26
66	26
74	6
74	1
74	3
74	5
74	2
74	30
75	5
75	3
75	1
75	2
75	6
\.


--
-- Data for Name: listing_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listing_categories (listing_id, category_id) FROM stdin;
1	1
2	1
3	1
4	1
5	1
6	1
7	1
8	1
9	1
10	1
14	9
41	9
45	2
46	2
47	2
48	2
49	2
50	2
51	2
52	2
45	3
46	3
47	3
48	3
49	3
50	3
51	3
52	3
14	10
41	10
11	6
12	6
13	6
15	6
16	6
17	6
18	6
19	6
20	6
21	6
22	6
23	6
24	6
25	6
26	6
27	6
28	6
29	6
30	6
31	6
32	6
33	6
34	6
35	6
36	6
37	6
38	6
39	6
40	6
42	6
43	6
44	6
53	6
54	6
55	6
56	6
57	6
58	6
59	6
60	6
61	6
62	6
63	6
64	6
65	6
66	6
67	6
68	6
1	5
2	5
3	5
4	5
5	5
6	5
7	5
8	5
9	5
10	5
11	5
12	5
13	5
15	5
16	5
17	5
18	5
19	5
20	5
21	5
22	5
23	5
24	5
25	5
26	5
27	5
28	5
29	5
30	5
31	5
32	5
33	5
34	5
35	5
36	5
37	5
38	5
39	5
40	5
42	5
43	5
44	5
53	5
54	5
55	5
56	5
57	5
58	5
59	5
60	5
61	5
62	5
63	5
64	5
65	5
66	5
67	5
68	5
74	2
74	1
75	1
75	2
\.


--
-- Data for Name: listing_photos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listing_photos (id, listing_id, url, caption, "position") FROM stdin;
1	1	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Cover photo	0
2	1	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 1	1
3	1	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 2	2
4	1	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Interior view 3	3
5	1	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Interior view 4	4
6	2	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Cover photo	0
7	2	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 1	1
8	2	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Interior view 2	2
9	2	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Interior view 3	3
10	2	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Interior view 4	4
11	3	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Cover photo	0
12	3	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 1	1
13	3	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Interior view 2	2
14	3	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 3	3
15	3	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Interior view 4	4
16	4	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Cover photo	0
17	4	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 1	1
18	4	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Interior view 2	2
19	4	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Interior view 3	3
20	4	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Interior view 4	4
21	4	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Interior view 5	5
22	5	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Cover photo	0
23	5	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 1	1
24	5	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 2	2
25	5	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Interior view 3	3
26	5	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80	Interior view 4	4
27	6	https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80	Cover photo	0
28	6	https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80	Interior view 1	1
29	6	https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80	Interior view 2	2
30	6	https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80	Interior view 3	3
31	6	https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80	Interior view 4	4
32	6	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80	Interior view 5	5
33	7	https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80	Cover photo	0
34	7	https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80	Interior view 1	1
35	7	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80	Interior view 2	2
36	7	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80	Interior view 3	3
37	7	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80	Interior view 4	4
38	7	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80	Interior view 5	5
39	8	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80	Cover photo	0
40	8	https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80	Interior view 1	1
41	8	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80	Interior view 2	2
42	8	https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80	Interior view 3	3
43	8	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80	Interior view 4	4
44	8	https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80	Interior view 5	5
45	8	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80	Interior view 6	6
46	9	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80	Cover photo	0
47	9	https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80	Interior view 1	1
48	9	https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80	Interior view 2	2
49	9	https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80	Interior view 3	3
50	9	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80	Interior view 4	4
51	9	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80	Interior view 5	5
52	10	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80	Cover photo	0
53	10	https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80	Interior view 1	1
54	10	https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80	Interior view 2	2
55	10	https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80	Interior view 3	3
56	10	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80	Interior view 4	4
57	10	https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80	Interior view 5	5
58	11	https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80	Cover photo	0
59	11	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80	Interior view 1	1
60	11	https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80	Interior view 2	2
61	11	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80	Interior view 3	3
62	11	https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80	Interior view 4	4
63	11	https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80	Interior view 5	5
64	12	https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80	Cover photo	0
65	12	https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80	Interior view 1	1
66	12	https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80	Interior view 2	2
67	12	https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80	Interior view 3	3
68	12	https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80	Interior view 4	4
69	12	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80	Interior view 5	5
70	12	https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80	Interior view 6	6
71	13	https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&q=80	Cover photo	0
72	13	https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=80	Interior view 1	1
73	13	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80	Interior view 2	2
74	13	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80	Interior view 3	3
75	13	https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80	Interior view 4	4
76	14	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80	Cover photo	0
77	14	https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80	Interior view 1	1
78	14	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Interior view 2	2
79	14	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 3	3
80	14	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 4	4
81	14	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Interior view 5	5
82	15	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Cover photo	0
83	15	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Interior view 1	1
84	15	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 2	2
85	15	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Interior view 3	3
86	15	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Interior view 4	4
87	16	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Cover photo	0
88	16	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Interior view 1	1
89	16	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 2	2
90	16	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Interior view 3	3
91	16	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 4	4
92	17	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Cover photo	0
93	17	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Interior view 1	1
94	17	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 2	2
95	17	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Interior view 3	3
96	17	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Interior view 4	4
97	17	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Interior view 5	5
98	18	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Cover photo	0
99	18	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Interior view 1	1
100	18	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 2	2
101	18	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 3	3
102	18	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Interior view 4	4
103	18	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80	Interior view 5	5
104	18	https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80	Interior view 6	6
105	19	https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80	Cover photo	0
106	19	https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80	Interior view 1	1
107	19	https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80	Interior view 2	2
108	19	https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80	Interior view 3	3
109	19	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80	Interior view 4	4
110	20	https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80	Cover photo	0
111	20	https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80	Interior view 1	1
112	20	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80	Interior view 2	2
113	20	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80	Interior view 3	3
114	20	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80	Interior view 4	4
115	21	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80	Cover photo	0
116	21	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80	Interior view 1	1
117	21	https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80	Interior view 2	2
118	21	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80	Interior view 3	3
119	21	https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80	Interior view 4	4
120	21	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80	Interior view 5	5
121	22	https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80	Cover photo	0
122	22	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80	Interior view 1	1
123	22	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80	Interior view 2	2
124	22	https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80	Interior view 3	3
125	22	https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80	Interior view 4	4
126	22	https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80	Interior view 5	5
127	22	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80	Interior view 6	6
128	23	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80	Cover photo	0
129	23	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80	Interior view 1	1
130	23	https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80	Interior view 2	2
131	23	https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80	Interior view 3	3
132	23	https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80	Interior view 4	4
133	23	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80	Interior view 5	5
134	23	https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80	Interior view 6	6
135	24	https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80	Cover photo	0
136	24	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80	Interior view 1	1
137	24	https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80	Interior view 2	2
138	24	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80	Interior view 3	3
139	24	https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80	Interior view 4	4
140	24	https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80	Interior view 5	5
141	25	https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80	Cover photo	0
142	25	https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80	Interior view 1	1
143	25	https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80	Interior view 2	2
144	25	https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80	Interior view 3	3
145	25	https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80	Interior view 4	4
146	25	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80	Interior view 5	5
147	25	https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80	Interior view 6	6
148	26	https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&q=80	Cover photo	0
149	26	https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=80	Interior view 1	1
150	26	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80	Interior view 2	2
151	26	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80	Interior view 3	3
152	26	https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80	Interior view 4	4
153	26	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80	Interior view 5	5
154	26	https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80	Interior view 6	6
155	27	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Cover photo	0
156	27	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 1	1
157	27	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 2	2
158	27	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Interior view 3	3
159	27	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Interior view 4	4
160	27	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Interior view 5	5
161	27	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 6	6
162	28	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Cover photo	0
163	28	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Interior view 1	1
164	28	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Interior view 2	2
165	28	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Interior view 3	3
166	28	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 4	4
167	29	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Cover photo	0
168	29	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 1	1
169	29	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Interior view 2	2
170	29	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Interior view 3	3
171	29	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 4	4
172	29	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Interior view 5	5
173	30	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Cover photo	0
174	30	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Interior view 1	1
175	30	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Interior view 2	2
176	30	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Interior view 3	3
177	30	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 4	4
178	30	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 5	5
179	31	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Cover photo	0
180	31	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80	Interior view 1	1
181	31	https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80	Interior view 2	2
182	31	https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80	Interior view 3	3
183	31	https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80	Interior view 4	4
184	31	https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80	Interior view 5	5
185	31	https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80	Interior view 6	6
186	32	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80	Cover photo	0
187	32	https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80	Interior view 1	1
188	32	https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80	Interior view 2	2
189	32	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80	Interior view 3	3
190	32	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80	Interior view 4	4
191	32	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80	Interior view 5	5
192	33	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80	Cover photo	0
193	33	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80	Interior view 1	1
194	33	https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80	Interior view 2	2
195	33	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80	Interior view 3	3
196	33	https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80	Interior view 4	4
197	33	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80	Interior view 5	5
198	34	https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80	Cover photo	0
199	34	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80	Interior view 1	1
200	34	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80	Interior view 2	2
201	34	https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80	Interior view 3	3
202	34	https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80	Interior view 4	4
203	34	https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80	Interior view 5	5
204	34	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80	Interior view 6	6
205	35	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80	Cover photo	0
206	35	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80	Interior view 1	1
207	35	https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80	Interior view 2	2
208	35	https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80	Interior view 3	3
209	35	https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80	Interior view 4	4
210	35	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80	Interior view 5	5
211	35	https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80	Interior view 6	6
212	36	https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80	Cover photo	0
213	36	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80	Interior view 1	1
214	36	https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80	Interior view 2	2
215	36	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80	Interior view 3	3
216	36	https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80	Interior view 4	4
217	37	https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80	Cover photo	0
218	37	https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80	Interior view 1	1
219	37	https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80	Interior view 2	2
220	37	https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80	Interior view 3	3
221	37	https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80	Interior view 4	4
222	38	https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80	Cover photo	0
223	38	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80	Interior view 1	1
224	38	https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80	Interior view 2	2
225	38	https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&q=80	Interior view 3	3
226	38	https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=80	Interior view 4	4
227	38	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80	Interior view 5	5
228	38	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80	Interior view 6	6
229	39	https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80	Cover photo	0
230	39	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80	Interior view 1	1
231	39	https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80	Interior view 2	2
232	39	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Interior view 3	3
233	39	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 4	4
234	39	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 5	5
235	39	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Interior view 6	6
236	40	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Cover photo	0
237	40	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Interior view 1	1
238	40	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 2	2
239	40	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Interior view 3	3
240	40	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Interior view 4	4
241	40	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Interior view 5	5
242	41	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Cover photo	0
243	41	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 1	1
244	41	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Interior view 2	2
245	41	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 3	3
246	41	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Interior view 4	4
247	41	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Interior view 5	5
248	41	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 6	6
249	42	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Cover photo	0
250	42	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Interior view 1	1
251	42	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Interior view 2	2
252	42	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Interior view 3	3
253	42	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Interior view 4	4
254	42	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 5	5
255	42	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 6	6
256	43	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Cover photo	0
257	43	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80	Interior view 1	1
258	43	https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80	Interior view 2	2
259	43	https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80	Interior view 3	3
260	43	https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80	Interior view 4	4
261	44	https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80	Cover photo	0
262	44	https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80	Interior view 1	1
263	44	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80	Interior view 2	2
264	44	https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80	Interior view 3	3
265	44	https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80	Interior view 4	4
266	45	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80	Cover photo	0
267	45	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80	Interior view 1	1
268	45	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80	Interior view 2	2
269	45	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80	Interior view 3	3
270	45	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80	Interior view 4	4
271	46	https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80	Cover photo	0
272	46	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80	Interior view 1	1
273	46	https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80	Interior view 2	2
274	46	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80	Interior view 3	3
275	46	https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80	Interior view 4	4
276	46	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80	Interior view 5	5
277	47	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80	Cover photo	0
278	47	https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80	Interior view 1	1
279	47	https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80	Interior view 2	2
280	47	https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80	Interior view 3	3
281	47	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80	Interior view 4	4
282	48	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80	Cover photo	0
283	48	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80	Interior view 1	1
284	48	https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80	Interior view 2	2
285	48	https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80	Interior view 3	3
286	48	https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80	Interior view 4	4
287	48	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80	Interior view 5	5
288	48	https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80	Interior view 6	6
289	49	https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80	Cover photo	0
290	49	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80	Interior view 1	1
291	49	https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80	Interior view 2	2
292	49	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80	Interior view 3	3
293	49	https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80	Interior view 4	4
294	49	https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80	Interior view 5	5
295	50	https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80	Cover photo	0
296	50	https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80	Interior view 1	1
297	50	https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80	Interior view 2	2
298	50	https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80	Interior view 3	3
299	50	https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80	Interior view 4	4
300	51	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80	Cover photo	0
301	51	https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80	Interior view 1	1
302	51	https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&q=80	Interior view 2	2
303	51	https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=80	Interior view 3	3
304	51	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80	Interior view 4	4
305	51	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80	Interior view 5	5
306	51	https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80	Interior view 6	6
307	52	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80	Cover photo	0
308	52	https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80	Interior view 1	1
309	52	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Interior view 2	2
310	52	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 3	3
311	52	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 4	4
312	53	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Cover photo	0
313	53	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Interior view 1	1
314	53	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Interior view 2	2
315	53	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 3	3
316	53	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Interior view 4	4
317	54	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Cover photo	0
318	54	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Interior view 1	1
319	54	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Interior view 2	2
320	54	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 3	3
321	54	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Interior view 4	4
322	54	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 5	5
323	55	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Cover photo	0
324	55	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Interior view 1	1
325	55	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 2	2
326	55	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Interior view 3	3
327	55	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Interior view 4	4
328	55	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Interior view 5	5
329	56	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Cover photo	0
330	56	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Interior view 1	1
331	56	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 2	2
332	56	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 3	3
333	56	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Interior view 4	4
334	56	https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80	Interior view 5	5
335	57	https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80	Cover photo	0
336	57	https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1200&q=80	Interior view 1	1
337	57	https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=1200&q=80	Interior view 2	2
338	57	https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80	Interior view 3	3
339	57	https://images.unsplash.com/photo-1501183638710-841dd1904471?w=1200&q=80	Interior view 4	4
340	57	https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80	Interior view 5	5
341	57	https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80	Interior view 6	6
342	58	https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&q=80	Cover photo	0
343	58	https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80	Interior view 1	1
344	58	https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80	Interior view 2	2
345	58	https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80	Interior view 3	3
346	58	https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80	Interior view 4	4
347	58	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80	Interior view 5	5
348	59	https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80	Cover photo	0
349	59	https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80	Interior view 1	1
350	59	https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80	Interior view 2	2
351	59	https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80	Interior view 3	3
352	59	https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&q=80	Interior view 4	4
353	59	https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80	Interior view 5	5
354	60	https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80	Cover photo	0
355	60	https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80	Interior view 1	1
356	60	https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&q=80	Interior view 2	2
357	60	https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=1200&q=80	Interior view 3	3
358	60	https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80	Interior view 4	4
359	60	https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80	Interior view 5	5
360	61	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80	Cover photo	0
361	61	https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80	Interior view 1	1
362	61	https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1200&q=80	Interior view 2	2
363	61	https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80	Interior view 3	3
364	61	https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80	Interior view 4	4
365	61	https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=1200&q=80	Interior view 5	5
366	62	https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80	Cover photo	0
367	62	https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80	Interior view 1	1
368	62	https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80	Interior view 2	2
369	62	https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80	Interior view 3	3
370	62	https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1200&q=80	Interior view 4	4
371	62	https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&q=80	Interior view 5	5
372	62	https://images.unsplash.com/photo-1615873968403-89e068629265?w=1200&q=80	Interior view 6	6
373	63	https://images.unsplash.com/photo-1615529182904-14819c35db37?w=1200&q=80	Cover photo	0
374	63	https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=1200&q=80	Interior view 1	1
375	63	https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=1200&q=80	Interior view 2	2
376	63	https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80	Interior view 3	3
377	63	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80	Interior view 4	4
378	63	https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80	Interior view 5	5
379	63	https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&q=80	Interior view 6	6
380	64	https://images.unsplash.com/photo-1560448075-bb485b067938?w=1200&q=80	Cover photo	0
381	64	https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&q=80	Interior view 1	1
382	64	https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80	Interior view 2	2
383	64	https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=1200&q=80	Interior view 3	3
384	64	https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80	Interior view 4	4
385	64	https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80	Interior view 5	5
386	65	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80	Cover photo	0
387	65	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80	Interior view 1	1
388	65	https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80	Interior view 2	2
389	65	https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=80	Interior view 3	3
390	65	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80	Interior view 4	4
391	66	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80	Cover photo	0
392	66	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80	Interior view 1	1
393	66	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80	Interior view 2	2
394	66	https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80	Interior view 3	3
395	66	https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80	Interior view 4	4
396	66	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80	Interior view 5	5
397	66	https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80	Interior view 6	6
398	67	https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80	Cover photo	0
399	67	https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80	Interior view 1	1
400	67	https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80	Interior view 2	2
401	67	https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=80	Interior view 3	3
402	67	https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&q=80	Interior view 4	4
403	67	https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80	Interior view 5	5
404	67	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80	Interior view 6	6
405	68	https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&q=80	Cover photo	0
406	68	https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80	Interior view 1	1
407	68	https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80	Interior view 2	2
408	68	https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=80	Interior view 3	3
409	68	https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80	Interior view 4	4
410	68	https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=1200&q=80	Interior view 5	5
421	74	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80	\N	0
422	74	https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80	\N	1
423	74	https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80	\N	2
424	75	https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80	\N	0
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listings (id, host_id, title, description, property_type, room_type, address, city, state, country, latitude, longitude, price_per_night, cleaning_fee, max_guests, bedrooms, beds, bathrooms, is_guest_favorite, is_active, avg_rating, review_count, created_at, updated_at) FROM stdin;
2	2	Flat in Anjuna	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Anjuna, Goa.	flat	entire	Anjuna Enclave, Road 2	Goa	Goa	India	15.567	73.726	4680	500	4	2	2	2	t	t	4.71	14	2026-09-07 13:49:12.63659	2026-09-07 13:49:12.668591
3	1	Flat in Calangute	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Calangute, Goa.	flat	entire	Calangute Enclave, Road 3	Goa	Goa	India	15.574	73.732	3200	400	4	1	2	1	f	t	4.57	14	2026-09-07 13:49:12.63659	2026-09-07 13:49:12.668734
4	2	Villa in Assagao	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Assagao, Goa.	villa	entire	Assagao Enclave, Road 4	Goa	Goa	India	15.581	73.738	22000	1800	6	3	3	3.5	t	t	4.69	13	2026-09-07 13:49:12.636591	2026-09-07 13:49:12.668857
5	1	Villa in Nerul	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Nerul, Goa.	villa	entire	Nerul Enclave, Road 5	Goa	Goa	India	15.588	73.744	16310	1200	6	3	3	3	t	t	5	12	2026-09-07 13:49:12.636591	2026-09-07 13:49:12.668976
6	2	Villa in Arpora	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Arpora, Goa.	villa	entire	Arpora Enclave, Road 6	Goa	Goa	India	15.595	73.75	15000	1200	6	3	3	3	f	t	4.92	12	2026-09-07 13:49:12.636592	2026-09-07 13:49:12.669096
7	1	Flat in Candolim	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Candolim, Goa.	flat	entire	Candolim Enclave, Road 7	Goa	Goa	India	15.602	73.756	5500	600	4	2	2	2	f	t	4.7	10	2026-09-07 13:49:12.636592	2026-09-07 13:49:12.669232
8	2	Cottage in Morjim	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Morjim, Goa.	cottage	entire	Morjim Enclave, Road 8	Goa	Goa	India	15.609	73.762	8900	800	4	2	2	2	t	t	4.86	14	2026-09-07 13:49:12.636592	2026-09-07 13:49:12.669396
9	1	Villa in Siolim	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Siolim, Goa.	villa	entire	Siolim Enclave, Road 9	Goa	Goa	India	15.616	73.768	14500	1100	6	3	4	3	t	t	4.75	8	2026-09-07 13:49:12.636593	2026-09-07 13:49:12.669523
10	2	Flat in Baga	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Baga, Goa.	flat	entire	Baga Enclave, Road 10	Goa	Goa	India	15.623	73.774	3900	400	3	1	2	1	f	t	4.86	14	2026-09-07 13:49:12.636593	2026-09-07 13:49:12.66964
11	3	Flat in Sector 63	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 63, Noida.	flat	entire	Sector 63 Enclave, Road 1	Noida	Uttar Pradesh	India	28.51	77.37	3700	400	3	1	2	1	t	t	5	15	2026-09-07 13:49:12.636594	2026-09-07 13:49:12.669751
12	3	Flat in Sector 62	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 62, Noida.	flat	entire	Sector 62 Enclave, Road 2	Noida	Uttar Pradesh	India	28.517	77.376	4200	450	4	2	2	2	f	t	4.7	10	2026-09-07 13:49:12.636594	2026-09-07 13:49:12.669865
13	3	Flat in Sector 137	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 137, Noida.	flat	entire	Sector 137 Enclave, Road 3	Noida	Uttar Pradesh	India	28.524	77.382	3100	350	2	1	1	1	f	t	4.71	14	2026-09-07 13:49:12.636594	2026-09-07 13:49:12.669988
14	3	Villa in Sector 150	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 150, Noida.	villa	entire	Sector 150 Enclave, Road 4	Noida	Uttar Pradesh	India	28.531	77.388	11500	1000	6	3	3	3	t	t	4.67	12	2026-09-07 13:49:12.636595	2026-09-07 13:49:12.67011
15	3	Room in Sector 18	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 18, Noida.	room	private	Sector 18 Enclave, Road 5	Noida	Uttar Pradesh	India	28.538	77.394	2200	300	2	1	1	1	f	t	4.58	12	2026-09-07 13:49:12.636595	2026-09-07 13:49:12.670237
16	3	Flat in Sector 78	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 78, Noida.	flat	entire	Sector 78 Enclave, Road 6	Noida	Uttar Pradesh	India	28.545	77.4	3400	400	4	2	2	2	f	t	5	1	2026-09-07 13:49:12.636596	2026-09-07 13:49:12.670348
17	3	Flat in Sector 93A	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Sector 93A, Noida.	flat	entire	Sector 93A Enclave, Road 7	Noida	Uttar Pradesh	India	28.552	77.406	5800	600	5	3	3	2.5	t	t	4.5	2	2026-09-07 13:49:12.636596	2026-09-07 13:49:12.670459
18	3	Flat in Expressway	Sleek, minimalist urban apartment featuring high-speed 300 Mbps fiber wifi, dedicated ergonomic work desk, modern kitchen appliances, and 24/7 security. Located in peaceful Expressway, Noida.	flat	entire	Expressway Enclave, Road 8	Noida	Uttar Pradesh	India	28.559	77.412	4100	450	4	2	2	2	f	t	5	2	2026-09-07 13:49:12.636596	2026-09-07 13:49:12.670571
19	3	Flat in Hauz Khas	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Hauz Khas, New Delhi.	flat	entire	Hauz Khas Enclave, Road 1	New Delhi	Delhi	India	28.59	77.18	5100	500	4	2	2	2	t	t	5	4	2026-09-07 13:49:12.636597	2026-09-07 13:49:12.670681
20	7	Flat in Greater Kailash	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Greater Kailash, New Delhi.	flat	entire	Greater Kailash Enclave, Road 2	New Delhi	Delhi	India	28.597	77.186	5900	600	4	2	2	2	t	t	5	1	2026-09-07 13:49:12.636597	2026-09-07 13:49:12.670793
21	3	Bungalow in Defence Colony	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Defence Colony, New Delhi.	bungalow	entire	Defence Colony Enclave, Road 3	New Delhi	Delhi	India	28.604	77.192	16500	1500	8	4	4	4	t	t	5	2	2026-09-07 13:49:12.636597	2026-09-07 13:49:12.670912
22	7	Flat in Vasant Vihar	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Vasant Vihar, New Delhi.	flat	entire	Vasant Vihar Enclave, Road 4	New Delhi	Delhi	India	28.611	77.198	8500	800	5	3	3	3	f	t	4.5	2	2026-09-07 13:49:12.636598	2026-09-07 13:49:12.671032
23	3	Flat in Connaught Place	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Connaught Place, New Delhi.	flat	entire	Connaught Place Enclave, Road 5	New Delhi	Delhi	India	28.618	77.204	6200	600	3	1	2	1.5	f	t	4	1	2026-09-07 13:49:12.636598	2026-09-07 13:49:12.671152
24	7	Flat in Saket	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Saket, New Delhi.	flat	entire	Saket Enclave, Road 6	New Delhi	Delhi	India	28.625	77.21	4500	500	4	2	2	2	f	t	4.33	3	2026-09-07 13:49:12.636599	2026-09-07 13:49:12.671274
25	3	Flat in Chanakyapuri	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Chanakyapuri, New Delhi.	flat	entire	Chanakyapuri Enclave, Road 7	New Delhi	Delhi	India	28.632	77.216	11200	1000	4	2	2	2.5	t	t	4.5	4	2026-09-07 13:49:12.636599	2026-09-07 13:49:12.671385
26	7	Flat in South Extension	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful South Extension, New Delhi.	flat	entire	South Extension Enclave, Road 8	New Delhi	Delhi	India	28.639	77.222	4800	500	4	2	2	2	f	t	5	4	2026-09-07 13:49:12.636599	2026-09-07 13:49:12.6715
27	3	Flat in Green Park	Sunlit architectural home in an upscale leafy neighborhood. Features curated vintage decor, quiet courtyard balconies, and effortless transit access. Located in peaceful Green Park, New Delhi.	flat	entire	Green Park Enclave, Road 9	New Delhi	Delhi	India	28.646	77.228	4900	500	3	1	2	1	f	t	5	3	2026-09-07 13:49:12.6366	2026-09-07 13:49:12.671608
28	7	Flat in DLF Phase 5	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful DLF Phase 5, Gurugram.	flat	entire	DLF Phase 5 Enclave, Road 1	Gurugram	Haryana	India	28.43	77	7050	700	4	2	2	2	t	t	4	1	2026-09-07 13:49:12.6366	2026-09-07 13:49:12.671715
29	7	Home in Sector 45	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Sector 45, Gurugram.	home	entire	Sector 45 Enclave, Road 2	Gurugram	Haryana	India	28.437	77.006	7399	700	5	3	3	2.5	t	t	5	2	2026-09-07 13:49:12.6366	2026-09-07 13:49:12.671832
30	7	Flat in Sector 51	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Sector 51, Gurugram.	flat	entire	Sector 51 Enclave, Road 3	Gurugram	Haryana	India	28.444	77.012	3998	400	3	1	2	1	f	t	5	1	2026-09-07 13:49:12.636601	2026-09-07 13:49:12.671949
31	7	Flat in Golf Course Road	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Golf Course Road, Gurugram.	flat	entire	Golf Course Road Enclave, Road 4	Gurugram	Haryana	India	28.451	77.018	9634	900	4	2	2	2.5	t	t	4.5	2	2026-09-07 13:49:12.636601	2026-09-07 13:49:12.672077
32	7	Flat in Cyber City	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Cyber City, Gurugram.	flat	entire	Cyber City Enclave, Road 5	Gurugram	Haryana	India	28.458	77.024	8522	800	4	2	2	2	f	t	4.67	3	2026-09-07 13:49:12.636602	2026-09-07 13:49:12.672198
33	7	Flat in DLF Phase 2	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful DLF Phase 2, Gurugram.	flat	entire	DLF Phase 2 Enclave, Road 6	Gurugram	Haryana	India	28.465	77.03	6400	600	4	2	2	2	f	t	4.5	4	2026-09-07 13:49:12.636602	2026-09-07 13:49:12.672319
34	7	Flat in Sohna Road	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Sohna Road, Gurugram.	flat	entire	Sohna Road Enclave, Road 7	Gurugram	Haryana	India	28.472	77.036	4200	400	4	2	2	2	f	t	5	1	2026-09-07 13:49:12.636602	2026-09-07 13:49:12.672431
35	7	Flat in Sector 29	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Sector 29, Gurugram.	flat	entire	Sector 29 Enclave, Road 8	Gurugram	Haryana	India	28.479	77.042	4800	500	3	1	1	1	f	t	5	3	2026-09-07 13:49:12.636603	2026-09-07 13:49:12.672556
36	7	Flat in Sector 57	Premium executive stay with panoramic skyline vistas, designer Italian furnishings, state-of-the-art entertainment setup, and covered parking. Located in peaceful Sector 57, Gurugram.	flat	entire	Sector 57 Enclave, Road 9	Gurugram	Haryana	India	28.486	77.048	3600	400	3	1	2	1	f	t	4.33	3	2026-09-07 13:49:12.636603	2026-09-07 13:49:12.672678
37	6	Home in Rajpur Road	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Rajpur Road, Dehradun.	home	entire	Rajpur Road Enclave, Road 1	Dehradun	Uttarakhand	India	30.29	78.01	5541	500	5	3	3	2.5	t	t	4.5	4	2026-09-07 13:49:12.636603	2026-09-07 13:49:12.672786
38	6	Cottage in Mussoorie Foothills	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Mussoorie Foothills, Dehradun.	cottage	entire	Mussoorie Foothills Enclave, Road 2	Dehradun	Uttarakhand	India	30.297	78.016	7200	600	4	2	2	2	t	t	5	4	2026-09-07 13:49:12.636604	2026-09-07 13:49:12.672897
39	6	Flat in Amwala Manjhala	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Amwala Manjhala, Dehradun.	flat	entire	Amwala Manjhala Enclave, Road 3	Dehradun	Uttarakhand	India	30.304	78.022	2950	350	4	2	2	2	f	t	5	3	2026-09-07 13:49:12.636604	2026-09-07 13:49:12.673017
40	6	Home in Clement Town	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Clement Town, Dehradun.	home	entire	Clement Town Enclave, Road 4	Dehradun	Uttarakhand	India	30.311	78.028	3300	400	4	2	2	2	f	t	4.67	3	2026-09-07 13:49:12.636605	2026-09-07 13:49:12.673134
41	6	Villa in Sahastradhara	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Sahastradhara, Dehradun.	villa	entire	Sahastradhara Enclave, Road 5	Dehradun	Uttarakhand	India	30.318	78.034	8900	800	6	3	3	3	t	t	4.67	3	2026-09-07 13:49:12.636605	2026-09-07 13:49:12.673253
42	6	Home in Dalanwala	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Dalanwala, Dehradun.	home	entire	Dalanwala Enclave, Road 6	Dehradun	Uttarakhand	India	30.325	78.04	4600	500	4	2	2	2	f	t	4.75	4	2026-09-07 13:49:12.636605	2026-09-07 13:49:12.673361
43	6	Flat in Jakhan	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Jakhan, Dehradun.	flat	entire	Jakhan Enclave, Road 7	Dehradun	Uttarakhand	India	30.332	78.046	3400	400	3	1	2	1	f	t	5	2	2026-09-07 13:49:12.636606	2026-09-07 13:49:12.673483
44	6	Flat in Chakrata Road	Tranquil hill retreat overlooking pine ridges and seasonal streams. Crisp mountain air, floor-to-ceiling glass windows, and spacious outdoor seating. Located in peaceful Chakrata Road, Dehradun.	flat	entire	Chakrata Road Enclave, Road 8	Dehradun	Uttarakhand	India	30.339	78.052	2800	300	3	1	2	1	f	t	4.75	4	2026-09-07 13:49:12.636606	2026-09-07 13:49:12.673588
45	4	Cottage in Old Manali	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Old Manali, Manali.	cottage	entire	Old Manali Enclave, Road 1	Manali	Himachal Pradesh	India	32.22	77.16	4800	500	4	2	2	2	t	t	5	2	2026-09-07 13:49:12.636606	2026-09-07 13:49:12.673707
46	4	Cabin in Log Huts Area	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Log Huts Area, Manali.	cabin	entire	Log Huts Area Enclave, Road 2	Manali	Himachal Pradesh	India	32.227	77.166	6500	600	4	2	2	2	t	t	5	4	2026-09-07 13:49:12.636607	2026-09-07 13:49:12.673834
47	4	Home in Vashisht	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Vashisht, Manali.	home	entire	Vashisht Enclave, Road 3	Manali	Himachal Pradesh	India	32.234	77.172	3200	350	3	1	2	1	f	t	5	3	2026-09-07 13:49:12.636607	2026-09-07 13:49:12.673943
48	4	Cottage in Naggar	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Naggar, Manali.	cottage	entire	Naggar Enclave, Road 4	Manali	Himachal Pradesh	India	32.241	77.178	5200	500	4	2	2	2	t	t	5	1	2026-09-07 13:49:12.636607	2026-09-07 13:49:12.674065
49	4	Flat in Aleo	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Aleo, Manali.	flat	entire	Aleo Enclave, Road 5	Manali	Himachal Pradesh	India	32.248	77.184	2900	300	3	1	2	1	f	t	5	2	2026-09-07 13:49:12.636608	2026-09-07 13:49:12.674193
50	4	Chalet in Solang Valley	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Solang Valley, Manali.	chalet	entire	Solang Valley Enclave, Road 6	Manali	Himachal Pradesh	India	32.255	77.19	8900	800	6	3	3	3	t	t	4.75	4	2026-09-07 13:49:12.636608	2026-09-07 13:49:12.674316
51	4	Cottage in Prini	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Prini, Manali.	cottage	entire	Prini Enclave, Road 7	Manali	Himachal Pradesh	India	32.262	77.196	4100	400	4	2	2	1.5	f	t	5	1	2026-09-07 13:49:12.636609	2026-09-07 13:49:12.674422
52	4	Cabin in Simsa	Authentic deodar wood mountain cabin with wood-burning fireplace, panoramic Himalayan snow peaks views, and direct access to alpine hiking trails. Located in peaceful Simsa, Manali.	cabin	entire	Simsa Enclave, Road 8	Manali	Himachal Pradesh	India	32.269	77.202	3800	400	3	1	1	1	f	t	4	1	2026-09-07 13:49:12.636609	2026-09-07 13:49:12.674532
53	5	Bungalow in Civil Lines	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Civil Lines, Jaipur.	bungalow	entire	Civil Lines Enclave, Road 1	Jaipur	Rajasthan	India	26.89	75.76	9500	900	6	3	3	3	t	t	4.75	4	2026-09-07 13:49:12.636609	2026-09-07 13:49:12.674648
54	5	Flat in C-Scheme	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful C-Scheme, Jaipur.	flat	entire	C-Scheme Enclave, Road 2	Jaipur	Rajasthan	India	26.897	75.766	4200	450	4	2	2	2	t	t	4.75	4	2026-09-07 13:49:12.63661	2026-09-07 13:49:12.67476
55	5	Home in Bani Park	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Bani Park, Jaipur.	home	entire	Bani Park Enclave, Road 3	Jaipur	Rajasthan	India	26.904	75.772	3800	400	4	2	2	2	f	t	5	1	2026-09-07 13:49:12.63661	2026-09-07 13:49:12.674878
56	5	Haveli in Amer Road	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Amer Road, Jaipur.	haveli	entire	Amer Road Enclave, Road 4	Jaipur	Rajasthan	India	26.911	75.778	14500	1400	8	4	4	4	t	t	4.67	3	2026-09-07 13:49:12.63661	2026-09-07 13:49:12.674994
57	5	Flat in Mansarovar	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Mansarovar, Jaipur.	flat	entire	Mansarovar Enclave, Road 5	Jaipur	Rajasthan	India	26.918	75.784	2600	300	3	1	2	1	f	t	5	1	2026-09-07 13:49:12.636611	2026-09-07 13:49:12.675116
58	5	Flat in Malviya Nagar	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Malviya Nagar, Jaipur.	flat	entire	Malviya Nagar Enclave, Road 6	Jaipur	Rajasthan	India	26.925	75.79	3400	350	4	2	2	2	f	t	4	2	2026-09-07 13:49:12.636611	2026-09-07 13:49:12.675235
59	5	Home in Vaishali Nagar	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Vaishali Nagar, Jaipur.	home	entire	Vaishali Nagar Enclave, Road 7	Jaipur	Rajasthan	India	26.932	75.796	4900	500	5	3	3	2.5	f	t	5	2	2026-09-07 13:49:12.636611	2026-09-07 13:49:12.675344
60	5	Flat in Raja Park	Restored heritage residence blending traditional Rajasthani courtyard architecture with modern comforts, handcrafted textiles, and private rooftop stargazing. Located in peaceful Raja Park, Jaipur.	flat	entire	Raja Park Enclave, Road 8	Jaipur	Rajasthan	India	26.939	75.802	3600	400	4	2	2	2	f	t	4	1	2026-09-07 13:49:12.636612	2026-09-07 13:49:12.675458
61	1	Flat in Bandra West	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Bandra West, Mumbai.	flat	entire	Bandra West Enclave, Road 1	Mumbai	Maharashtra	India	19.05	72.85	9800	900	4	2	2	2	t	t	4.75	4	2026-09-07 13:49:12.636612	2026-09-07 13:49:12.675576
62	7	Flat in Juhu	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Juhu, Mumbai.	flat	entire	Juhu Enclave, Road 2	Mumbai	Maharashtra	India	19.057	72.856	12500	1200	5	2	3	2.5	t	t	4.25	4	2026-09-07 13:49:12.636613	2026-09-07 13:49:12.675694
63	1	Flat in Khar	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Khar, Mumbai.	flat	entire	Khar Enclave, Road 3	Mumbai	Maharashtra	India	19.064	72.862	8400	800	3	1	2	1.5	f	t	5	1	2026-09-07 13:49:12.636613	2026-09-07 13:49:12.675818
64	7	Flat in Colaba	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Colaba, Mumbai.	flat	entire	Colaba Enclave, Road 4	Mumbai	Maharashtra	India	19.071	72.868	7600	700	3	1	2	1	t	t	5	2	2026-09-07 13:49:12.636613	2026-09-07 13:49:12.675925
65	1	Flat in Powai	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Powai, Mumbai.	flat	entire	Powai Enclave, Road 5	Mumbai	Maharashtra	India	19.078	72.874	6200	600	4	2	2	2	f	t	5	3	2026-09-07 13:49:12.636614	2026-09-07 13:49:12.676048
66	7	Flat in Versova	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Versova, Mumbai.	flat	entire	Versova Enclave, Road 6	Mumbai	Maharashtra	India	19.085	72.88	6900	700	4	2	2	2	f	t	5	4	2026-09-07 13:49:12.636614	2026-09-07 13:49:12.676167
67	1	Flat in Santacruz	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Santacruz, Mumbai.	flat	entire	Santacruz Enclave, Road 7	Mumbai	Maharashtra	India	19.092	72.886	5800	550	3	1	2	1	f	t	4.25	4	2026-09-07 13:49:12.636614	2026-09-07 13:49:12.676283
68	7	Flat in Lower Parel	Sophisticated seaside apartment in a prime cultural hub. Stroll to charming bakeries, art galleries, and scenic coastal promenades. Located in peaceful Lower Parel, Mumbai.	flat	entire	Lower Parel Enclave, Road 8	Mumbai	Maharashtra	India	19.099	72.892	10500	1000	4	2	2	2	t	t	5	1	2026-09-07 13:49:12.636615	2026-09-07 13:49:12.67639
1	1	Villa in Vagator	Peaceful sanctuary with sun-drenched verandas, private pool access, and tranquil coastal breezes. Just minutes from renowned local bistros and secluded sandy beaches. Located in peaceful Vagator, Goa.	villa	entire	Vagator Enclave, Road 1	Goa	Goa	India	15.56	73.72	18500	1500	8	4	4	4	t	t	4.79	14	2026-09-07 13:49:12.636588	2026-09-08 03:39:18.357079
74	1	Come and stay	nothing to show here	Beach House	Private room	Bennett University	Bengaluru	Karnataka	India	12.9716	77.5946	5000	500	3	1	1	2	f	t	0	0	2026-09-08 03:43:30.130902	2026-09-08 03:43:30.13091
75	23	errrtrt	eterterteterte344	Villa	Private room	bbbbbb	New Delhi	Delhi	India	28.6139	77.209	4500	500	4	2	2	2	f	t	0	0	2026-09-08 03:54:11.557373	2026-09-08 03:54:11.55738
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, listing_id, author_id, booking_id, rating, cleanliness, accuracy, check_in_rating, communication, location_rating, value_rating, comment, created_at) FROM stdin;
1	1	8	\N	5	5	5	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-06-14 13:49:12.649617
2	1	9	\N	4	4	4	5	5	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-08-27 13:49:12.649648
3	1	9	\N	5	5	4	5	5	5	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2025-11-11 13:49:12.649657
4	1	10	\N	5	5	4	5	5	5	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-07-19 13:49:12.649666
5	1	8	\N	5	5	4	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-06-10 13:49:12.649674
6	1	10	\N	5	5	5	5	4	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-06-10 13:49:12.649682
7	1	8	\N	5	5	5	5	5	4	4	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2025-12-02 13:49:12.649689
8	1	9	\N	4	5	4	5	5	4	4	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-07-20 13:49:12.649699
9	1	8	\N	5	4	5	5	5	5	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2025-12-27 13:49:12.649707
10	1	9	\N	5	5	5	5	5	4	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-06-28 13:49:12.649715
11	1	8	\N	5	5	5	5	5	5	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2025-11-16 13:49:12.649723
12	1	10	\N	4	5	5	5	4	4	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2025-12-28 13:49:12.64973
13	1	10	\N	5	5	5	5	5	4	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-08-17 13:49:12.649738
14	1	9	\N	5	5	4	5	5	5	4	Fantastic hospitality! The host welcomed us with local treats and gave us a comprehensive guide to nearby sights.	2025-11-19 13:49:12.649745
15	2	9	\N	5	5	5	5	5	4	4	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2026-05-27 13:49:12.649753
16	2	10	\N	5	5	4	5	5	5	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-06-17 13:49:12.64976
17	2	9	\N	4	5	4	5	5	4	4	Great value for money in South Delhi. Safe and peaceful neighborhood with green parks right across the road.	2026-06-19 13:49:12.649767
18	2	10	\N	4	4	5	5	4	4	5	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-07-07 13:49:12.649775
19	2	8	\N	5	5	4	5	5	5	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2025-11-27 13:49:12.649782
20	2	10	\N	4	4	5	5	4	4	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-07-16 13:49:12.649789
21	2	10	\N	5	5	4	5	5	5	4	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-01-08 13:49:12.649796
22	2	9	\N	5	5	5	5	5	4	4	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-08-22 13:49:12.649804
23	2	10	\N	4	5	4	5	5	4	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-07-22 13:49:12.649811
24	2	8	\N	5	5	5	5	5	5	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-05-22 13:49:12.649818
25	2	8	\N	5	4	5	5	5	5	5	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-02-11 13:49:12.649825
26	2	10	\N	5	4	5	5	5	5	4	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-02-18 13:49:12.649832
27	2	10	\N	5	5	4	5	5	4	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-08-23 13:49:12.64984
28	2	10	\N	5	5	5	5	5	4	4	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-05-23 13:49:12.649847
29	3	8	\N	5	5	5	5	4	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-05-31 13:49:12.649855
30	3	8	\N	4	5	5	5	4	4	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2025-12-30 13:49:12.649862
31	3	8	\N	4	4	5	5	5	4	4	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-09-02 13:49:12.64987
32	3	8	\N	5	5	5	5	5	5	4	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-02-14 13:49:12.649877
33	3	8	\N	5	5	5	5	4	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-01-18 13:49:12.649885
34	3	8	\N	5	5	5	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-01-13 13:49:12.649892
35	3	9	\N	4	4	5	5	4	4	4	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2025-12-02 13:49:12.6499
36	3	10	\N	4	5	4	5	4	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-07-27 13:49:12.649907
37	3	10	\N	5	5	4	5	5	5	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2025-12-21 13:49:12.649914
38	3	9	\N	5	5	5	5	5	4	4	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-08-18 13:49:12.649922
39	3	9	\N	4	4	5	5	5	4	4	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2026-04-15 13:49:12.649929
40	3	10	\N	5	5	5	5	4	4	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-08-02 13:49:12.649936
41	3	8	\N	5	5	5	5	4	5	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2025-12-10 13:49:12.649943
42	3	9	\N	4	4	5	5	5	4	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2025-12-29 13:49:12.649951
43	4	10	\N	4	5	4	5	4	5	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-08-31 13:49:12.649958
44	4	8	\N	5	5	5	5	4	4	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-02-02 13:49:12.649966
45	4	9	\N	4	5	5	5	4	4	4	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-03-05 13:49:12.649973
46	4	9	\N	4	4	5	5	4	4	4	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-01-07 13:49:12.64998
47	4	10	\N	5	5	5	5	5	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-08-14 13:49:12.649987
48	4	9	\N	4	5	4	5	4	4	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2025-12-22 13:49:12.65005
49	4	10	\N	5	5	5	5	4	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2025-11-26 13:49:12.650059
50	4	10	\N	5	5	5	5	5	5	5	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2025-11-23 13:49:12.650066
51	4	8	\N	5	5	5	5	5	5	4	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2025-12-23 13:49:12.650073
52	4	9	\N	5	5	5	5	5	5	5	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2026-08-07 13:49:12.650081
53	4	8	\N	5	5	5	5	5	5	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-08-16 13:49:12.650089
54	4	8	\N	5	5	5	5	5	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2025-11-20 13:49:12.650096
55	4	10	\N	5	5	4	5	4	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-04-19 13:49:12.650103
56	5	9	\N	5	4	5	5	5	4	5	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-01-20 13:49:12.650111
57	5	10	\N	5	5	4	5	5	5	4	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-07-09 13:49:12.650119
58	5	8	\N	5	5	5	5	4	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2025-12-20 13:49:12.650126
59	5	9	\N	5	5	5	5	4	5	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-08-27 13:49:12.650133
60	5	9	\N	5	5	5	5	5	4	4	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-05-26 13:49:12.650141
61	5	8	\N	5	5	5	5	5	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2025-11-15 13:49:12.650148
62	5	8	\N	5	5	5	5	5	5	5	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-07-10 13:49:12.650156
63	5	8	\N	5	5	5	5	5	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-05-28 13:49:12.650163
64	5	8	\N	5	5	5	5	5	4	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-02-21 13:49:12.650171
65	5	8	\N	5	5	5	5	5	4	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2025-12-04 13:49:12.650178
66	5	9	\N	5	5	5	5	5	4	4	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2025-11-29 13:49:12.650186
67	5	8	\N	5	5	5	5	5	4	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2025-12-10 13:49:12.650193
68	6	9	\N	5	5	5	5	5	4	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-04-18 13:49:12.650201
69	6	8	\N	5	5	5	5	4	5	4	Great value for money in South Delhi. Safe and peaceful neighborhood with green parks right across the road.	2025-12-31 13:49:12.650208
70	6	10	\N	5	5	5	5	5	5	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-05-21 13:49:12.650216
71	6	9	\N	5	5	5	5	5	5	5	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2026-03-14 13:49:12.650223
72	6	8	\N	5	5	5	5	5	5	4	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-07-14 13:49:12.65023
73	6	8	\N	5	5	5	5	5	4	4	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-01-01 13:49:12.650238
74	6	10	\N	5	5	4	5	5	5	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-01-24 13:49:12.650246
75	6	8	\N	5	5	4	5	5	4	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-05-16 13:49:12.650254
76	6	10	\N	5	5	5	5	4	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-04-26 13:49:12.650261
77	6	8	\N	4	4	4	5	4	4	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-03-02 13:49:12.650268
78	6	8	\N	5	5	5	5	4	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-08-01 13:49:12.650276
79	6	8	\N	5	4	5	5	5	4	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-03-23 13:49:12.650283
80	7	9	\N	5	5	5	5	5	5	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-08-18 13:49:12.650291
81	7	9	\N	4	5	4	5	4	4	5	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-02-26 13:49:12.650298
82	7	8	\N	5	5	5	5	4	4	5	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-04-23 13:49:12.650306
83	7	8	\N	5	5	4	5	4	5	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2025-12-09 13:49:12.650313
84	7	9	\N	4	4	4	5	4	5	5	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2026-01-01 13:49:12.650321
85	7	9	\N	5	5	5	5	4	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2025-12-21 13:49:12.650328
86	7	9	\N	5	4	4	5	5	5	5	Great value for money in South Delhi. Safe and peaceful neighborhood with green parks right across the road.	2026-01-08 13:49:12.650335
87	7	8	\N	5	5	5	5	5	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-01-20 13:49:12.650342
88	7	8	\N	5	5	5	5	5	5	5	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-01-17 13:49:12.650349
89	7	10	\N	4	5	4	5	5	4	4	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-08-25 13:49:12.650356
90	8	9	\N	5	4	5	5	5	5	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-02-15 13:49:12.650364
91	8	9	\N	5	5	4	5	5	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-04-06 13:49:12.650371
92	8	8	\N	5	5	4	5	5	5	4	Fantastic hospitality! The host welcomed us with local treats and gave us a comprehensive guide to nearby sights.	2026-01-04 13:49:12.650379
93	8	8	\N	4	5	4	5	4	4	4	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-04-15 13:49:12.650386
94	8	9	\N	5	5	5	5	5	4	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-02-23 13:49:12.650393
95	8	9	\N	5	5	4	5	5	5	4	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2025-11-23 13:49:12.650401
96	8	8	\N	5	4	5	5	5	5	5	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-05-01 13:49:12.650408
97	8	8	\N	5	5	4	5	4	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-06-23 13:49:12.650415
98	8	9	\N	5	5	4	5	5	5	4	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-01-16 13:49:12.650422
99	8	10	\N	5	5	5	5	5	5	4	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2026-05-17 13:49:12.650429
100	8	10	\N	5	5	5	5	5	4	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-08-28 13:49:12.650437
101	8	8	\N	5	5	5	5	5	5	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-04-23 13:49:12.650444
102	8	8	\N	4	4	5	5	5	4	4	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-02-23 13:49:12.650451
103	8	9	\N	5	4	5	5	4	5	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-04-08 13:49:12.650458
104	9	9	\N	5	5	5	5	4	4	5	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-04-29 13:49:12.650466
105	9	9	\N	5	5	5	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2025-11-29 13:49:12.650473
106	9	10	\N	5	4	4	5	5	5	5	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2025-12-17 13:49:12.65048
107	9	8	\N	4	4	5	5	5	4	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-07-25 13:49:12.650487
108	9	9	\N	5	5	5	5	5	4	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-08-30 13:49:12.650495
109	9	10	\N	5	5	5	5	5	5	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2025-11-24 13:49:12.650508
110	9	9	\N	4	5	4	5	5	4	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-05-19 13:49:12.650515
111	9	10	\N	5	5	5	5	5	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-06-08 13:49:12.650522
112	10	8	\N	4	4	4	5	4	5	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-07-26 13:49:12.65053
113	10	9	\N	5	5	5	5	5	4	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-01-08 13:49:12.650537
114	10	10	\N	5	5	5	5	5	5	4	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-05-13 13:49:12.650544
115	10	10	\N	5	5	5	5	5	4	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-03-14 13:49:12.650551
116	10	10	\N	5	5	5	5	5	5	4	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-07-22 13:49:12.650558
117	10	8	\N	5	5	4	5	5	5	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-08-04 13:49:12.650566
118	10	10	\N	5	5	4	5	4	5	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-04-17 13:49:12.650573
119	10	8	\N	5	5	5	5	5	4	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-01-13 13:49:12.65058
120	10	9	\N	5	5	4	5	5	5	4	Splendid stay during our monsoon trip. Watching the rain over the valley from the balcony was pure magic.	2025-12-11 13:49:12.650587
121	10	10	\N	5	5	5	5	5	4	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-02-20 13:49:12.650594
122	10	8	\N	5	5	5	5	5	5	4	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-08-30 13:49:12.650601
123	10	8	\N	4	4	5	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-04-11 13:49:12.650608
124	10	10	\N	5	5	4	5	4	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-03-13 13:49:12.650615
125	10	10	\N	5	5	4	5	5	4	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-03-30 13:49:12.650623
126	11	8	\N	5	5	4	5	4	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-03-29 13:49:12.65063
127	11	9	\N	5	5	5	5	5	4	4	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-05-01 13:49:12.650637
128	11	8	\N	5	5	5	5	5	4	4	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2025-12-09 13:49:12.650645
129	11	9	\N	5	5	5	5	5	4	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-08-12 13:49:12.650652
130	11	10	\N	5	5	5	5	5	5	4	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-05-25 13:49:12.650659
131	11	8	\N	5	5	5	5	5	4	5	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-08-23 13:49:12.650667
132	11	8	\N	5	5	4	5	5	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-02-09 13:49:12.650674
133	11	9	\N	5	5	5	5	5	4	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-06-07 13:49:12.650681
134	11	10	\N	5	5	4	5	5	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-04-19 13:49:12.650688
135	11	10	\N	5	5	5	5	5	4	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2025-11-16 13:49:12.650696
136	11	9	\N	5	5	5	5	5	5	4	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-04-22 13:49:12.650703
137	11	8	\N	5	5	5	5	5	5	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2025-12-24 13:49:12.65071
138	11	10	\N	5	5	5	5	4	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-07-12 13:49:12.650717
139	11	10	\N	5	5	5	5	5	4	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-03-07 13:49:12.650725
140	11	8	\N	5	5	5	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2025-11-29 13:49:12.650732
141	12	8	\N	5	5	4	5	4	5	5	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-04-26 13:49:12.65074
142	12	8	\N	5	4	5	5	5	5	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2025-11-20 13:49:12.650747
143	12	8	\N	5	4	5	5	5	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2025-11-12 13:49:12.650754
144	12	10	\N	5	5	4	5	5	5	5	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-04-22 13:49:12.650761
145	12	8	\N	5	5	5	5	5	4	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2025-12-19 13:49:12.650769
146	12	8	\N	4	5	5	5	4	4	4	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-08-18 13:49:12.650776
147	12	9	\N	4	4	5	5	4	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2025-12-14 13:49:12.650784
148	12	10	\N	4	4	5	5	4	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-08-18 13:49:12.650808
149	12	9	\N	5	5	5	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-02-05 13:49:12.650816
150	12	10	\N	5	5	5	5	4	5	4	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2025-12-10 13:49:12.650824
151	13	9	\N	5	5	4	5	5	5	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-03-11 13:49:12.650831
152	13	8	\N	5	5	5	5	5	4	5	Great value for money in South Delhi. Safe and peaceful neighborhood with green parks right across the road.	2026-08-29 13:49:12.650838
153	13	8	\N	4	4	5	5	4	4	5	Fantastic hospitality! The host welcomed us with local treats and gave us a comprehensive guide to nearby sights.	2026-06-22 13:49:12.650845
154	13	8	\N	5	5	5	5	5	4	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-01-27 13:49:12.650852
155	13	8	\N	4	5	4	5	5	4	4	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2026-05-17 13:49:12.65086
156	13	8	\N	5	4	5	5	5	5	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-04-19 13:49:12.650867
157	13	8	\N	4	5	4	5	5	4	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-05-04 13:49:12.650874
158	13	8	\N	5	5	5	5	5	5	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2025-11-12 13:49:12.650881
159	13	8	\N	5	5	4	5	5	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-04-19 13:49:12.650889
160	13	8	\N	5	5	5	5	4	5	4	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2025-12-22 13:49:12.650896
161	13	10	\N	5	5	5	5	5	4	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2025-11-30 13:49:12.650903
162	13	10	\N	4	4	4	5	5	4	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-06-12 13:49:12.65091
163	13	9	\N	5	5	5	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-04-20 13:49:12.650917
164	13	10	\N	5	4	4	5	5	5	5	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2026-06-30 13:49:12.650925
165	14	8	\N	5	5	5	5	5	4	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-02-13 13:49:12.650932
166	14	8	\N	4	5	4	5	5	4	4	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2026-08-27 13:49:12.65094
167	14	10	\N	5	5	5	5	5	4	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-01-19 13:49:12.650946
168	14	9	\N	5	5	4	5	5	5	4	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2025-11-13 13:49:12.650954
169	14	9	\N	5	5	5	5	4	4	5	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-05-21 13:49:12.650961
170	14	10	\N	5	5	5	5	4	5	4	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-05-14 13:49:12.650968
171	14	9	\N	5	4	5	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-03-09 13:49:12.650975
172	14	10	\N	4	4	4	5	4	5	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-06-21 13:49:12.650982
173	14	10	\N	4	4	5	5	4	4	4	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2026-05-06 13:49:12.65099
174	14	8	\N	5	5	5	5	4	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-08-31 13:49:12.650997
175	14	10	\N	4	4	5	5	4	5	4	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-06-13 13:49:12.651004
176	14	8	\N	5	5	5	5	4	5	5	Fantastic hospitality! The host welcomed us with local treats and gave us a comprehensive guide to nearby sights.	2026-05-12 13:49:12.651012
177	15	8	\N	5	4	5	5	5	5	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2025-12-24 13:49:12.651019
178	15	8	\N	5	5	5	5	5	5	5	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2026-03-27 13:49:12.651027
179	15	9	\N	5	5	4	5	5	5	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-01-03 13:49:12.651034
180	15	8	\N	5	5	5	5	5	5	4	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2025-11-30 13:49:12.651041
181	15	10	\N	5	5	5	5	5	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-04-18 13:49:12.651049
182	15	8	\N	4	5	4	5	4	4	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-08-12 13:49:12.651056
183	15	10	\N	5	5	5	5	5	4	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-04-17 13:49:12.651063
184	15	8	\N	4	4	5	5	5	4	4	Peaceful stay amidst the bustling city. Soundproofing was great and we slept peacefully every night.	2025-12-19 13:49:12.65107
185	15	10	\N	5	4	5	5	5	5	5	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-01-28 13:49:12.651078
186	15	8	\N	4	4	5	5	4	4	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-05-29 13:49:12.651085
187	15	8	\N	4	5	4	5	4	5	4	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2025-12-16 13:49:12.651092
188	15	10	\N	4	5	4	5	5	4	4	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-02-19 13:49:12.651099
189	16	10	\N	5	5	5	5	5	4	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-06-18 13:49:12.651107
190	17	10	\N	4	4	5	5	5	4	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-02-12 13:49:12.651115
191	17	8	\N	5	5	4	5	5	5	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-07-15 13:49:12.651122
192	18	8	\N	5	5	5	5	5	4	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-04-26 13:49:12.651129
193	18	8	\N	5	5	5	5	5	4	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-03-11 13:49:12.651137
194	19	10	\N	5	5	5	5	5	4	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-03-05 13:49:12.651144
195	19	8	\N	5	5	4	5	5	5	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-08-23 13:49:12.651152
196	19	10	\N	5	5	5	5	5	5	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-03-23 13:49:12.651159
197	19	10	\N	5	5	5	5	5	5	5	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-06-15 13:49:12.651166
198	20	10	\N	5	4	5	5	5	4	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2025-12-09 13:49:12.651173
199	21	9	\N	5	5	5	5	5	4	5	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2026-05-19 13:49:12.651181
200	21	9	\N	5	4	5	5	5	4	5	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2025-12-04 13:49:12.651188
201	22	9	\N	5	4	5	5	5	5	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-02-18 13:49:12.651196
202	22	8	\N	4	4	4	5	5	4	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-01-22 13:49:12.651204
203	23	8	\N	4	5	5	5	4	4	4	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-07-30 13:49:12.651211
204	24	8	\N	4	4	5	5	4	4	5	Great value for money in South Delhi. Safe and peaceful neighborhood with green parks right across the road.	2026-07-28 13:49:12.651219
205	24	9	\N	4	4	5	5	5	4	4	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-08-04 13:49:12.651226
206	24	8	\N	5	4	4	5	5	5	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-05-01 13:49:12.651233
207	25	9	\N	4	5	4	5	4	5	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-09-01 13:49:12.65124
208	25	10	\N	5	5	4	5	4	5	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-04-14 13:49:12.651248
209	25	8	\N	5	5	5	5	5	5	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-08-24 13:49:12.651255
210	25	9	\N	4	4	5	5	4	4	5	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-06-18 13:49:12.651262
211	26	8	\N	5	5	5	5	5	4	5	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-07-25 13:49:12.651269
212	26	8	\N	5	5	4	5	5	4	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2025-12-28 13:49:12.651277
213	26	10	\N	5	5	5	5	4	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-05-13 13:49:12.651284
214	26	8	\N	5	5	5	5	5	4	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-01-20 13:49:12.651291
215	27	8	\N	5	5	5	5	5	5	4	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-07-08 13:49:12.651298
216	27	8	\N	5	5	5	5	5	5	4	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-05-31 13:49:12.651306
217	27	9	\N	5	5	5	5	5	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-04-06 13:49:12.651313
218	28	8	\N	4	5	4	5	5	4	4	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-04-28 13:49:12.65132
219	29	9	\N	5	5	5	5	5	4	4	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-05-05 13:49:12.651328
220	29	8	\N	5	5	5	5	5	5	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-02-23 13:49:12.651335
221	30	8	\N	5	4	5	5	4	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-01-28 13:49:12.651342
222	31	8	\N	4	5	5	5	4	4	4	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-05-27 13:49:12.65135
223	31	9	\N	5	5	5	5	5	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-08-10 13:49:12.651357
224	32	10	\N	5	5	5	5	4	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-02-02 13:49:12.651365
225	32	10	\N	5	5	4	5	5	4	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-07-21 13:49:12.651372
226	32	8	\N	4	4	4	5	5	4	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-04-08 13:49:12.65138
227	33	8	\N	5	4	5	5	4	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-07-02 13:49:12.651388
228	33	9	\N	4	4	4	5	5	4	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2025-12-03 13:49:12.651395
229	33	8	\N	5	4	5	5	5	5	4	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2026-05-21 13:49:12.651403
230	33	10	\N	4	4	5	5	5	4	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-02-10 13:49:12.65141
231	34	8	\N	5	4	5	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-05-17 13:49:12.651418
232	35	9	\N	5	5	5	5	4	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-04-06 13:49:12.651425
233	35	9	\N	5	5	5	5	5	5	5	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2025-12-19 13:49:12.651432
234	35	10	\N	5	5	5	5	5	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-07-09 13:49:12.65144
235	36	9	\N	4	4	4	5	5	4	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-03-10 13:49:12.651448
236	36	8	\N	5	5	5	5	5	4	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2025-12-30 13:49:12.651455
237	36	9	\N	4	4	4	5	5	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2025-11-22 13:49:12.651462
238	37	10	\N	4	4	5	5	4	4	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-01-31 13:49:12.65147
239	37	10	\N	5	5	5	5	5	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-04-27 13:49:12.651478
240	37	8	\N	4	4	5	5	4	5	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2026-08-23 13:49:12.651485
241	37	9	\N	5	5	5	5	5	4	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-04-26 13:49:12.651492
242	38	8	\N	5	5	5	5	4	5	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-01-06 13:49:12.6515
243	38	10	\N	5	5	5	5	5	5	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2025-12-06 13:49:12.651507
244	38	10	\N	5	5	5	5	5	5	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-02-01 13:49:12.651515
245	38	10	\N	5	5	5	5	5	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-06-26 13:49:12.651522
246	39	8	\N	5	5	5	5	5	5	4	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-04-13 13:49:12.651529
247	39	10	\N	5	5	5	5	5	4	5	Ideal home for remote work and quiet downtime. Power backup and strong wifi made working stress-free.	2026-06-02 13:49:12.651536
248	39	10	\N	5	5	4	5	5	5	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-01-13 13:49:12.651643
249	40	9	\N	5	5	5	5	5	5	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2025-12-28 13:49:12.651651
250	40	10	\N	4	4	4	5	5	5	4	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2025-11-12 13:49:12.651659
251	40	10	\N	5	4	5	5	5	4	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-02-18 13:49:12.651666
252	41	10	\N	5	4	5	5	5	4	5	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-03-17 13:49:12.651674
253	41	9	\N	4	4	4	5	5	5	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-02-13 13:49:12.651681
254	41	9	\N	5	4	5	5	5	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-09-02 13:49:12.651688
255	42	10	\N	5	4	5	5	5	5	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-01-30 13:49:12.651696
256	42	9	\N	5	5	5	5	4	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2025-12-20 13:49:12.651703
257	42	10	\N	4	4	5	5	4	4	4	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2026-08-05 13:49:12.651711
258	42	9	\N	5	5	5	5	5	5	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-07-25 13:49:12.651718
259	43	9	\N	5	5	5	5	4	4	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-08-05 13:49:12.651725
260	43	9	\N	5	5	4	5	4	5	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-05-25 13:49:12.651732
261	44	9	\N	5	5	5	5	5	4	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-02-03 13:49:12.65174
262	44	9	\N	4	4	5	5	4	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2025-11-26 13:49:12.651748
263	44	10	\N	5	5	5	5	5	5	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2025-11-20 13:49:12.651755
264	44	8	\N	5	5	5	5	5	5	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-05-06 13:49:12.651762
265	45	8	\N	5	5	5	5	4	4	5	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-01-29 13:49:12.65177
266	45	8	\N	5	4	5	5	5	4	5	Loved the aesthetic decor and attention to detail. Every corner had artistic touches and plants. Felt like a boutique stay.	2026-01-21 13:49:12.651777
267	46	9	\N	5	5	4	5	5	4	5	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2025-12-06 13:49:12.651784
268	46	10	\N	5	5	5	5	5	5	4	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-06-14 13:49:12.651792
269	46	9	\N	5	5	5	5	5	4	4	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2025-11-14 13:49:12.651799
270	46	9	\N	5	5	5	5	5	5	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-05-24 13:49:12.651806
271	47	8	\N	5	4	5	5	5	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-01-29 13:49:12.651814
272	47	9	\N	5	5	5	5	5	4	4	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2025-12-18 13:49:12.651821
273	47	9	\N	5	5	5	5	5	4	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2026-05-25 13:49:12.651829
274	48	10	\N	5	4	5	5	5	5	5	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-08-30 13:49:12.651837
275	49	10	\N	5	5	5	5	5	4	5	Very comfortable stay. Safe gated community with dedicated parking right under the building.	2026-07-04 13:49:12.651844
276	49	10	\N	5	5	4	5	5	5	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-05-11 13:49:12.651851
277	50	9	\N	5	5	4	5	5	4	5	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2026-02-13 13:49:12.651859
278	50	10	\N	4	5	4	5	4	4	5	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2026-03-03 13:49:12.651866
279	50	9	\N	5	5	5	5	5	4	4	Everything was exactly as shown in the photos. The host was prompt with communication and accommodated our late check-in.	2025-12-14 13:49:12.651873
280	50	9	\N	5	4	4	5	5	5	5	Perfect family stay. The kitchen had all the utensils and condiments needed to prepare meals for our kids. Very thoughtful touches.	2026-06-16 13:49:12.65188
281	51	10	\N	5	4	5	5	5	4	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-01-13 13:49:12.651888
282	52	9	\N	4	4	4	5	5	4	5	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-01-05 13:49:12.651896
283	53	9	\N	5	5	5	5	5	4	5	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2026-08-11 13:49:12.651904
284	53	8	\N	5	5	5	5	5	4	5	The host responded within minutes whenever we had a question. Felt very well taken care of throughout our trip.	2026-04-18 13:49:12.651911
285	53	8	\N	5	5	5	5	5	4	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-01-24 13:49:12.651918
286	53	8	\N	4	4	5	5	5	4	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2025-11-15 13:49:12.651926
287	54	9	\N	5	5	5	5	5	4	5	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-05-26 13:49:12.651933
288	54	8	\N	5	5	5	5	5	4	5	Stunning sunsets from the rooftop terrace! The location is close to top-rated restaurants and historic monuments.	2026-01-24 13:49:12.65194
289	54	10	\N	4	5	4	5	4	4	5	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-03-09 13:49:12.651948
290	54	8	\N	5	5	5	5	5	4	5	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2025-12-30 13:49:12.651955
291	55	8	\N	5	5	5	5	5	5	5	Unbeatable location in North Goa! We walked to the beach in 5 minutes and had wonderful cafes just around the corner. Sparkling clean.	2026-07-26 13:49:12.651962
292	56	10	\N	5	4	5	5	5	4	5	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-08-29 13:49:12.65197
293	56	8	\N	4	4	4	5	4	5	4	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-07-11 13:49:12.651977
294	56	10	\N	5	5	4	5	5	5	4	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-05-03 13:49:12.651984
295	57	8	\N	5	5	5	5	5	5	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-06-03 13:49:12.651992
296	58	9	\N	4	4	5	5	4	5	4	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-04-04 13:49:12.651999
297	58	9	\N	4	5	5	5	4	4	4	Very spacious living room with cozy couches. Perfect for our group of four to relax and watch movies in the evening.	2026-03-28 13:49:12.652007
298	59	10	\N	5	5	4	5	5	4	5	Waking up to mountain views and fresh cedar pine scent in Manali was truly unforgettable. The fireplace kept us cozy in the evenings.	2026-02-05 13:49:12.652014
299	59	9	\N	5	5	5	5	5	4	4	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-06-26 13:49:12.652022
300	60	8	\N	4	4	5	5	4	5	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-07-28 13:49:12.652029
301	61	9	\N	4	4	4	5	5	4	4	The cottage was immaculate. Fresh towels, well-stocked bathroom essentials, and hot water anytime we needed it.	2026-05-27 13:49:12.652036
302	61	8	\N	5	5	5	5	5	5	5	Charming rustic vibe combined with modern amenities. The wooden architecture gave it such a warm, inviting feel.	2026-04-06 13:49:12.652044
303	61	8	\N	5	5	5	5	5	4	5	The bed was extremely comfortable, linens were crisp, and the bathroom was spotless. Will definitely stay here again on my next visit.	2026-06-07 13:49:12.652051
304	61	10	\N	5	4	5	5	5	5	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2026-07-03 13:49:12.652058
305	62	8	\N	4	5	4	5	5	4	4	Spacious rooms with plenty of natural light. Air conditioning worked flawlessly in the summer heat.	2025-12-05 13:49:12.652065
306	62	10	\N	5	5	5	5	5	5	5	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2025-12-24 13:49:12.652073
307	62	9	\N	4	5	4	5	4	5	4	Beautifully restored haveli with authentic Rajasthani charm. The courtyard breakfast was delicious and Vikramaditya was so welcoming.	2026-01-08 13:49:12.65208
308	62	10	\N	4	4	4	5	4	4	4	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-07-01 13:49:12.652087
309	63	10	\N	5	5	5	5	5	5	5	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-07-16 13:49:12.652095
310	64	8	\N	5	5	5	5	5	4	5	The villa exceeded all our expectations. The private pool was pristine and the garden was quiet and lush. Priya was an extraordinary host!	2026-05-30 13:49:12.652103
311	64	10	\N	5	5	4	5	5	5	4	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2025-12-01 13:49:12.65211
312	65	10	\N	5	5	5	5	5	5	4	Fantastic hospitality! The host welcomed us with local treats and gave us a comprehensive guide to nearby sights.	2026-05-24 13:49:12.652117
313	65	9	\N	5	4	5	5	5	4	5	Outstanding luxury flat right on Golf Course Road. Check-in was completely frictionless with the smart lock code.	2026-08-27 13:49:12.652124
314	65	8	\N	5	4	5	5	4	5	5	Peaceful and private. We spent three days relaxing by the pool with zero disturbances. Five stars all around.	2026-07-26 13:49:12.652132
315	66	9	\N	5	5	4	5	5	5	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2026-07-31 13:49:12.65214
316	66	8	\N	5	4	4	5	5	5	5	The terrace garden was our favorite spot for morning tea. Super hospitable host and excellent amenities.	2026-08-12 13:49:12.652148
317	66	10	\N	5	5	5	5	5	4	5	Super fast wifi allowed me to work remotely without any lag. The desk and ergonomic chair made a huge difference. Highly recommend for digital nomads.	2026-07-17 13:49:12.652156
318	66	8	\N	5	5	5	5	4	5	4	Modern minimalist design with high ceilings and huge windows. Kitchen was fully equipped with microwave and refrigerator.	2025-11-26 13:49:12.652164
319	67	10	\N	5	5	5	5	5	5	5	Clean, modern, and very well maintained apartment in Noida. Great connectivity to the metro and expressways.	2026-07-05 13:49:12.652172
320	67	10	\N	4	5	5	5	4	4	4	Quiet retreat nestled in the hills of Dehradun. The balcony views over the valley at sunset were breathtaking.	2026-06-10 13:49:12.65218
321	67	10	\N	4	5	4	5	4	4	4	Super clean and tidy flat. The host provided clear instructions and checking in took less than a minute.	2025-11-28 13:49:12.652188
322	67	10	\N	4	4	5	5	4	5	4	Exemplary stay from start to finish. Everything promised in the listing description was delivered to perfection.	2026-08-09 13:49:12.652196
323	68	8	\N	5	4	5	5	5	5	4	A true gem in Bandra West! Stepped right out into charming cafes and sea breeze. Host gave fantastic local food recommendations.	2026-05-09 13:49:12.652204
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description) FROM stdin;
1	traveller	Explore, search, and book stays and experiences
2	host	Publish and manage property listings, pricing, and reservations
3	admin	System administration and platform moderation
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_roles (user_id, role_id) FROM stdin;
9	1
10	1
11	1
12	1
13	1
14	1
15	1
16	1
17	1
18	1
19	1
20	1
21	1
22	1
8	1
1	1
2	1
3	1
4	1
5	1
6	1
7	1
23	1
1	2
2	2
3	2
4	2
5	2
6	2
7	2
23	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, hashed_password, avatar_url, is_host, is_superhost, bio, joined_at, response_rate, created_at, role) FROM stdin;
9	Neha Malhotra	neha.guest@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80	f	f	Yoga teacher and weekend road-tripper exploring coastal and mountain stays across India.	2026-09-07 13:49:12.623286	\N	2026-09-07 13:49:12.623286	traveller
10	Amit Saxena	amit.guest@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&q=80	f	f	Product designer based in Bengaluru. Traveling with family and looking for quiet, design-forward retreats.	2026-09-07 13:49:12.623287	\N	2026-09-07 13:49:12.623287	traveller
11	Newtraveler	newtraveler@example.com	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-07 15:00:16.508511	\N	2026-09-07 15:00:16.508514	traveller
12	Vd	vd@gmail.com	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:05:29.048226	\N	2026-09-08 02:05:29.048236	traveller
13	New Traveler	brandnew@example.com	$2b$12$EO60e/VanJ7QHwHsFcy.9OR.rD4/ENy7BWdqHhTzrznT2g5nwfnt6	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:14:57.737645	\N	2026-09-08 02:14:57.737649	traveller
14	New Traveler	traveler_aed81565@example.com	$2b$12$RPueWkRO3hhi6XWMK.TCb.3g1Bo12z7mUkgU10VDt83EaS/YLNa4i	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:15:31.248788	\N	2026-09-08 02:15:31.2488	traveller
15	David Miller	david.miller@testtraveler.com	$2b$12$c2b8g3pNhM9XtllK1cn2zuQ0FiQ4xuo1EJBEQD02dG7EodnBXCKnO	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:18:17.936212	\N	2026-09-08 02:18:17.936216	traveller
16	David Miller	david.miller1@testtraveler.com	$2b$12$fj25dMqnDeRRhvj.sf3RmewbRfZCOCN80vRiVWC2HubVrcE4dZMle	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:21:01.532897	\N	2026-09-08 02:21:01.532901	traveller
17	Postgres User	pg_user@test.com	$2b$12$LeQBdpqyuxI5ofe/gAyx9..xeQvthy8nXADl7MsmHZN7LTOCW3iee	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:29:53.851146	\N	2026-09-08 02:29:53.851149	traveller
18	New Traveler	traveler_18887c30@example.com	$2b$12$vZbmzxYU9Yr9y/q5n85qAe05KkSfKMWZr4gA5DvI49RznGkeFC.xu	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:30:10.105537	\N	2026-09-08 02:30:10.10554	traveller
19	New Traveler	traveler_143b935b@example.com	$2b$12$h7Z5eWe/Z0hIMa/cnTFUBeyQrvV/xtr28QgGZx0BbunddzRktijge	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:30:48.868384	\N	2026-09-08 02:30:48.868387	traveller
20	New Traveler	traveler_e0f0b678@example.com	$2b$12$bDE/eAnRaAXaIdGANUcNueCHa3DFW4ugMQI9dmYcDOIa9Flalc/8m	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:44:37.52629	\N	2026-09-08 02:44:37.526293	traveller
21	New Traveler	traveler_e321d309@example.com	$2b$12$OXhPi6W1d37cCEUjajc1Fu10nrB2Z31zKEasiIh5yrgf7TthxsTdG	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 02:46:06.943608	\N	2026-09-08 02:46:06.943612	traveller
22	New Traveler	traveler_b6cd06bc@example.com	$2b$12$CHab9PBcl1BjP/Py/QgNMe2fvRbatSPL9kQrMHyKBsxlzZ679GbUO	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	f	f	\N	2026-09-08 03:39:15.378121	\N	2026-09-08 03:39:15.378126	traveller
8	Rahul Mehta	rahul.guest@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&q=80	f	f	Frequent traveler, avid food photographer, and remote software engineer.	2026-09-07 13:49:12.623286	\N	2026-09-07 13:49:12.623286	traveller
1	Priya Sharma	priya.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80	t	t	Architect and hospitality enthusiast living between Goa and Mumbai. I design spaces that bring natural light and serenity to vacations.	2026-09-07 13:49:12.623279	99	2026-09-07 13:49:12.623282	host
2	Tarun Kapoor	tarun.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80	t	f	Lifelong resident of North Goa. Excited to share the best local cafes, hidden beaches, and quiet coves with fellow travelers.	2026-09-07 13:49:12.623283	96	2026-09-07 13:49:12.623283	host
3	Rohit Verma	rohit.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80	t	f	Tech consultant and property host across Delhi NCR. Obsessed with fast wifi, ergonomic workspaces, and seamless self check-in.	2026-09-07 13:49:12.623283	94	2026-09-07 13:49:12.623284	host
4	Ananya Joshi	ananya.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80	t	t	Painter and writer hosting scenic cedarwood cabins in Old Manali. Always happy to guide guests on Himalayan treks.	2026-09-07 13:49:12.623285	100	2026-09-07 13:49:12.623285	host
5	Vikramaditya Rathore	vikram.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80	t	t	Restorer of heritage bungalows and havelis in Rajasthan. Passionate about traditional architecture and authentic cuisine.	2026-09-07 13:49:12.623285	98	2026-09-07 13:49:12.623285	host
6	Kavita Sen	kavita.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80	t	t	Ecologist hosting hillside cottages in Dehradun surrounded by pine forests and bird sanctuaries.	2026-09-07 13:49:12.623285	99	2026-09-07 13:49:12.623286	host
7	Arjun Singhal	arjun.host@airbnb.test	$2b$12$tsRdt3/C6yuIugNPAXqezuO3hWC9aG32C41QkLkbEZ1PeKUAfWHXq	https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80	t	f	Entrepreneur hosting luxury city apartments in Gurugram and South Delhi designed for business executives and families.	2026-09-07 13:49:12.623286	92	2026-09-07 13:49:12.623286	host
23	vishal	vd1@gmail.com	$2b$12$6zZRwecdutlnRWNIausiKOvru93h5JaP3cLQDUd46iAPuesPYp5ji	https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80	t	f	\N	2026-09-08 03:44:03.749604	\N	2026-09-08 03:44:03.749606	host
\.


--
-- Data for Name: wishlist_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlist_items (id, user_id, listing_id, created_at) FROM stdin;
1	8	1	2026-09-07 13:49:12.66641
2	8	4	2026-09-07 13:49:12.666411
3	9	2	2026-09-07 13:49:12.666411
4	9	6	2026-09-07 13:49:12.666412
5	12	5	2026-09-08 02:05:32.708503
\.


--
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.amenities_id_seq', 30, true);


--
-- Name: blocked_dates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blocked_dates_id_seq', 8, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 56, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 10, true);


--
-- Name: listing_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listing_photos_id_seq', 424, true);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.listings_id_seq', 75, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 323, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- Name: wishlist_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlist_items_id_seq', 10, true);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (id);


--
-- Name: blocked_dates blocked_dates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_dates
    ADD CONSTRAINT blocked_dates_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: listing_amenities listing_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_amenities
    ADD CONSTRAINT listing_amenities_pkey PRIMARY KEY (listing_id, amenity_id);


--
-- Name: listing_categories listing_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories
    ADD CONSTRAINT listing_categories_pkey PRIMARY KEY (listing_id, category_id);


--
-- Name: listing_photos listing_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_photos
    ADD CONSTRAINT listing_photos_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: blocked_dates uq_blocked_listing_date; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_dates
    ADD CONSTRAINT uq_blocked_listing_date UNIQUE (listing_id, date);


--
-- Name: wishlist_items uq_wishlist_user_listing; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT uq_wishlist_user_listing UNIQUE (user_id, listing_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlist_items wishlist_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_pkey PRIMARY KEY (id);


--
-- Name: idx_bookings_listing_dates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_bookings_listing_dates ON public.bookings USING btree (listing_id, check_in, check_out);


--
-- Name: idx_listings_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_city ON public.listings USING btree (city);


--
-- Name: idx_listings_host; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_host ON public.listings USING btree (host_id);


--
-- Name: idx_listings_price; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_listings_price ON public.listings USING btree (price_per_night);


--
-- Name: idx_reviews_listing; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reviews_listing ON public.reviews USING btree (listing_id);


--
-- Name: ix_bookings_confirmation_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_bookings_confirmation_code ON public.bookings USING btree (confirmation_code);


--
-- Name: ix_categories_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_categories_slug ON public.categories USING btree (slug);


--
-- Name: ix_listing_photos_listing_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_listing_photos_listing_id ON public.listing_photos USING btree (listing_id);


--
-- Name: ix_roles_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_roles_name ON public.roles USING btree (name);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: blocked_dates blocked_dates_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_dates
    ADD CONSTRAINT blocked_dates_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_guest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_guest_id_fkey FOREIGN KEY (guest_id) REFERENCES public.users(id);


--
-- Name: bookings bookings_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- Name: listing_amenities listing_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_amenities
    ADD CONSTRAINT listing_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(id) ON DELETE CASCADE;


--
-- Name: listing_amenities listing_amenities_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_amenities
    ADD CONSTRAINT listing_amenities_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: listing_categories listing_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories
    ADD CONSTRAINT listing_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: listing_categories listing_categories_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_categories
    ADD CONSTRAINT listing_categories_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: listing_photos listing_photos_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_photos
    ADD CONSTRAINT listing_photos_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: listings listings_host_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id) ON DELETE CASCADE;


--
-- Name: wishlist_items wishlist_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT wishlist_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 4xCAELFwOpo9IcZL2vBZgM8DhQIaBRPg8wLdwvcGSW4BKhl9h35tV0qE09gO5Ga

