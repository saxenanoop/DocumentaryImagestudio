(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();function E(t="home"){return`
    <header class="site-header">
      <div class="container header-inner">
        <a href="#home" class="brand-link" data-route="home">
          <div class="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <div>
            <span class="brand-title">Documentary Image Studio</span>
          </div>
          <span class="ethical-pill">Ethical AI</span>
        </a>

        <nav>
          <ul class="nav-menu">
            <li>
              <a href="#home" class="nav-link ${t==="home"?"active":""}" data-route="home">
                Home
              </a>
            </li>
            <li>
              <a href="#create" class="nav-link ${t==="create"?"active":""}" data-route="create">
                Create Visual
              </a>
            </li>
            <li>
              <a href="#ethics" class="nav-link ${t==="ethics"?"active":""}" data-route="ethics">
                Ethics Guidelines
              </a>
            </li>
            <li>
              <a href="#history" class="nav-link ${t==="history"?"active":""}" data-route="history">
                Saved Drafts
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `}function L(){return`
    <footer class="site-footer">
      <div class="container footer-content">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <strong style="font-family: var(--font-serif); font-size: 1.1rem;">Documentary Image Studio</strong>
        </div>

        <p class="footer-text" style="max-width: 600px;">
          Designed for NGOs, agencies, educators, documentary researchers, and impact storytelling teams to turn briefs into structured documentary prompts with ethical clarity.
        </p>

        <p class="footer-text" style="font-size: 0.8rem; color: var(--text-light);">
          Synthetic Documentary Visual Disclosure: All generated prompts and images are synthetic media intended for storyboarding, pre-visualization, and educational illustration.
        </p>

        <ul class="footer-nav">
          <li><a href="#create" data-route="create">Create Visual</a></li>
          <li><a href="#ethics" data-route="ethics">Ethics Guidelines</a></li>
          <li><a href="#history" data-route="history">Saved Drafts</a></li>
        </ul>

        <p class="footer-text" style="font-size: 0.75rem; margin-top: 0.5rem;">
          © ${new Date().getFullYear()} Documentary Image Studio. Open, ethical, no-login MVP.
        </p>
      </div>
    </footer>
  `}function d(t,e="info"){let a=document.getElementById("toast-container");a||(a=document.createElement("div"),a.id="toast-container",a.className="toast-container",document.body.appendChild(a));const i=document.createElement("div");i.className=`toast toast-${e}`;const o=e==="success"?'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>':'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';i.innerHTML=`${o} <span>${t}</span>`,a.appendChild(i),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(20px)",i.style.transition="all 0.3s ease",setTimeout(()=>i.remove(),300)},3e3)}const v=[{id:"social",title:"Social Documentary",icon:"users",description:"Community resilience, grassroot initiatives, and everyday human labor.",sampleImage:"/samples/social_doc.jpg",defaults:{projectName:"Grassroots Seed Bank Initiative",topic:"Community Food Sovereignty & Local Agriculture",subject:"Local farmers and community volunteers organizing traditional seed varieties in a rustic barn",location:"Rural agricultural cooperative community hub",timeOfDay:"Late afternoon golden hour",lighting:"Warm natural sunlight filtering through barn wooden slats",mood:"Dignified, collaborative, hopeful, authentic",visualStyle:"Unposed social realism, candid documentary framing, intimate human connection",filmLook:"Kodak Portra 400 35mm, warm natural grain, soft highlights",aspectRatio:"16:9"}},{id:"climate",title:"Climate Documentary",icon:"globe",description:"Environmental transitions, conservation field studies, and climate adaptation.",sampleImage:"/samples/climate_doc.jpg",defaults:{projectName:"Coastal Wetland Restoration Project",topic:"Mangrove Reforestation & Ecosystem Defense",subject:"Marine biology researchers measuring young mangrove saplings along tidal waters",location:"Tropical mangrove estuary and research outpost",timeOfDay:"Early morning twilight & sunrise mist",lighting:"Soft diffuse morning light with glowing low-horizon sun rays",mood:"Urgent, scientific, tranquil, protective",visualStyle:"Environmental documentary, wide ecological framing, clear natural textures",filmLook:"Fujifilm Pro 400H, cool muted greens and blues, fine film grain",aspectRatio:"16:9"}},{id:"heritage",title:"Cultural Heritage",icon:"compass",description:"Indigenous traditions, living craftsmanship, and historical preservation.",sampleImage:"/samples/detail_doc.jpg",defaults:{projectName:"Living Artisans Archive",topic:"Traditional Hand-Loom Textile Weaving Traditions",subject:"Master weaver guiding a young apprentice at a wooden handloom",location:"Heritage artisan workshop in a historic mountain village",timeOfDay:"Mid-day side-lighting",lighting:"Direct directional window light highlighting thread textures and dust motes",mood:"Reverent, focused, timeless, tactile",visualStyle:"Heritage photojournalism, rich tactile focus, deep environmental depth",filmLook:"Kodak Tri-X 400 Black & White, high contrast grain, deep shadow tones",aspectRatio:"4:3"}},{id:"education",title:"Education Documentary",icon:"book",description:"Literacy programs, rural classrooms, and intergenerational learning.",sampleImage:"/samples/social_doc.jpg",defaults:{projectName:"Mobile Library Outreach",topic:"Rural Literacy Access & Community Education",subject:"Children listening intently to a storyteller inside a converted solar bus library",location:"Rural village community center courtyard",timeOfDay:"Overcast afternoon",lighting:"Soft ambient diffused window light",mood:"Curious, joyous, engaged, warm",visualStyle:"Human-centric photojournalism, expressive candid faces, eye-level camera placement",filmLook:"Kodak Portra 800, vibrant natural skin tones, soft shadows",aspectRatio:"3:2"}},{id:"humanitarian",title:"Humanitarian Documentary",icon:"heart",description:"Relief efforts, clean water access, and healthcare mobility.",sampleImage:"/samples/climate_doc.jpg",defaults:{projectName:"Clean Water Mobile Filtration Unit",topic:"Sub-Saharan Clean Water Access & Infrastructure",subject:"Community members testing purified water at a newly installed solar filtration pump",location:"Semi-arid community water collection point",timeOfDay:"Late afternoon soft sun",lighting:"Warm low-angle sun creating long shadows",mood:"Relieved, empowered, respectful, dignified",visualStyle:"Ethical humanitarian photojournalism, respectful distance, un-sensationalized storytelling",filmLook:"Fujifilm Superia 400, natural color reproduction, authentic grain",aspectRatio:"16:9"}},{id:"urban",title:"Urban Documentary",icon:"city",description:"Public transit systems, urban agriculture, and civic life.",sampleImage:"/samples/social_doc.jpg",defaults:{projectName:"Night Transit Workers",topic:"Essential Urban Infrastructure & Night Economy",subject:"Maintenance crew preparing an electric light-rail train inside a central depot",location:"Metropolitan public transit maintenance depot",timeOfDay:"Pre-dawn blue hour",lighting:"Cool overhead depot lamps contrasting with warm halogen worklights",mood:"Industrious, atmospheric, quiet, grounded",visualStyle:"Urban street documentary, strong geometrical lead lines, high atmospheric contrast",filmLook:"Cinestill 800T, glowing tungsten highlights, moody deep blue shadows",aspectRatio:"16:9"}},{id:"workplace",title:"Workplace Documentary",icon:"briefcase",description:"Sustainable farming, small workshops, and trade apprenticeships.",sampleImage:"/samples/detail_doc.jpg",defaults:{projectName:"Regenerative Organic Orchard",topic:"Soil Regeneration & Sustainable Agriculture Trades",subject:"Pruner examining fruit tree buds in early spring with soil quality notes",location:"Family-owned organic orchard",timeOfDay:"Early morning crisp sunlight",lighting:"Backlit morning sun with dewy lens flare and clear texture details",mood:"Dedicated, pragmatic, patient, grounded",visualStyle:"Workplace observational photojournalism, focus on hands and tool interaction",filmLook:"Kodak Ektar 100, sharp detail, saturated natural earth tones",aspectRatio:"3:2"}},{id:"speculative",title:"Speculative Documentary",icon:"sparkle",description:"Futuristic climate adaptations, circular economy, and post-carbon living.",sampleImage:"/samples/climate_doc.jpg",defaults:{projectName:"Circular Bio-City Housing Prototype",topic:"Zero-Carbon Urban Bio-Building Materials",subject:"Architect inspecting mycelium insulation panels in a climate-resilient residential module",location:"Experimental urban bio-materials lab",timeOfDay:"Neutral diffuse daylight",lighting:"Even ambient daylight through translucent skylights",mood:"Visionary, practical, serene, innovative",visualStyle:"Architectural documentary, clean geometric composition, observational distance",filmLook:"Kodak Portra 160, clean neutral tones, high clarity, subtle grain",aspectRatio:"16:9"}}];function P(t){const{topic:e="Documentary Project",subject:a="Subject",location:i="Environment",timeOfDay:o="Daylight",lighting:r="Available natural light",mood:s="Authentic",visualStyle:l="Documentary photojournalism",filmLook:c="35mm natural grain",aspectRatio:m="16:9"}=t,p={id:"establishing",title:"1. Establishing Shot (Wide Context)",shotType:"Wide Angle Establishing Shot",description:"Establishes the environment, spatial scale, and context of the documentary setting.",lens:"24mm f/8 wide-angle photojournalism lens",focus:"deep depth of field, sharp environmental detail from foreground to horizon",prompt:y({shotTypePrefix:"Wide angle environmental documentary photograph,",subjectAction:`establishing view of ${i} for a documentary on ${e}, showing ${a}`,environmentContext:`in the surrounding context of ${i}`,timeLighting:`during ${o}, lit by ${r}`,cameraLens:"shot on 24mm f/8 wide-angle lens with deep depth of field",filmStock:c,imperfections:"natural atmospheric haze, subtle lens dust, authentic environmental clutter, unposed spatial balance",style:`${l}, candid documentary realism, strong sense of place, non-commercial editorial aesthetic`,aspectRatio:m}),disclosureCaption:`Synthetic documentary image created with AI to illustrate ${e}. This is not a photograph of a real person, event, or place.`},C={id:"medium",title:"2. Medium / Interaction Shot (Human Relation)",shotType:"Medium 35mm Storytelling Shot",description:"Captures human action, emotional connection, and unposed interaction within the space.",lens:"35mm or 50mm f/2.8 prime lens",focus:"natural focus on subject with soft environmental background falloff",prompt:y({shotTypePrefix:"Candid medium-shot documentary photograph,",subjectAction:`${a} engaged in authentic unposed action, depicting ${e}`,environmentContext:`set within ${i}`,timeLighting:`captured in ${o} under ${r}`,cameraLens:"shot on 35mm f/2.8 prime lens at eye level",filmStock:c,imperfections:"natural skin textures, un-airbrushed details, subtle motion blur on hands, candid body language, organic available light highlights",style:`${l}, emotional authenticity, ${s} atmosphere, human-centered photojournalism`,aspectRatio:m}),disclosureCaption:`Synthetic documentary image created with AI to illustrate ${e}. This is not a photograph of a real person, event, or place.`},D={id:"detail",title:"3. Detail Shot (Texture & Objects)",shotType:"Macro Close-Up Detail Shot",description:"Focuses on tactile textures, hands, tools, or emotional artifacts that deepen the story.",lens:"90mm f/2.8 macro or 85mm f/1.8 lens",focus:"shallow depth of field, crisp focus on object or hands with creamy background bokeh",prompt:y({shotTypePrefix:"Close-up detail documentary photograph,",subjectAction:`macro focus on hands, worn tools, textures, or key objects belonging to ${a}`,environmentContext:`in the immediate setting of ${i}`,timeLighting:`illuminated by ${r} during ${o}`,cameraLens:"shot on 90mm f/2.8 macro lens with shallow depth of field and soft background bokeh",filmStock:c,imperfections:"visible surface grain, tactile wear and tear, micro dust particles, natural specular reflections",style:`${l}, tactile emotional resonance, intimate observational documentary photography`,aspectRatio:m}),disclosureCaption:`Synthetic documentary image created with AI to illustrate ${e}. This is not a photograph of a real person, event, or place.`};return[p,C,D]}function y({shotTypePrefix:t,subjectAction:e,environmentContext:a,timeLighting:i,cameraLens:o,filmStock:r,imperfections:s,style:l,aspectRatio:c}){return`${`${t} ${e}, ${a}. ${i}. ${o}, film stock look: ${r}. Documentary realism: ${s}, ${l}. --ar ${c}`}

[Negative Prompt / Exclude]:
Avoid: cartoon, 3D render, illustration, fake HDR, studio flash, perfect symmetry, airbrushed skin, commercial stock photo look, text overlay, watermark, extra fingers, distorted limbs, oversaturated colors.`}function w(t,e){const a=new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return`# DOCUMENTARY SHOT PLAN: ${t.projectName||t.topic}
*Generated by Documentary Image Studio | Ethical AI Visuals*
*Date: ${a}*

---

## PROJECT BRIEF SUMMARY
- **Project Name:** ${t.projectName||"Untitled Project"}
- **Documentary Topic:** ${t.topic}
- **Subject:** ${t.subject}
- **Location / Environment:** ${t.location}
- **Time & Lighting:** ${t.timeOfDay} (${t.lighting})
- **Mood & Style:** ${t.mood} | ${t.visualStyle}
- **Film Look & Aspect Ratio:** ${t.filmLook} | Aspect Ratio: ${t.aspectRatio}

---

## ETHICAL MANDATE & DISCLOSURE
> **NOTICE**: All prompts below are designed for synthetic media creation to illustrate educational or documentary concepts. Images generated from these prompts MUST include the standard synthetic disclosure:
> *"Synthetic documentary image created with AI to illustrate [Topic]. This is not a photograph of a real person, event, or place."*

---

${e.map(i=>`
### ${i.title}
**Shot Type:** ${i.shotType}  
**Description:** ${i.description}  
**Lens & Focus:** ${i.lens} | ${i.focus}  

\`\`\`
${i.prompt}
\`\`\`

**Required Ethical Caption:**  
*${i.disclosureCaption}*

---
`).join(`
`)}

*Documentary Image Studio - Created for NGOs, Educators, Agencies & Impact Researchers.*
`}const $="doc_studio_current_draft",b="doc_studio_project_history";function A(t){try{localStorage.setItem($,JSON.stringify(t))}catch(e){console.warn("Could not save draft to local storage",e)}}function M(){try{const t=localStorage.getItem($);return t?JSON.parse(t):null}catch{return null}}function z(t){try{const e=g(),a=[{id:"proj_"+Date.now(),createdAt:new Date().toISOString(),...t},...e.slice(0,19)];localStorage.setItem(b,JSON.stringify(a))}catch(e){console.warn("Could not save project to history",e)}}function g(){try{const t=localStorage.getItem(b);return t?JSON.parse(t):[]}catch{return[]}}function T(t){try{const a=g().filter(i=>i.id!==t);return localStorage.setItem(b,JSON.stringify(a)),a}catch{return[]}}function x(){return`
    <div class="container">
      <!-- Hero Section -->
      <section style="padding: 3rem 0 2rem 0; text-align: center; max-width: 860px; margin: 0 auto;">
        <span class="badge" style="background-color: var(--primary-bg-subtle); color: var(--primary); font-weight: 600; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.25rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
          No Login Required • Ethical Synthetic Media
        </span>

        <h1 style="font-size: 3rem; line-height: 1.15; margin-bottom: 1.25rem; font-weight: 700; color: var(--text-main);">
          Create documentary-style AI visuals with ethical clarity
        </h1>

        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; max-width: 720px; margin-left: auto; margin-right: auto;">
          A simple studio for NGOs, agencies, and educators to generate documentary-grade AI image prompts and synthetic documentary visuals based on real photographic principles.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem;">
          <a href="#create" class="btn btn-primary btn-lg" data-route="create">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Create Documentary Visual
          </a>
          <a href="#ethics" class="btn btn-secondary btn-lg" data-route="ethics">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            View Ethics Guidelines
          </a>
        </div>

        <!-- Visible Ethics Notice -->
        <div class="ethics-banner" style="justify-content: center; text-align: left; max-width: 720px; margin: 0 auto 3rem auto;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <strong>Mandatory Ethical Use Notice:</strong>
            <p style="margin: 0; font-size: 0.875rem;">This tool creates synthetic documentary-style images. Outputs should not be presented as real photographic evidence.</p>
          </div>
        </div>
      </section>

      <!-- 3-Step Process Section -->
      <section style="margin-bottom: 4rem;">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">How It Works</h2>
          <p class="text-muted">Generate a complete 3-shot documentary plan in under 60 seconds.</p>
        </div>

        <div class="grid-3">
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              1
            </div>
            <h3>Describe Subject</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              Fill in a short documentary brief specifying your topic, environment, time of day, and emotional mood.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              2
            </div>
            <h3>Generate Shot Plan</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              The engine builds 3 structured documentary prompts: Establishing Shot, Medium Shot, and Detail Shot.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              3
            </div>
            <h3>Copy & Disclose</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              Copy prompts for external generator use or direct preview with standard synthetic disclosure captions.
            </p>
          </div>
        </div>
      </section>

      <!-- Target Audience Section -->
      <section class="card" style="background: var(--bg-subtle); border-color: var(--border-medium); margin-bottom: 4rem; padding: 2.5rem; text-align: center;">
        <h2 style="font-size: 1.6rem; margin-bottom: 0.75rem;">Built for Impact Storytellers</h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 680px; margin: 0 auto 1.5rem auto;">
          “Built for NGOs, agencies, educators, documentary researchers, and impact storytelling teams.”
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">
          <span class="chip" style="background: white;">NGO Campaign Managers</span>
          <span class="chip" style="background: white;">Documentary Researchers</span>
          <span class="chip" style="background: white;">Educational Content Creators</span>
          <span class="chip" style="background: white;">Impact Storytellers</span>
          <span class="chip" style="background: white;">Ethical Media Designers</span>
        </div>
      </section>

      <!-- Preset Quick-Start Grid -->
      <section style="margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Documentary Style Presets</h2>
            <p class="text-muted">Select a preset to pre-fill your documentary brief instantly.</p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            Custom Brief →
          </a>
        </div>

        <div class="grid-3">
          ${v.map(t=>`
            <div class="card preset-card" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;" data-preset-id="${t.id}">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                  <h3 style="font-size: 1.15rem; color: var(--primary);">${t.title}</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">${t.description}</p>
              </div>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--primary);">
                Launch Brief →
              </div>
            </div>
          `).join("")}
        </div>
      </section>
    </div>
  `}function k(t=null){let e={projectName:"Community Resilience Study",topic:"Sustainable Urban Agriculture & Local Food Security",subject:"Volunteers harvesting organic produce together in a city garden",location:"Community garden plot surrounded by residential neighborhoods",timeOfDay:"Late afternoon golden hour",lighting:"Warm direct sunlight with soft directional shadows",mood:"Collaborative, dignified, hopeful",visualStyle:"Unposed social realism, candid documentary photojournalism",filmLook:"Kodak Portra 400 35mm",aspectRatio:"16:9"};const a=M();if(a&&(e={...e,...a}),t){const i=v.find(o=>o.id===t);i&&(e={...e,...i.defaults})}return`
    <div class="container-narrow">
      <div style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Create Documentary Visual</h1>
        <p class="text-muted" style="font-size: 1.05rem;">
          Describe the documentary scene you want to create. The app will build structured documentary-style prompts.
        </p>
      </div>

      <!-- Preset Quick Selection Chips -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
          <span>QUICK PRESETS</span>
          <span style="font-size: 0.775rem; font-weight: normal;">Click to autofill form</span>
        </div>
        <div class="preset-chips">
          ${v.map(i=>`
            <button type="button" class="chip ${t===i.id?"active":""}" data-preset-autofill="${i.id}">
              ${i.title}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Main Form -->
      <form id="create-project-form" class="card" style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Section 1: Project Basics -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            1. Project Basics
          </h3>
          
          <div class="form-group">
            <label class="form-label" for="projectName">
              Project Name
              <span class="form-hint">Internal reference title</span>
            </label>
            <input type="text" id="projectName" class="form-control" value="${e.projectName}" placeholder="e.g. Coastal Mangrove Defense Brief" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="topic">
              Documentary Topic
              <span class="form-hint">The central issue or story</span>
            </label>
            <input type="text" id="topic" class="form-control" value="${e.topic}" placeholder="e.g. Traditional Seed Conservation & Food Security" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="subject">
              Core Subject & Action
              <span class="form-hint">Who or what is taking place</span>
            </label>
            <textarea id="subject" class="form-control" rows="2" placeholder="e.g. Elderly weaver guiding young student through traditional wooden loom techniques" required>${e.subject}</textarea>
          </div>
        </div>

        <!-- Section 2: Environment -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            2. Environment & Lighting
          </h3>

          <div class="form-group">
            <label class="form-label" for="location">
              Location / Environment
              <span class="form-hint">Specific physical setting</span>
            </label>
            <input type="text" id="location" class="form-control" value="${e.location}" placeholder="e.g. Rustic wooden seed repository barn in rural valley" required />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="timeOfDay">Time of Day</label>
              <select id="timeOfDay" class="form-control">
                <option value="Early morning sunrise & morning mist" ${e.timeOfDay.includes("Early morning")?"selected":""}>Early Morning Sunrise</option>
                <option value="Late afternoon golden hour" ${e.timeOfDay.includes("golden hour")||e.timeOfDay.includes("Late afternoon")?"selected":""}>Late Afternoon Golden Hour</option>
                <option value="Midday natural daylight" ${e.timeOfDay.includes("Midday")?"selected":""}>Midday Natural Light</option>
                <option value="Overcast diffused light" ${e.timeOfDay.includes("Overcast")?"selected":""}>Overcast Soft Daylight</option>
                <option value="Blue hour twilight" ${e.timeOfDay.includes("Blue hour")?"selected":""}>Blue Hour Twilight</option>
                <option value="Night atmosphere with artificial work lights" ${e.timeOfDay.includes("Night")?"selected":""}>Night Worklights</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="lighting">Lighting Condition</label>
              <input type="text" id="lighting" class="form-control" value="${e.lighting}" placeholder="e.g. Diffused window daylight filtering through wood" required />
            </div>
          </div>
        </div>

        <!-- Section 3: Mood and Style -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            3. Mood, Aesthetics & Format
          </h3>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="mood">Mood / Emotion</label>
              <input type="text" id="mood" class="form-control" value="${e.mood}" placeholder="e.g. Reverent, focused, collaborative" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="visualStyle">Visual Style</label>
              <input type="text" id="visualStyle" class="form-control" value="${e.visualStyle}" placeholder="e.g. Observational documentary photojournalism" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="filmLook">Film Stock Look</label>
              <select id="filmLook" class="form-control">
                <option value="Kodak Portra 400 35mm" ${e.filmLook.includes("Portra 400")?"selected":""}>Kodak Portra 400 (Warm & Natural)</option>
                <option value="Fujifilm Pro 400H" ${e.filmLook.includes("Fujifilm")?"selected":""}>Fujifilm Pro 400H (Cool Greens & Blues)</option>
                <option value="Kodak Tri-X 400 Black & White" ${e.filmLook.includes("Tri-X")?"selected":""}>Kodak Tri-X 400 (Classic B&W Grain)</option>
                <option value="Cinestill 800T" ${e.filmLook.includes("Cinestill")?"selected":""}>Cinestill 800T (Atmospheric Tungsten)</option>
                <option value="Kodak Ektar 100" ${e.filmLook.includes("Ektar")?"selected":""}>Kodak Ektar 100 (Vivid Sharp Detail)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Aspect Ratio</label>
              <input type="hidden" id="aspectRatio" value="${e.aspectRatio}" />
              <div class="segmented-control">
                <button type="button" class="segmented-option ${e.aspectRatio==="16:9"?"active":""}" data-ratio="16:9">16:9</button>
                <button type="button" class="segmented-option ${e.aspectRatio==="4:3"?"active":""}" data-ratio="4:3">4:3</button>
                <button type="button" class="segmented-option ${e.aspectRatio==="1:1"?"active":""}" data-ratio="1:1">1:1</button>
                <button type="button" class="segmented-option ${e.aspectRatio==="3:2"?"active":""}" data-ratio="3:2">3:2</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button Section -->
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-light); text-align: center;">
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
            Generate Documentary Prompts
          </button>
          <p class="form-hint" style="margin-top: 0.75rem; text-align: center;">
            No login required. Prompts are created locally in your browser with ethical clarity.
          </p>
        </div>

      </form>
    </div>
  `}function I(t,e,a=null){const i=!!a;return`
    <div class="visual-preview-area" id="preview-${t.id}">
      ${i?`
        <img src="${a}" alt="AI-generated documentary-style image" class="visual-preview-img" />
        <div class="preview-overlay-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FEF3C7" stroke-width="2">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
          </svg>
          AI-Generated Synthetic Visual
        </div>
      `:`
        <div class="preview-placeholder">
          <!-- Viewfinder Overlay Graphics -->
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.5">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <div style="font-weight: 600; font-size: 0.95rem; color: #E5E7EB;">Prompt Studio Mode</div>
          <p style="font-size: 0.825rem; color: #9CA3AF; max-width: 320px; margin: 0 auto; line-height: 1.4;">
            Direct image generation is not available in this environment. Copy the prompt below and use it in your preferred AI image tool.
          </p>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
            <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; color: #D1D5DB;">
              Lens: ${t.lens.split(" ")[0]}
            </span>
            <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; color: #D1D5DB;">
              Aspect Ratio: ${e.aspectRatio||"16:9"}
            </span>
          </div>
        </div>
      `}
    </div>
  `}function B(t){const{brief:e,shots:a}=t,i=o=>{if(e.topic.toLowerCase().includes("seed")||e.topic.toLowerCase().includes("food")||e.topic.toLowerCase().includes("urban")){if(o==="establishing"||o==="medium")return"/samples/social_doc.jpg";if(o==="detail")return"/samples/detail_doc.jpg"}if(e.topic.toLowerCase().includes("climate")||e.topic.toLowerCase().includes("water")||e.topic.toLowerCase().includes("wetland")){if(o==="establishing"||o==="medium")return"/samples/climate_doc.jpg";if(o==="detail")return"/samples/detail_doc.jpg"}return null};return`
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge" style="background-color: var(--primary-bg-subtle); color: var(--primary); font-weight: 600; font-size: 0.8rem; padding: 0.25rem 0.6rem; border-radius: 99px; display: inline-block; margin-bottom: 0.5rem;">
            Documentary Shot Plan • 3 Shots Generated
          </span>
          <h1 style="font-size: 2.25rem;">Your Documentary Shot Plan</h1>
          <p class="text-muted">Review, edit, and copy documentary-grade AI image prompts constructed for your brief.</p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary" id="btn-copy-all-prompts">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy All Prompts
          </button>
          <button type="button" class="btn btn-primary" id="btn-download-sheet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Prompt Sheet (.md)
          </button>
          <a href="#create" class="btn btn-ghost" data-route="create">
            Start New Project
          </a>
        </div>
      </div>

      <!-- Project Summary Card -->
      <div class="card" style="margin-bottom: 2.5rem; background: var(--bg-surface); border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">${e.projectName||e.topic}</h2>
            <p class="text-muted" style="font-size: 0.9rem;">Topic: <strong>${e.topic}</strong></p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit Brief
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-size: 0.875rem; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <div>
            <span class="text-muted" style="display: block;">Subject:</span>
            <strong>${e.subject}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Environment:</span>
            <strong>${e.location}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Style & Mood:</span>
            <strong>${e.mood}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Film Stock:</span>
            <strong>${e.filmLook} (${e.aspectRatio})</strong>
          </div>
        </div>
      </div>

      <!-- Prompt Studio Mode Banner -->
      <div class="notice-pill" style="width: 100%; justify-content: space-between; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span><strong>Prompt Studio Active:</strong> Prompts are constructed using real documentary photography principles. Copy and paste into Midjourney, DALL-E, Stable Diffusion, or your preferred AI image generator.</span>
        </div>
      </div>

      <!-- 3 Shot Cards -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        ${a.map(o=>{const r=i(o.id);return`
            <div class="card shot-card" id="card-${o.id}">
              
              <!-- Shot Header -->
              <div class="shot-card-header">
                <div>
                  <span class="shot-badge">${o.shotType}</span>
                  <h3 style="font-size: 1.35rem; margin-top: 0.35rem;">${o.title}</h3>
                  <p class="text-muted" style="font-size: 0.9rem;">${o.description}</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm btn-copy-prompt" data-prompt-id="${o.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Prompt
                </button>
              </div>

              <!-- Content Grid: Prompt Left, Visual Preview Right -->
              <div class="grid-2" style="align-items: start;">
                
                <!-- Left: Editable Prompt & Details -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div>
                    <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">
                      Generated Documentary Prompt (Editable)
                    </label>
                    <div class="prompt-box">
                      <textarea class="prompt-textarea" id="prompt-text-${o.id}">${o.prompt}</textarea>
                    </div>
                  </div>

                  <!-- Mandatory Ethical Disclosure Box -->
                  <div class="disclosure-box">
                    <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.775rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      Mandatory Ethical Disclosure Caption
                    </div>
                    <div class="disclosure-text">
                      "${o.disclosureCaption}"
                    </div>
                    <button type="button" class="btn btn-ghost btn-sm btn-copy-caption" data-caption-text="${o.disclosureCaption}" style="align-self: flex-start; padding: 0.2rem 0.5rem; font-size: 0.775rem;">
                      Copy Caption
                    </button>
                  </div>
                </div>

                <!-- Right: Visualizer & Synthetic Media Area -->
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">
                    Synthetic Visual Canvas
                  </label>
                  ${I(o,e,r)}
                </div>

              </div>

            </div>
          `}).join("")}
      </div>

    </div>
  `}function R(){const t="AI-generated synthetic documentary image. This is not a photograph of a real person, event, or place.";return`
    <div class="container-narrow">
      <div style="margin-bottom: 2.5rem; text-align: center;">
        <span class="badge" style="background-color: var(--ethics-bg); color: var(--ethics-text); border: 1px solid var(--ethics-border); font-weight: 600; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Ethical Framing Standard
        </span>
        <h1 style="font-size: 2.5rem; margin-bottom: 0.75rem;">Ethical Use Guidelines</h1>
        <p class="text-muted" style="font-size: 1.1rem; max-width: 640px; margin: 0 auto;">
          Principles for using synthetic AI media in impact campaigns, educational materials, and pre-visualization without deceiving the public.
        </p>
      </div>

      <!-- Highlighted Standard Disclosure Box -->
      <div class="card" style="background: var(--ethics-bg); border: 2px solid var(--ethics-text); margin-bottom: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--ethics-text); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Recommended Standard Disclosure
          </span>
          <button type="button" class="btn btn-secondary btn-sm btn-copy-caption" data-caption-text="${t}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Disclosure Snippet
          </button>
        </div>
        <div style="font-family: var(--font-serif); font-size: 1.15rem; font-style: italic; color: var(--ethics-text); line-height: 1.5; padding: 0.5rem 0;">
          "${t}"
        </div>
      </div>

      <!-- Guidelines Content Cards -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            1. Synthetic Media Transparency
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            AI-generated images possess documentary aesthetics (available light, film grain, unposed framing) but are fundamentally <strong>synthetic illustrations</strong>. They should always be explicitly tagged as synthetic or AI-generated in all public campaigns, pitch decks, and educational releases.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            2. Do Not Present as Real Evidence
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            Never use this studio to fabricate news events, generate misleading photographic proof, or present synthetic images as real historical evidence. Impact storytelling relies on public trust; misrepresenting synthetic imagery damages institutional credibility.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            3. Respect for People & Communities
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            Prompts generated by this studio focus on dignity, agency, and collaborative realism. Avoid generating images that exploit suffering, reinforce harmful cultural stereotypes, or depict recognizable living individuals without permission.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            4. Handling Sensitive & Humanitarian Topics
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            When illustrating sensitive subjects such as disaster response, climate vulnerability, or healthcare access, prioritize representative systemic concepts rather than sensationalized distress. Use the included disclosure tags prominently alongside all published visuals.
          </p>
        </div>

      </div>

      <div style="text-align: center; margin-top: 3rem;">
        <a href="#create" class="btn btn-primary btn-lg" data-route="create">
          Create Ethical Visual →
        </a>
      </div>

    </div>
  `}function O(){const t=g();return`
    <div class="container-narrow">
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 2.25rem; margin-bottom: 0.25rem;">Saved Local Drafts</h1>
          <p class="text-muted">Projects and prompt plans stored locally in your browser cache.</p>
        </div>
        <a href="#create" class="btn btn-primary" data-route="create">
          + New Project
        </a>
      </div>

      ${t.length===0?`
        <div class="card text-center" style="padding: 3rem 1.5rem;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; color: var(--text-muted);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No Saved Projects Yet</h3>
          <p class="text-muted" style="max-width: 400px; margin: 0 auto 1.5rem auto;">
            When you create documentary briefs, your shot plans will appear here for easy access and reuse.
          </p>
          <a href="#create" class="btn btn-primary" data-route="create">Create First Project</a>
        </div>
      `:`
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${t.map(e=>`
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;" id="history-item-${e.id}">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">
                  Saved ${new Date(e.createdAt).toLocaleDateString()}
                </span>
                <h3 style="font-size: 1.15rem; color: var(--text-main); margin: 0.2rem 0;">
                  ${e.brief.projectName||e.brief.topic}
                </h3>
                <p class="text-muted" style="font-size: 0.875rem;">
                  Topic: ${e.brief.topic} • ${e.shots?e.shots.length:3} Shots
                </p>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-secondary btn-sm btn-open-project" data-project-id="${e.id}">
                  Open Plan →
                </button>
                <button type="button" class="btn btn-ghost btn-sm btn-delete-project" data-project-id="${e.id}" style="color: var(--error-text);">
                  Delete
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `}
    </div>
  `}const n={route:"home",selectedPresetId:null,activeProject:null};function u(){const t=document.getElementById("app");if(!t)return;let e="";n.route==="home"?e=x():n.route==="create"?e=k(n.selectedPresetId):n.route==="results"?n.activeProject?e=B(n.activeProject):(n.route="create",e=k()):n.route==="ethics"?e=R():n.route==="history"?e=O():e=x(),t.innerHTML=`
    ${E(n.route)}
    <main class="main-content">
      ${e}
    </main>
    ${L()}
  `,N(),window.scrollTo({top:0,behavior:"smooth"})}function N(){document.querySelectorAll("[data-route]").forEach(i=>{i.addEventListener("click",o=>{o.preventDefault();const r=i.getAttribute("data-route");h(r)})}),document.querySelectorAll(".preset-card").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-preset-id");n.selectedPresetId=o,h("create")})}),document.querySelectorAll("[data-preset-autofill]").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-preset-autofill");n.selectedPresetId=o,u(),d(`Autofilled form with ${o.toUpperCase()} documentary preset`,"success")})}),document.querySelectorAll(".segmented-option").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".segmented-option").forEach(s=>s.classList.remove("active")),i.classList.add("active");const o=i.getAttribute("data-ratio"),r=document.getElementById("aspectRatio");r&&(r.value=o)})});const t=document.getElementById("create-project-form");t&&(t.addEventListener("input",()=>{const i=S(t);A(i)}),t.addEventListener("submit",i=>{i.preventDefault();const o=S(t);d("Building documentary shot plan...","info"),setTimeout(()=>{const r=P(o);n.activeProject={brief:o,shots:r},z(n.activeProject),h("results"),d("Documentary shot plan generated successfully!","success")},400)})),document.querySelectorAll(".btn-copy-prompt").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-prompt-id"),r=document.getElementById(`prompt-text-${o}`);r&&f(r.value,"Prompt copied to clipboard!")})}),document.querySelectorAll(".btn-copy-caption").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-caption-text");o&&f(o,"Ethical disclosure caption copied!")})});const e=document.getElementById("btn-copy-all-prompts");e&&n.activeProject&&e.addEventListener("click",()=>{const i=w(n.activeProject.brief,n.activeProject.shots);f(i,"All 3 documentary prompts copied as Markdown!")});const a=document.getElementById("btn-download-sheet");a&&n.activeProject&&a.addEventListener("click",()=>{const i=w(n.activeProject.brief,n.activeProject.shots),o=`Documentary_Shot_Plan_${(n.activeProject.brief.projectName||"Project").replace(/\s+/g,"_")}.md`;H(i,o,"text/markdown"),d("Downloaded prompt sheet .md file","success")}),document.querySelectorAll(".btn-open-project").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-project-id"),s=g().find(l=>l.id===o);s&&(n.activeProject=s,h("results"))})}),document.querySelectorAll(".btn-delete-project").forEach(i=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-project-id");T(o),u(),d("Project removed from history","info")})})}function S(t){var e,a,i,o,r,s,l,c,m,p;return{projectName:((e=t.querySelector("#projectName"))==null?void 0:e.value)||"",topic:((a=t.querySelector("#topic"))==null?void 0:a.value)||"",subject:((i=t.querySelector("#subject"))==null?void 0:i.value)||"",location:((o=t.querySelector("#location"))==null?void 0:o.value)||"",timeOfDay:((r=t.querySelector("#timeOfDay"))==null?void 0:r.value)||"",lighting:((s=t.querySelector("#lighting"))==null?void 0:s.value)||"",mood:((l=t.querySelector("#mood"))==null?void 0:l.value)||"",visualStyle:((c=t.querySelector("#visualStyle"))==null?void 0:c.value)||"",filmLook:((m=t.querySelector("#filmLook"))==null?void 0:m.value)||"",aspectRatio:((p=t.querySelector("#aspectRatio"))==null?void 0:p.value)||"16:9"}}function h(t){n.route=t,window.location.hash=t,u()}function f(t,e){navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).then(()=>{d(e,"success")}).catch(()=>{j(t,e)}):j(t,e)}function j(t,e){const a=document.createElement("textarea");a.value=t,a.style.position="fixed",document.body.appendChild(a),a.focus(),a.select();try{document.execCommand("copy"),d(e,"success")}catch{d("Failed to copy","error")}document.body.removeChild(a)}function H(t,e,a){const i=new Blob([t],{type:a}),o=URL.createObjectURL(i),r=document.createElement("a");r.href=o,r.download=e,document.body.appendChild(r),r.click(),setTimeout(()=>{document.body.removeChild(r),window.URL.revokeObjectURL(o)},100)}window.addEventListener("hashchange",()=>{const t=window.location.hash.replace("#","");t&&["home","create","results","ethics","history"].includes(t)&&(n.route=t,u())});document.addEventListener("DOMContentLoaded",()=>{const t=window.location.hash.replace("#","");t&&["home","create","results","ethics","history"].includes(t)&&(n.route=t),u()});
