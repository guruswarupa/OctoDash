import type { ConnectionSettings } from "@shared/schema";

export interface IStorage {
  getConnectionSettings(): Promise<ConnectionSettings | undefined>;
  saveConnectionSettings(settings: ConnectionSettings): Promise<void>;
}

export class MemStorage implements IStorage {
  private settings: ConnectionSettings | undefined;

  constructor() {
    this.settings = {
      serverUrl: process.env.OCTOPRINT_URL || "http://localhost:5000",
      apiKey: process.env.OCTOPRINT_API_KEY || "",
    };
  }

  async getConnectionSettings(): Promise<ConnectionSettings | undefined> {
    return this.settings;
  }

  async saveConnectionSettings(settings: ConnectionSettings): Promise<void> {
    this.settings = settings;
  }
}

export const storage = new MemStorage();
