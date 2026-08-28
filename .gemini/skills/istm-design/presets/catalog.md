# 🎨 @istmx Design Presets Catalog

The `@istmx` Design Engine includes **70+ production-grade, reverse-engineered Design System presets** extracted from the world's most iconic digital products.

When generating a `.istm-context/design.md` or executing UI components in `/istm-design`, agents can dynamically match, recommend, or load any of these presets.

---

## 🚀 How Agents Use This Catalog

1. **Direct Keyword / Flag Matching**:
   - If the user specifies a brand name or flag (e.g., `--preset=linear`, `stripe-style`, `like apple`, `cursor-themed`), immediately load `istm-design/presets/<slug>/DESIGN.md` into `.istm-context/design.md`.
2. **Semantic Domain Recommendation (Discovery Gate)**:
   - If the user specifies an app category (e.g., "Build a RAG AI platform" or "Create a crypto exchange"), scan the taxonomy below and offer the top 3 matching presets.
3. **On-Demand Vibe Switching**:
   - If the user dislikes an initial design ("Make it brighter", "Feels too enterprise"), offer 2-3 contrasting presets from the relevant category.

---

## 📚 Preset Taxonomy & Keyword Triggers

### 1. 🤖 AI, LLM & Machine Learning Platforms
*Keywords: AI, LLM, RAG, Chatbot, Machine Learning, Prompt, Model, Intelligence*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `claude` | Claude / Anthropic | Warm Paper (`#faf9f5`) / Terracotta (`#d97757`) | Serif & Warm Sans | Editorial AI, thinking models, research chats |
| `cursor` | Cursor | Deep Dark (`#0a0a0c`) / Electric Indigo (`#6366f1`) | Technical Sans & Mono | Developer-focused AI, code editors |
| `cohere` | Cohere | Warm Coral / Deep Charcoal | Clean Modern Sans | Enterprise RAG, NLP embeddings |
| `mistral` | Mistral AI | Warm Amber (`#ff7000`) / Monochromatic Dark | Geometric Sans | Fast LLM inference, open-weight models |
| `ollama` | Ollama | Dark Minimalist / Clean White | Monospace & Modern Sans | Local AI runners, CLI tools |
| `replicate` | Replicate | High-Contrast Terminal / Neon Accent | Dense Monospace | Model hosting, API generation |
| `runwayml` | Runway | Cinematic Black / Electric Cyan | Modern Display | Gen-AI video, creative media tools |
| `elevenlabs` | ElevenLabs | Minimal Slate / Precision Blue | High-legibility Sans | Voice AI, audio synthesis |
| `xai` | xAI / Grok | True Monochromatic Black (`#000000`) | Bold Tech Sans | High-speed frontier AI |

---

### 2. ⚡ Developer Tools, Cloud & Infrastructure
*Keywords: DevTools, API, SaaS, Database, Cloud, Terminal, Infrastructure, Monitoring, Logging*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `linear` | Linear | Deep Canvas (`#010102`) / Lavender (`#5e6ad2`) | Linear Sans (-tracking) | Issue trackers, roadmaps, elite SaaS |
| `vercel` | Vercel | Pure Black / White / Hyper-minimal | Geist Sans & Geist Mono | Cloud hosting, frontend platforms, Indieweb |
| `supabase` | Supabase | Dark Surface (`#171717`) / Emerald (`#3ecf8e`) | Crisp Modern Sans | Backend-as-a-service, PostgreSQL tools |
| `raycast` | Raycast | Deep Charcoal (`#0f0f11`) / Vivid Red (`#ff6363`) | High-density Mono | Command palettes, launcher tools |
| `posthog` | PostHog | Light/Dark Hybrid / Retro Sunset Orange | Playful Bold Sans | Product analytics, feature flags |
| `clickhouse` | ClickHouse | Dark Charcoal / Bright Cyber Yellow | Data Monospace | Analytical databases, high-speed telemetry |
| `sentry` | Sentry | Dark Purple-Charcoal / Cyber Magenta | Clean Technical Sans | Error logging, crash reporting |
| `mongodb` | MongoDB | Dark Forest / Spring Green | Modern Enterprise Sans | NoSQL databases, cloud data platforms |
| `hashicorp` | HashiCorp | Dark Grid / Infrastructure Blue | Technical Sans | DevOps tools, Terraform cloud portals |
| `warp` | Warp | Jet Black / Cyan Glow | Terminal Monospace | Next-generation CLI terminals |

---

### 3. 💳 Fintech, Crypto & Banking
*Keywords: Fintech, Banking, Payments, Crypto, Exchange, Wallet, Invoicing, Billing*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `stripe` | Stripe | Slate Blue (`#0a2540`) / Radiant Violet (`#635bff`) | Banking-Grade Sans | Payment gateways, SaaS billing, checkout |
| `wise` | Wise | High-Contrast White / Forest Green (`#163300`) | Bold Expressive Sans | Currency exchange, global bank transfers |
| `coinbase` | Coinbase | Clean White / Electric Cobalt Blue | Trust-first Sans | Crypto retail, institutional brokerage |
| `binance` | Binance | Deep Dark (`#181a20`) / Bright Gold (`#f0b90b`) | Compact Numeric Sans | High-frequency trading, crypto exchanges |
| `kraken` | Kraken | Deep Indigo / Neon Violet | Crypto Trading Sans | Pro trading desks, OTC markets |
| `revolut` | Revolut | Ultra-clean White / Vibrant Indigo & Pink | Modern Mobile-first | Neo-banking, multi-currency wallets |
| `mastercard` | Mastercard | Warm Charcoal / Iconic Amber & Red | Corporate Geometric | Card services, global financial networks |

---

### 4. 🎨 Creative, Workspace & Productivity
*Keywords: Creative, Design, Workspace, Notion, Canvas, Docs, Collaboration, Notes*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `notion` | Notion | Cream Paper / Charcoal Ink (`#2f3437`) | Sans & Serif Hybrid | Wikis, documentation, modular workspaces |
| `figma` | Figma | Dark Canvas / Vibrant Multicolored Accents | Precision Vector Sans | Collaborative design tools, canvas apps |
| `framer` | Framer | Dark Metallic / Electric Blue | Kinetic Display Sans | Website builders, portfolio canvases |
| `miro` | Miro | Canvas Yellow & Warm White / Royal Blue | Creative Collaboration | Infinite whiteboards, brainstorming |
| `airtable` | Airtable | Crisp White / Multi-hued Primary Badges | Tabular Clean Sans | Relational spreadsheets, no-code bases |
| `cal` | Cal.com | Pure Minimal Monochrome / Subtle Hairlines | Restrained Modern Sans | Scheduling tools, calendar booking |
| `intercom` | Intercom | Clean White / Electric Blue (`#0057ff`) | Conversational Sans | Customer support, live chat widgets |
| `slack` | Slack | Clean White / Aubergine & Multi-Color Badges | Friendly Sans | Team communication, enterprise chat |
| `zapier` | Zapier | Crisp White / Vibrant Orange (`#ff4a00`) | Action-driven Sans | Workflow automation, integrations |

---

### 5. 🏎️ Luxury, Automotive & High-Impact Editorial
*Keywords: Luxury, Car, Automotive, High-Fashion, Premium, Dark Editorial, Cinematic*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `porsche` | Porsche | Cold Monochrome / Guard Red Accent | High-craft Extended Display | Automotive showrooms, luxury configurators |
| `ferrari` | Ferrari | Deep Jet Black / Corsa Red (`#d40000`) | Aggressive Bold Display | High-performance sports, exotic brands |
| `bugatti` | Bugatti | Ultra-deep Black / French Racing Blue | Refined Luxury Serif/Display | Hypercars, elite private sales |
| `lamborghini` | Lamborghini | Stealth Black / Cyber Yellow & Bronze | Angular Tech Display | Aggressive automotive, avant-garde design |
| `bmw-m` | BMW M | Asphalt Dark / Iconic M-Tri-Color Stripes | High-contrast Sport Sans | Performance engineering, tuning shops |
| `tesla` | Tesla | Minimal Clean White & Cold Gray | Architectural Sans | Electric vehicles, sustainable energy tech |

---

### 6. 🛍️ Consumer, E-Commerce & Lifestyle
*Keywords: E-commerce, Marketplace, Lifestyle, Retail, Fashion, Travel, Music, Social*

| Slug | Brand | Canvas / Primary Accent | Typography | Best For |
|---|---|---|---|---|
| `apple` | Apple | Airy Spatial White / Deep Space Gray | SF Pro Display & Text | Premium consumer tech, hardware showcases |
| `airbnb` | Airbnb | Warm Clean Canvas / Rausch Coral (`#ff5a5f`) | Friendly Geometrical | Travel booking, rental marketplaces |
| `spotify` | Spotify | Pitch Black (`#121212`) / Spotify Green (`#1ed760`) | High-density Circular | Audio streaming, media hubs, entertainment |
| `shopify` | Shopify | Trust White / Mint Green (`#008060`) | Merchant E-commerce Sans | Storefronts, retail admin panels |
| `nike` | Nike | High-energy Monochrome / Bold Dynamic Accents | Heavy Extended Display | Athleisure, high-impact retail |
| `uber` | Uber | Pure Black & White / Restrained Blueprint | High-legibility Universal | Mobility apps, on-demand logistics |
| `starbucks` | Starbucks | Warm Beige & Off-white / Deep House Green | Artisan Warm Sans | Food & beverage, artisan retail |
| `theverge` | The Verge | High-saturation Neon / Acid Green & Magenta | Cyber Editorial Display | Tech journalism, review blogs |

---

## ⚡ Loading a Preset

To apply any preset to a project:
```bash
# Example: Load Linear design system
cp istm-design/presets/linear/DESIGN.md .istm-context/design.md
```
Or simply instruct your agent:
> `"/istm-design apply preset linear"`
