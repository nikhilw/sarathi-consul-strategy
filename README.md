# sarathi-consul-strategy
Implementation of Sarathi's discovery API for Consul.io

## Installation
```npm
npm install sarathi-consul-strategy --save
```

## Features
Lets you use [Sarathi](https://www.npmjs.com/package/sarathi) as declarative rest client with client-side load balancing when using [consul.io](https://www.consul.io/) discovery server.

## Usage
```javascript
var ConsulDiscoveryStrategy = require("sarathi-consul-strategy").DiscoveryStrategy;
var ds = new ConsulDiscoveryStrategy(...);
sarathiClientBuilder.setDiscoveryStrategy(ds);
```
## Options
* serviceId: ```String``` name of the service to discover, Ex: "testservice"
* client: ```Object``` instance of discovery service client, if you already have one; you might have used it for registering your service.
* clientConfig: ```Object``` Configuration to be passed to discovery service client, if you want sarathi to instantiate it. Client instance, if passed, takes precedence over this.
* refreshRate: ```Number``` in ms. timeout, to refresh discovered services. Ex: 30000 to mean every 30s.
* zone: ```String``` **not** yet supported, but for data-center awareness.
* discoveryTimeout: ```Number``` in ms. Timeout, time to wait for before the call to the discovery server times out.

## Examples
### When consul server is running locally
```javascript
var ds = new ConsulDiscoveryStrategy({serviceId: "express-service"});
```

### When consul client already instantiated
```javascript
var ds = new ConsulDiscoveryStrategy({serviceId: "express-service", client: consulClientInstance});
```


## API
A fluent API for setting configuration

### DiscoveryBuilder()
Object returned by ```require("sarathi-consul-strategy").StrategyBuilder```

#### DiscoveryBuilder# setClient(discoveryClient)
Set instance of the discovery server client. This shall come handy when you have already instantiated the client instance for registering with the server.

#### DiscoveryBuilder# setClientConfig(clientConfig)
Pass the config for sarathi to instantiate the client. If setClient and setClientConfig both are used, client instance passed will be used and the configuration provided to this method will be discarded. You can un-set the client instance by setting it to undefined.

#### DiscoveryBuilder# setRefreshRate(refreshRate)
Set service catalg refresh timeout

#### DiscoveryBuilder# setServiceId(serviceId)
Set the service name to look for on the discovery server

#### DiscoveryBuilder# setZone(zone)
**NOT** Implemented; but this is where you can set the data center preference

#### DiscoveryBuilder# build()
Builds the discovery handler instance and returns the instance of DiscoveryStrategy.

### ConsulDiscoveryStrategy
Sarathi consul discovery strategy

#### ConsulDiscoveryStrategy# getConsulInstance()
Returns the instance of consul client, if you needed to use it.

## Configuration Defaults
```javascript
{
	serviceId: undefined,
	client: undefined,
	clientConfig: {},
	refreshRate: 30000,
	zone: undefined
}
```
