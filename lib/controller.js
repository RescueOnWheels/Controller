const HID = require('node-hid');

const Input = require('./components/Input.js');
const SimpleButton = require('./components/SimpleButton.js');
const SingleAxis = require('./components/SingleAxis.js');
const DualAxis = require('./components/DualAxis.js');

const platforms = {
  win32: (dev) => {
    const isWired = dev.productId === 4354;
    const isWireless = dev.productId === 4418;

    return (isWired || isWireless) && dev.path.includes('&mi_01');
  },
};

class SteamController {
  constructor() {
    if (Object.keys(platforms).indexOf(process.platform) > -1) {
      this.controller_device = HID.devices().find(platforms[process.platform]);
    } else {
      throw new Error('Controller: Unsupported platform detected!');
    }

    if (!this.controller_device) {
      throw new Error('Controller: Steam Controller not found in the connected devices!');
    }

    /*
     * Buttons
     */
    this.a = new Input(SimpleButton);
    this.b = new Input(SimpleButton);
    this.x = new Input(SimpleButton);
    this.y = new Input(SimpleButton);

    /*
     * Menu buttons
     */
    this.back = new Input(SimpleButton);
    this.forward = new Input(SimpleButton);
    this.home = new Input(SimpleButton);

    /*
     * Triggers
     */
    this.ltrigger = new Input(SimpleButton, SingleAxis);
    this.rtrigger = new Input(SimpleButton, SingleAxis);

    /*
     * Shoulders
     */
    this.lshoulder = new Input(SimpleButton);
    this.rshoulder = new Input(SimpleButton);

    /*
     * Grips
     */
    this.lgrip = new Input(SimpleButton);
    this.rgrip = new Input(SimpleButton);

    /*
     * Joystick
     */
    this.stick = new Input(SimpleButton, DualAxis);

    /*
     * Right Pad
     */
    this.rpad = new Input(SimpleButton, DualAxis);
  }

  connect() {
    this.hid = new HID.HID(this.controller_device.path);
    this.hid.on('data', this.onData.bind(this));
  }

  onData(data) {
    /*
     * Event Type:
     * 0x01 - STEAMCONTROLLER_EVENT_UPDATE
     * 0x02 - ?
     * 0x03 - STEAMCONTROLLER_EVENT_CONNECTION
     * 0x04 - STEAMCONTROLLER_EVENT_BATTERY
     */
    if (data[0x02] !== 0x01) {
      return;
    }

    /*
     * Button data
     */
    const buttons = data.readUInt32BE(7);

    /*
     * Buttons
     */
    this.a.update('SimpleButton', buttons >> 23 & 1);
    this.b.update('SimpleButton', buttons >> 21 & 1);
    this.x.update('SimpleButton', buttons >> 22 & 1);
    this.y.update('SimpleButton', buttons >> 20 & 1);

    /*
     * Shoulders
     */
    this.lshoulder.update('SimpleButton', buttons >> 19 & 1);
    this.rshoulder.update('SimpleButton', buttons >> 18 & 1);

    /*
     * Grips
     */
    this.lgrip.update('SimpleButton', buttons >> 15 & 1);
    this.rgrip.update('SimpleButton', buttons & 1);

    /*
     * Menu buttons
     */
    this.back.update('SimpleButton', buttons >> 12 & 1);
    this.forward.update('SimpleButton', buttons >> 14 & 1);
    this.home.update('SimpleButton', buttons >> 13 & 1);

    /*
     * Triggers
     */
    this.ltrigger.update('SingleAxis', data[11]);
    this.rtrigger.update('SingleAxis', data[12]);
    this.ltrigger.update('SimpleButton', buttons >> 17 & 1);
    this.rtrigger.update('SimpleButton', buttons >> 16 & 1);

    /*
     * Joystick
     */
    const LX = data.readInt16LE(16);
    const LY = data.readInt16LE(18);
    this.stick.update('DualAxis', LX, LY);
    this.stick.update('SimpleButton', (buttons >> 6 & 1) && (buttons >> 1 & 1));

    /*
     * Right pad
     */
    const RX = data.readInt16LE(20);
    const RY = data.readInt16LE(22);
    this.rpad.update('DualAxis', RX, RY);
    this.rpad.update('SimpleButton', buttons >> 2 & 1);
  }
}

module.exports = SteamController;
