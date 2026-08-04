import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs"
import { join } from "path"

const ROOT = join(import.meta.dirname, "..")
const OUT_DIR = join(ROOT, "public/images/blog")
const BLOG_DIR = join(ROOT, "src/content/blog")
mkdirSync(OUT_DIR, { recursive: true })

// API key comes from the environment (never hardcode it — this repo is public).
// Run with:  node --env-file=.env.local scripts/download-images.mjs
// Falls back to parsing .env.local directly for older Node versions.
let API_KEY = process.env.POLLINATIONS_API_KEY
if (!API_KEY) {
  const envPath = join(ROOT, ".env.local")
  if (existsSync(envPath)) {
    const m = readFileSync(envPath, "utf8").match(/^POLLINATIONS_API_KEY=(.+)$/m)
    if (m) API_KEY = m[1].trim()
  }
}
if (!API_KEY) {
  console.error("POLLINATIONS_API_KEY not found in environment or .env.local")
  process.exit(1)
}

const STYLE =
  "editorial industrial technology photography, cinematic lighting, high detail, no text, no watermark"

const images = [
  {
    slug: "iiot-trend-2026-edge-ai",
    file: "edge-ai-manufacturing.jpg",
    prompt: `photorealistic ruggedized edge AI computer mounted in electrical cabinet on a live production line, real-time inference results on a small industrial display, machine operators in background, shallow depth of field, blue-orange industrial color palette, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-cobots-amrs",
    file: "cobots-amrs-factory.jpg",
    prompt: `photorealistic collaborative robot arm handing a component to a human technician while an autonomous mobile robot carries totes through a modern assembly hall, natural interaction, safety-orange accents, wide angle, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-energy-sustainability",
    file: "energy-sustainability-factory.jpg",
    prompt: `photorealistic factory energy control room with live power-consumption dashboards per production line, large window revealing rooftop solar array at golden hour, engineer reviewing kWh trend charts, green and amber data accents, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-it-ot-convergence",
    file: "it-ot-convergence.jpg",
    prompt: `photorealistic converged operations center where IT server racks and OT SCADA control stations share one room, IT engineer and plant engineer collaborating at a shared console, data streams visualized bridging both sides, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-computer-vision",
    file: "computer-vision-inspection.jpg",
    prompt: `photorealistic high-speed machine vision inspection station over a conveyor of machined metal parts, ring light illumination, monitor showing AI defect detection overlays with pass and fail markings, quality lab atmosphere, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-unified-namespace",
    file: "unified-namespace-mqtt.jpg",
    prompt: `photorealistic dark operations wall displaying a unified namespace topology, hierarchical tree of factory sites lines and machines converging into one glowing central data broker node, MQTT message streams as light trails, teal and blue palette, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-predictive-maintenance",
    file: "predictive-maintenance-iiot.jpg",
    prompt: `photorealistic wireless vibration and temperature sensors magnet-mounted on a large industrial motor, maintenance engineer reviewing rising vibration trend and remaining-useful-life estimate on tablet, warning threshold visible on chart, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-private-5g",
    file: "private-5g-factory.jpg",
    prompt: `photorealistic private 5G small-cell antennas mounted on the ceiling trusses of a vast smart factory, subtle radio wave visualization linking AGVs robots and handheld devices below, cool blue connectivity accents, ultra wide angle, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-digital-twins",
    file: "digital-twins-iiot.jpg",
    prompt: `photorealistic engineer manipulating a glowing holographic digital twin of a CNC machine floating beside the real machine, live sensor values streaming between physical and virtual, dark factory with blue holographic light, ${STYLE}`,
  },
  {
    slug: "iiot-trend-2026-ot-cybersecurity",
    file: "ot-cybersecurity.jpg",
    prompt: `photorealistic executive boardroom with a large screen showing an OT security dashboard of a factory network map with threat indicators, plant security officer briefing leadership, serious atmosphere, red and blue accent lighting, ${STYLE}`,
  },
  {
    slug: "understanding-oee",
    file: "oee-metrics-dashboard.jpg",
    prompt: `photorealistic production supervisor at a factory floor andon board showing OEE gauges for availability performance and quality with a large overall percentage, real production line softly blurred behind, clean data visualization, ${STYLE}`,
  },
  {
    slug: "digital-twins-manufacturing",
    file: "digital-twins-manufacturing.jpg",
    prompt: `photorealistic split composition of a complete production line and its glowing wireframe virtual mirror image above it, simulation scenarios branching as translucent overlays, engineers comparing physical and digital states, dark blue palette, ${STYLE}`,
  },
  {
    slug: "predictive-maintenance-guide",
    file: "predictive-maintenance-guide.jpg",
    prompt: `photorealistic maintenance technician catching a failing bearing early, thermal camera view inset showing hot spot on a gearbox, condition-monitoring laptop with vibration spectrum, workshop environment with warm practical lighting, ${STYLE}`,
  },
  {
    slug: "getting-started-with-iiot",
    file: "iiot-getting-started.jpg",
    prompt: `photorealistic technician retrofitting a clamp-on IoT sensor onto a decades-old legacy machine, small wireless gateway with antenna nearby, first live data appearing on a phone dashboard, mix of old iron and new electronics, ${STYLE}`,
  },
  {
    slug: "industry-4-0-explained",
    file: "industry-4-0-explained.jpg",
    prompt: `photorealistic sweeping panorama of an Industry 4.0 factory, robotic cells conveyors and AGVs coordinated under real-time production displays, workers supervising with tablets, bright clean architecture with blue accent lighting, ultra wide, ${STYLE}`,
  },
  {
    slug: "what-is-smart-manufacturing",
    file: "smart-manufacturing-intro.jpg",
    prompt: `photorealistic modern smart manufacturing facility exterior at dusk, glass walls revealing illuminated automated production lines inside, subtle data visualization motifs in the sky, aspirational aerial three-quarter view, ${STYLE}`,
  },
  {
    slug: "ot-network-segmentation-iec-62443",
    file: "ot-network-segmentation.jpg",
    prompt: `photorealistic industrial control room, engineer configuring network segmentation on a large monitor showing a glowing zones-and-conduits topology diagram with firewalls between segments, SCADA screens in the background, dark moody atmosphere, ${STYLE}`,
  },
  {
    slug: "agentic-ai-in-manufacturing",
    file: "agentic-ai-in-manufacturing.jpg",
    prompt: `photorealistic factory operator reviewing an AI agent's proposed maintenance work order on a large monitor showing a multi-step decision workflow with approve and reject controls, robotic assembly line visible through control room window, cool blue and amber accent lighting, ${STYLE}`,
  },
]

// Keep the hero-image-prompt comment in each MDX in sync with the image we generate.
function syncPromptComment(slug, prompt) {
  const mdxPath = join(BLOG_DIR, `${slug}.mdx`)
  if (!existsSync(mdxPath)) return false
  const src = readFileSync(mdxPath, "utf8")
  const comment = `{/* hero-image-prompt: ${prompt} */}`
  const updated = src.match(/\{\/\* hero-image-prompt:[\s\S]*?\*\/\}/)
    ? src.replace(/\{\/\* hero-image-prompt:[\s\S]*?\*\/\}/, comment)
    : src.replace(/^---\n[\s\S]*?\n---\n/, (fm) => `${fm}\n${comment}\n`)
  if (updated !== src) writeFileSync(mdxPath, updated)
  return true
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function downloadOne(file, prompt) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://gen.pollinations.ai/image/${encoded}?model=flux&width=1280&height=720&seed=7&enhance=false&key=${API_KEY}`
  const res = await fetch(url, {
    headers: { Accept: "image/jpeg,image/png,image/*;q=0.9,*/*;q=0.8" },
    redirect: "follow",
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.length < 10000) throw new Error(`Response too small (${buffer.length} bytes)`)
  // JPEG magic bytes check so we never save an HTML error page as an image
  if (!(buffer[0] === 0xff && buffer[1] === 0xd8) && !(buffer[0] === 0x89 && buffer[1] === 0x50)) {
    throw new Error("Response is not a JPEG/PNG image")
  }
  writeFileSync(join(OUT_DIR, file), buffer)
  return buffer.length
}

async function downloadAll() {
  let ok = 0
  const failed = []

  for (const { slug, file, prompt } of images) {
    console.log(`\n⟳  ${file}`)
    syncPromptComment(slug, prompt)

    let success = false
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      if (attempt > 1) {
        console.log(`   retry ${attempt}/3 (waiting 10s)...`)
        await sleep(10000)
      }
      try {
        const bytes = await downloadOne(file, prompt)
        console.log(`   OK  ${(bytes / 1024).toFixed(0)} KB`)
        success = true
        ok++
      } catch (err) {
        console.log(`   FAIL: ${err.message}`)
      }
    }
    if (!success) failed.push(file)
    await sleep(3000)
  }

  console.log(`\n${"─".repeat(50)}`)
  console.log(`Done: ${ok}/${images.length} images downloaded`)
  if (failed.length) {
    console.log(`Failed (${failed.length}): ${failed.join(", ")}`)
    process.exitCode = 1
  }
}

downloadAll().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
