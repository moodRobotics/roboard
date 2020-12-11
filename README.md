# roboard

Remote screen controled by robots. Create a cheap Videoconference, digital signage or dashboard with an old computer or raspberry pi connected to a small or large screen.

You (or your robot) can change the screen content, change vol or Power On or Off with MQTT or HTPP commands.

## Installation

## Setup

Edit config.js and complete this data:

- deviceName: Use a Case Sensitive name without Spaces, "/", and special caracters.
- args = [
        '--start-fullscreen' // you can also use '--start-fullscreen' or '--start-maximized'
];
- defaultViewport = null;
- headless = false;
- splashUrl = "https://tolentinoabogados.com";

## Documentation

To do this, it leverages the great work of:

- [cec-monitor](https://github.com/senzil/cec-monitor) by Pablo González of Senzil, and
- [libcec](https://github.com/Pulse-Eight/libcec) by PulseEight.
- [MQTT](https://www.npmjs.com/package/mqtt).
