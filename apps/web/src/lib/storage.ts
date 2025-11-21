import os from "os";
import path from "path";

export function getStorageDir(): string {
  const home = os.homedir();

  // Use standard XDG-like paths or platform specific conventions
  if (process.platform === "win32") {
    return path.join(
      process.env.APPDATA || path.join(home, "AppData", "Roaming"),
      "dive",
      "storage",
    );
  } else if (process.platform === "darwin") {
    return path.join(home, "Library", "Application Support", "dive", "storage");
  } else {
    // Linux / other
    return path.join(home, ".local", "share", "dive", "storage");
  }
}

export const STORAGE_DIR = getStorageDir();
