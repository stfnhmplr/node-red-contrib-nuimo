module.exports = function (RED) {

    function WriteLedsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        this.images = DefaultImages();

        this.nuimo = RED.nodes.getNode(config.device).nuimo;

        this.nuimo.on('connected', () => {
            updateStatus('green', 'connected');
        });

        this.nuimo.on('disconnected', () => {
            updateStatus('red', 'disconnected');
        });

        updateStatus('red', 'disconnected');

        function updateStatus(color, text) {
            node.status({ fill: color, shape: 'ring', text: text });
        }

        this.on('input', msg => {
            if (msg && msg.payload) {
                if (msg.payload instanceof Array) {
                    var brightness = Math.max(msg.brightness || 75, 100);
                    var duration = Math.max(msg.duration || 10, 30);

                    var temp = node.nuimo.createDataForLedMatrix(
                        msg.payload, brightness, duration);
                    node.nuimo.writeToLEDs(temp);
                } else {
                    var temp = node.images[msg.payload];
                    if (temp) {
                        var data = node.nuimo.createDataForLedMatrix(
                            temp.arr, temp.brightness, temp.duration);
                        node.nuimo.writeToLEDs(data);
                    }
                }
            }
        });
    }

    function DefaultImages() {
        var images = {};

        images.PLAYING = {
            arr: [
                0, 0, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 1, 0, 0, 0,
                0, 0, 1, 1, 1, 1, 1, 0, 0,
                0, 0, 1, 1, 1, 1, 0, 0, 0,
                0, 0, 1, 1, 1, 0, 0, 0, 0,
                0, 0, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.PAUSED_PLAYBACK = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 0, 1, 1, 0, 0,
                0, 0, 1, 1, 0, 1, 1, 0, 0,
                0, 0, 1, 1, 0, 1, 1, 0, 0,
                0, 0, 1, 1, 0, 1, 1, 0, 0,
                0, 0, 1, 1, 0, 1, 1, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.previous = {
            arr: [
                0, 1, 0, 0, 0, 0, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 1, 0, 0,
                0, 1, 0, 0, 1, 1, 1, 0, 0,
                0, 1, 0, 1, 1, 1, 1, 0, 0,
                0, 1, 1, 1, 1, 1, 1, 0, 0,
                0, 1, 0, 1, 1, 1, 1, 0, 0,
                0, 1, 0, 0, 1, 1, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 1, 0, 0,
                0, 1, 0, 0, 0, 0, 1, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.next = {
            arr: [
                0, 0, 1, 0, 0, 0, 0, 1, 0,
                0, 0, 1, 1, 0, 0, 0, 1, 0,
                0, 0, 1, 1, 1, 0, 0, 1, 0,
                0, 0, 1, 1, 1, 1, 0, 1, 0,
                0, 0, 1, 1, 1, 1, 1, 1, 0,
                0, 0, 1, 1, 1, 1, 0, 1, 0,
                0, 0, 1, 1, 1, 0, 0, 1, 0,
                0, 0, 1, 1, 0, 0, 0, 1, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.one = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.two = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.three = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.four = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.five = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.six = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.seven = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };


        images.eight = {
            arr: [
                0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        images.nine = {
            arr: [
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 1, 0, 0, 0
            ],
            brightness: 75,
            duration: 10
        };

        return images;
    }

    RED.nodes.registerType("write-leds", WriteLedsNode);
}
