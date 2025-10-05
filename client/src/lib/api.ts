import { apiRequest } from "./queryClient";

export const api = {
  // Connection
  async testConnection() {
    const res = await apiRequest("GET", "/api/connection/test");
    return res.json();
  },

  // Settings
  async getSettings() {
    const res = await apiRequest("GET", "/api/settings");
    return res.json();
  },

  async saveSettings(settings: { serverUrl: string; apiKey: string }) {
    const res = await apiRequest("POST", "/api/settings", settings);
    return res.json();
  },

  // Job control
  async startJob() {
    const res = await apiRequest("POST", "/api/job/start");
    return res.json();
  },

  async pauseJob() {
    const res = await apiRequest("POST", "/api/job/pause");
    return res.json();
  },

  async resumeJob() {
    const res = await apiRequest("POST", "/api/job/resume");
    return res.json();
  },

  async cancelJob() {
    const res = await apiRequest("POST", "/api/job/cancel");
    return res.json();
  },

  // Files
  async getFiles(location: string = "local") {
    const res = await apiRequest("GET", `/api/files?location=${location}`);
    return res.json();
  },

  async selectFile(location: string, path: string, print: boolean = false) {
    const res = await apiRequest("POST", "/api/files/select", { location, path, print });
    return res.json();
  },

  async deleteFile(location: string, path: string) {
    const res = await apiRequest("DELETE", `/api/files/${location}/${path}`);
    return res.json();
  },

  // Temperature
  async setToolTemperature(temp: number, tool: number = 0) {
    const res = await apiRequest("POST", "/api/printer/tool/target", { temp, tool });
    return res.json();
  },

  async setBedTemperature(temp: number) {
    const res = await apiRequest("POST", "/api/printer/bed/target", { temp });
    return res.json();
  },

  // Movement
  async jog(axes: Record<string, number>) {
    const res = await apiRequest("POST", "/api/printer/jog", { axes });
    return res.json();
  },

  async home(axes: string[]) {
    const res = await apiRequest("POST", "/api/printer/home", { axes });
    return res.json();
  },

  // Extruder
  async extrude(amount: number) {
    const res = await apiRequest("POST", "/api/printer/extrude", { amount });
    return res.json();
  },

  // Commands
  async sendCommand(command: string) {
    const res = await apiRequest("POST", "/api/printer/command", { command });
    return res.json();
  },
};
