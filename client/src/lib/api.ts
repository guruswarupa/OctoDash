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

  // File upload (uses fetch directly to support FormData)
  async uploadFile(file: File, location: string = "local") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("location", location);
    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    return res.json();
  },

  // System commands
  async shutdown() {
    const res = await apiRequest("POST", "/api/system/shutdown");
    return res.json();
  },

  async reboot() {
    const res = await apiRequest("POST", "/api/system/reboot");
    return res.json();
  },

  async restartOctoPrint() {
    const res = await apiRequest("POST", "/api/system/restart");
    return res.json();
  },

  // Fan control
  async setFanSpeed(speed: number) {
    const res = await apiRequest("POST", "/api/printer/fan", { speed });
    return res.json();
  },

  // Speed and flow control
  async setFeedrate(percentage: number) {
    const res = await apiRequest("POST", "/api/printer/feedrate", { percentage });
    return res.json();
  },

  async setFlowrate(percentage: number) {
    const res = await apiRequest("POST", "/api/printer/flowrate", { percentage });
    return res.json();
  },

  // Timelapse
  async getTimelapses() {
    const res = await apiRequest("GET", "/api/timelapse");
    return res.json();
  },

  async deleteTimelapse(filename: string) {
    const res = await apiRequest("DELETE", `/api/timelapse/${filename}`);
    return res.json();
  },

  async getTimelapseConfig() {
    const res = await apiRequest("GET", "/api/timelapse/config");
    return res.json();
  },

  async setTimelapseConfig(config: any) {
    const res = await apiRequest("POST", "/api/timelapse/config", config);
    return res.json();
  },

  // Webcam
  async getWebcamUrl() {
    const res = await apiRequest("GET", "/api/webcam/url");
    return res.json();
  },
};
