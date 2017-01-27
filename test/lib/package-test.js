var chai = require("chai");
chai.should();

var Strategy = require("../../lib/index");

describe("consul-discovery-strategy", function() {
	it("should export DiscoveryStrategy constructor directly from package.", function () {
		Strategy.should.be.a("function");
		Strategy.should.be.equal(Strategy.DiscoveryStrategy);
	});

	it("should export DiscoveryStrategy constructor", function () {
		Strategy.DiscoveryStrategy.should.be.a("function");
	});

	it("should export StrategyBuilder constructor", function () {
		Strategy.StrategyBuilder.should.be.a("function");
	});
});
