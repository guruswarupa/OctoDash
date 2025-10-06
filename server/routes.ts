import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { OctoPrintClient } from "./octoprint";
import { z } from "zod";
import multer from "multer";
import fs from "fs";

// Use memory storage to avoid filesystem dependencies
const upload = multer({ storage: multer.memoryStorage() });

let octoprintClient: OctoPrintClient | null = null;

function getClient(): OctoPrintClient {
  if (!octoprintClient) {
    throw new Error("OctoPrint client not initialized. Configure connection settings first.");
  }
  return octoprintClient;
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // Initialize OctoPrint client from settings
  const settings = await storage.getConnectionSettings();
  if (settings && settings.apiKey) {
    try {
      octoprintClient = new OctoPrintClient(settings.serverUrl, settings.apiKey);
      console.log(`OctoPrint client initialized for ${settings.serverUrl}`);
    } catch (error) {
      console.error("Failed to initialize OctoPrint client:", error);
    }
  }

  // WebSocket connection for real-time updates
  wss.on("connection", (ws: WebSocket) => {
    console.log("WebSocket client connected");
    
    let updateInterval: NodeJS.Timeout | null = null;

    const sendUpdate = async () => {
      if (!octoprintClient) return;
      
      try {
        const [status, job] = await Promise.all([
          octoprintClient.getPrinterStatus(),
          octoprintClient.getJob(),
        ]);
        
        ws.send(JSON.stringify({
          type: "update",
          data: { status, job },
        }));
      } catch (error) {
        console.error("Error fetching printer data:", error);
      }
    };

    // Send updates every 2 seconds
    updateInterval = setInterval(sendUpdate, 2000);
    sendUpdate(); // Send initial update

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      if (updateInterval) clearInterval(updateInterval);
    });
  });

  // Connection settings
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getConnectionSettings();
    res.json(settings || {});
  });

  app.post("/api/settings", async (req, res) => {
    try {
      const settings = req.body;
      await storage.saveConnectionSettings(settings);
      
      // Reinitialize client
      octoprintClient = new OctoPrintClient(settings.serverUrl, settings.apiKey);
      const connected = await octoprintClient.testConnection();
      
      res.json({ success: true, connected });
    } catch (error) {
      res.status(400).json({ error: "Failed to save settings" });
    }
  });

  // Test connection
  app.get("/api/connection/test", async (req, res) => {
    try {
      const client = getClient();
      const connected = await client.testConnection();
      res.json({ connected });
    } catch (error) {
      res.json({ connected: false });
    }
  });

  // Printer status
  app.get("/api/printer/status", async (req, res) => {
    try {
      const client = getClient();
      const status = await client.getPrinterStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Job information
  app.get("/api/job", async (req, res) => {
    try {
      const client = getClient();
      const job = await client.getJob();
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Job control
  app.post("/api/job/start", async (req, res) => {
    try {
      const client = getClient();
      await client.startJob();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/job/pause", async (req, res) => {
    try {
      const client = getClient();
      await client.pauseJob();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/job/resume", async (req, res) => {
    try {
      const client = getClient();
      await client.resumeJob();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/job/cancel", async (req, res) => {
    try {
      const client = getClient();
      await client.cancelJob();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Files
  app.get("/api/files", async (req, res) => {
    try {
      const client = getClient();
      const location = (req.query.location as string) || "local";
      const files = await client.getFiles(location);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/files/select", async (req, res) => {
    try {
      const client = getClient();
      const { location, path, print } = req.body;
      await client.selectFile(location, path, print);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/files/:location/:path(*)", async (req, res) => {
    try {
      const client = getClient();
      const { location, path } = req.params;
      await client.deleteFile(location, path);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Temperature control
  app.post("/api/printer/tool/target", async (req, res) => {
    try {
      const client = getClient();
      const { temp, tool } = req.body;
      await client.setToolTemperature(temp, tool || 0);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/printer/bed/target", async (req, res) => {
    try {
      const client = getClient();
      const { temp } = req.body;
      await client.setBedTemperature(temp);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Movement
  app.post("/api/printer/jog", async (req, res) => {
    try {
      const client = getClient();
      const { axes } = req.body;
      await client.jog(axes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/printer/home", async (req, res) => {
    try {
      const client = getClient();
      const { axes } = req.body;
      await client.home(axes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Extruder
  app.post("/api/printer/extrude", async (req, res) => {
    try {
      const client = getClient();
      const { amount } = req.body;
      await client.extrude(amount);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // G-code commands
  app.post("/api/printer/command", async (req, res) => {
    try {
      const client = getClient();
      const { command } = req.body;
      await client.sendGcode(command);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // File upload
  app.post("/api/files/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    
    try {
      const client = getClient();
      // With memoryStorage, file buffer is already in memory
      await client.uploadFile(req.file.buffer, req.file.originalname, req.body.location || "local");
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // System commands
  app.post("/api/system/shutdown", async (req, res) => {
    try {
      const client = getClient();
      await client.shutdown();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/system/reboot", async (req, res) => {
    try {
      const client = getClient();
      await client.reboot();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/system/restart", async (req, res) => {
    try {
      const client = getClient();
      await client.restartOctoPrint();
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Fan control
  app.post("/api/printer/fan", async (req, res) => {
    try {
      const client = getClient();
      const { speed } = req.body;
      await client.setFanSpeed(speed);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Speed and flow control
  app.post("/api/printer/feedrate", async (req, res) => {
    try {
      const client = getClient();
      const { percentage } = req.body;
      await client.setFeedrate(percentage);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/printer/flowrate", async (req, res) => {
    try {
      const client = getClient();
      const { percentage } = req.body;
      await client.setFlowrate(percentage);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Timelapse
  app.get("/api/timelapse", async (req, res) => {
    try {
      const client = getClient();
      const timelapses = await client.getTimelapses();
      res.json(timelapses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/timelapse/:filename", async (req, res) => {
    try {
      const client = getClient();
      const { filename } = req.params;
      await client.deleteTimelapse(filename);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/timelapse/config", async (req, res) => {
    try {
      const client = getClient();
      const config = await client.getTimelapseConfig();
      res.json(config);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/timelapse/config", async (req, res) => {
    try {
      const client = getClient();
      const config = req.body;
      const result = await client.setTimelapseConfig(config);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Webcam
  app.get("/api/webcam/url", async (req, res) => {
    try {
      const client = getClient();
      const settings = await client.getSettings();
      res.json({
        streamUrl: settings.webcam?.streamUrl || "",
        snapshotUrl: settings.webcam?.snapshotUrl || "",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
