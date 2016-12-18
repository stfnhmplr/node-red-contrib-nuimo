module.exports = function (RED) {

    function RotateNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

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

        this.nuimo.on('rotate', (nuimo, data) => {
            if (data[1] === 255) {
                var velocity = Math.round((255 - data[0]) / 255 * 100);
                node.send({ payload: -velocity });
            } else {
                var velocity = Math.round(data[0] / 255 * 100);
                node.send({ payload: velocity });
            }
        });

    }

    RED.nodes.registerType("rotate", RotateNode);
}
