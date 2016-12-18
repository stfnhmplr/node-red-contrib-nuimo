var noble = require('noble');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

util.inherits(Nuimo, EventEmitter);

module.exports = new Nuimo();

function Nuimo() {

    // Private members
    var handlers = {
        'f29b1528cb1940f3be5c7241ecb82fd2': (nuimo, data, characteristic) => {
            this.emit('rotate', nuimo, data, characteristic);
        },
        'f29b1529cb1940f3be5c7241ecb82fd2': (nuimo, data, characteristic) => {
            this.emit('click', nuimo, data, characteristic);
        },
        'f29b1527cb1940f3be5c7241ecb82fd2': (nuimo, data, characteristic) => {
            this.emit('swipe', nuimo, data, characteristic);
        },
        'f29b1526cb1940f3be5c7241ecb82fd2': (nuimo, data, characteristic) => {
            this.emit('fly', nuimo, data, characteristic);
        }
    };
    var ledMatrix = undefined;

    // Public members
    this.createDataForLedMatrix = createDataForLedMatrix;
    this.writeToLEDs = writeToLEDs;

    this.SERVICES = {
        LED_MATRIX: 'f29b1523cb1940f3be5c7241ecb82fd1',
        USER_INPUT: 'f29b1525cb1940f3be5c7241ecb82fd2'
    };

    this.CHARACTERISTICS = {
        BATTERY: '00002a1900001000800000805f9b34fb',
        DEVICE_INFO: '00002a2900001000800000805f9b34fb',
        LED_MATRIX: 'f29b1524cb1940f3be5c7241ecb82fd1',
        ROTATION: 'f29b1528cb1940f3be5c7241ecb82fd2',
        BUTTON_CLICK: 'f29b1529cb1940f3be5c7241ecb82fd2',
        SWIPE: 'f29b1527cb1940f3be5c7241ecb82fd2',
        FLY: 'f29b1526cb1940f3be5c7241ecb82fd2'
    };

    this.EVENTS = {
        Connected: 'Connected',
        Disconnected: 'Disconnected'
    };

    // Implementations:
    function writeToLEDs(data) {
        if (ledMatrix) {
            ledMatrix.write(data);
        } else {
            console.log("Can't writeToLEDs yet.")
        }
    };

    function createDataForLedMatrix(data, brightness, duration) {
        if (arguments.length != 3) {
            throw 'createDataForLedMatrix requires three arguments';
        }

        var strData = '';
        if (data instanceof Array) {
            strData = data.join('');
        } else {
            strData = data;
        }
        var tempArr = strData.split('').filter(x => x === '1' || x === '0');

        if (strData.length != 81)
            throw 'data must be 81 bits';
        if (brightness < 0 || brightness > 255)
            throw 'brightness must be between 0 and 255';
        if (duration < 0 || duration > 255)
            throw 'duration must be between 0 and 255';

        var output = [];

        while (tempArr.length > 0) {
            var temp = parseInt(tempArr.splice(0, 8).reverse().join(''), 2);
            output.push(temp);
        }

        output.push(brightness);
        output.push(duration);

        return new Buffer(output);
    }

    noble.on('stateChange', state => {
        if (state === 'poweredOn') {
            noble.startScanning(['180f', '180a'], false);
        } else {
            noble.stopScanning();
        }
    });

    noble.on('discover', p => {
        p.connect(err => {
            if (err) return;
            this.emit('connected', p);
            p.discoverServices([this.SERVICES.LED_MATRIX, this.SERVICES.USER_INPUT], (err, services) => {
                for (var service of services) {
                    var nuimoChars = Object.keys(this.CHARACTERISTICS).map(prop => this.CHARACTERISTICS[prop]);
                    service.discoverCharacteristics(nuimoChars, (err, characteristics) => {
                        characteristics.forEach(c => {
                            if (c.uuid == this.CHARACTERISTICS.LED_MATRIX) {
                                ledMatrix = c;
                            }
                            if (handlers[c.uuid]) {
                                if (c.properties.indexOf('notify') > -1) {
                                    c.on('read', (data, isNotification) => {
                                        handlers[c.uuid](this, data, c);
                                    });
                                    c.notify(true);
                                }
                            }
                            // else if (c.properties.indexOf('write') > -1) {
                            //     handlers[c.uuid](this, c);
                            // }
                        });
                    });
                }
            });
        });
        p.once('disconnect', () => {
            this.emit('disconnected', p);
            noble.startScanning(['180f', '180a'], false);
        });
    });
}