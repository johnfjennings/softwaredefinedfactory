import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"

const OUT_DIR = join(import.meta.dirname, "../public/images/blog")
mkdirSync(OUT_DIR, { recursive: true })

const images = [
  {
    file: "edge-ai-manufacturing.jpg",
    prompt: "photorealistic industrial edge computing AI gateway device mounted on factory wall with glowing blue LED status indicators, neural network hologram floating above industrial machines, blurred robotic assembly line background, dramatic directional lighting, ultra wide angle, editorial technology photography, dark moody atmosphere",
  },
  {
    file: "cobots-amrs-factory.jpg",
    prompt: "photorealistic collaborative robot cobot arm working alongside human factory worker on precision assembly task, modern automotive manufacturing plant, orange and blue safety lighting, autonomous mobile robot AMR navigating between workstations in background, wide angle editorial industrial photography",
  },
  {
    file: "energy-sustainability-factory.jpg",
    prompt: "photorealistic aerial drone view of modern smart factory with large solar panel array on roof and wind turbines nearby, green energy sustainability concept, golden hour warm lighting, environmental smart manufacturing, cinematic wide angle",
  },
  {
    file: "it-ot-convergence.jpg",
    prompt: "photorealistic modern data center server racks with blue LED lights seamlessly merging into industrial factory control room with SCADA screens, glowing data streams bridging IT and OT worlds, cinematic professional technology photography",
  },
  {
    file: "computer-vision-inspection.jpg",
    prompt: "photorealistic industrial machine vision camera system above conveyor belt performing automated quality inspection, bright LED inspection lighting, AI detection bounding boxes highlighting defects on electronic components, quality control manufacturing environment, editorial technology photography",
  },
  {
    file: "unified-namespace-mqtt.jpg",
    prompt: "photorealistic glowing blue network graph node diagram showing factory equipment connected to central unified data hub, MQTT data streams flowing between industrial sensors and cloud platforms, dark background teal blue color palette, editorial industrial IoT architecture visualization",
  },
  {
    file: "predictive-maintenance-iiot.jpg",
    prompt: "photorealistic industrial maintenance engineer holding tablet showing AI predictive analytics dashboard, large industrial motor with wireless vibration sensors attached, health score and warning indicators on screen, modern factory floor environment, dramatic directional lighting",
  },
  {
    file: "private-5g-factory.jpg",
    prompt: "photorealistic private 5G antenna array installed on ceiling of large modern factory floor, wireless signal wave visualization connecting hundreds of machines and autonomous vehicles, blue electromagnetic connectivity streams, wide angle editorial industrial photography",
  },
  {
    file: "digital-twins-iiot.jpg",
    prompt: "photorealistic glowing blue holographic digital twin of industrial turbine machine floating beside its physical counterpart on factory floor, real-time sensor data streams synchronizing, engineers studying holographic interface panels, dark dramatic atmospheric lighting",
  },
  {
    file: "ot-cybersecurity.jpg",
    prompt: "photorealistic industrial cybersecurity SCADA control room screens showing network intrusion detection red warning alerts, glowing firewall shield barrier between IT network and OT factory systems, dark atmospheric moody lighting, editorial security photography",
  },
  {
    file: "oee-metrics-dashboard.jpg",
    prompt: "photorealistic large factory floor digital display wall showing OEE overall equipment effectiveness dashboard with availability performance quality gauges, manufacturing operations manager analyzing production metrics, modern industrial control room, blue data visualization editorial photography",
  },
  {
    file: "digital-twins-manufacturing.jpg",
    prompt: "photorealistic entire factory production line as glowing blue holographic digital twin floating above real physical machinery, engineers walking through layered physical and virtual space simultaneously, ultra wide cinematic angle, dark background blue holographic accent lighting",
  },
  {
    file: "predictive-maintenance-guide.jpg",
    prompt: "photorealistic industrial maintenance engineer wearing augmented reality AR glasses viewing predictive maintenance data overlaid on large industrial pump, thermal imaging visualization, vibration spectrum chart in AR display, professional factory environment editorial photography",
  },
  {
    file: "iiot-getting-started.jpg",
    prompt: "photorealistic factory floor overview with glowing IoT sensor nodes attached to industrial machines and pipes, data streams flowing upward forming cloud visualization above the factory, connected smart factory concept, blue accent lighting, wide angle editorial industrial photography",
  },
  {
    file: "industry-4-0-explained.jpg",
    prompt: "photorealistic panoramic view of fully automated Industry 4.0 smart factory with collaborative robot arms, automated guided vehicles AGVs, conveyor systems, real-time digital production displays, workers using tablets, cinematic ultra wide angle factory photography, clean white and blue lighting",
  },
  {
    file: "smart-manufacturing-intro.jpg",
    prompt: "photorealistic aerial drone view of modern smart manufacturing facility, glass facade revealing multiple levels of robotic production lines, solar panels on roof, futuristic geometric architecture, golden hour sunset lighting, cinematic wide angle editorial photography",
  },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function downloadOne(file, prompt, attempt = 1) {
  const encoded = encodeURIComponent(prompt)
  // Try without model param first (uses default flux), then with flux
  const model = attempt === 1 ? "flux" : "turbo"
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&model=${model}&nologo=true`

  const res = await fetch(url, {
    headers: {
      Accept: "image/jpeg,image/png,image/*;q=0.9,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Referer: "https://pollinations.ai/",
    },
    redirect: "follow",
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.length < 1000) throw new Error(`Response too small (${buffer.length} bytes) — likely not an image`)

  const dest = join(OUT_DIR, file)
  writeFileSync(dest, buffer)
  return buffer.length
}

async function downloadAll() {
  let ok = 0
  let failed = []

  for (const { file, prompt } of images) {
    console.log(`\n⟳  ${file}`)
    let success = false

    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      if (attempt > 1) {
        console.log(`   retry ${attempt}/3 (waiting 5s)...`)
        await sleep(5000)
      }
      try {
        const bytes = await downloadOne(file, prompt, attempt)
        console.log(`   OK  ${(bytes / 1024).toFixed(0)} KB`)
        success = true
        ok++
      } catch (err) {
        console.log(`   FAIL: ${err.message}`)
      }
    }

    if (!success) failed.push(file)

    // Be polite — wait between requests
    await sleep(2000)
  }

  console.log(`\n${"─".repeat(50)}`)
  console.log(`Done: ${ok}/${images.length} images downloaded`)
  if (failed.length) {
    console.log(`\nFailed (${failed.length}):`)
    failed.forEach((f) => console.log(`  - ${f}`))
    console.log("\nFor failed images, try running the script again or use the")
    console.log("prompts from the MDX comments with Midjourney/DALL-E.")
  } else {
    console.log("\nAll images ready! Commit with:")
    console.log("  git add public/images/blog && git commit -m 'Add hero images' && git push")
  }
}

downloadAll().catch(console.error)
