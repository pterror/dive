import os from "os";
import path from "path";

export function getStorageDir(): string {
  const home = os.homedir();

  // Use standard XDG-like paths or platform specific conventions
  switch (process.platform) {
    case "win32": {
      return path.join(
        process.env["APPDATA"] || path.join(home, "AppData", "Roaming"),
        "dive",
        "storage",
      );
    }
    case "darwin": {
      return path.join(home, "Library", "Application Support", "dive", "storage");
    }
    default: {
      // Linux / other
      const xdgDataHome = process.env["XDG_DATA_HOME"];
      const baseDir = xdgDataHome || path.join(home, ".local", "share");
      return path.join(baseDir, "dive", "storage");
    }
  }
}

export const STORAGE_DIR = getStorageDir();
