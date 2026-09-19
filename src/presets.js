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
      subject: "Local farmers and community volunteers actively cataloging traditional seed varieties together",
      location: "Rural agricultural cooperative community hub",
      timeOfDay: "Late afternoon golden hour",
      lighting: "Warm natural sunlight filtering through barn wooden slats",
      mood: "Dignified, collaborative, hopeful, authentic",
      visualStyle: "Unposed social realism, candid documentary framing, intimate human connection",
      filmLook: "Warm & Hopeful Daylight (Kodak Portra 400 35mm)",
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
      subject: "Marine biology researchers actively planting and measuring mangrove saplings in tidal waters",
      location: "Tropical mangrove estuary and research outpost",
      timeOfDay: "Early morning sunrise & morning mist",
      lighting: "Soft diffuse morning light with glowing low-horizon sun rays",
      mood: "Urgent, scientific, tranquil, protective",
      visualStyle: "Environmental documentary, wide ecological framing, clear natural textures",
      filmLook: "Cool & Natural Greens (Fujifilm Pro 400H)",
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
      subject: "Master artisan weaver passionately guiding a young apprentice at a wooden handloom",
      location: "Heritage artisan workshop in a historic mountain village",
      timeOfDay: "Midday natural daylight",
      lighting: "Direct directional window light highlighting thread textures and dust motes",
      mood: "Reverent, focused, timeless, tactile",
      visualStyle: "Heritage photojournalism, rich tactile focus, deep environmental depth",
      filmLook: "Classic B&W Historic Journal (Kodak Tri-X 400)",
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
      subject: "Children actively engaging in an interactive storytelling session inside a solar bus library",
      location: "Rural village community center courtyard",
      timeOfDay: "Overcast diffused light",
      lighting: "Soft ambient diffused window light",
      mood: "Curious, joyous, engaged, warm",
      visualStyle: "Human-centric photojournalism, expressive candid faces, eye-level camera placement",
      filmLook: "Warm & Hopeful Daylight (Kodak Portra 400 35mm)",
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
      subject: "Community leaders operating a solar-powered water filtration pump to fill clean containers",
      location: "Semi-arid community water collection point",
      timeOfDay: "Late afternoon golden hour",
      lighting: "Warm low-angle sun creating long shadows",
      mood: "Relieved, empowered, respectful, dignified",
      visualStyle: "Ethical humanitarian photojournalism, respectful distance, un-sensationalized storytelling",
      filmLook: "Warm & Hopeful Daylight (Kodak Portra 400 35mm)",
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
      subject: "Maintenance crew collaboratively inspecting an electric light-rail train inside a central depot",
      location: "Metropolitan public transit maintenance depot",
      timeOfDay: "Night atmosphere with artificial work lights",
      lighting: "Cool overhead depot lamps contrasting with warm halogen worklights",
      mood: "Industrious, atmospheric, quiet, grounded",
      visualStyle: "Urban street documentary, strong geometrical lead lines, high atmospheric contrast",
      filmLook: "Moody Night & Industrial Worklight (Cinestill 800T)",
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
      subject: "Horticulturist carefully examining fruit tree buds in early spring with soil quality notes",
      location: "Family-owned organic orchard",
      timeOfDay: "Early morning sunrise & morning mist",
      lighting: "Backlit morning sun with dewy lens flare and clear texture details",
      mood: "Dedicated, pragmatic, patient, grounded",
      visualStyle: "Workplace observational photojournalism, focus on hands and tool interaction",
      filmLook: "Vivid Sharp Detail & Earth Tones (Kodak Ektar 100)",
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
      timeOfDay: "Midday natural daylight",
      lighting: "Even ambient daylight through translucent skylights",
      mood: "Visionary, practical, serene, innovative",
      visualStyle: "Architectural documentary, clean geometric composition, observational distance",
      filmLook: "Cool & Natural Greens (Fujifilm Pro 400H)",
      aspectRatio: "16:9"
    }
  }
];
