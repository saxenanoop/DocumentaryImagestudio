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
- **Inbuilt Video Generation Node (Modular & Decoupled)**:
  - 100% browser-native procedural documentary cinema video synthesis (HTML5 Canvas 2D + Web Audio API foley + MediaRecorder).
  - 5 film stock emulations: *Kodak Portra 400*, *Kodak Tri-X 400 B&W*, *16mm Vintage Reversal*, *Fujifilm Pro 400H*, *Kodachrome 64*.
  - 6 optical motion styles: *Slow Push-In*, *Handheld Tracking*, *Dolly Parallax Orbit*, *Observational Wide*, *Aerial Reveal*, *Rack Focus*.
  - Viewfinder Director HUD with running timecode, audio VU levels, lens optics, and lower-third captions.
  - Generates downloadable `.webm`/`.mp4` video files with one click.
  - **Decoupled Architecture**: Designed as a standalone modular node. Can be disabled or removed in 1 second by toggling `export const ENABLE_VIDEO_GEN_NODE = false;` in `src/main.js` without affecting the rest of the application.
- **Export & Download**: One-click prompt copying, markdown prompt sheet export (`.md`), video file download, and local storage auto-save.

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
