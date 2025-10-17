import type { ConnectionSettings } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

export interface IStorage {
  getConnectionSettings(): Promise<ConnectionSettings | undefined>;
  saveConnectionSettings(settings: ConnectionSettings): Promise<void>;
}

export class FileStorage implements IStorage {
  private settingsPath: string;
  private settings: ConnectionSettings | undefined;

  constructor() {
    this.settingsPath = path.join(process.cwd(), "octoprint-settings.json");
  }

  async getConnectionSettings(): Promise<ConnectionSettings | undefined> {
    if (this.settings) {
      return this.settings;
    }

    try {
      const data = await fs.readFile(this.settingsPath, "utf-8");
      this.settings = JSON.parse(data);
      return this.settings;
    } catch (error) {
      // File doesn't exist or is invalid, use environment variables as default
      this.settings = {
        serverUrl: process.env.OCTOPRINT_URL || "http://localhost:8080",
        apiKey: process.env.OCTOPRINT_API_KEY || "",
      };
      return this.settings;
    }
  }

  async saveConnectionSettings(settings: ConnectionSettings): Promise<void> {
    this.settings = settings;
    await fs.writeFile(this.settingsPath, JSON.stringify(settings, null, 2), "utf-8");
  }
}

export const storage = new FileStorage();
