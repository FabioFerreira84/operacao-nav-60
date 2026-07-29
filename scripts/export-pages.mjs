import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(projectRoot, "dist", "client");
const outputDir = path.join(projectRoot, "pages-dist");
const siteBase = "/operacao-nav-60";

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp(clientDir, outputDir, { recursive: true });

const workerUrl = pathToFileURL(path.join(projectRoot, "dist", "server", "index.js"));
workerUrl.searchParams.set("static-export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/"),
  {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  },
  {
    waitUntil() {},
    passThroughOnException() {},
  },
);

if (!response.ok) {
  throw new Error(`Static render failed with HTTP ${response.status}.`);
}

let html = await response.text();
html = html
  .replaceAll('"/assets/', `"${siteBase}/assets/`)
  .replaceAll('"/favicon.svg', `"${siteBase}/favicon.svg`)
  .replace(
    /url\([^)]*?\.vinext\/fonts\/[^/]+\/([^/)]+\.woff2)\)/g,
    `url(${siteBase}/assets/_vinext_fonts/$1)`,
  );

await writeFile(path.join(outputDir, "index.html"), html, "utf8");
await writeFile(path.join(outputDir, "404.html"), html, "utf8");
await writeFile(path.join(outputDir, ".nojekyll"), "", "utf8");

const assetsDir = path.join(outputDir, "assets");
for (const entry of await readdir(assetsDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
  const filePath = path.join(assetsDir, entry.name);
  const source = await readFile(filePath, "utf8");
  const patched = source.replaceAll("return`/`+e", `return\`${siteBase}/\`+e`);
  await writeFile(filePath, patched, "utf8");
}

const exportedHtml = await readFile(path.join(outputDir, "index.html"), "utf8");
if (
  !exportedHtml.includes(`${siteBase}/assets/`) ||
  exportedHtml.includes(`${projectRoot.replaceAll("\\", "/")}/.vinext/fonts`)
) {
  throw new Error("Static export contains unresolved asset or local font paths.");
}

console.log(`GitHub Pages export ready at ${outputDir}`);
