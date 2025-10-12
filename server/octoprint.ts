import axios, { AxiosInstance } from "axios";
import FormData from "form-data";
import type {
  PrinterStatus,
  Job,
  JobProgress,
  FilesResponse,
} from "@shared/schema";

export class OctoPrintClient {
  private client: AxiosInstance;
  private serverUrl: string;

  constructor(serverUrl: string, apiKey: string) {
    this.serverUrl = serverUrl.replace(/\/$/, "");
    this.client = axios.create({
      baseURL: `${this.serverUrl}/api`,
      headers: {
        "X-Api-Key": apiKey,
      },
      timeout: 10000,
    });
  }

  async getPrinterStatus(): Promise<PrinterStatus> {
    const res = await this.client.get("/printer");

    return {
      state: res.data.state,
      temperature: res.data.temperature,
    };
  }

  async getJob(): Promise<{ job: Job; progress: JobProgress }> {
    const res = await this.client.get("/job");
    return {
      job: res.data.job,
      progress: res.data.progress,
    };
  }

  async getFiles(location: string = "local"): Promise<FilesResponse> {
    const res = await this.client.get(`/files/${location}`);
    return res.data;
  }

  async startJob() {
    await this.client.post("/job", { command: "start" });
  }

  async pauseJob() {
    await this.client.post("/job", { command: "pause", action: "pause" });
  }

  async resumeJob() {
    await this.client.post("/job", { command: "pause", action: "resume" });
  }

  async cancelJob() {
    await this.client.post("/job", { command: "cancel" });
  }

  async selectFile(location: string, path: string, print: boolean = false) {
    await this.client.post(`/files/${location}/${path}`, {
      command: "select",
      print,
    });
  }

  async deleteFile(location: string, path: string) {
    await this.client.delete(`/files/${location}/${path}`);
  }

  async setToolTemperature(temp: number, tool: number = 0) {
    await this.client.post("/printer/tool", {
      command: "target",
      targets: { [`tool${tool}`]: temp },
    });
  }

  async setBedTemperature(temp: number) {
    await this.client.post("/printer/bed", {
      command: "target",
      target: temp,
    });
  }

  async jog(axes: Record<string, number>) {
    await this.client.post("/printer/printhead", {
      command: "jog",
      ...axes,
    });
  }

  async home(axes: string[]) {
    await this.client.post("/printer/printhead", {
      command: "home",
      axes,
    });
  }

  async extrude(amount: number) {
    await this.client.post("/printer/tool", {
      command: "extrude",
      amount,
    });
  }

  async sendGcode(command: string) {
    await this.client.post("/printer/command", {
      command,
    });
  }

  async getVersion() {
    const res = await this.client.get("/version");
    return res.data;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getVersion();
      return true;
    } catch {
      return false;
    }
  }

  // File upload
  async uploadFile(fileBuffer: Buffer, filename: string, location: string = "local"): Promise<any> {
    const formData = new FormData();
    formData.append("file", fileBuffer, filename);
    
    const res = await this.client.post(`/files/${location}`, formData, {
      headers: formData.getHeaders(),
    });
    return res.data;
  }

  async downloadFile(location: string, path: string): Promise<string> {
    // Use the downloads endpoint instead of API endpoint to get raw file content
    const res = await axios.get(`${this.serverUrl}/downloads/files/${location}/${path}`, {
      responseType: 'text',
      headers: {
        "X-Api-Key": this.client.defaults.headers["X-Api-Key"],
      },
      timeout: 10000,
    });
    return res.data;
  }

  // System commands
  async shutdown() {
    await this.client.post("/system/commands/core/shutdown");
  }

  async reboot() {
    await this.client.post("/system/commands/core/reboot");
  }

  async restartOctoPrint() {
    await this.client.post("/system/commands/core/restart");
  }

  // Fan control
  async setFanSpeed(speed: number) {
    // Speed: 0-255
    const command = speed === 0 ? "M106 S0" : `M106 S${Math.round(speed)}`;
    await this.sendGcode(command);
  }

  // Speed and flow rate
  async setFeedrate(percentage: number) {
    await this.sendGcode(`M220 S${percentage}`);
  }

  async setFlowrate(percentage: number) {
    await this.sendGcode(`M221 S${percentage}`);
  }

  // Timelapse
  async getTimelapses() {
    const res = await this.client.get("/timelapse");
    return res.data;
  }

  async deleteTimelapse(filename: string) {
    await this.client.delete(`/timelapse/${filename}`);
  }

  async getTimelapseConfig() {
    const res = await this.client.get("/timelapse/config");
    return res.data;
  }

  async setTimelapseConfig(config: any) {
    const res = await this.client.post("/timelapse/config", config);
    return res.data;
  }

  // Get webcam settings
  async getSettings() {
    const res = await this.client.get("/settings");
    return res.data;
  }
}
