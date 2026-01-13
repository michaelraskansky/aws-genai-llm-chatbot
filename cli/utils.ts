import * as path from "path";

export function resolveConfigFile(): string {
  // check if chatbot config env exists if it does use that
  if (process.env["CHATBOT_CONFIG"]) {
    return process.env["CHATBOT_CONFIG"];
  }
  // Use path.resolve to get absolute path
  const projectRoot = path.resolve(__dirname, "..");
  return path.resolve(projectRoot, "bin/config.json");
}
