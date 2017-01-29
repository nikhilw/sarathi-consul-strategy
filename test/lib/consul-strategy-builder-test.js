var chai = require("chai");
chai.should();
var expect = chai.expect;
var Consul = require("consul");
var StrategyBuilder = require("../../lib/consul-strategy-builder");
var Strategy = require("../../lib/consul-discovery-strategy");

describe("ConsulStrategyBuilder", function () {
	var strategyBuilder;

	beforeEach(function () {
		strategyBuilder = new StrategyBuilder({serviceId: "test"});
	});

	it("setClient should verify typeof consul", function () {
		function A(){}
		(function() {
			strategyBuilder.setClient(new A());
		}).should.Throw(Error, "Not a valid consul client");
	});

	it("setClient should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setClient(new Consul());
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("setClientConfig should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setClientConfig({});
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("setRefreshRate should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setRefreshRate(3000);
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("setServiceId should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setServiceId("test");
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("setZone should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setZone("someZone");
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("setDiscoveryTimeout should return builder back, for chainability", function () {
		var returnVal = strategyBuilder.setDiscoveryTimeout(500);
		returnVal.should.be.an.instanceOf(StrategyBuilder);
	});

	it("build should return instance of strategy", function () {
		var returnVal = strategyBuilder.build();
		returnVal.should.be.an.instanceOf(Strategy);
	});
});
