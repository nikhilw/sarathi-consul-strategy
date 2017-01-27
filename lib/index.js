var discoveryStrategy = require("./consul-discovery-strategy");
var strategyBuilder = require("./consul-strategy-builder");

var exports = module.exports = discoveryStrategy;

exports.DiscoveryStrategy = discoveryStrategy;
exports.StrategyBuilder = strategyBuilder;
