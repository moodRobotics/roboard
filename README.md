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

You are going to need a computer with a screen.

### Computers

- PC. You ca use linux (prefered) or windows. I didn´t check a Apple but you can try.
- Raspberry Pi, or may be Orange Pi or Banana or any fruit. I test with a Rpi 4 & 400, but a Zero Wifi may be a cheap and good option.

### Screen

- Computer screen
- TV. I test this one, with the internal HDMI-CEC protocol, and is the best solution. It´s big, cheap and it works with and USB camera like a videoconference system without any contact (COVID Free).
If you want to use it with a raspbery pi (or an ARM processor)

### Raspberry Pi or linux configuration

```console
sudo apt install chromium-browser chromium-codecs-ffmpeg
sudo apt install cec-utils
sudo apt install npm
md roboard
cd roboard
npm i roboard
npm install
```

edit the file: /etc/xdg/lxsession/LXDE/autostart
comment out a xscreensaver command, and add these xset lines

```script
#@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
```

```console
node roboard.js
```

## Setup

First time you are going to write this information:

- company name (only to help for creating the topics) no spaces or special caracters.
- device name: no spaces or special caracters.
- splasUrl: The default url for the screen. Please write *http://* or *https://*.
- mqtt server: Begin with *mqtt://* the domain, and finish with *:* and port number only if is different to 1883.
- infotopic: The topic you are going to use to know how is working, suscribe it.
- commandtopic: The topic you are going to use to send commands, publish in there.

Edit config.js to configure how the chromium works only if you want to change something.
Remember to do not use the root user to activate the roboard application.

## Documentation

To do this, it leverages the great work of:

- [cec-monitor](https://github.com/senzil/cec-monitor) by Pablo González of Senzil.
- [libcec](https://github.com/Pulse-Eight/libcec) by PulseEight.
- [hdmi-cec](https://github.com/jvanharn/node-hdmi-cec).
- [node-cec](https://github.com/patlux/node-cec)
- [MQTT](https://www.npmjs.com/package/mqtt).
- [Puppeteer](https://github.com/puppeteer/puppeteer)
- [prompt-sync](https://github.com/heapwolf/prompt-sync) from David Mark Clements.
