/**
 * Documentary Style Presets
 * Pre-configured briefs for standard documentary photography categories.
 */

export const DOCUMENTARY_PRESETS = [
  {
    id: "social",
    title: "Social Documentary",
    icon: "users",
    description: "Community resilience, grassroot initiatives, and everyday human labor.",
    sampleImage: "/samples/social_doc.jpg",
    defaults: {
      projectName: "Grassroots Seed Bank Initiative",
      topic: "Community Food Sovereignty & Local Agriculture",
      subject: "Local farmers and community volunteers organizing traditional seed varieties in a rustic barn",
      location: "Rural agricultural cooperative community hub",
      timeOfDay: "Late afternoon golden hour",
      lighting: "Warm natural sunlight filtering through barn wooden slats",
      mood: "Dignified, collaborative, hopeful, authentic",
      visualStyle: "Unposed social realism, candid documentary framing, intimate human connection",
      filmLook: "Kodak Portra 400 35mm, warm natural grain, soft highlights",
      aspectRatio: "16:9"
    }
  },
  {
    id: "climate",
    title: "Climate Documentary",
    icon: "globe",
    description: "Environmental transitions, conservation field studies, and climate adaptation.",
    sampleImage: "/samples/climate_doc.jpg",
    defaults: {
      projectName: "Coastal Wetland Restoration Project",
      topic: "Mangrove Reforestation & Ecosystem Defense",
      subject: "Marine biology researchers measuring young mangrove saplings along tidal waters",
      location: "Tropical mangrove estuary and research outpost",
      timeOfDay: "Early morning twilight & sunrise mist",
      lighting: "Soft diffuse morning light with glowing low-horizon sun rays",
      mood: "Urgent, scientific, tranquil, protective",
      visualStyle: "Environmental documentary, wide ecological framing, clear natural textures",
      filmLook: "Fujifilm Pro 400H, cool muted greens and blues, fine film grain",
      aspectRatio: "16:9"
    }
  },
  {
    id: "heritage",
    title: "Cultural Heritage",
    icon: "compass",
    description: "Indigenous traditions, living craftsmanship, and historical preservation.",
    sampleImage: "/samples/detail_doc.jpg",
    defaults: {
      projectName: "Living Artisans Archive",
      topic: "Traditional Hand-Loom Textile Weaving Traditions",
      subject: "Master weaver guiding a young apprentice at a wooden handloom",
      location: "Heritage artisan workshop in a historic mountain village",
      timeOfDay: "Mid-day side-lighting",
      lighting: "Direct directional window light highlighting thread textures and dust motes",
      mood: "Reverent, focused, timeless, tactile",
      visualStyle: "Heritage photojournalism, rich tactile focus, deep environmental depth",
      filmLook: "Kodak Tri-X 400 Black & White, high contrast grain, deep shadow tones",
      aspectRatio: "4:3"
    }
  },
  {
    id: "education",
    title: "Education Documentary",
    icon: "book",
    description: "Literacy programs, rural classrooms, and intergenerational learning.",
    sampleImage: "/samples/social_doc.jpg",
    defaults: {
      projectName: "Mobile Library Outreach",
      topic: "Rural Literacy Access & Community Education",
      subject: "Children listening intently to a storyteller inside a converted solar bus library",
      location: "Rural village community center courtyard",
      timeOfDay: "Overcast afternoon",
      lighting: "Soft ambient diffused window light",
      mood: "Curious, joyous, engaged, warm",
      visualStyle: "Human-centric photojournalism, expressive candid faces, eye-level camera placement",
      filmLook: "Kodak Portra 800, vibrant natural skin tones, soft shadows",
      aspectRatio: "3:2"
    }
  },
  {
    id: "humanitarian",
    title: "Humanitarian Documentary",
    icon: "heart",
    description: "Relief efforts, clean water access, and healthcare mobility.",
    sampleImage: "/samples/climate_doc.jpg",
    defaults: {
      projectName: "Clean Water Mobile Filtration Unit",
      topic: "Sub-Saharan Clean Water Access & Infrastructure",
      subject: "Community members testing purified water at a newly installed solar filtration pump",
      location: "Semi-arid community water collection point",
      timeOfDay: "Late afternoon soft sun",
      lighting: "Warm low-angle sun creating long shadows",
      mood: "Relieved, empowered, respectful, dignified",
      visualStyle: "Ethical humanitarian photojournalism, respectful distance, un-sensationalized storytelling",
      filmLook: "Fujifilm Superia 400, natural color reproduction, authentic grain",
      aspectRatio: "16:9"
    }
  },
  {
    id: "urban",
    title: "Urban Documentary",
    icon: "city",
    description: "Public transit systems, urban agriculture, and civic life.",
    sampleImage: "/samples/social_doc.jpg",
    defaults: {
      projectName: "Night Transit Workers",
      topic: "Essential Urban Infrastructure & Night Economy",
      subject: "Maintenance crew preparing an electric light-rail train inside a central depot",
      location: "Metropolitan public transit maintenance depot",
      timeOfDay: "Pre-dawn blue hour",
      lighting: "Cool overhead depot lamps contrasting with warm halogen worklights",
      mood: "Industrious, atmospheric, quiet, grounded",
      visualStyle: "Urban street documentary, strong geometrical lead lines, high atmospheric contrast",
      filmLook: "Cinestill 800T, glowing tungsten highlights, moody deep blue shadows",
      aspectRatio: "16:9"
    }
  },
  {
    id: "workplace",
    title: "Workplace Documentary",
    icon: "briefcase",
    description: "Sustainable farming, small workshops, and trade apprenticeships.",
    sampleImage: "/samples/detail_doc.jpg",
    defaults: {
      projectName: "Regenerative Organic Orchard",
      topic: "Soil Regeneration & Sustainable Agriculture Trades",
      subject: "Pruner examining fruit tree buds in early spring with soil quality notes",
      location: "Family-owned organic orchard",
      timeOfDay: "Early morning crisp sunlight",
      lighting: "Backlit morning sun with dewy lens flare and clear texture details",
      mood: "Dedicated, pragmatic, patient, grounded",
      visualStyle: "Workplace observational photojournalism, focus on hands and tool interaction",
      filmLook: "Kodak Ektar 100, sharp detail, saturated natural earth tones",
      aspectRatio: "3:2"
    }
  },
  {
    id: "speculative",
    title: "Speculative Documentary",
    icon: "sparkle",
    description: "Futuristic climate adaptations, circular economy, and post-carbon living.",
    sampleImage: "/samples/climate_doc.jpg",
    defaults: {
      projectName: "Circular Bio-City Housing Prototype",
      topic: "Zero-Carbon Urban Bio-Building Materials",
      subject: "Architect inspecting mycelium insulation panels in a climate-resilient residential module",
      location: "Experimental urban bio-materials lab",
      timeOfDay: "Neutral diffuse daylight",
      lighting: "Even ambient daylight through translucent skylights",
      mood: "Visionary, practical, serene, innovative",
      visualStyle: "Architectural documentary, clean geometric composition, observational distance",
      filmLook: "Kodak Portra 160, clean neutral tones, high clarity, subtle grain",
      aspectRatio: "16:9"
    }
  }
];
