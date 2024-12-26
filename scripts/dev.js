import minimist from "minimist";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import path from "path";
import fs from "fs";
import esbuild from "esbuild";

const { _: packages = [], f: format = "iife" } = minimist(
  process.argv.slice(2)
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pkg = packages[0];
const entry = path.resolve(__dirname, `../packages/${pkg}/src/index.ts`);
const pkgJson = path.resolve(__dirname, `../packages/${pkg}/package.json`);
const pkgJsonContent = JSON.parse(fs.readFileSync(pkgJson, "utf-8"));
const globalName = pkgJsonContent.buildOptions.name;

esbuild
  .context({
    entryPoints: [entry],
    outfile: path.resolve(
      __dirname,
      `../packages/${pkg}/dist/${pkg}.${format}.js`
    ),
    format,
    bundle: true,
    minify: true,
    platform: "browser",
    sourcemap: true,
    ...(globalName ? { globalName } : {}),
  })
  .then((ctx) => {
    ctx.watch();
  });
