# Course Briefs

Drop a brief file here to queue a new course for the **SDF Course Scaffolder** routine
(https://claude.ai/code/routines — "SDF Course Scaffolder"). Then press **Run** on the
routine, and it will scaffold every brief in this folder that doesn't yet have a
matching `src/content/courses/<slug>.json`, opening one pull request per course.

Name the file `<course-slug>.md` — the filename becomes the course slug.

## Template

```markdown
# Course title

**Audience:** who this is for (e.g. plant engineers new to OPC UA)
**Difficulty:** beginner | intermediate | advanced
**Price:** free | paid
**Category:** e.g. smart-manufacturing, iiot, automation

## Goal

One paragraph: what a learner can do after finishing.

## Must cover

- Topic 1
- Topic 2

## Outline (optional)

Leave this out to let the scaffolder propose the module/lesson structure.
```

Scaffolded courses always arrive as a PR with `isPublished: false` — a human reviews
the content, adds a Stripe price if paid, and flips it live. Once the course is merged,
delete the brief file (or leave it; the scaffolder skips briefs that already have a
course JSON).
