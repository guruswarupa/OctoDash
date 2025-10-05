import axios, { AxiosInstance } from "axios";
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
    const [stateRes, tempRes] = await Promise.all([
      this.client.get("/printer"),
      this.client.get("/printer/printhead"),
    ]);

    return {
      state: stateRes.data.state,
      temperature: stateRes.data.temperature,
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
}
