export interface ConferenceEvent {
  name: string
  dates: string
  location: string
  region: "North America" | "Europe" | "Asia"
  description: string
  url: string
  tags: string[]
  isPast?: boolean
}

export const REGION_COLORS: Record<string, string> = {
  "North America": "bg-blue-500/10 text-blue-500",
  Europe: "bg-emerald-500/10 text-emerald-500",
  Asia: "bg-amber-500/10 text-amber-500",
}

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

export function getMonthFromDates(dates: string): string {
  for (const month of MONTHS) {
    if (dates.includes(month)) return month
  }
  return "TBD"
}

export const events: ConferenceEvent[] = [
  {
    name: "CES 2026",
    dates: "January 6-9, 2026",
    location: "Las Vegas, NV, USA",
    region: "North America",
    description: "The world's most powerful tech event. Increasingly relevant for manufacturing with AI, robotics, digital twins, and industrial IoT showcases alongside consumer tech.",
    url: "https://www.ces.tech/",
    tags: ["AI", "Robotics", "IoT", "Digital Twins"],
    isPast: true,
  },
  {
    name: "IoT Tech Expo Global",
    dates: "February 4-5, 2026",
    location: "Olympia, London, UK",
    region: "Europe",
    description: "Leading IoT conference covering Industrial IoT, smart cities, connected industry, and edge computing. Strong focus on real-world IIoT deployment case studies.",
    url: "https://www.iottechexpo.com/global/",
    tags: ["IIoT", "Edge Computing", "Connected Industry"],
    isPast: true,
  },
  {
    name: "ARC Industry Leadership Forum",
    dates: "February 3-5, 2026",
    location: "Orlando, FL, USA",
    region: "North America",
    description: "Premier forum for industrial technology leaders focused on IIoT-enabled sustainability, smart factories, secure industrial connectivity, and digital transformation strategies.",
    url: "https://www.arcweb.com/events/arc-industry-leadership-forum",
    tags: ["IIoT", "Smart Factories", "Sustainability"],
    isPast: true,
  },
  {
    name: "SPS Smart Production Solutions Guangzhou",
    dates: "March 4-6, 2026",
    location: "Guangzhou, China",
    region: "Asia",
    description: "Asia's key event for smart production solutions, automation, and industrial digitisation. Features international exhibitors from the SPS Nuremberg ecosystem.",
    url: "https://www.spsinchina.com/",
    tags: ["Automation", "Smart Production", "Industry 4.0"],
  },
  {
    name: "SPS Stage Bangkok",
    dates: "March 11-13, 2026",
    location: "Bangkok, Thailand",
    region: "Asia",
    description: "Regional extension of SPS Nuremberg connecting international automation brands with partners and customers in the Thai and Southeast Asian markets.",
    url: "https://www.spsinchina.com/",
    tags: ["Automation", "Smart Production"],
  },
  {
    name: "Smart Manufacturing World Summit",
    dates: "March 18-20, 2026",
    location: "Stuttgart, Germany",
    region: "Europe",
    description: "Three-day event for manufacturing leaders focused on scaling from pilots to plant-wide rollouts, cyber resilience, regulatory compliance, and circular operations.",
    url: "https://www.key-notion.com/smart-manufacturing-world-summit-stuttgart-2026",
    tags: ["Smart Manufacturing", "Industry 4.0", "Digital Transformation"],
  },
  {
    name: "Smart Factories Summit",
    dates: "March 31, 2026",
    location: "Chicago, IL, USA",
    region: "North America",
    description: "One-day leadership event focused on building future-ready Industry 4.0 strategies. Covers automation, data intelligence, AI deployment, and operational excellence.",
    url: "https://www.amg-world.co.uk/smart-factories-summit/",
    tags: ["Industry 4.0", "AI", "Automation"],
  },
  {
    name: "Hannover Messe 2026",
    dates: "April 20-24, 2026",
    location: "Hanover, Germany",
    region: "Europe",
    description: "The world's leading trade fair for industrial technology. Over 4,000 exhibitors, 300+ startups, and 2,000+ product launches across Automation & Digitalization, Energy & Industrial Infrastructure, and Research & Technology Transfer.",
    url: "https://www.hannovermesse.de/en/",
    tags: ["Automation", "Industry 4.0", "Energy", "Robotics"],
  },
  {
    name: "SPS Stage Kuala Lumpur",
    dates: "May 13-15, 2026",
    location: "Kuala Lumpur, Malaysia",
    region: "Asia",
    description: "SPS regional event for Southeast Asia featuring speaking slots, product demonstrations, and exclusive networking with regional decision-makers in automation and smart production.",
    url: "https://www.spsinchina.com/",
    tags: ["Automation", "Smart Production"],
  },
  {
    name: "IoT Tech Expo North America",
    dates: "May 18-19, 2026",
    location: "San Jose, CA, USA",
    region: "North America",
    description: "North American edition of the IoT Tech Expo series, covering Industrial IoT, smart manufacturing, AI, edge computing, and connected industry solutions.",
    url: "https://www.iottechexpo.com/northamerica/",
    tags: ["IIoT", "AI", "Edge Computing"],
  },
  {
    name: "Automate 2026",
    dates: "June 22-25, 2026",
    location: "Chicago, IL, USA",
    region: "North America",
    description: "North America's largest robotics and automation event. Over 1,000 exhibitors and 50,000+ attendees showcasing the latest in manufacturing automation. Free registration.",
    url: "https://www.automateshow.com/",
    tags: ["Robotics", "Automation", "Machine Vision", "AI"],
  },
  {
    name: "Smart Manufacturing Experience",
    dates: "June 2026 (Dates TBD)",
    location: "Pittsburgh, PA, USA",
    region: "North America",
    description: "Focused on digital transformation, IIoT, AI, and robotics for manufacturers at the edge of digital transformation. Connects emerging tech with real-world implementation.",
    url: "https://www.sme.org/",
    tags: ["Smart Manufacturing", "IIoT", "AI", "Robotics"],
  },
  {
    name: "IMTS 2026 — International Manufacturing Technology Show",
    dates: "September 14-19, 2026",
    location: "Chicago, IL, USA",
    region: "North America",
    description: "The largest manufacturing technology show in the Western Hemisphere. Nearly 90,000 attendees and thousands of exhibitors showcasing machine tools, automation, additive manufacturing, and digital solutions.",
    url: "https://www.imts.com/",
    tags: ["Machine Tools", "Automation", "Additive Manufacturing", "Digital"],
  },
  {
    name: "IoT Tech Expo Europe",
    dates: "October 20-21, 2026",
    location: "Amsterdam, Netherlands",
    region: "Europe",
    description: "European edition covering Industrial IoT, AI, edge computing, and connected industry. Features real-world case studies and hands-on demos from leading technology providers.",
    url: "https://www.iottechexpo.com/europe/",
    tags: ["IIoT", "AI", "Edge Computing"],
  },
  {
    name: "FABTECH 2026",
    dates: "October 21-23, 2026",
    location: "Las Vegas, NV, USA",
    region: "North America",
    description: "North America's largest event for metal forming, fabricating, welding, and finishing. Essential for manufacturers working with metals and materials processing.",
    url: "https://www.fabtechexpo.com/",
    tags: ["Fabrication", "Welding", "Metal Forming", "Automation"],
  },
  {
    name: "PACK EXPO International",
    dates: "October 2026 (Dates TBD)",
    location: "Chicago, IL, USA",
    region: "North America",
    description: "Packaging innovations and manufacturing automation for CPG and industrial manufacturers. Covers smart packaging, robotics, and Industry 4.0 solutions for packaging lines.",
    url: "https://www.packexpointernational.com/",
    tags: ["Packaging", "Automation", "Robotics"],
  },
  {
    name: "Rockwell Automation Fair",
    dates: "November 16-19, 2026",
    location: "Boston, MA, USA",
    region: "North America",
    description: "Rockwell Automation's premier event showcasing the latest in industrial automation, smart manufacturing, and the Connected Enterprise. Hands-on labs, demos, and technical sessions.",
    url: "https://www.rockwellautomation.com/en-us/events/automation-fair.html",
    tags: ["Automation", "Smart Manufacturing", "Connected Enterprise"],
  },
  {
    name: "ISM 2026 — Industry of the Future & Smart Manufacturing",
    dates: "November 2026 (Dates TBD)",
    location: "TBD",
    region: "Europe",
    description: "Academic and industry conference covering IIoT-based smart factories, digital twins, cybersecurity, edge-cloud computing, cognitive factories, and Industry 4.0/5.0 research.",
    url: "https://www.msc-les.org/ism2026/",
    tags: ["Research", "Digital Twins", "Cybersecurity", "Industry 5.0"],
  },
  {
    name: "SPS — Smart Production Solutions Nuremberg",
    dates: "November 23-25, 2026",
    location: "Nuremberg, Germany",
    region: "Europe",
    description: "Europe's leading trade fair for smart and digital automation. Over 56,000 visitors exploring electric control, sensor technology, drive systems, engineering services, and plant automation.",
    url: "https://www.sps-exhibition.com/",
    tags: ["Automation", "Sensors", "Drives", "Industry 4.0"],
  },
]
