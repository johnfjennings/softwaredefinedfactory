import { createWriteStream, existsSync } from "fs"
import { pipeline } from "stream/promises"
import https from "https"

const OUT_DIR = "c:/JohnJennings/_Projects/ClaudePro/softwaredefinedfactory/public/images/blog"

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
    prompt: "photorealistic split composition: modern data center server racks with blue LED lights on left seamlessly merging into industrial factory control room with SCADA screens on right, glowing data streams bridging IT and OT worlds, cinematic professional technology photography",
  },
  {
    file: "computer-vision-inspection.jpg",
    prompt: "photorealistic industrial machine vision camera system above conveyor belt performing automated quality inspection, bright LED inspection lighting, AI detection bounding boxes highlighting defects on electronic components, quality control manufacturing environment, editorial technology photography",
  },
  {
    file: "unified-namespace-mqtt.jpg",
    prompt: "photorealistic abstract technology: glowing blue network graph node diagram showing factory equipment connected to central unified data hub, MQTT message data streams flowing between industrial sensors PLCs cloud platforms, dark background teal blue color palette, editorial industrial IoT architecture visualization",
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
    prompt: "photorealistic industrial cybersecurity: SCADA control room screens showing network intrusion detection red warning alerts, glowing firewall shield barrier between IT network and OT factory systems, dark atmospheric moody lighting, editorial security photography",
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
    prompt: "photorealistic panoramic view of fully automated Industry 4.0 smart factory: collaborative robot arms, automated guided vehicles AGVs, conveyor systems, real-time digital production displays, workers using tablets, cinematic ultra wide angle factory photography, clean white and blue lighting",
  },
  {
    file: "smart-manufacturing-intro.jpg",
    prompt: "photorealistic aerial drone view of modern smart manufacturing facility, glass facade revealing multiple levels of robotic production lines, solar panels on roof, futuristic geometric architecture, golden hour sunset lighting, cinematic wide angle editorial photography",
  },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        file.close()
        download(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        file.close()
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }
      res.pipe(file)
      file.on("finish", () => file.close(resolve))
      file.on("error", reject)
    }).on("error", reject)
  })
}

// Download in batches of 4 to avoid overwhelming the API
async function downloadAll() {
  const BATCH = 4
  for (let i = 0; i < images.length; i += BATCH) {
    const batch = images.slice(i, i + BATCH)
    await Promise.all(
      batch.map(async ({ file, prompt }) => {
        const dest = `${OUT_DIR}/${file}`
        const encoded = encodeURIComponent(prompt)
        const url = `https://image.pollinations.ai/prompt/${encoded}?width=1280&height=720&model=flux-realism&nologo=true&seed=${Math.floor(Math.random() * 99999)}`
        console.log(`Downloading ${file}...`)
        try {
          await download(url, dest)
          console.log(`  OK  ${file}`)
        } catch (err) {
          console.error(`  FAIL ${file}: ${err.message}`)
        }
      })
    )
  }
  console.log("\nAll downloads complete.")
}

downloadAll()
