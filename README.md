# OctoPrint Control Interface

A web-based control interface for OctoPrint designed to run on Raspberry Pi and auto-launch on boot in kiosk mode.

## Features

- **Real-time Monitoring**: Live printer status, temperature, and print progress updates via WebSocket
- **Job Control**: Start, pause, resume, and cancel prints
- **Temperature Management**: Set and monitor hotend and bed temperatures with presets
- **Manual Control**: Move printer axes, home, and control extrusion
- **File Management**: Browse, select, and manage G-code files
- **Terminal**: Send G-code commands directly to the printer
- **Dark/Light Mode**: Optimized for workshop environments

## Setup

### Prerequisites

- Node.js 20+ installed
- OctoPrint instance running (on same or different device)
- OctoPrint API key

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure OctoPrint connection:
   - Copy `.env.example` to `.env`
   - Edit `.env` and add your OctoPrint URL and API key:
     ```
     OCTOPRINT_URL=http://your-octoprint-ip:5000
     OCTOPRINT_API_KEY=your_api_key_here
     ```
   - Alternatively, configure in the Settings page after starting the app

4. **For Development:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5000 in your browser

5. **For Production:**
   ```bash
   npm run build
   npm run start
   ```

## Raspberry Pi Auto-Start Setup

To configure the interface to launch automatically on Raspberry Pi boot in kiosk mode:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Make the setup script executable:**
   ```bash
   chmod +x raspberry-pi-setup.sh
   ```

3. **Run the setup script:**
   ```bash
   ./raspberry-pi-setup.sh
   ```

4. **Reboot your Raspberry Pi:**
   ```bash
   sudo reboot
   ```

The interface will now launch automatically in full-screen kiosk mode when the Raspberry Pi boots.

### What the Setup Does

- Installs Chromium browser and required packages
- Configures LXDE autostart to launch the interface in kiosk mode
- Creates a systemd service to start the production web server on boot
- Disables screen blanking for continuous display

### Managing the Service

```bash
# Start the service manually
sudo systemctl start octoprint-control.service

# Stop the service
sudo systemctl stop octoprint-control.service

# Check service status
sudo systemctl status octoprint-control.service

# View service logs
sudo journalctl -u octoprint-control.service -f

# Disable auto-start
sudo systemctl disable octoprint-control.service

# Re-enable auto-start
sudo systemctl enable octoprint-control.service
```

## Getting Your OctoPrint API Key

1. Open OctoPrint in your browser
2. Go to Settings (wrench icon)
3. Scroll down to "API" section
4. Copy the "API Key" shown there
5. If no key exists, click "Generate" to create one

## Usage

### Dashboard
- View printer status at a glance
- Monitor temperatures in real-time
- Track print progress
- Quick access to print controls

### Control
- Manual movement on X, Y, and Z axes
- Home printer axes
- Extrude and retract filament

### Temperature
- Set hotend and bed temperatures
- Quick presets for common filaments (PLA, PETG, ABS)
- Real-time temperature monitoring

### Files
- Browse G-code files on OctoPrint
- Start prints directly from file list
- Delete unwanted files

### Terminal
- Send custom G-code commands
- View command history

### Settings
- Configure OctoPrint connection
- Change server URL and API key
- View system information

## Architecture

- **Frontend**: React + TypeScript with Tailwind CSS
- **Backend**: Express.js server proxying OctoPrint API
- **Real-time Updates**: WebSocket for live printer data
- **State Management**: TanStack Query for server state
- **Production Build**: Vite for frontend, esbuild for backend

## Project Structure

```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and API client
├── server/              # Backend Express server
│   ├── octoprint.ts    # OctoPrint API client
│   ├── routes.ts       # API routes and WebSocket
│   └── storage.ts      # Settings storage
├── shared/             # Shared TypeScript types
└── dist/               # Production build output
```

## Troubleshooting

### Cannot connect to OctoPrint
- Verify OctoPrint is running and accessible
- Check the server URL is correct (including http://)
- Verify API key is correct
- Check firewall settings allow connection

### Auto-start not working on Raspberry Pi
- Ensure you ran `npm run build` before setup
- Check systemd service status: `sudo systemctl status octoprint-control.service`
- View service logs: `sudo journalctl -u octoprint-control.service`
- Ensure autostart file exists: `cat ~/.config/lxsession/LXDE-pi/autostart`

### WebSocket disconnects frequently
- Check network stability
- Verify OctoPrint server is not overloaded
- Check Raspberry Pi performance (CPU temperature, RAM usage)

### Production build fails
- Ensure all dependencies are installed: `npm install`
- Check Node.js version is 20+: `node --version`
- Clear build cache: `rm -rf dist && npm run build`

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Run production build locally:
```bash
npm run build
npm run start
```

## License

MIT
