module.exports = function (RED) {

    function ClickNode(config) {
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

        node.on('close', function (done) {
            done();
        });

        function updateStatus(color, text) {
            node.status({ fill: color, shape: 'ring', text: text });
        }

        this.nuimo.on('click', (nuimo, data) => {
            if (data[0] === 1) {
                node.send({ payload: 'DOWN' });
            } else {
                node.send({ payload: 'UP' });
            }
        });
    }

    RED.nodes.registerType("click", ClickNode);
}
