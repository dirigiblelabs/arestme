# arestme
Utility library for quick and flexible functional mixin of REST service capabilities

Usage:
<pre>
// Step 1. aREST a DAO
//require the lib
var arester = require("arestme/arester");

var entityDAO = require("path_to_dao/entity_dao");
//create a mixin
var EntitySvc = arester.asRestAPI(entityDAO);

// Step 2. Use as a service
var entitySvc = new EntitySvc(entityDAO);

var request = require("net/http/request");
var response = require("net/http/response");
//Go!
entitySvc.service(request, response);
</pre>
This setup assumes default mapping of resource path, verb and requested MIME type to DAO method names.
This can be easily changed or amended in the exposed cfg object (with the example above: EntitySvc.prototype.cfg)
