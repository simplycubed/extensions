// Script to sync change log for firebase extension using lerna change log
import { readFileSync, writeFileSync } from "fs";

export async function syncFbChangeLog(extensionPath: string) {
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
      firestoreVersionLog = `${firestoreVersionLog}## Version ${version}\n${log}\n`;
    }
  } while (matches);
  writeFileSync(extensionPath + "/CHANGELOG.md", firestoreVersionLog);
}

syncFbChangeLog("./firestore-webflow-sync");
syncFbChangeLog("./rtdb-webflow-sync");
syncFbChangeLog("./storage-webflow-sync");
