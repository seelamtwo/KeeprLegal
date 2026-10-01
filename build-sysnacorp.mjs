// Renders the Keepr legal pages into the SysnaCorpSolutions website (served at sysnacorpsolutions.com/keepr/).
// Usage: npm install && npm run build:site [-- path to SysnaCorpSolutions repo]
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const here = dirname(fileURLToPath(import.meta.url));
const site = process.argv[2] ?? join(here, "..", "SysnaCorpSolutions");
const out = join(site, "public", "keepr");

const css = `
  :root { --forest:#2f5d4a; --ink:#1f2622; --muted:#5d6762; --hair:#e4e0d6; --bg:#faf8f3; }
  * { box-sizing:border-box; }
  body { margin:0; background:var(--bg); color:var(--ink); font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; }
  header { border-bottom:1px solid var(--hair); background:#fff; }
  header .bar { max-width:860px; margin:0 auto; padding:14px 24px; display:flex; align-items:center; gap:12px; }
  header img { width:36px; height:36px; border-radius:9px; }
  header a.brand { font-weight:700; font-size:18px; color:var(--ink); text-decoration:none; }
  header nav { margin-left:auto; display:flex; gap:18px; font-size:14px; }
  main { max-width:860px; margin:0 auto; padding:32px 24px 64px; }
  a { color:var(--forest); }
  h1 { font-size:32px; line-height:1.2; margin:0 0 12px; }
  h2 { margin-top:36px; font-size:22px; }
  h3 { margin-top:24px; font-size:17px; }
  table { border-collapse:collapse; width:100%; font-size:14px; margin:16px 0; }
  th, td { border:1px solid var(--hair); padding:8px 10px; text-align:left; vertical-align:top; }
  th { background:#f1ede4; }
  footer { border-top:1px solid var(--hair); color:var(--muted); font-size:13px; }
  footer .bar { max-width:860px; margin:0 auto; padding:18px 24px; }
  .lead { font-size:19px; color:var(--muted); }
  .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:14px; margin:24px 0; }
  .features div { background:#fff; border:1px solid var(--hair); border-radius:14px; padding:16px; }
  .features b { display:block; margin-bottom:4px; }
`;

function page(title, body, description) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="icon" href="/keepr/icon.png" />
<style>${css}</style>
</head>
<body>
<header><div class="bar">
  <img src="/keepr/icon.png" alt="" /><a class="brand" href="/keepr/">Keepr</a>
  <nav><a href="/keepr/privacy-policy/">Privacy Policy</a><a href="/keepr/terms-of-use/">Terms of Use</a><a href="mailto:support@sysnacorpsolutions.com">Support</a></nav>
</div></header>
<main>
${body}
</main>
<footer><div class="bar">© ${new Date().getFullYear()} Sysna Corp Solutions · Texas, USA · <a href="mailto:support@sysnacorpsolutions.com">support@sysnacorpsolutions.com</a></div></footer>
</body>
</html>
`;
}

function renderDoc(file, slug, description) {
  const src = readFileSync(join(here, file), "utf8");
  const title = (src.match(/^title:\s*(.+)$/m) ?? [, "Keepr"])[1].trim();
  const md = src.replace(/^---[\s\S]*?---\s*/, "");
  mkdirSync(join(out, slug), { recursive: true });
  writeFileSync(join(out, slug, "index.html"), page(title, marked.parse(md), description));
}

const home = `
<h1>Keepr — save what you scroll, keep what matters</h1>
<p class="lead">Keepr is an iPhone app that turns the posts, videos, links, and screenshots you share into organized, searchable notes.</p>
<p>Share a post from Instagram, TikTok, YouTube, Facebook, a website, or your messages to Keepr. It reads the caption, transcript, and any text in your screenshots, then uses AI to pull out what's useful and file it in the right place — so you can actually find it again.</p>
<div class="features">
  <div><b>Recipes</b>Ingredients and step-by-step instructions.</div>
  <div><b>Workouts &amp; yoga</b>Exercises, sets, reps, and routines.</div>
  <div><b>Stocks</b>Tickers and ideas from finance posts, for your reference.</div>
  <div><b>Courses &amp; lessons</b>Key points and outlines.</div>
  <div><b>Travel</b>Places, tips, and itineraries.</div>
  <div><b>Contacts &amp; shows</b>Businesses, people, and what to watch next.</div>
</div>
<h2>Your account</h2>
<p>Sign in with Apple, Google, or email so your saved posts are backed up and restored on a new phone. Keepr only processes what you choose to share to it — it has no access to your social-media accounts. We don't sell your data or show ads. You can export your notes or delete your account at any time in the app.</p>
<p>Keepr includes a free trial; continued use requires a subscription purchased through the App Store.</p>
<h2>Legal &amp; support</h2>
<ul>
  <li><a href="/keepr/privacy-policy/">Privacy Policy</a></li>
  <li><a href="/keepr/terms-of-use/">Terms of Use</a></li>
  <li>Support: <a href="mailto:support@sysnacorpsolutions.com">support@sysnacorpsolutions.com</a></li>
</ul>
<p>Keepr is developed by Sysna Corp Solutions. Keepr is not affiliated with Instagram, Meta, TikTok, YouTube, or Google.</p>
`;

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "index.html"), page("Keepr — save what you scroll", home, "Keepr turns the posts, videos, links, and screenshots you share into organized notes."));
renderDoc("privacy-policy.md", "privacy-policy", "How Keepr collects, uses, and protects your information.");
renderDoc("terms-of-use.md", "terms-of-use", "Terms of Use for the Keepr app.");
console.log("wrote", out);
