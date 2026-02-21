import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const BASE = "c:/JohnJennings/_Projects/ClaudePro/softwaredefinedfactory/src/content/blog"

import { readdirSync } from "fs"
const files = readdirSync(BASE).filter(f => f.endsWith(".mdx"))

for (const filename of files) {
  const path = join(BASE, filename)
  let content = readFileSync(path, "utf8")

  // Replace HTML comments with MDX/JSX comments
  content = content.replace(
    /<!-- (hero-image-prompt: .*?) -->/g,
    "{/* $1 */}"
  )

  writeFileSync(path, content, "utf8")
  console.log(`Fixed ${filename}`)
}

console.log("\nDone.")
