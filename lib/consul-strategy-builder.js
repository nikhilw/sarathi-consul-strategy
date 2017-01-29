// @flow
"use strict";
var Consul = require("consul");
var ConsulDiscoveryStrategy = require("./consul-discovery-strategy");

function StrategyBuilder(discoveryConfig) {
    this.setClient = function(discoveryClient) {
		if (discoveryClient instanceof Consul) {
			discoveryConfig.client = discoveryClient;
			return this;
		}
		throw new Error("Not a valid consul client");
    };

    this.setClientConfig = function(clientConfig) {
        discoveryConfig.clientConfig = clientConfig;
        return this;
    };

    this.setRefreshRate = function(refreshRate) {
        discoveryConfig.refreshRate = refreshRate;
        return this;
    };

    this.setServiceId = function(serviceId) {
        discoveryConfig.serviceId = serviceId;
		return this;
    };

	this.setZone = function(zone) {
		discoveryConfig.zone = zone;
		return this;
	};

	this.setDiscoveryTimeout = function (timeout) {
		discoveryConfig.discoveryTimeout = timeout;
		return this;
	};

    this.build = function() {
        return new ConsulDiscoveryStrategy(discoveryConfig);
    };
}

module.exports = StrategyBuilder;
