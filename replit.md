# OctoPrint Control Interface

## Project Overview

A web-based control interface for OctoPrint 3D printer management, designed specifically for Raspberry Pi deployment with auto-start on boot in kiosk mode.

## Purpose

This application provides a touch-optimized control interface for OctoPrint that:
- Auto-launches on Raspberry Pi boot in full-screen kiosk mode
- Provides real-time monitoring of printer status via WebSocket
- Offers complete printer control (movement, temperature, job management)
- Works offline after initial load for workshop environments

## Architecture

### Stack
- **Frontend**: React + TypeScript with Tailwind CSS and shadcn/ui components
- **Backend**: Express.js server acting as OctoPrint API proxy
- **Real-time**: WebSocket for live printer data updates
- **State**: TanStack Query for server state management

### Key Components

**Backend (`server/`):**
- `octoprint.ts` - OctoPrint API client with all printer control methods
- `routes.ts` - Express API routes and WebSocket server
- `storage.ts` - In-memory storage for connection settings

**Frontend (`client/src/`):**
- `hooks/useWebSocket.ts` - WebSocket hook for real-time updates
- `lib/api.ts` - API client for backend communication
- `pages/` - Main application pages (Dashboard, Control, Temperature, Files, Camera, Timelapse, Terminal, Settings)
- `components/HorizontalNav.tsx` - Android-style horizontal scrollable navigation with tab indicators
- `components/` - Reusable UI components

**Design:**
- **Navigation**: Horizontal scrollable tabs (Android-style) with active indicators and icons
- **Dark mode optimized**: Primary interface mode with clean visual hierarchy
- **Touch-first design**: 44px+ touch targets, optimized spacing for mobile and tablet
- **Responsive layout**: Mobile-first approach with breakpoints (md:, lg:)
- **Typography**: Consistent heading sizes and text hierarchy across all pages
- **Minimal animations**: Optimized for Raspberry Pi performance

## Configuration

The application connects to OctoPrint using:
1. Environment variables (`.env` file)
2. Settings page in the application

Required settings:
- `OCTOPRINT_URL` - OctoPrint server URL (e.g., http://localhost:5000)
- `OCTOPRINT_API_KEY` - OctoPrint API key from settings

## Raspberry Pi Deployment

Use `raspberry-pi-setup.sh` to:
1. Install Chromium browser in kiosk mode
2. Configure LXDE autostart
3. Create systemd service for the web server
4. Disable screen blanking

The interface launches automatically on boot at http://localhost:5000

## Features Implemented

✅ Real-time printer status monitoring
✅ Temperature control with presets
✅ Manual movement control (X/Y/Z axes)
✅ Extruder control
✅ Job control (start, pause, resume, cancel)
✅ File management (browse, select, delete)
✅ G-code terminal
✅ Connection settings management
✅ Dark/light theme toggle
✅ WebSocket auto-reconnect
✅ Error handling with toast notifications

## Development

Start dev server:
```bash
npm run dev
```

The app runs on port 5000 with hot reload enabled.

## Replit Environment Setup

This project has been configured for Replit:
- **Port**: Application runs on port 5000 (configured for Replit's infrastructure)
- **Workflow**: "Start application" workflow runs `npm run dev` automatically
- **Deployment**: Configured for autoscale deployment with build and start commands
- **Host Configuration**: Vite dev server configured with `allowedHosts: true` to work with Replit's proxy

The application will work without OctoPrint connection - you can configure it:
1. Through the `.env` file with `OCTOPRINT_URL` and `OCTOPRINT_API_KEY`
2. Or via the Settings page in the application UI

## Future Enhancements

Potential additions:
- File upload functionality
- Webcam stream integration
- Temperature graphs
- Print history
- Multi-printer support
- Timelapse controls
