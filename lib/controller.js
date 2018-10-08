/**
 * Dependencies
 */
const HID = require('node-hid');

/**
 * Debug dependencies
 */
const debug = require('debug')('RRS:Controller');

/**
 * Events
 */
const STEAMCONTROLLER_EVENT_UPDATE = 0x01;
const STEAMCONTROLLER_EVENT_CONNECTION = 0x03;
const STEAMCONTROLLER_EVENT_BATTERY = 0x04;

/**
 * Connection events
 */
const STEAMCONTROLLER_CONNECTION_EVENT_DISCONNECTED = 0x01;
const STEAMCONTROLLER_CONNECTION_EVENT_CONNECTED = 0x02;
const STEAMCONTROLLER_CONNECTION_EVENT_PAIRING_REQUESTED = 0x03;

/**
 * Buttons
 */
const STEAMCONTROLLER_BUTTON_Y = 4;
const STEAMCONTROLLER_BUTTON_B = 5;
const STEAMCONTROLLER_BUTTON_X = 6;
const STEAMCONTROLLER_BUTTON_A = 7;

/**
 * Menu buttons
 */
const STEAMCONTROLLER_BUTTON_PREV = 12;
const STEAMCONTROLLER_BUTTON_HOME = 13;
const STEAMCONTROLLER_BUTTON_NEXT = 14;

/**
 * Shoulders
 */
const STEAMCONTROLLER_BUTTON_LS = 3;
const STEAMCONTROLLER_BUTTON_RS = 2;

/**
 * Grips
 */
const STEAMCONTROLLER_BUTTON_LG = 15;
const STEAMCONTROLLER_BUTTON_RG = 16;

/**
 * Left trigger
 */
const STEAMCONTROLLER_BUTTON_LT = 1;
const STEAMCONTROLLER_BUTTON_LT_DATA = 0x0b;

/**
 * Right trigger
 */
const STEAMCONTROLLER_BUTTON_RT = 0;
const STEAMCONTROLLER_BUTTON_RT_DATA = 0x0c;

/**
 * X constants
 */
const STEAMCONTROLLER_LX = 0x10;
const STEAMCONTROLLER_RX = 0x14;

/**
 * Y constants
 */
const STEAMCONTROLLER_LY = 0x12;
const STEAMCONTROLLER_RY = 0x16;

/**
 * Touch constants
 */
const STEAMCONTROLLER_PAD_LT = 19;
const STEAMCONTROLLER_PAD_RT = 20;

/**
 * DPad
 */
const STEAMCONTROLLER_BUTTON_DPAD_UP = 8;
const STEAMCONTROLLER_BUTTON_DPAD_RIGHT = 9;
const STEAMCONTROLLER_BUTTON_DPAD_LEFT = 10;
const STEAMCONTROLLER_BUTTON_DPAD_DOWN = 11;

/**
 * Others
 */
const STEAMCONTROLLER_BUTTON_LFINGER = (0x08 << 16);
const STEAMCONTROLLER_FLAG_PAD_STICK = (0x80 << 16);

/**
 * Controller base
 */
const { EventEmitter } = require('events');

/**
 * Button base
 */
const Input = require('./components/Input.js');

/**
 * Button specific
 */
const SimpleButton = require('./components/SimpleButton.js');
const SingleAxis = require('./components/SingleAxis.js');
const DualAxis = require('./components/DualAxis.js');
const Touch = require('./components/Touch.js');
const DPad = require('./components/DPad.js');

/**
 * Platform specific Steam Controller USB-identifiers
 */
const platforms = {
  linux: (dev) => {
    const isWired = dev.productId === 4354;
    const isWireless = dev.productId === 4418;

    return (isWired || isWireless) && dev.interface === 1;
  },
  win32: (dev) => {
    const isWired = dev.productId === 4354;
    const isWireless = dev.productId === 4418;

    return (isWired || isWireless) && dev.path.includes('&mi_01');
  },
};

class SteamController extends EventEmitter {
  constructor() {
    super();

    /**
     * Buttons
     */
    this.a = new Input(SimpleButton);
    this.b = new Input(SimpleButton);
    this.x = new Input(SimpleButton);
    this.y = new Input(SimpleButton);

    /**
     * Menu buttons
     */
    this.prev = new Input(SimpleButton);
    this.next = new Input(SimpleButton);
    this.home = new Input(SimpleButton);

    /**
     * Shoulders
     */
    this.lshoulder = new Input(SimpleButton);
    this.rshoulder = new Input(SimpleButton);

    /**
     * Grips
     */
    this.lgrip = new Input(SimpleButton);
    this.rgrip = new Input(SimpleButton);

    /**
     * Triggers
     */
    this.ltrigger = new Input(SimpleButton, SingleAxis);
    this.rtrigger = new Input(SimpleButton, SingleAxis);

    /**
     * Joystick
     */
    this.stick = new Input(SimpleButton, DualAxis);

    /**
     * Pads
     */
    this.lpad = new Input(SimpleButton, Touch, DualAxis, DPad);
    this.rpad = new Input(SimpleButton, Touch, DualAxis);
  }

  connect() {
    const { platform } = process;
    if (!(platform in platforms)) {
      throw new Error(`This platform, '${platform}', is not supported!`);
    }

    this.controller_device = HID.devices().find(platforms[platform]);
    if (!this.controller_device) {
      debug('Steam Controller not found in the connected devices!');

      const error = new Error('Steam Controller not found in the connected devices!');
      error.code = 'ERR_STEAM_CONTROLLER_NOT_FOUND';

      this.emit('error', error);
      return;
    }

    try {
      this.hid = new HID.HID(this.controller_device.path);
      this.hid.on('data', this.onData.bind(this));
      this.hid.on('error', this.onError.bind(this));
      this.emit('connect');
    } catch (error) {
      this.onError(error);
    }
  }

  disconnect() {
    debug('Closing HID of Steam Controller.');
    if (!this.hid) {
      debug('There is no active HID connection, aborted closing HID!');
      return;
    }

    this.hid.close();
    debug('Closed HID of Steam Controller!');
  }

  onError(err) {
    debug('%o', err);

    this.emit('error', err);
  }

  onData(eventData) {
    const eventType = eventData[0x02];
    switch (eventType) {
      case STEAMCONTROLLER_EVENT_UPDATE:
      {
        const buttons = eventData[0x08] | (eventData[0x09] << 8) | (eventData[0x0a] << 16);

        /**
         * Buttons
         */
        this.a.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_A & 1);
        this.b.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_B & 1);
        this.x.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_X & 1);
        this.y.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_Y & 1);

        /**
         * Menu buttons
         */
        this.prev.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_PREV & 1);
        this.home.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_HOME & 1);
        this.next.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_NEXT & 1);

        /**
         * Shoulders
         */
        this.lshoulder.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_LS & 1);
        this.rshoulder.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_RS & 1);

        /**
         * Grips
         */
        this.lgrip.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_LG & 1);
        this.rgrip.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_RG & 1);

        /**
         * Left trigger
         */
        this.ltrigger.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_LT & 1);
        this.ltrigger.update('SingleAxis', eventData[STEAMCONTROLLER_BUTTON_LT_DATA]);

        /**
         * Right trigger
         */
        this.rtrigger.update('SimpleButton', buttons >> STEAMCONTROLLER_BUTTON_RT & 1);
        this.rtrigger.update('SingleAxis', eventData[STEAMCONTROLLER_BUTTON_RT_DATA]);

        /**
         * X constants
         */
        const LX = eventData.readInt16LE(STEAMCONTROLLER_LX);
        const RX = eventData.readInt16LE(STEAMCONTROLLER_RX);

        /**
         * Y constants
         */
        const LY = eventData.readInt16LE(STEAMCONTROLLER_LY);
        const RY = eventData.readInt16LE(STEAMCONTROLLER_RY);

        /**
         * Touch constants
         */
        const Ltouched = (buttons >> STEAMCONTROLLER_PAD_LT & 1);
        const Rtouched = (buttons >> STEAMCONTROLLER_PAD_RT & 1);

        /**
         * Joystick
         */
        this.stick.update('SimpleButton', (buttons >> 17 & 1) && (buttons >> 22 & 1));
        if (buttons ^ STEAMCONTROLLER_BUTTON_LFINGER) {
          this.stick.update('DualAxis', LX, LY, (LX !== 0 || LY !== 0) && !Ltouched);
        }

        /**
         * Left pad
         */
        this.lpad.update('SimpleButton', (buttons >> 17 & 1) && (buttons >> 19 & 1));
        this.lpad.update('Touch', Ltouched, LX, LY);

        if (buttons & STEAMCONTROLLER_BUTTON_LFINGER) {
          this.lpad.update('DualAxis', LX, LY, Ltouched);
        } else if ((buttons & STEAMCONTROLLER_FLAG_PAD_STICK) !== 0) {
          this.lpad.update('DualAxis', LX, LY, Ltouched);
        }

        /**
         * Right pad
         */
        this.rpad.update('SimpleButton', (buttons >> 18 & 1) && (buttons >> 20 & 1));
        this.rpad.update('DualAxis', RX, RY, Rtouched);
        this.rpad.update('Touch', Rtouched, RX, RY);

        /**
         * DPad
         */
        this.lpad.update('DPad', buttons >> STEAMCONTROLLER_BUTTON_DPAD_UP & 1, buttons >> STEAMCONTROLLER_BUTTON_DPAD_DOWN & 1, buttons >> STEAMCONTROLLER_BUTTON_DPAD_LEFT & 1, buttons >> STEAMCONTROLLER_BUTTON_DPAD_RIGHT & 1);

        break;
      }

      case STEAMCONTROLLER_EVENT_CONNECTION:
      {
        const details = eventData[0x04];

        switch (details) {
          case STEAMCONTROLLER_CONNECTION_EVENT_DISCONNECTED:
            debug('Steam Controller disconnected!');
            this.emit('disconnect');

            break;

          case STEAMCONTROLLER_CONNECTION_EVENT_CONNECTED:
            debug('Steam Controller connected!');
            this.emit('connect');

            break;

          case STEAMCONTROLLER_CONNECTION_EVENT_PAIRING_REQUESTED:
            // ignored
            break;

          default:
            debug('Received unknown connection event type', details);

            break;
        }

        break;
      }

      case STEAMCONTROLLER_EVENT_BATTERY:
      {
        // ignored
        break;
      }

      default:
      {
        debug('Received unknown event type', eventType);
        break;
      }
    }
  }
}

/**
 * Singleton
 *
 * Because `require` caches the value assigned to `module.exports`,
 * all calls to `require` will return this same instance.
 */
module.exports = exports = new SteamController(); // eslint-disable-line no-multi-assign
