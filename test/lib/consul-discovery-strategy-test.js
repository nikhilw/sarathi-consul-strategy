var chai = require("chai");
chai.should();
var SarathiDiscoveryStrategy = require("sarathi-discovery-strategy");
var proxyquire = require("proxyquire");

function DummyConsul() {
	return this;
}
DummyConsul.prototype.health = {
	service: function (options, cb) {
		return cb(null, [{Service: {Address: "someAddress1", Port: 8080}}, {Service: {Address: "someAddress2", Port: 8081}}]);
	}
};

var DiscoveryStrategy = proxyquire("../../lib/consul-discovery-strategy", {"consul": DummyConsul});

describe("DiscoveryStrategy", function() {
	var discoveryStrategy;
	var consulClient = new DummyConsul();

	beforeEach(function () {
		discoveryStrategy = new DiscoveryStrategy({serviceId: "test-one", client: consulClient});
	});

	it("should throw error when serviceId is falsy", function() {
		(function() {
			new DiscoveryStrategy();
		}).should.Throw(Error, "serviceId must be defined for service discovery");
	});

	it("should ensure that setClient takes precedence", function () {
		function A() {}
		var ds = new DiscoveryStrategy({serviceId: "test", client: new A(), clientConfig: {a: 1}});
		ds._client.should.be.an.instanceOf(A);
	});

	it("should be an instance of consul-discovery-strategy", function () {
		discoveryStrategy.should.be.an.instanceOf(SarathiDiscoveryStrategy);
	});

	it("#getConsulInstance should retrun the client instance", function () {
		discoveryStrategy.getConsulInstance().should.be.equal(consulClient);
	});

	it("should resolve status to reject when error in service discovery", function () {
		var localConsulClient = new DummyConsul();
		var localDiscoveryStrategy = new DiscoveryStrategy({serviceId: "test-one", client: localConsulClient});

		localConsulClient.health = {
			service: function (options, cb) {
				return cb(new Error("just some error"));
			}
		};

		localDiscoveryStrategy.discoverInstances();

		localDiscoveryStrategy.discoveryDone(null, function (err) {
			err.should.be.an.instanceOf(Error);
		});

	});

	it("should resolve status to reject when no nodes found", function () {
		var localConsulClient = new DummyConsul();
		var localDiscoveryStrategy = new DiscoveryStrategy({serviceId: "test-one", client: localConsulClient});

		localConsulClient.health = {
			service: function (options, cb) {
				return cb(null, []);
			}
		};

		localDiscoveryStrategy.discoverInstances();

		localDiscoveryStrategy.discoveryDone(null, function (err) {
			err.should.be.an.instanceOf(Error);
			err.message.should.be.equal("No instances of the service found");
		});

	});

	it("should resolve status to reject when no nodes discovered in 30s timeout period", function (complete) {
		var localConsulClient = new DummyConsul();
		var localDiscoveryStrategy = new DiscoveryStrategy({serviceId: "test-one", client: localConsulClient, discoveryTimeout: 200});

		localConsulClient.health = {
			service: function (options, cb) {
				// return cb(null, []);
			}
		};

		localDiscoveryStrategy.discoverInstances();

		localDiscoveryStrategy.discoveryDone(null, function (err) {
			err.should.be.an.instanceOf(Error);
			err.message.should.be.equal("Discovery timeout reached");
			complete();
		});

	});


	it("#discoverInstances should start discovery", function(callback) {
		discoveryStrategy.getDiscoveredInstances().should.be.empty;
		(function () {
			discoveryStrategy.discoveryDone();
		}).should.Throw(Error);

		discoveryStrategy.discoverInstances();

		discoveryStrategy.discoveryDone((function() {
			var done = false;

			setTimeout(function () {
				if(!done) {
					return callback(new Error("Timeout, discovery promise not resolved."));
				}
			}, 500);

			return function () {
				done = true;
				discoveryStrategy.getDiscoveredInstances().length.should.equal(2);
				return callback();
			}
		})());
	});
});
