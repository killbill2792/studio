# Exec: Stylit Agent
Vision version: v1, date: 2026-11-10

Status: proposed; owner starts work by merging this PR.

## Vision
Stylit is an AI fashion agent. For Gen Z, style is identity: it shows who they could be, not just clothes, and acts before they ask.

The ONE primary screen is Stylist (Agent), replacing Shop. Users see, talk and act there: looks, try-ons, products and Pods. Follow the owner's mockup: large try-on image on top, Current Outfit card, short AI Stylist message, chips for More Looks, Mix & Match, Color Analysis and Style Advice, and an always-bottom chat bar that grows only slightly while typing. Changes appear in the image rather than long text.

**Elevate Your Look appears only once an outfit or try-on image is already visible** (closet, earlier try-on, or tomorrow's look), never on an empty screen. Its short row uses active garment-catalog items with photo, brand, price and **Try On** but no size before the tap; tapping counts as interest and reveals existing Fit Check size, labeled profile size, or “size not confirmed.” It uses the on-screen look as the person image, a user-owned copy of the garment image and **only** the gated PR #4 Nano Banana route. Body-photo collection stays in the closet workflow, not Elevate.

The Stylist says “tap here to see products” and opens a same-screen sheet of about ten items (image, brand, price, Try On). It speaks first using style intelligence: “I think this suits you. Not sure? I can run a Pod. I'd go Global.” A Pod starts only after the user agrees.

After 3–4 closet photos, show three try-ons: closet-based, elevated and complete makeover. Ask a style question during generation and use answers to personalize future advice. Each look has Send to Pod.

With consent, the app's own nightly Vercel/Supabase backend makes tomorrow's look from closet, calendar event and weather and sends an Expo image push. No external bot.

Find-and-buy is triggered by “I found this” only after a shoppable look appears (Elevate Try On, an Elevated or Makeover closet look, or tomorrow's look), once per look, never at app open. The user can also ask to find or buy an item. Photo, brand and price always show with **no size** on look and catalog cards. When the user taps Try On or Buy, or says “I like this,” reveal a supported Fit Check size and a fit note; otherwise use a clearly labeled saved profile size or say “size not confirmed.” The button reads **Buy** and opens the store link; the user selects their own size on the store page. V1 has no checkout, payments or affiliate links. Live searches, paid APIs and affiliate links require separate owner go-live approval.

## Why this matters
Pods are the core USP: friends, style twins and global voters help validate each look. Reuse current color-season analysis, Fit Profile, rule-based Fit Check, style fingerprint, StyleVault, garments API and SerpAPI search. Never rebuild these.

## Success looks like
One visual interaction and proactive outfit advice while existing try-on, Pods, wardrobe, profiles and Fit Check continue working. All implementation goes to killbill2792/MVPStyli, never this studio repo.

## Out of scope
A second primary screen, separate bots, new image-model integration, rebuilding existing intelligence, live checkout, and unapproved production/App Store/paid API/secret changes.

## Open questions
The owner's mockup and Thanmayi's Nov 4 Figma files (Trello tz4sewiZ) were not accessible here. Obtain them; do not invent visuals. Calendar, location and push permissions must be designed before nightly enablement.

## Change rule
This is the ONLY current vision. Any change requires a new dated vision version; move the prior full text to `archive/` with `SUPERSEDED` at the top. Coding agents never read `archive/`.
