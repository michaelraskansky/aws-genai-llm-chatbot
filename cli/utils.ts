import * as path from "path";
import * as fs from "fs";

export function resolveConfigFile(): string {
  // check if chatbot config env exists if it does use that
  if (process.env["CHATBOT_CONFIG"]) {
    return process.env["CHATBOT_CONFIG"];
  }
  
  // Find the actual project root by looking for package.json
  let currentDir = __dirname;
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, "package.json"))) {
      return path.join(currentDir, "bin/config.json");
    }
    currentDir = path.dirname(currentDir);
  }
  
  // Fallback to old behavior if package.json not found
  const projectRoot = path.resolve(__dirname, "..");
  return path.resolve(projectRoot, "bin/config.json");
}
