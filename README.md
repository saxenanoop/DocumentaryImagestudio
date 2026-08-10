# Documentary Image Studio

> **Create documentary-style AI visuals with ethical clarity.**

**Documentary Image Studio** is a complete, no-login MVP web application designed for NGOs, agencies, educators, documentary researchers, and impact storytelling teams. It turns documentary briefs into structured, documentary-grade 3-shot prompt plans (*Establishing Shot*, *Medium/Interaction Shot*, *Detail Shot*) with ethical disclosures, copyable prompts, and prompt studio tools.

---

## 🌟 Key Features

- **No User Login & No API Key Required**: Operates 100% client-side without paid third-party APIs, user accounts, or billing.
- **Documentary Photography Formula**: Constructs prompts following real documentary principles:
  $$\text{Shot Type} + \text{Subject \& Action} + \text{Environment} + \text{Camera/Lens} + \text{Film Stock} + \text{Lighting} + \text{Documentary Imperfections} + \text{Negative Avoidance}$$
- **3 Structured Shots**:
  1. **Establishing Shot**: 24mm wide angle, environment context, sense of scale.
  2. **Medium / Interaction Shot**: 35mm/50mm lens, human connection, unposed candid action.
  3. **Detail Shot**: 90mm macro lens, shallow depth of field, tactile textures and micro-details.
- **Mandatory Ethical Disclosures**: Automatically attaches synthetic media disclosure captions:
  > *"Synthetic documentary image created with AI to illustrate [Topic]. This is not a photograph of a real person, event, or place."*
- **8 Preset Styles**: Includes presets for *Social*, *Climate*, *Cultural Heritage*, *Education*, *Humanitarian*, *Urban*, *Workplace*, and *Speculative* documentary briefs.
- **Export & Download**: One-click prompt copying, markdown prompt sheet export (`.md`), and local storage auto-save.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

---

## 📜 Ethical Use Guidelines

- **Synthetic Media Notice**: All outputs are synthetic illustrations intended for storyboarding, concept development, and educational use.
- **Anti-Deception**: Outputs must not be presented as real photographic evidence or fabricated news events.

---

## 📄 License

MIT License. Designed for ethical impact storytelling and open educational use.
