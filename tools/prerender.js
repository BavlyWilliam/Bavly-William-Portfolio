#!/usr/bin/env node
/*
  Pre-renders the portfolio, so visitors without JavaScript, search engines and
  link previews (LinkedIn, WhatsApp, Slack) see the real content instead of
  empty sections.

      node tools/prerender.js

  Run it after every change to assets/js/data.js, then commit what it changed:
    index.html       Work, Videos, Creative, Experience and contact links filled in
    case-<id>.html   one static page per project with a caseStudy, with its own
                     title, description and link-preview tags
    case.html        only its list of static case pages is updated

  It runs the real assets/js/render.js against a small stand-in for the browser's
  DOM, so the static HTML is exactly what the browser draws. In the browser,
  render.js clears this HTML and draws again from data.js, so forgetting to run
  this only affects visitors without JavaScript.

  No dependencies. Needs Node 18 or newer.
*/
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://bavlywilliam.github.io/Bavly-William-Portfolio/";

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");

/* ------------------------------------------------------------------
   A minimal DOM: only what render.js uses.
   ------------------------------------------------------------------ */
const VOID_TAGS = new Set(["img", "br", "hr", "input", "meta", "link", "source"]);
const escText = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escText(s).replace(/"/g, "&quot;");

class TextNode {
  constructor(text) { this.text = String(text); this.parentNode = null; }
  get textContent() { return this.text; }
  get outerHTML() { return escText(this.text); }
}

class FakeElement {
  constructor(tag) {
    this.tagName = tag.toLowerCase();
    this.attrs = new Map();
    this.childNodes = [];
    this.parentNode = null;
    this.hiddenWasSet = false; // so we know which sections render.js showed or hid
    const self = this;
    this.classList = {
      add(c) { const set = new Set(self.className.split(/\s+/).filter(Boolean)); set.add(c); self.className = [...set].join(" "); },
      remove(c) { self.className = self.className.split(/\s+/).filter((x) => x && x !== c).join(" "); }
    };
  }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.has(name) ? this.attrs.get(name) : null; }
  removeAttribute(name) { this.attrs.delete(name); }
  get className() { return this.getAttribute("class") || ""; }
  set className(value) { this.setAttribute("class", value); }
  get hidden() { return this.attrs.has("hidden"); }
  set hidden(value) {
    this.hiddenWasSet = true;
    if (value) this.setAttribute("hidden", ""); else this.removeAttribute("hidden");
  }
  get parentElement() { return this.parentNode; }
  get offsetWidth() { return 0; }
  appendChild(node) { node.parentNode = this; this.childNodes.push(node); return node; }
  replaceChild(node, old) {
    const i = this.childNodes.indexOf(old);
    if (i !== -1) { this.childNodes[i] = node; node.parentNode = this; }
    return old;
  }
  get textContent() { return this.childNodes.map((c) => c.textContent).join(""); }
  set textContent(value) {
    this.childNodes = [];
    if (value !== "" && value !== null && value !== undefined) this.appendChild(new TextNode(value));
  }
  addEventListener() {}
  closest() { return null; }
  get innerHTML() { return this.childNodes.map((c) => c.outerHTML).join("\n"); }
  get outerHTML() {
    let attrs = "";
    for (const [name, value] of this.attrs) attrs += value === "" ? ` ${name}` : ` ${name}="${escAttr(value)}"`;
    if (VOID_TAGS.has(this.tagName)) return `<${this.tagName}${attrs}>`;
    return `<${this.tagName}${attrs}>${this.innerHTML}</${this.tagName}>`;
  }
}

// Runs data.js + render.js and returns the elements render.js looked up and filled.
function runRender(bodyAttrs, search) {
  const slots = new Map(); // selector -> FakeElement
  const slot = (selector) => {
    if (!slots.has(selector)) slots.set(selector, new FakeElement("div"));
    return slots.get(selector);
  };
  const body = new FakeElement("body");
  Object.entries(bodyAttrs).forEach(([k, v]) => body.setAttribute(k, v));

  const document = {
    title: "",
    body,
    createElement: (tag) => new FakeElement(tag),
    createTextNode: (text) => new TextNode(text),
    querySelector: (selector) => slot(selector),
    // The text bindings (data-bind, mailto, WhatsApp, links) are written by this script itself.
    querySelectorAll: () => []
  };
  const context = {
    document,
    URLSearchParams,
    console,
    location: { search: search || "" },
    // Report "reduced motion", so the hero animation code doesn't run here.
    matchMedia: () => ({ matches: true })
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(read("assets/js/data.js"), context, { filename: "data.js" });
  vm.runInContext(read("assets/js/render.js"), context, { filename: "render.js" });
  return { slots, data: context.PORTFOLIO, title: document.title };
}

/* ------------------------------------------------------------------
   Small HTML editing helpers (the templates are our own, so these stay simple).
   ------------------------------------------------------------------ */
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// "#videos" -> id="videos", '[data-list="x"]' -> data-list="x", "[data-brand]" -> data-brand
function selectorToAttr(selector) {
  let m = /^#([\w-]+)$/.exec(selector);
  if (m) return `id="${m[1]}"`;
  m = /^\[([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
  if (m) return m[2] === undefined ? m[1] : `${m[1]}="${m[2]}"`;
  return null; // not a selector we can map (e.g. ".replay"); ignored
}

function openTagRegex(attr, flags) {
  return new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*?\\s${reEsc(attr)}(?=[\\s>/=])[^>]*>`, flags || "i");
}

function replaceInner(html, selector, inner) {
  const attr = selectorToAttr(selector);
  const open = attr && openTagRegex(attr).exec(html);
  if (!open) return html;
  const tag = open[1];
  const start = open.index + open[0].length;
  const scan = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
  scan.lastIndex = start;
  let depth = 1;
  let m;
  while ((m = scan.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(0, start) + inner + html.slice(m.index);
  }
  throw new Error(`No closing </${tag}> for ${selector}`);
}

function setHidden(html, selector, hidden) {
  const attr = selectorToAttr(selector);
  if (!attr) return html;
  return html.replace(openTagRegex(attr), (tag) => {
    const without = tag.replace(/\s+hidden(?:="[^"]*")?(?=[\s>/])/, "");
    return hidden ? without.replace(/\s*>$/, " hidden>") : without;
  });
}

// Sets an attribute on every opening tag that carries `marker` (an attribute name or name="value").
function setAttrEverywhere(html, marker, name, value) {
  return html.replace(openTagRegex(marker, "gi"), (tag) => {
    const re = new RegExp(`(\\s${reEsc(name)}=")[^"]*(")`);
    return re.test(tag) ? tag.replace(re, `$1${escAttr(value)}$2`) : tag.replace(/\s*>$/, ` ${name}="${escAttr(value)}">`);
  });
}

function setMetaContent(html, marker, value) {
  // marker: 'name="description"' or 'property="og:title"'
  return html.replace(new RegExp(`(<meta\\s+${reEsc(marker)}\\s+content=")[^"]*(")`), `$1${escAttr(value)}$2`);
}

function setLinkHref(html, rel, value) {
  return html.replace(new RegExp(`(<link\\s+rel="${reEsc(rel)}"\\s+href=")[^"]*(")`), `$1${escAttr(value)}$2`);
}

function setBodyAttrs(html, attrs) {
  return html.replace(/<body\b[^>]*>/, (tag) => {
    let out = tag;
    for (const [name, value] of Object.entries(attrs)) {
      const re = new RegExp(`\\s${reEsc(name)}="[^"]*"`);
      out = re.test(out) ? out.replace(re, ` ${name}="${escAttr(value)}"`) : out.replace(/>$/, ` ${name}="${escAttr(value)}">`);
    }
    return out;
  });
}

// Fill the text and link bindings from data.js, the same way render.js does in the browser.
function applyBindings(html, data) {
  const person = data.person || {};
  const links = data.links || {};
  const values = { availability: person.availability, email: person.email, updated: data.updated };
  for (const [key, value] of Object.entries(values)) {
    // data-bind elements hold plain text only, e.g. <span data-bind="updated">November 2026</span>
    if (!value) continue;
    const re = new RegExp(`(<([a-z][a-z0-9]*)\\b[^>]*\\sdata-bind="${reEsc(key)}"[^>]*>)[^<]*(</\\2>)`, "gi");
    html = html.replace(re, (all, open, tag, close) => open + escText(value) + close);
  }
  if (person.email) html = setAttrEverywhere(html, "data-bind-mailto", "href", "mailto:" + person.email);
  const wa = String(person.whatsapp || "").replace(/\D/g, "");
  if (wa) html = setAttrEverywhere(html, "data-bind-whatsapp", "href", "https://wa.me/" + wa);
  for (const [key, value] of Object.entries(links)) {
    if (value) html = setAttrEverywhere(html, `data-bind-href="${key}"`, "href", value);
  }
  return html;
}

// Put everything render.js drew back into the HTML template.
function applySlots(html, slots) {
  for (const [selector, node] of slots) {
    if (node.childNodes.length) html = replaceInner(html, selector, node.innerHTML);
    if (node.hiddenWasSet) html = setHidden(html, selector, node.hidden);
  }
  return html;
}

// Writes only real changes. Line endings are ignored when comparing, because a
// Windows checkout has CRLF on disk while git stores LF, and the file is written
// with the line endings it already had.
function writeIfChanged(file, content) {
  const full = path.join(ROOT, file);
  const lf = (s) => s.replace(/\r\n/g, "\n");
  const before = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : null;
  if (before !== null && lf(before) === lf(content)) return false;
  const crlf = before !== null ? before.includes("\r\n") : content.includes("\r\n");
  fs.writeFileSync(full, crlf ? lf(content).replace(/\n/g, "\r\n") : lf(content));
  return true;
}

/* ------------------------------------------------------------------
   Build
   ------------------------------------------------------------------ */
function main() {
  const probe = runRender({ "data-page": "home" });
  const data = probe.data;
  const cases = (data.projects || []).filter((p) => !p.draft && p.caseStudy);
  const staticList = cases.map((p) => p.id).join(" ");
  const changed = [];

  // Home page
  const home = runRender({ "data-page": "home", "data-static-cases": staticList });
  let index = read("index.html");
  index = setBodyAttrs(index, { "data-static-cases": staticList });
  index = applySlots(index, home.slots);
  index = applyBindings(index, data);
  if (writeIfChanged("index.html", index)) changed.push("index.html");

  // The dynamic case page (old case.html?p=<id> links): only bindings and the static list.
  const caseTemplate = read("case.html");
  let dynamicCase = setBodyAttrs(caseTemplate, { "data-static-cases": staticList });
  dynamicCase = applyBindings(dynamicCase, data);
  if (writeIfChanged("case.html", dynamicCase)) changed.push("case.html");

  // One static page per case study
  for (const p of cases) {
    const file = `case-${p.id}.html`;
    const run = runRender({ "data-page": "case", "data-case-id": p.id, "data-static-cases": staticList });
    const title = `${p.title} | Bavly William`;
    const description = p.summary || "";
    let page = setBodyAttrs(caseTemplate, { "data-static-cases": staticList, "data-case-id": p.id });
    page = page.replace(/<title>[^<]*<\/title>/, `<title>${escText(title)}</title>`);
    page = setMetaContent(page, 'name="description"', description);
    page = setMetaContent(page, 'property="og:title"', title);
    page = setMetaContent(page, 'property="og:description"', description);
    page = setMetaContent(page, 'property="og:url"', SITE + file);
    page = setLinkHref(page, "canonical", SITE + file);
    page = page.replace(/\s*<noscript>[\s\S]*?<\/noscript>/, "");
    page = applySlots(page, run.slots);
    page = applyBindings(page, data);
    if (writeIfChanged(file, page)) changed.push(file);
  }

  // Static case pages whose project no longer has a case study
  const wanted = new Set(cases.map((p) => `case-${p.id}.html`));
  const stale = fs.readdirSync(ROOT).filter((f) => /^case-.+\.html$/.test(f) && !wanted.has(f));

  console.log(changed.length ? "Updated: " + changed.join(", ") : "Everything was already up to date.");
  if (stale.length) console.log("No longer used (delete them): " + stale.join(", "));
}

main();
