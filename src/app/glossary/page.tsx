import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export const metadata = {
  title: "Smart Manufacturing Glossary — Key Terms & Definitions",
  description:
    "A comprehensive glossary of smart manufacturing, Industry 4.0, IIoT, and automation terms. Clear, jargon-free definitions for manufacturing professionals.",
}

interface GlossaryTerm {
  term: string
  definition: string
  category: string
}

const glossaryTerms: GlossaryTerm[] = [
  // A
  {
    term: "Additive Manufacturing",
    definition:
      "The process of creating three-dimensional objects by adding material layer by layer, commonly known as 3D printing. Used in manufacturing for prototyping, tooling, and increasingly for production parts.",
    category: "Manufacturing Processes",
  },
  {
    term: "AGV (Automated Guided Vehicle)",
    definition:
      "A mobile robot that follows predefined paths (using wires, magnets, or lasers) to transport materials around a factory floor without human intervention.",
    category: "Automation",
  },
  {
    term: "AMR (Autonomous Mobile Robot)",
    definition:
      "A mobile robot that navigates dynamically using sensors, cameras, and AI — unlike AGVs, AMRs don't need fixed paths and can reroute around obstacles in real time.",
    category: "Automation",
  },
  {
    term: "Andon",
    definition:
      "A visual management system originating from lean manufacturing that uses lights or signals to indicate the status of a production line. Alerts operators and supervisors to quality or process issues requiring attention.",
    category: "Lean Manufacturing",
  },
  {
    term: "API (Application Programming Interface)",
    definition:
      "A set of rules and protocols that allows different software systems to communicate with each other. In manufacturing, APIs connect machines, MES, ERP, and cloud platforms to share data.",
    category: "Software & Integration",
  },
  // B
  {
    term: "Batch Processing",
    definition:
      "A manufacturing method where products are made in groups (batches) rather than in a continuous flow. Common in food, pharmaceutical, and chemical manufacturing.",
    category: "Manufacturing Processes",
  },
  {
    term: "Brownfield",
    definition:
      "An existing factory or facility being upgraded with new technology, as opposed to a greenfield (new) site. Brownfield deployments are typically more complex due to legacy equipment and systems.",
    category: "Strategy",
  },
  // C
  {
    term: "CMMS (Computerised Maintenance Management System)",
    definition:
      "Software that manages maintenance activities including work orders, preventive maintenance schedules, spare parts inventory, and maintenance history for plant equipment.",
    category: "Maintenance",
  },
  {
    term: "CNC (Computer Numerical Control)",
    definition:
      "Automated control of machining tools (mills, lathes, routers) using pre-programmed computer software. CNC machines execute precise, repeatable operations from digital instructions.",
    category: "Automation",
  },
  {
    term: "Cobot (Collaborative Robot)",
    definition:
      "A robot designed to work safely alongside humans without the need for physical safety barriers. Cobots are typically used for repetitive tasks like assembly, pick-and-place, and quality inspection.",
    category: "Automation",
  },
  {
    term: "Condition Monitoring",
    definition:
      "The continuous measurement of equipment parameters (vibration, temperature, pressure) to detect changes that indicate developing faults. A key enabler of predictive maintenance.",
    category: "Maintenance",
  },
  {
    term: "Cyber-Physical System (CPS)",
    definition:
      "A system that integrates computation, networking, and physical processes. Sensors and actuators are connected to software that monitors and controls the physical world — the foundation of Industry 4.0.",
    category: "Industry 4.0",
  },
  // D
  {
    term: "Dark Factory",
    definition:
      "A fully automated manufacturing facility that can operate without human presence, and therefore without lighting. While true dark factories are rare, the concept represents the ultimate goal of full automation.",
    category: "Automation",
  },
  {
    term: "Data Historian",
    definition:
      "A specialised database designed to efficiently store and retrieve time-series data from industrial processes. Historians record sensor readings, machine states, and process variables over time.",
    category: "Software & Integration",
  },
  {
    term: "Digital Thread",
    definition:
      "The connected data flow that links every stage of a product's lifecycle — from design and engineering through manufacturing, quality, and field service — creating a single, traceable record.",
    category: "Industry 4.0",
  },
  {
    term: "Digital Twin",
    definition:
      "A virtual replica of a physical asset, process, or system that is continuously updated with real-time data. Unlike a simulation, a digital twin evolves alongside its physical counterpart and grows more accurate over time.",
    category: "Industry 4.0",
  },
  {
    term: "DCS (Distributed Control System)",
    definition:
      "An automated control system distributed across a plant, where controllers are located near the equipment they control. Common in process industries like chemicals, oil and gas, and power generation.",
    category: "Automation",
  },
  // E
  {
    term: "Edge Computing",
    definition:
      "Processing data near the source (on the factory floor) rather than sending it all to the cloud. Reduces latency, saves bandwidth, and enables real-time decision making for time-critical manufacturing operations.",
    category: "Infrastructure",
  },
  {
    term: "ERP (Enterprise Resource Planning)",
    definition:
      "Business management software that integrates core processes including production planning, procurement, inventory, finance, and HR into a single system. SAP, Oracle, and Microsoft Dynamics are common examples.",
    category: "Software & Integration",
  },
  // F
  {
    term: "FMEA (Failure Mode and Effects Analysis)",
    definition:
      "A systematic method for identifying potential failure modes in a process or product, assessing their severity, likelihood, and detectability, and prioritising actions to reduce risk.",
    category: "Quality",
  },
  {
    term: "FMS (Flexible Manufacturing System)",
    definition:
      "A production system that can be quickly adapted to produce different products or product variants with minimal changeover time. Combines CNC machines, robots, and automated material handling.",
    category: "Manufacturing Processes",
  },
  // G
  {
    term: "Gemba",
    definition:
      "A Japanese term meaning 'the real place' — in manufacturing, it refers to the factory floor where value is created. A 'gemba walk' is the practice of going to the shop floor to observe processes firsthand.",
    category: "Lean Manufacturing",
  },
  {
    term: "Greenfield",
    definition:
      "A brand-new factory or facility built from scratch, offering the opportunity to implement the latest technologies without legacy constraints. Contrast with brownfield.",
    category: "Strategy",
  },
  // H
  {
    term: "HMI (Human-Machine Interface)",
    definition:
      "A screen or panel that allows operators to interact with machines and control systems. Modern HMIs display real-time data, alarms, and controls, often replacing physical buttons and gauges.",
    category: "Automation",
  },
  // I
  {
    term: "IIoT (Industrial Internet of Things)",
    definition:
      "The application of IoT technology in industrial settings — connecting machines, sensors, and systems to collect and analyse data for improved efficiency, quality, and safety in manufacturing.",
    category: "Industry 4.0",
  },
  {
    term: "Industry 4.0",
    definition:
      "The fourth industrial revolution, characterised by the integration of digital technologies (IoT, AI, cloud computing, big data) into manufacturing. Focuses on smart, connected, data-driven production.",
    category: "Industry 4.0",
  },
  {
    term: "Industry 5.0",
    definition:
      "An emerging concept that builds on Industry 4.0 by emphasising human-centric manufacturing, sustainability, and resilience. Focuses on human-robot collaboration rather than pure automation.",
    category: "Industry 4.0",
  },
  {
    term: "ISA-95",
    definition:
      "An international standard that defines a framework for integrating enterprise (ERP) and control systems (SCADA/MES). Establishes clear levels of the manufacturing IT architecture from Level 0 (physical process) to Level 4 (business planning).",
    category: "Standards",
  },
  // J
  {
    term: "Jidoka",
    definition:
      "A lean manufacturing principle meaning 'automation with a human touch.' Machines are designed to detect abnormalities and stop automatically, preventing defective products from being produced.",
    category: "Lean Manufacturing",
  },
  {
    term: "JIT (Just-in-Time)",
    definition:
      "A production strategy where materials and components are delivered exactly when needed in the production process, minimising inventory costs and waste. Pioneered by Toyota.",
    category: "Lean Manufacturing",
  },
  // K
  {
    term: "Kaizen",
    definition:
      "A Japanese philosophy meaning 'continuous improvement.' In manufacturing, it involves all employees — from the CEO to assembly operators — identifying and implementing small, incremental improvements every day.",
    category: "Lean Manufacturing",
  },
  {
    term: "Kanban",
    definition:
      "A visual scheduling system that controls the flow of materials and work through a production process. Uses cards or signals to trigger production or movement of parts only when needed.",
    category: "Lean Manufacturing",
  },
  {
    term: "KPI (Key Performance Indicator)",
    definition:
      "A measurable value that indicates how effectively a manufacturing operation is achieving its objectives. Common manufacturing KPIs include OEE, first-pass yield, on-time delivery, and scrap rate.",
    category: "Performance",
  },
  // L
  {
    term: "Lean Manufacturing",
    definition:
      "A systematic method for minimising waste within a manufacturing system without sacrificing productivity. Originated from the Toyota Production System and focuses on value, flow, pull, and continuous improvement.",
    category: "Lean Manufacturing",
  },
  {
    term: "Lights-Out Manufacturing",
    definition:
      "Another term for dark factory — production that runs autonomously without human workers present. Machines operate continuously with monitoring provided remotely.",
    category: "Automation",
  },
  // M
  {
    term: "Machine Learning (ML)",
    definition:
      "A subset of artificial intelligence where algorithms learn patterns from data without being explicitly programmed. In manufacturing, ML is used for predictive maintenance, quality prediction, and process optimisation.",
    category: "AI & Analytics",
  },
  {
    term: "Machine Vision",
    definition:
      "The use of cameras and image processing algorithms to automatically inspect and analyse products on a production line. Used for defect detection, measurement, barcode reading, and robotic guidance.",
    category: "Quality",
  },
  {
    term: "MES (Manufacturing Execution System)",
    definition:
      "Software that tracks and manages production in real time on the factory floor. Bridges the gap between ERP (business planning) and the shop floor (machines and operators), managing work orders, quality, and traceability.",
    category: "Software & Integration",
  },
  {
    term: "MQTT",
    definition:
      "A lightweight messaging protocol designed for IoT devices. Widely used in IIoT to transmit sensor data from machines to cloud platforms or edge devices with minimal bandwidth and power consumption.",
    category: "Infrastructure",
  },
  {
    term: "MTBF (Mean Time Between Failures)",
    definition:
      "The average time a piece of equipment operates before it fails. A key reliability metric — higher MTBF means more reliable equipment. Used to plan maintenance intervals and spare parts inventory.",
    category: "Maintenance",
  },
  {
    term: "MTTR (Mean Time to Repair)",
    definition:
      "The average time it takes to repair a piece of equipment after a failure. A key maintenance performance metric — lower MTTR means faster recovery from breakdowns.",
    category: "Maintenance",
  },
  // O
  {
    term: "OEE (Overall Equipment Effectiveness)",
    definition:
      "The gold standard metric for measuring manufacturing productivity. Calculated as Availability x Performance x Quality, expressed as a percentage. World-class OEE is typically considered to be 85% or above.",
    category: "Performance",
  },
  {
    term: "OPC UA (Open Platform Communications Unified Architecture)",
    definition:
      "An industrial communication standard that enables secure, reliable data exchange between machines, controllers, and software systems from different vendors. The lingua franca of Industry 4.0.",
    category: "Standards",
  },
  {
    term: "OT (Operational Technology)",
    definition:
      "Hardware and software that monitors and controls physical equipment and processes in a factory — PLCs, SCADA, DCS, HMIs, and industrial networks. Distinct from IT (information technology) but increasingly converging.",
    category: "Infrastructure",
  },
  // P
  {
    term: "PLC (Programmable Logic Controller)",
    definition:
      "A ruggedised industrial computer designed to control manufacturing processes — monitoring inputs from sensors, executing logic, and controlling outputs like motors, valves, and conveyors. The workhorse of factory automation.",
    category: "Automation",
  },
  {
    term: "Poka-Yoke",
    definition:
      "A Japanese term meaning 'mistake-proofing.' A mechanism or design feature that prevents errors from occurring or makes them immediately obvious. Examples include asymmetric connectors that can only be inserted one way.",
    category: "Lean Manufacturing",
  },
  {
    term: "Predictive Maintenance",
    definition:
      "A maintenance strategy that uses sensor data and analytics to predict when equipment will fail, allowing maintenance to be scheduled just before failure occurs. Reduces both unplanned downtime and unnecessary preventive maintenance.",
    category: "Maintenance",
  },
  {
    term: "Prescriptive Maintenance",
    definition:
      "An advanced maintenance approach that goes beyond predicting failures — it recommends specific actions to take, optimal timing, and expected outcomes. Uses AI and digital twin technology to prescribe the best maintenance strategy.",
    category: "Maintenance",
  },
  // Q
  {
    term: "Quality 4.0",
    definition:
      "The application of Industry 4.0 technologies (AI, big data, IIoT, cloud) to quality management. Shifts quality from reactive inspection to proactive, data-driven prevention and prediction.",
    category: "Quality",
  },
  // R
  {
    term: "RFID (Radio-Frequency Identification)",
    definition:
      "Technology that uses radio waves to automatically identify and track tags attached to objects. In manufacturing, RFID tracks work-in-progress, raw materials, tools, and finished goods throughout the facility.",
    category: "Infrastructure",
  },
  {
    term: "RPA (Robotic Process Automation)",
    definition:
      "Software 'bots' that automate repetitive digital tasks — data entry, report generation, order processing. In manufacturing, RPA automates back-office processes that support production operations.",
    category: "Automation",
  },
  // S
  {
    term: "SCADA (Supervisory Control and Data Acquisition)",
    definition:
      "A system that monitors and controls industrial processes across an entire plant or multiple sites. Collects data from PLCs and sensors, displays it on operator screens, and enables remote control of equipment.",
    category: "Automation",
  },
  {
    term: "Six Sigma",
    definition:
      "A data-driven methodology for eliminating defects and reducing variation in manufacturing processes. Aims for no more than 3.4 defects per million opportunities. Uses DMAIC (Define, Measure, Analyse, Improve, Control) framework.",
    category: "Quality",
  },
  {
    term: "Smart Factory",
    definition:
      "A highly digitised and connected production facility where machines, systems, and people communicate and collaborate in real time. Uses IIoT, AI, and data analytics to self-optimise performance, adapt to changes, and learn from new conditions.",
    category: "Industry 4.0",
  },
  {
    term: "SPC (Statistical Process Control)",
    definition:
      "The use of statistical methods to monitor and control a manufacturing process. Control charts track process variation in real time, distinguishing normal variation from assignable causes that require intervention.",
    category: "Quality",
  },
  // T
  {
    term: "Takt Time",
    definition:
      "The rate at which a finished product must be completed to meet customer demand. Calculated as available production time divided by customer demand. The heartbeat of a lean production line.",
    category: "Lean Manufacturing",
  },
  {
    term: "Throughput",
    definition:
      "The rate at which a manufacturing system produces finished goods. Measured in units per hour, day, or shift. One of the three key metrics (along with inventory and operating expense) in the Theory of Constraints.",
    category: "Performance",
  },
  {
    term: "TPM (Total Productive Maintenance)",
    definition:
      "A holistic approach to equipment maintenance that involves all employees — from operators to managers — in maintaining and improving equipment. Aims for zero breakdowns, zero defects, and zero accidents.",
    category: "Maintenance",
  },
  {
    term: "Traceability",
    definition:
      "The ability to track every component, material, and process step involved in manufacturing a product. Essential for quality control, regulatory compliance, and recall management in industries like automotive, aerospace, and pharmaceuticals.",
    category: "Quality",
  },
  // U
  {
    term: "Unified Namespace (UNS)",
    definition:
      "An architectural pattern that creates a single, centralised data hub for all manufacturing data. Instead of point-to-point connections between systems, all data is published to and consumed from a shared namespace, typically using MQTT.",
    category: "Infrastructure",
  },
  // V
  {
    term: "Value Stream Mapping (VSM)",
    definition:
      "A lean management tool that visualises the flow of materials and information required to deliver a product to the customer. Identifies value-adding and non-value-adding steps to highlight improvement opportunities.",
    category: "Lean Manufacturing",
  },
  // W
  {
    term: "WIP (Work in Progress)",
    definition:
      "Partially finished goods that are still in the manufacturing process. Excessive WIP ties up capital, increases lead times, and makes quality problems harder to detect. Lean manufacturing aims to minimise WIP.",
    category: "Manufacturing Processes",
  },
]

const categories = Array.from(new Set(glossaryTerms.map((t) => t.category))).sort()

const categoryColors: Record<string, string> = {
  "AI & Analytics": "bg-violet-500/10 text-violet-500",
  Automation: "bg-blue-500/10 text-blue-500",
  "Industry 4.0": "bg-cyan-500/10 text-cyan-500",
  Infrastructure: "bg-slate-500/10 text-slate-500",
  "Lean Manufacturing": "bg-green-500/10 text-green-500",
  Maintenance: "bg-orange-500/10 text-orange-500",
  "Manufacturing Processes": "bg-indigo-500/10 text-indigo-500",
  Performance: "bg-amber-500/10 text-amber-500",
  Quality: "bg-rose-500/10 text-rose-500",
  "Software & Integration": "bg-purple-500/10 text-purple-500",
  Standards: "bg-teal-500/10 text-teal-500",
  Strategy: "bg-emerald-500/10 text-emerald-500",
}

export default function GlossaryPage() {
  const letters = Array.from(new Set(glossaryTerms.map((t) => t.term[0].toUpperCase()))).sort()

  const groupedByLetter: Record<string, GlossaryTerm[]> = {}
  for (const term of glossaryTerms) {
    const letter = term.term[0].toUpperCase()
    if (!groupedByLetter[letter]) groupedByLetter[letter] = []
    groupedByLetter[letter].push(term)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl px-4 py-24">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              Smart Manufacturing Glossary
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Clear, jargon-free definitions for the key terms and acronyms used in smart
              manufacturing, Industry 4.0, IIoT, and factory automation.
            </p>
          </div>

          {/* Category legend */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${categoryColors[cat] || "bg-muted text-muted-foreground"}`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Letter jump nav */}
          <div className="flex flex-wrap justify-center gap-1 mb-16">
            {letters.map((letter) => (
              <a
                key={letter}
                href={`#${letter}`}
                className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Terms */}
          <div className="space-y-12">
            {letters.map((letter) => (
              <section key={letter} id={letter}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl font-bold">{letter}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground">
                    {groupedByLetter[letter].length} term{groupedByLetter[letter].length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {groupedByLetter[letter].map((item) => (
                    <Card key={item.term}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                              <h3 className="text-lg font-semibold">{item.term}</h3>
                              <span
                                className={`shrink-0 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[item.category] || "bg-muted text-muted-foreground"}`}
                              >
                                {item.category}
                              </span>
                            </div>
                            <p className="text-muted-foreground ml-7">{item.definition}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Stats + CTA */}
          <div className="mt-24 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="pt-8 pb-8">
                <p className="text-4xl font-bold mb-2">{glossaryTerms.length}</p>
                <p className="text-muted-foreground mb-4">
                  terms defined across {categories.length} categories. This glossary is regularly
                  updated as new technologies and concepts emerge.
                </p>
                <p className="text-sm text-muted-foreground">
                  Missing a term?{" "}
                  <a
                    href="mailto:hello@softwaredefinedfactory.com"
                    className="underline hover:text-foreground transition-colors"
                  >
                    Let us know
                  </a>{" "}
                  and we&apos;ll add it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
