module.exports = function (RED) {

    function SwipeNode(config) {
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

        this.nuimo.on('swipe', (nuimo, data) => {
            var dirs = ['LEFT', 'RIGHT', 'UP', 'DOWN'];
            var payload = dirs[data[0]] || data[0]
            node.send({ payload: payload });
        });

    }

    RED.nodes.registerType("swipe", SwipeNode);
}
