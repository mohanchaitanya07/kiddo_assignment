# Kiddo — Server-Driven UI Homepage Renderer

A production-style **Server-Driven UI (SDUI)** homepage engine for *Kiddo*, a Q-commerce app
for kids & baby essentials. The React Native client is a **"dumb" rendering engine**: it ingests
a JSON payload from the backend and dynamically builds the screen, injects themes, runs live
campaigns, and dispatches actions — **without any App/Play Store release**.

> Built with Expo (managed) · TypeScript **strict** · `@shopify/flash-list` · `lottie-react-native` · Zustand.

---

## 1. The problem we are solving

Kiddo's homepage is highly volatile — Diwali, New Year, Summer sales etc. run as **live campaigns**,
and the hard constraint is **zero binary releases**. So the homepage layout, theme, content and even
the interactive behaviour must be **driven by data from the server**, not hard-coded in the app.

The challenge is to build the client engine that:

1. **Parses** a large, deeply-structured JSON payload.
2. **Maps** each backend node to a UI component via a scalable registry (not a brittle `switch`).
3. **Renders** heterogeneous blocks (hero banners, product grids, horizontal carousels) inside a
   single high-performance vertical list.
4. **Survives** corrupt / unknown nodes without crashing (resilience).
5. **Runs live campaigns** — swap theme + content + a full-screen animation overlay instantly.
6. **Stays fast** — adding one item to the cart must NOT re-render the other 50+ cards in the feed.

---

## 2. How I approached it

I treated the payload as **untrusted input** and built a clean pipeline:

```
RAW JSON payload  ──▶  parseLayout()  ──▶  Component Registry  ──▶  one FlashList  ──▶  screen
   (untrusted)        (validate +        (type → component,        (virtualized,
                       drop bad nodes)     hash-map factory)         memoized rows)
```

Cross-cutting concerns are each isolated into their own module so a component never mixes
responsibilities:

| Concern | Where it lives | One-line idea |
|---|---|---|
| **Type contracts** | `src/types/sdui.ts` | Discriminated unions for blocks + actions. |
| **Validation / resilience** | `src/registry/validate.ts`, `parseLayout.ts` | Narrow `unknown` → typed; drop bad nodes. |
| **Component factory** | `src/registry/registry.ts` | `Map<type, {parse, Component}>` — no `switch`. |
| **Action handling** | `src/actions/dispatcher.ts` | One `handleAction()` coordinator. |
| **Theming (OTA)** | `src/theme/ThemeContext.tsx` | React Context wrapping the root. |
| **Cart state** | `src/store/cartStore.ts` | Zustand + narrow selectors = render isolation. |
| **Campaigns** | `src/data/payloads.ts`, `CampaignOverlay.tsx` | 3 themed payloads + Lottie overlay. |

The guiding principle: **components stay dumb**. A `ProductCard` knows how to *look* and how to
*emit a declarative action* — it knows nothing about carts, coupons, navigation, or themes-by-name.

---

## 3. Codebase structure

```
kiddo/
├── App.tsx                     # Root: theme provider + FlashList feed + overlay + campaign state
├── assets/
│   ├── lottie/                 # 3 generated, valid Lottie animations (offline)
│   │   ├── back-to-school.json #   falling pencils (yellow/blue)
│   │   ├── summer-playhouse.json #  rising bubbles (ocean blue)
│   │   └── mystery-carnival.json # confetti burst (carnival red)
│   └── lottieMap.ts            # logical key → bundled asset (the "cache hit" path)
└── src/
    ├── types/sdui.ts           # ALL schema types: Action, Theme, Product, blocks, payload
    ├── registry/
    │   ├── registry.ts         # the hash-map Component Registry (Factory Pattern)
    │   ├── validate.ts         # runtime guards: parseAction / parseProduct
    │   └── parseLayout.ts      # untrusted payload → safe renderable list (resilience)
    ├── actions/dispatcher.ts   # Universal Action Dispatcher: handleAction()
    ├── theme/ThemeContext.tsx  # OTA theming via React Context
    ├── store/cartStore.ts      # Zustand cart + isolated selector hooks
    ├── components/
    │   ├── blocks/
    │   │   ├── index.ts            # barrel: registers all blocks (factory wiring)
    │   │   ├── BannerHero.tsx      # BANNER_HERO       + its validator
    │   │   ├── ProductGrid2x2.tsx  # PRODUCT_GRID_2X2  + its validator
    │   │   └── DynamicCollection.tsx # DYNAMIC_COLLECTION (nested horizontal FlatList)
    │   ├── common/
    │   │   ├── ProductCard.tsx     # atomic, memoized, render-isolated card
    │   │   └── Header.tsx          # greeting + cart badge + campaign switcher
    │   └── CampaignOverlay.tsx     # full-screen Lottie, pointerEvents="none"
    ├── data/
    │   ├── products.ts         # catalog + block authoring helpers
    │   └── payloads.ts         # base homepage + 3 campaign payloads (mock backend)
    └── screens/HomeScreen.tsx  # the single vertical FlashList
```

---

## 4. How each requirement is met (mapped to the brief)

### A. JSON Schema & Component Registry — Factory Pattern, not `switch`
- `registry.ts` is a `Map<string, BlockDefinition>`. Each block **registers itself**
  (`registerBlock({ type, parse, Component })`) — see the bottom of every file in `blocks/`.
- Adding a new block type = create one file + add one line to `blocks/index.ts`. **The renderer
  never changes.** No central `switch` to grow.
- Supported types: `BANNER_HERO`, `PRODUCT_GRID_2X2`, `DYNAMIC_COLLECTION`.

### ⚠️ Resilience — graceful failure
- `parseLayout.ts` walks the payload; for each node it does an O(1) registry lookup then validates.
- **Unknown type** (the payload literally contains a `NEW_COMPONENT_V2` node) → registry miss → dropped.
- **Corrupt node** (the payload contains a `PRODUCT_GRID_2X2` with an empty product list) → validator
  returns `null` → dropped.
- Everything before/after a bad node still renders. A `warnOnce` logs it in dev, once.

### B. Dynamic Collections & virtualization boundaries
- `DynamicCollection.tsx` is a **horizontal `FlatList` nested inside the vertical `FlashList`**.
- Scroll momentum is preserved because the inner list is `horizontal` — RN's gesture responder routes
  horizontal pans to it and vertical pans to the outer list, so they don't fight.
- Heap stays bounded via `getItemLayout` (O(1) scroll math), `removeClippedSubviews`, and small
  `initialNumToRender` / `maxToRenderPerBatch` / `windowSize`.

### C. The Universal Action Dispatcher
- One `handleAction(action)` in `dispatcher.ts`. Components only emit a declarative
  `{ type, payload }`; all business logic lives in the dispatcher.
- The `switch` is **exhaustive over a discriminated union** — an `assertNever` default makes a
  forgotten action type a *compile* error.
- Handles `ADD_TO_CART`, `DEEP_LINK`, `OPEN_PRODUCT`, `BOOK_EVENT`, `APPLY_MYSTERY_GIFT_COUPON`.

### D. High frame-rate optimization
- The **entire** layout streams through **one** vertical list — `FeedList` (`HomeScreen.tsx`).
- `FeedList` uses **FlashList v2** on the New Architecture (recommended, recycling) and falls back to
  a **tuned FlatList** on old-architecture hosts, so the single-list design runs everywhere.
- `keyExtractor` returns each block's **stable server id** → correct recycling, no flicker.
- `getItemType` groups rows by block type into separate recycle pools (FlashList path).
- Every block + the `ProductCard` is wrapped in `React.memo`. A root **ErrorBoundary** isolates any
  render fault and shows a readable message instead of a blank screen.

### Advanced A. Remote overlay contexts (Campaign Engine)
- Three distinct campaigns in `payloads.ts`: **Back to School**, **Summer Playhouse**,
  **Mystery Gift Carnival** — each with its own theme, a signature row, and a `FULL_SCREEN_OVERLAY`.
- `CampaignOverlay.tsx` renders the Lottie animation in an absolute-fill layer with
  **`pointerEvents="none"`**, so you can keep scrolling/tapping the feed underneath.
- Asset resolution goes through a **cache pipeline** (`resolveAnimationSource`): bundled on-device
  asset = cache hit; the production remote `animation_url` is the documented cache-miss path.

### Advanced B. OTA runtime theming
- The payload's `theme` is pushed into a **React Context** wrapping the root (`App.tsx`).
- Every skinnable element (`ProductCard` ADD button, banner CTA, headers, badges, borders) samples
  `useTheme()` — switch a campaign and the whole app re-skins instantly.

### Advanced C. Local state collocation (the rendering challenge)
- Cart lives in an **external Zustand store**, not in the React tree.
- The header badge subscribes to `count`; a `ProductCard` subscribes to `qtyOf(id)`.
- Tapping **ADD** updates the store → only the **badge** + that **one card** re-render. The other
  50+ cards subscribe to nothing cart-related, so they **don't re-render**. (Verify in the React
  DevTools "highlight re-renders" — only two components flash.)

---

## 5. How to run it

### Web (recommended — runs on this machine, no phone needed)
```bash
cd /home/mohan/kiddo
npm install      # first time only
npm run web      # opens http://localhost:8081 in your browser
```
On web the Lottie confetti is shown as a small badge (lottie is native-only); everything else — the
SDUI feed, grids, carousels, cart, theming, campaign switching, resilience — works fully.

### Phone (optional — for the full Lottie animation)
```bash
npm start                 # then scan the QR with Expo Go (Expo SDK 55)
# if the phone can't reach the dev server:
npm run lan               # phone + computer on the SAME Wi-Fi
npm run tunnel            # any network (routes via the internet)
```
> Expo Go must match the project's SDK (**55**). If Expo Go says "incompatible", it's on a different
> SDK — align `expo` in `package.json` to it and run `npx expo install --fix`.

### Quality checks
```bash
npm run typecheck   # strict TypeScript — passes clean
npm test            # jest: renders App + every block, asserts no throw
```

### What to try in the app
1. Tap **ADD** on several cards → the cart badge counts up instantly; notice the feed doesn't flicker.
2. Tap the campaign chips at the top (**Back to School / Summer / Carnival**) → theme + content +
   animated overlay all change instantly (this is the "no app release" demo).
3. While a campaign overlay is animating, **scroll and tap right through it** — `pointerEvents="none"`.
4. Open `src/data/payloads.ts` and note the `NEW_COMPONENT_V2` and empty-grid nodes — they’re in the
   feed data but silently dropped (resilience).

---

## 6. Tech choices & trade-offs (the "why")

- **Expo (managed)** — one command to run on a real phone via Expo Go; no native build setup. Bare
  RN was acceptable per the brief but adds friction for a reviewer.
- **`@shopify/flash-list` v2 with a FlatList fallback (`FeedList`)** — auto-sizing, recycling list for
  the best sustained frame rate; the fallback guarantees the app runs on old-architecture hosts too.
- **Zustand over Context for the cart** — Context would re-render every consumer on any change.
  Zustand’s selector subscriptions give surgical re-renders, which is exactly the rendering mandate.
- **Context for theme** — theme changes are deliberately global (a campaign switch *should* re-skin
  everything), and the brief explicitly asks for a Context Provider. Right tool for that job.
- **Discriminated unions everywhere** — blocks and actions are unions keyed on a literal `type`, so
  the compiler enforces exhaustive handling and safe narrowing of unpredictable payloads.
- **Generated local Lottie** — the brief's `assets.example.com` URLs are placeholders. I generated
  three *valid* Lottie files so the app runs fully offline; the remote-URL cache path is implemented
  and documented in `CampaignOverlay.tsx`.

---

## 7. Known simplifications (honest notes)

- Product images are emoji + colour swatches (no real CDN images) so the demo runs offline. The
  `OPEN_PRODUCT` / navigation actions surface an `Alert` instead of routing to a real screen.
- The "backend" is local mock data in `src/data/`. The client treats it exactly as if it came over
  the wire (loose `RawBlock` types, full validation), so swapping in a real `fetch()` is a one-line
  change in `App.tsx`.
- No navigation library (single screen by design — the brief is a homepage renderer).
