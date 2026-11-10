# Product: Stylit Agent

Status: proposed

## Current vision
Read **[exec.md — current version v2](https://github.com/killbill2792/studio/blob/main/studio/ideas/stylit-agent/exec.md)** as the only vision source. This file defines product behavior and acceptance detail, not a second vision.

## Who it is for
People using Stylit for styling advice and shared outfit feedback.

## Experience specification
Implement the Stylist as an image-first screen with accessible controls and a stable bottom input. Keep every activity on the Stylist route when a sheet or panel can handle it; navigate to existing Pods or detail flow only as needed.

A single Stylist chat card shows swipeable Shop results with photo, brand, price, Try On, Buy, and See all N. Exactly four AI Stylist chips are specified only in exec.md. No extra screens or per-day chats. Consent is required to create a Pod, upload photos, personalize responses or send pushes. Show partial results as generated images arrive, not as a wall of chat text.

## In scope
Use the latest owner-approved interaction model in exec.md; do not copy its vision text here. No new application database tables; use dev.md for API, storage, failures and wait states. Verify design against the owner's mockup and Thanmayi's Figma source.

## Out of scope
Changes to protected try-on code, paid/live enablement or speculative sizes.

## Open questions
Exact colors and spacing await reference access. Do not guess.
