# aRESTme
**aRESTme** is a project that hosts several related frameworks for developing scripting services supporting fully functional REST API protocols split in several modules, which will be briefly introduced below. For extensive documentation and examples, explore the project [wiki](https://github.com/dirigiblelabs/arestme/wiki). For those of you who are more of a 'I learn from tests' type, refer to the [test suite](https://github.com/dirigiblelabs/arestme/tree/1.0/arestme/TestCases/arestme) in the project.

## `arestme/http`
The `arestme/http` module is a generic framework that enables the definition of multiple URL resource path endpoints rooted in a single JS scripting service, and mapping resource handlers to requests to them for different HTTP verbs and i/o media types. A resource handler is a function, which is invoked whenever a request matches the resource handling definition to which this function is assigned. The function execution context is the request to its matching resource. The core of the module is a [request controller](https://github.com/dirigiblelabs/arestme/wiki/2.-HttpController) that uses these resource handler definitions to find try to match the current request and invoke its resource handling function on it. In that way, what is left up to you is the concrete REST protocol resources definition and the functions that will handle the supported requests to them.

Here is an example of a REST API that services `GET` requests to its root path, responding with `OK`:
<pre>
require('arestme/http').get()
.addResourceHandler("","get", function(ctx, io){
    io.response.setStatus(io.response.OK);
    io.response.println('OK');
})
.service();
</pre>

In this example we get an instance of the `arestme/http` module controller, next we add a resource handler definition that specifies the resource path, verb and handling function, and finally we invoke servicing of the request.

## `arestme/data_service`
The `arestme/data_service` module leverages the REST API building framework from `arestme/http` to provide resource handling definitions for the [HTTP DataService Protocol](https://github.com/dirigiblelabs/arestme/wiki/6.-HTTP-DataService-Protocol). This protocol is a REST API for managing and querying data records in e.g. a relational database via HTTP (REST) protocol (similar to OData). As resource handling definitions are pre-built based on the protocol specification, the resource handling functions mapped to these definitions are the minimal variable that needs to be provided to make the API functional. In a sense, this framework shifts the design focus from HTTP to data resources.

The framework is built on a defined contract with [handling function](https://github.com/dirigiblelabs/arestme/wiki/5.-HandlersProvider-SPI) providers sharing common interface so different functions can be 'plugged-in' depending on different backend handling needs. There is a [default handler](https://github.com/dirigiblelabs/arestme/wiki/4.-DAOHandlersProvider) that works with DAOs from the [daoism](https://github.com/dirigiblelabs/daoism) project, or functionally equivalent objects (there is no hard dependency to daoism in fact). In this case, all that you need to have a fully functional HTTP DataService protocol enabled service is to supply a dao, which is largely an ORM configuration. Or if you need something more custom, you can provide your own [handler provider](https://github.com/dirigiblelabs/arestme/wiki/5.-HandlersProvider-SPI) with functions that will react to the requests specified in the [HTTP DataService Protocol](https://github.com/dirigiblelabs/arestme/wiki/6.-HTTP-DataService-Protocol).

Here is an example of a data service based on daoism [DAO ORM](https://github.com/dirigiblelabs/daoism/wiki/DAO-ORM-Configuration) definition:
<pre>
var DataService = require('arestme/data_service').DataService;
//we use the daoism library to get us a shiny dao object in fewer lines
var dao = require('daoism/dao').get({
  "dbName": "TBL_A",
  "properties":[{
    "name": "id",
    "dbName": "A_ID",
    "type": "Long",
    "id": true
  }]
});
var dataService = new DataService(dao);
dataService.service();
</pre>

Invoking requests defined in [HTTP DataService Protocol](https://github.com/dirigiblelabs/arestme/wiki/6.-HTTP-DataService-Protocol) to this data service endpoint are now serviced against the data records in table `TBL_A`. For example, a `GET` request to the root path will return an array of JSON formatted objects representing the data records in `TBL_A`.
