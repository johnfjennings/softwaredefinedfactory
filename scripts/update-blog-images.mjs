import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const BASE = "c:/JohnJennings/_Projects/ClaudePro/softwaredefinedfactory/src/content/blog"

const posts = {
  "iiot-trend-2026-edge-ai.mdx": {
    cover: "/images/blog/edge-ai-manufacturing.jpg",
    prompt: "photorealistic industrial edge computing AI gateway device mounted on factory wall with glowing blue LED status indicators, neural network hologram floating above industrial machines, blurred robotic assembly line background, dramatic directional lighting, ultra wide angle, editorial technology photography, dark moody atmosphere",
  },
  "iiot-trend-2026-cobots-amrs.mdx": {
    cover: "/images/blog/cobots-amrs-factory.jpg",
    prompt: "photorealistic collaborative robot cobot arm working alongside human factory worker on precision assembly task, modern automotive manufacturing plant, orange and blue safety lighting, autonomous mobile robot AMR navigating between workstations in background, wide angle editorial industrial photography",
  },
  "iiot-trend-2026-energy-sustainability.mdx": {
    cover: "/images/blog/energy-sustainability-factory.jpg",
    prompt: "photorealistic aerial drone view of modern smart factory with large solar panel array on roof and wind turbines nearby, green energy sustainability concept, golden hour warm lighting, environmental smart manufacturing, cinematic wide angle",
  },
  "iiot-trend-2026-it-ot-convergence.mdx": {
    cover: "/images/blog/it-ot-convergence.jpg",
    prompt: "photorealistic split composition: modern data center server racks with blue LED lights on left seamlessly merging into industrial factory control room with SCADA screens on right, glowing data streams bridging IT and OT worlds, cinematic professional technology photography",
  },
  "iiot-trend-2026-computer-vision.mdx": {
    cover: "/images/blog/computer-vision-inspection.jpg",
    prompt: "photorealistic industrial machine vision camera system above conveyor belt performing automated quality inspection, bright LED inspection lighting, AI detection bounding boxes highlighting defects on electronic components, quality control manufacturing environment, editorial technology photography",
  },
  "iiot-trend-2026-unified-namespace.mdx": {
    cover: "/images/blog/unified-namespace-mqtt.jpg",
    prompt: "photorealistic abstract technology: glowing blue network graph node diagram showing factory equipment connected to central unified data hub, MQTT message data streams flowing between industrial sensors PLCs cloud platforms, dark background teal blue color palette, editorial industrial IoT architecture visualization",
  },
  "iiot-trend-2026-predictive-maintenance.mdx": {
    cover: "/images/blog/predictive-maintenance-iiot.jpg",
    prompt: "photorealistic industrial maintenance engineer holding tablet showing AI predictive analytics dashboard, large industrial motor with wireless vibration sensors attached, health score and warning indicators on screen, modern factory floor environment, dramatic directional lighting",
  },
  "iiot-trend-2026-private-5g.mdx": {
    cover: "/images/blog/private-5g-factory.jpg",
    prompt: "photorealistic private 5G antenna array installed on ceiling of large modern factory floor, wireless signal wave visualization connecting hundreds of machines and autonomous vehicles, blue electromagnetic connectivity streams, wide angle editorial industrial photography",
  },
  "iiot-trend-2026-digital-twins.mdx": {
    cover: "/images/blog/digital-twins-iiot.jpg",
    prompt: "photorealistic glowing blue holographic digital twin of industrial turbine machine floating beside its physical counterpart on factory floor, real-time sensor data streams synchronizing, engineers studying holographic interface panels, dark dramatic atmospheric lighting",
  },
  "iiot-trend-2026-ot-cybersecurity.mdx": {
    cover: "/images/blog/ot-cybersecurity.jpg",
    prompt: "photorealistic industrial cybersecurity: SCADA control room screens showing network intrusion detection red warning alerts, glowing firewall shield barrier between IT network and OT factory systems, dark atmospheric moody lighting, editorial security photography",
  },
  "understanding-oee.mdx": {
    cover: "/images/blog/oee-metrics-dashboard.jpg",
    prompt: "photorealistic large factory floor digital display wall showing OEE overall equipment effectiveness dashboard with availability performance quality gauges, manufacturing operations manager analyzing production metrics, modern industrial control room, blue data visualization editorial photography",
  },
  "digital-twins-manufacturing.mdx": {
    cover: "/images/blog/digital-twins-manufacturing.jpg",
    prompt: "photorealistic entire factory production line as glowing blue holographic digital twin floating above real physical machinery, engineers walking through layered physical and virtual space simultaneously, ultra wide cinematic angle, dark background blue holographic accent lighting",
  },
  "predictive-maintenance-guide.mdx": {
    cover: "/images/blog/predictive-maintenance-guide.jpg",
    prompt: "photorealistic industrial maintenance engineer wearing augmented reality AR glasses viewing predictive maintenance data overlaid on large industrial pump, thermal imaging visualization, vibration spectrum chart in AR display, professional factory environment editorial photography",
  },
  "getting-started-with-iiot.mdx": {
    cover: "/images/blog/iiot-getting-started.jpg",
    prompt: "photorealistic factory floor overview with glowing IoT sensor nodes attached to industrial machines and pipes, data streams flowing upward forming cloud visualization above the factory, connected smart factory concept, blue accent lighting, wide angle editorial industrial photography",
  },
  "industry-4-0-explained.mdx": {
    cover: "/images/blog/industry-4-0-explained.jpg",
    prompt: "photorealistic panoramic view of fully automated Industry 4.0 smart factory: collaborative robot arms, automated guided vehicles AGVs, conveyor systems, real-time digital production displays, workers using tablets, cinematic ultra wide angle factory photography, clean white and blue lighting",
  },
  "what-is-smart-manufacturing.mdx": {
    cover: "/images/blog/smart-manufacturing-intro.jpg",
    prompt: "photorealistic aerial drone view of modern smart manufacturing facility, glass facade revealing multiple levels of robotic production lines, solar panels on roof, futuristic geometric architecture, golden hour sunset lighting, cinematic wide angle editorial photography",
  },
}

for (const [filename, data] of Object.entries(posts)) {
  const path = join(BASE, filename)
  let content = readFileSync(path, "utf8")

  // Replace or insert coverImage in frontmatter
  if (content.includes("coverImage:")) {
    content = content.replace(/coverImage: ".*?"/, `coverImage: "${data.cover}"`)
  } else {
    // Insert before the closing --- of frontmatter
    content = content.replace(/(\ntags: \[.*?\])\n---/s, `$1\ncoverImage: "${data.cover}"\n---`)
  }

  // Add HTML comment after closing frontmatter ---
  const comment = `<!-- hero-image-prompt: ${data.prompt} -->`
  const parts = content.split("---")
  // parts[0]='', parts[1]=frontmatter, parts[2]=rest
  if (parts.length >= 3) {
    content = `---${parts[1]}---\n\n${comment}\n\n${parts.slice(2).join("---").trimStart()}`
  }

  writeFileSync(path, content, "utf8")
  console.log(`OK  ${filename}`)
}

console.log("\nAll MDX files updated.")
