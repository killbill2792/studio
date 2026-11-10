# Exec: Stylit Agent
Vision version: v1, date: 2026-11-10

Status: proposed; owner starts work by merging this PR.

## Vision
Stylit is an AI fashion agent. For Gen Z, style is identity: it shows who they could be, not just clothes, and acts before they ask.

The ONE primary screen is Stylist (Agent), replacing Shop. Users see, talk and act there: looks, try-ons, products and Pods. Follow the owner's mockup: large try-on image on top, Current Outfit card, short AI Stylist message, Elevate Your Look items each with Try On, chips for More Looks, Mix & Match, Color Analysis and Style Advice, and an always-bottom chat bar that grows only slightly while typing. Changes appear in the image rather than long text.

The Stylist says “tap here to see products” and opens a same-screen sheet of about ten items (image, brand, price, Try On). It speaks first using style intelligence: “I think this suits you. Not sure? I can run a Pod. I'd go Global.” A Pod starts only after the user agrees.

After 3–4 closet photos, show three try-ons: closet-based, elevated and complete makeover. Ask a style question during generation and use answers to personalize future advice. Each look has Send to Pod.

With consent, the app's own nightly Vercel/Supabase backend makes tomorrow's look from closet, calendar event and weather and sends an Expo image push. No external bot.

The agent proactively finds items and recommends a size based on Fit Profile only when the fit data supports it. V1 opens the store link. Real checkout needs separate go-live approval.

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
