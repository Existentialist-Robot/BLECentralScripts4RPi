
# BLE central sample scripts for Raspberry Pi
Made of [node.js](https://nodejs.org/en/) + [noble](https://github.com/sandeepmistry/noble)

## Requirement:
- Raspberry Pi B+
- BLE USB dongle
- Raspbian 8.0+
- [node.js 4.3+](https://nodejs.org/en/download/)
- [noble](https://github.com/sandeepmistry/noble)
- [date-utils](https://github.com/JerrySievert/date-utils)

## Install:
Assumes that Raspbian 8.0 is installed.

1. Install the Bluetooth library and tools, development tools.

   ```
   $ sudo apt install -y git bluez bluez-tools libbluetooth-dev libudev-dev
   ```

2. Install the node.js.

  ```
  $ tar xJf node-v4.3.1-linux-armv6l.tar.xz
  $ cd node-v4.3.1-linux-armv6l/
  $ sudo cp -R * /usr/local
  ```

3. Clone the scripts.
  "WORKDIR" to be replaced with your working directory.

  ```
  $ cd WORKDIR
  $ git clone https://github.com/f-okuhara/BLECentralScripts4RPi.git
  ```

4. Install the node.js packages.

  ```
  $ cd BLECentralScripts4RPi
  $ npm install noble date-utils
  ```

## Run scripts:
### Enable bluetooth HCI

```
$ sudo hciconfig hci0 up
```

### Run the Eddystone beacon detection script

```
$ sudo node beacon_detect.js
```

`9axis.js`, `pwm.js` also performs in the sam way.
