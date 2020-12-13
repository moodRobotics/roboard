# roboard

Remote screen controled by robots. Create a cheap Videoconference, digital signage or dashboard with an old computer or raspberry pi connected to a small or large screen.

You (or your robot) can change the screen content, change vol or Power On or Off with MQTT or HTTP commands.

## Commands

You can use these commands:

- **goto** *url* Where url is where the page it´s going to load
- tv on
- tv off
- mute on
- mute off
- vol +
- vol -
- vol (0-10)

## Installation

<npm install>

## Setup

Edit config.js and complete this data:

- deviceName: Use a Case Sensitive name without Spaces, "/", and special caracters.
- args = [
        '--start-fullscreen' // you can also use '--start-fullscreen' or '--start-maximized'
];
- defaultViewport = null;
- headless = false;
- splashUrl = "https://tolentinoabogados.com";
- mqtt = {
    host: "mqtt://domain:PORT",
    commandtopic: "/devices/command/nikola",
    infotopic: "/devices/info/nikola"
}

## Documentation

To do this, it leverages the great work of:

- [cec-monitor](https://github.com/senzil/cec-monitor) by Pablo González of Senzil.
- [libcec](https://github.com/Pulse-Eight/libcec) by PulseEight.
- [hdmi-cec](https://github.com/jvanharn/node-hdmi-cec).
- [node-cec](https://github.com/patlux/node-cec)
- [MQTT](https://www.npmjs.com/package/mqtt).
