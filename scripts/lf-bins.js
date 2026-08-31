// npm bin scripts must use Unix LF (especially the shebang), even when
// publishing from Windows. Otherwise Unix installs get:
//   /usr/bin/env: 'node\r': No such file or directory
const { readFileSync, writeFileSync, existsSync } = require("node:fs");
const { join } = require("node:path");

const files = ["dist/index.js", "dist/ay.js"];
for (const file of files) {
  const path = join(__dirname, "..", file);
  if (!existsSync(path)) {
    console.error(`lf-bins: missing ${file}`);
    process.exit(1);
  }
  let source = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  if (!source.startsWith("#!/usr/bin/env node\n")) {
    source = source.replace(/^#!\/usr\/bin\/env node\r?\n/, "");
    source = "#!/usr/bin/env node\n" + source;
  }
  writeFileSync(path, source);
}
