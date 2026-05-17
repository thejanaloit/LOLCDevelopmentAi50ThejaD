import fs from 'fs';
import path from 'path';
import { PACKAGE_ROOT, resolveRepoRoot } from './paths.mjs';

const VENDOR_SKILL_GLOBS = [
  { repo: 'graphify', files: ['graphify/skill.md', 'graphify/skill-vscode.md'] },
  { repo: 'superpowers', dir: 'skills' },
  { repo: 'claude-mem', dir: 'plugin/skills' },
  { repo: 'superpowers-developing-for-claude-code', dir: 'skills' },
];

function copySkill(src, destDir, prefix) {
  const base = path.basename(path.dirname(src)) || path.basename(src, path.extname(src));
  const name = `${prefix}-${base}`.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  const target = path.join(destDir, name);
  fs.mkdirSync(target, { recursive: true });
  let body = fs.readFileSync(src, 'utf8');
  if (!body.includes('name:')) {
    body = `---\nname: ${name}\ndescription: Imported for LOLC ThejaD (${prefix})\n---\n\n${body}`;
  }
  const lolc = `\n\n## LOLC Internet Banking\n- Repo: ${resolveRepoRoot()}\n- Phase 1 scope per AGENTS.md\n- Use coordination_claim before multi-agent edits\n`;
  fs.writeFileSync(path.join(target, 'SKILL.md'), body + lolc, 'utf8');
  return name;
}

function walkSkills(dir, out) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkSkills(full, out);
    else if (e.name.toUpperCase() === 'SKILL.MD' || e.name === 'skill.md') out.push(full);
  }
}

export function syncVendorSkills() {
  const imported = path.join(PACKAGE_ROOT, 'skills', 'imported');
  fs.mkdirSync(imported, { recursive: true });
  const synced = [];

  for (const spec of VENDOR_SKILL_GLOBS) {
    const root = path.join(PACKAGE_ROOT, 'vendor', spec.repo);
    if (!fs.existsSync(root)) continue;
    if (spec.files) {
      for (const rel of spec.files) {
        const src = path.join(root, rel);
        if (fs.existsSync(src)) synced.push(copySkill(src, imported, spec.repo));
      }
    }
    if (spec.dir) {
      const files = [];
      walkSkills(path.join(root, spec.dir), files);
      for (const src of files) synced.push(copySkill(src, imported, spec.repo));
    }
  }

  const manifestPath = path.join(PACKAGE_ROOT, 'data', 'imported-skills.json');
  fs.writeFileSync(manifestPath, JSON.stringify({ synced, count: synced.length, at: new Date().toISOString() }, null, 2));
  return { importedDir: imported, synced, count: synced.length };
}

export function listImportedSkillNames() {
  const manifest = path.join(PACKAGE_ROOT, 'data', 'imported-skills.json');
  if (!fs.existsSync(manifest)) return [];
  return JSON.parse(fs.readFileSync(manifest, 'utf8')).synced || [];
}
