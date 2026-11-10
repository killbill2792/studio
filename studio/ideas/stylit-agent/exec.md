# Exec: Stylit Agent
Vision version: v2, date: 2026-11-10

Status: proposed. Only merging Studio PR #2 authorizes feature start; no live/paid services or app release without separate owner go-live approval.

## Vision
Stylit is one proactive, image-first AI fashion agent for Gen Z. **The single Stylist screen** replaces Shop; there are no new primary screens or Spaces. The hero shows the user wearing the current look. The floating **Current Outfit** panel has real item thumbnails, brand and remove controls; the hero has bookmark, share and “Why this works.” A slide-up/down **AI Stylist** sheet shows the latest short exchange and tappable inline cards; a slim chat bar grows only while typing.

**Exactly four chips**, all on the AI Stylist sheet: **Today's look, Style my closet, Find & buy, Elevate.** No Mix & Match, More Looks, Color Analysis or Style Advice chips. Elevate suggestions appear only when a real look is on screen. There are **no separate chip workflows** for styling combinations, colors or advice.

**“Style this” is a contextual action, not a chip or workflow.** Tap any Current Outfit thumbnail, closet item or Shop product and choose **Style this / Fit for you / Buy**. Asking “what goes with my black jeans?” in chat runs the same pairing action: one inline card with **2–3 pairings**, using closet items first and catalog items only to fill gaps, with Try On **only when a current look is on screen**, Buy and Send to Pod. No size until the user expresses interest.

Questions such as “what colors suit me?” or requests for style advice are answered in the **same chat** using existing color analysis, style fingerprint and Fit Profile. For an interested item, a **Fit for you** card gives supported size, color swatches/skin-tone verdict and one honest face/body suitability line. Never invent a size or a look-level score. **“Why this works”** gives the supported full look explanation.

**One continuous chat per user for all days**, backed by existing `chat_conversations` / `chat_messages`. The full timeline is **not shown by default**; the three-dot menu contains only **History** and **Saved looks & Pods**. History scrolls across days with dividers and tappable cards, restores chosen looks to the hero and expands cards full-screen *within the Stylist screen*. Shop searches appear as inline swipe cards (photo, brand, price, Try On, Buy, **See all N**), not a new Shop page.

**Style my closet** requires 3–4 clothing photos and a full-body profile image; generation starts immediately. The server planner picks three looks (closet, elevated, makeover) and routes composite garment images through the PR #4 gated Nano Banana try-on only. A style question during generation is optional. Each look is selectable and can be sent to Pod; **More** appears **on the three-looks card** to request another set through the same WF2 picker and PR #4 route, never as a chip.

The Stylist can offer **“I like this. Want a quick vote? I'd go Global.”** once per real look. An inline Pod-ready card pre-fills current image, title, Global, 15 minutes; Edit occurs inline and **only Go live** creates a real Pod. Live votes, invites, guest links and recaps reuse existing Pods. A No suppresses future offers for that look; no invented style score.

With opt-in, the app backend schedules tomorrow's look for eligible recently active users at 9 PM local time via Supabase hourly jobs and short per-user Vercel work, using closet, approved calendar event and test-only weather; the ready look appears in the hero and can notify by text-only Expo push. No external bot. The agent also proactively says **“I found this”** once after a shoppable look or responds to shopping requests; merchant Buy opens a verified store URL, not checkout.

**No new application database tables.** All Stylist interactions, cards and event/dedupe metadata go in the **one existing chat conversation** and its messages (additive column/index/RLS changes are allowed). Use existing `profiles`, `user_style_profile`, `try_on_history`, `saved_fits`, `pods`, `notifications`, `user_events` and per-user protected Storage paths as appropriate. Never create `closet_items`, `tomorrow_looks`, `buy_intents` or a separate History table. No code outside MVPStyli; this Studio PR is plans only.

## Why this matters
Pods are the core shared validation. Reuse color season, Fit Profile, rule-based Fit Check, style fingerprint/twins, StyleVault, owned garment catalog, SerpAPI search and current try-on. No separate bots, shopping APIs or model clients.

## Out of scope
Spaces, extra primary screens, separate chat threads or pages, independent pairing/color/advice workflows, new database tables, autonomous checkout, paid/live APIs, app-store deployment, push activation, secrets and affiliate links without owner go-live approval.

## Open questions
Owner reference screenshot and Thanmayi Figma from Trello tz4sewiZ must be obtained for precise visual sign-off. TEST identity pins, PR #4 merge plus migrations, provider rates, permissions, time zone and production eligibility must be checked before enabling services.

## Change rule
This is the ONLY current vision. Prior v1 is SUPERSEDED in `archive/`; coding chats **never read `archive/`**. Any future owner-approved vision change receives a new version/date and archives the previous complete text.
