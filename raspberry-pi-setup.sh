#!/bin/bash
# OctoPrint Control Interface - Raspberry Pi Auto-Start Setup
# This script configures the interface to launch automatically on boot in kiosk mode

echo "OctoPrint Control Interface - Auto-Start Setup"
echo "================================================"

# Check if app is built
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    echo "Error: Application not built!"
    echo "Please run 'npm run build' before running this setup script."
    exit 1
fi

# Install required packages
echo "Installing required packages..."
sudo apt-get update
sudo apt-get install -y chromium-browser unclutter xdotool

# Create autostart directory if it doesn't exist
mkdir -p ~/.config/lxsession/LXDE
mkdir -p ~/.config/autostart

# Create autostart script for kiosk mode
cat > ~/.config/lxsession/LXDE/autostart << 'EOF'
@lxpanel --profile LXDE
@pcmanfm --desktop --profile LXDE
@xscreensaver -no-splash

# Disable screen blanking
@xset s off
@xset -dpms
@xset s noblank

# Hide mouse cursor when idle
@unclutter -idle 0

# Launch OctoPrint Control Interface in Chromium kiosk mode
@chromium-browser --kiosk --app=http://localhost:4000
EOF

echo "Autostart configuration created at ~/.config/lxsession/LXDE/autostart"

# Create systemd service to start the Node.js server on boot
echo "Creating systemd service for the web application..."

sudo tee /etc/systemd/system/octoprint-control.service > /dev/null << EOF
[Unit]
Description=OctoPrint Control Interface Web Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable octoprint-control.service

echo ""
echo "Setup complete!"
echo ""
echo "The interface will automatically launch on boot in kiosk mode."
echo ""
echo "To start the service now, run:"
echo "  sudo systemctl start octoprint-control.service"
echo ""
echo "To check service status:"
echo "  sudo systemctl status octoprint-control.service"
echo ""
echo "To view service logs:"
echo "  sudo journalctl -u octoprint-control.service -f"
echo ""
echo "To disable auto-start:"
echo "  sudo systemctl disable octoprint-control.service"
echo ""
echo "Reboot your Raspberry Pi to see it in action!"