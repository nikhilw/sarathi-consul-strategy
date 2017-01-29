// @flow
"use strict";
var util = require("util");
var discoveryStrategy = require("sarathi-discovery-strategy");
var _ = require("lodash");
var consul = require("consul");
var Promise = require("promise");

var discoveryDefaults = {
	serviceId: undefined, // name of your service
	client: undefined, // instance of service discovery client
	clientConfig: {}, // configuration to create disovery client instance: server ip, port etc
	refreshRate: 30000, // timeout to refresh services from discovery server
	zone: undefined, // data-center or zone of preference
	discoveryTimeout: 30000
};

function ConsulDiscoveryStrategy(options) {
	var discoveryConfig = {};
	_.merge(discoveryConfig, discoveryDefaults, options);

	if (!discoveryConfig.serviceId) {
		throw new Error("serviceId must be defined for service discovery");
	}

    var instance = this;
	instance._discoveryConfig = discoveryConfig;
    instance._client = discoveryConfig.client || consul(discoveryConfig.clientConfig);

	instance.serviceDiscovery = {
		nodes: [],
		status: undefined
	};

    setInterval(function() {
		instance.discoverInstances();
    }, discoveryConfig.refreshRate);
}

util.inherits(ConsulDiscoveryStrategy, discoveryStrategy);

ConsulDiscoveryStrategy.prototype.discoveryDone = function(cb, cbError) {
	return this.serviceDiscovery.status.done(cb, cbError);
};

ConsulDiscoveryStrategy.prototype.getDiscoveredInstances = function() {
	return this.serviceDiscovery.nodes;
};

ConsulDiscoveryStrategy.prototype.getConsulInstance = function () {
	return this._client;
};

ConsulDiscoveryStrategy.prototype.discoverInstances = function() {
	var instance = this;
	// instance.serviceDiscovery = {
		// nodes: [],
		instance.serviceDiscovery.status = new Promise(
			function(resolve, reject) {
				instance._client.health.service({
					service: instance._discoveryConfig.serviceId,
					passing: true,
					dc: instance._discoveryConfig.zone
				}, function(err, result) {
					if (err) {
						return reject(err); // TODO: Log an error
					}

					// console.log(result.length);
					if (result.length) {
						instance.serviceDiscovery.nodes.length = 0; // clear listed nodes, why should I not?
						_.forEach(result, function(serviceDetails) {
							// console.log(serviceDetails);
							instance.serviceDiscovery.nodes.push({
								address: serviceDetails.Service.Address,
								port: serviceDetails.Service.Port,
								url: "http://" + serviceDetails.Service.Address + ":" + serviceDetails.Service.Port + "/"
							});
						});
						// console.log(serviceDiscovery.nodes);
						return resolve(instance.serviceDiscovery.nodes);
					} else {
						return reject(new Error("No instances of the service found"));
					}
				});

				setTimeout(function() {
					reject(new Error("Discovery timeout reached")); // TODO: Log an error
				}, instance._discoveryConfig.discoveryTimeout);
			}
		);
	// };

	//return serviceDiscovery;
	// return instance._discoveryConfig.cb(serviceDiscovery);
};

module.exports = ConsulDiscoveryStrategy;
