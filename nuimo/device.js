var nuimo = require('./nuimo');

module.exports = function (RED) {
    function DeviceNode(config) {
        RED.nodes.createNode(this, config);
        this.nuimo = nuimo;
    }
    RED.nodes.registerType("device", DeviceNode);
}