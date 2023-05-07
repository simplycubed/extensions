// Script to sync change log for firebase extension using lerna change log
import { readFileSync, writeFileSync } from "fs";

export async function sync(extensionPath: string) {
  // sync change log
  const lernaChangeLog = readFileSync(
    extensionPath + "/functions/CHANGELOG.md",
    "utf-8"
  );
  const changeRegex =
    /##? \[?(\d+\.\d+\.\d+)\]?.*\n((?:.|\n)*?\n)(?=##? \[?(\d+\.\d+\.\d+)\]?)/gm;
  let matches: any = null;
  let firestoreVersionLog = "";
  do {
    matches = changeRegex.exec(lernaChangeLog);
    if (matches) {
      const version = matches[1];
      const log = matches[2];
      firestoreVersionLog = `${firestoreVersionLog}## Version ${version}\n${log}`;
    }
  } while (matches);
  writeFileSync(
    extensionPath + "/CHANGELOG.md",
    firestoreVersionLog.trim() + "\n"
  );

  // sync extension version
  const packageJson = JSON.parse(
    readFileSync(extensionPath + "/functions/package.json", "utf-8")
  );
  const version = packageJson.version;
  const extensionYaml = readFileSync(
    extensionPath + "/extension.yaml",
    "utf-8"
  );
  const updatedExtensionYaml = extensionYaml.replace(
    /version: \d+\.\d+\.\d+/g,
    `version: ${version}`
  );
  writeFileSync(extensionPath + "/extension.yaml", updatedExtensionYaml);
}

var args = process.argv.slice(2);
sync(__dirname + "/../../../" + args[0]);
