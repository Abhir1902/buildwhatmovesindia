# How Codex was used to build SETU

SETU is a compliance operating system for Indian SMEs, submitted to Build What Moves India as an independent hackathon prototype.

Codex was used as a working partner on this build, not as a one-shot generator:

- Domain model in `src/domain/types.ts` (requirements, journeys, filings, vault documents, professionals).
- Mock government desks in `src/data/portals.ts` and the filing session in `src/components/filing/portal-session.tsx`.
- The local search engine in `src/services/compliance-assistant.ts` (synonyms, Hinglish, glossary) so Ask SETU and ⌘K work offline.
- The suite shell (waffle launcher, command bar, per-app icons) in `src/components/suite/` after the top-250 selection, to make the product read as a set of apps rather than a single long page.
- i18n dictionaries and merge fallbacks so Hindi and Marathi launcher copy can sit on an English base.

Human decisions that stayed explicit: the problem (Ease of Doing Business for SMEs, not another RTI clone), mock-only data (no live government APIs), the OpenAI canvas + Fluent structure split, and the demo script (Discover → Register → File → Vault).

This prototype does not connect to live government systems. Acknowledgements, OTPs and filings are simulated.
