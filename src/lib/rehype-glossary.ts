import type { Root, Element, Text, ElementContent } from "hast"
import { visit } from "unist-util-visit"
import { glossaryTerms } from "./glossary"

// Elements whose children should NOT be annotated
const SKIP_ELEMENTS = new Set([
  "h1", "h2", "h3", "h4", "h5", "h6",
  "a", "code", "pre",
  "glossary-term", // avoid re-annotating
])

/**
 * Rehype plugin that wraps the first occurrence of each glossary term
 * in a <span data-glossary="..." data-glossary-definition="..."> element.
 */
export default function rehypeGlossary() {
  // Build lookup: lowercase term name -> { term, definition }
  const termLookup = new Map<string, { term: string; definition: string }>()
  for (const entry of glossaryTerms) {
    termLookup.set(entry.term.toLowerCase(), {
      term: entry.term,
      definition: entry.definition,
    })
  }

  // Sort terms longest-first so "Unified Namespace" matches before "Namespace"
  const sortedTermNames = Array.from(termLookup.keys()).sort(
    (a, b) => b.length - a.length
  )

  // Build a single regex that matches any glossary term (case-insensitive, word boundary)
  const escaped = sortedTermNames.map((t) =>
    t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  )
  const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi")

  return (tree: Root) => {
    // Track which terms have already been annotated (first-occurrence-only)
    const annotated = new Set<string>()

    visit(tree, "element", (node: Element) => {
      // Skip elements that should not contain glossary annotations
      if (SKIP_ELEMENTS.has(node.tagName)) {
        return "skip"
      }

      // Only process direct text children of content elements
      const newChildren: ElementContent[] = []
      let changed = false

      for (const child of node.children) {
        if (child.type !== "text") {
          newChildren.push(child)
          continue
        }

        const text = (child as Text).value
        const fragments: ElementContent[] = []
        let lastIndex = 0

        // Reset regex lastIndex for each text node
        pattern.lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = pattern.exec(text)) !== null) {
          const matchedText = match[0]
          const key = matchedText.toLowerCase()
          const entry = termLookup.get(key)

          if (!entry || annotated.has(key)) {
            continue
          }

          annotated.add(key)
          changed = true

          // Add text before the match
          if (match.index > lastIndex) {
            fragments.push({
              type: "text",
              value: text.slice(lastIndex, match.index),
            } as Text)
          }

          // Add the annotated span
          fragments.push({
            type: "element",
            tagName: "span",
            properties: {
              "data-glossary": entry.term,
              "data-glossary-definition": entry.definition,
            },
            children: [{ type: "text", value: matchedText } as Text],
          } as Element)

          lastIndex = match.index + matchedText.length
        }

        if (fragments.length > 0) {
          // Add remaining text after last match
          if (lastIndex < text.length) {
            fragments.push({
              type: "text",
              value: text.slice(lastIndex),
            } as Text)
          }
          newChildren.push(...fragments)
        } else {
          newChildren.push(child)
        }
      }

      if (changed) {
        node.children = newChildren
      }
    })
  }
}
