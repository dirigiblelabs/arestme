# arestme
Utility library for quick and flexible enabling of REST service endpoints mapped to functional handlers.
The minimal and basic functionality is provided by the HttpController class. 

Here's a simple example:
<pre>
var HttpController = require('arestme/http').HttpController;
var http = new HttpController()
.addResourceHandler("","get", function(ctx, io){
	io.response.setStatus(io.response.OK);
	io.response.println('OK');
})
http.service();
</pre>

What happens here is that we add a resource handler for the root path of the service ('/'), HTTP verb GET. GET Requests recieved on this path will be served by the function supplied as third argument, and it will send HTTP code 200 and response body 'OK' back to the requesting party. Finally, we service the request with http.service();
Resource path templates are also supported:
<pre>
var http = new HttpController()
.addResourceHandler("{id}","get", function(ctx, io){
	io.response.setStatus(io.response.OK);
	io.response.println(ctx.pathParams.id);
})
</pre>
The path parameter names are provided in curly braces. They are made available to the handling function in the ctx parameter. In the example above we have a template path with one parameter {id}. To get the resolved value of the parameter, the handler function refers to ctx.pathParams by the parameter name: ctx.pathParams.id. You can define longer tempalte paths with multiple parameters, all of which will be available resolved ot the current request path in ctx. pathParams by name: "{id}/path/{another}".
There is a convenience function sendError that your handlers can use to handle errors. It deals with the different options of reporting errors depending on the agent and automaticall closing the repsonse for you. The response is generallly automatically closed for you. An example use of sendErrror is the following:
<pre>
var http = new HttpController()
.addResourceHandler("error","get", function(ctx, io){
	this.sendError(io.response.INTERNAL_SERVER_ERROR, 'sample error response');
})
</pre>
If the http controller didn't find a matching resource handler for a given request it responds with HTTP code 400 BAD REQUEST.
You can opt to add multiple resource handlers at once with the addResourceHandlers method:
<pre>
var http = new HttpController()
.addResourceHandlers({
	"":{
		"get": {
			produces: ['application/json'],
			handler: function(context, io){
				io.response.setStatus(io.response.OK);
				io.response.println('OK');
			}	
		}
	}
})
</pre>
Notice that here we also specified that our resource handler produces 'application/json' media type. The controller will look for Accepts header in the request that matches this media type and will resolve a match only if it finds one. Similiarly it handles a specification for consumed media type by resource handlers (e.g. by POST verb handlers) but it looks for matching Content-Type header instead. The produces and consumes specifications can be provided as the last arguments of the addResourceHanlder method too.
When the controller finds multiple handler mathches to the same request, they are wheighed and the most specific wins. For example the request path '1/abcd' will match both resource specifications '{id}/{name}' and '{id}/abcd' and the handler for the second one, being more specific, wins. 


Data Services

While HttpController enables you to design REST Services 'in the wild', DataService extends it to introduce some hygene and actually define a REST protocol for handlng backend data via HTTP, similiar to what OData does. It levereges the core mechanism in HttpController to map HTTP resources to function handlers and provides its own resource specification for that, which constitutes the HTTP Data Protocol definition. You can still take advantage of the HttpController's built-in extensibility and add your own resource handler definitions, or redefine and remove the default ones. On this stage we rather refer to them rather as 'default' than 'standard' and do not restrict changes in them. As far as the data protocol is concerned, the handlers for the defined resources are mapped to standard functions, provided by a HandlersProvider. If you wnated to implement a specific data access protocol, you could provide your own HandlerProvider to a DataService to effectively specify your own resource handling functions. Or you could achieve the same by overwriting the handler function in a resource handler definition. DataService will take as first parameter in its constructor either a HandlerProvider or a (daoism/dao)DAO-like object. The latter is actually used by the default HandlerProvider (DefaultHandlerProvider), which happens to be designed to work smoothly with DAOs produced by the daoism library or objects with similiar structure. There is no hard dpeendency between the two projects apart from that, i.e. no type checking or so.

<pre>
var DataService = require('arestme/data_service').DataService;
//we use the daoism library to get us a shiny dao object in fewer lines
var dao = require('daoism/dao').get({
  dbName: "TBL_A",
  properties:[{
    name: "id",
    dbName: "A_ID",
    id: true,
    required: true
  }]
});
var dataService = new DataService(dao);
dataService.service();
</pre>
Once we construct a new instance of DataService we've got ourselves a REST service API that knows how to query(list), find, create, update, remove and count the persistent entities mapped by the dao. That takes us one step further at actually mapping sql statements and result sets (or whatever you implemented in your HanldersProvider) to HTTP requests and payload entities.
DataService will install the standard endpoint resource path and the mapped handlers and also take care to add resource paths and handlers for each association defined by the wrapped dao.

Why not OData compliant implementation?

First of all, we borrowed some concepts from OData already, the ones that we liked and we felt absolutely necessary. But instead of blindly aiming at comliance with OData, we prefer to add features on on-demand basis. While we certainly take into account how they are relaized in OData we may not necessarily follow the same path, should there be better alternatives the way we see it. Maybe one day we will be close enough to make DataService compliant or start a project that levereges it in that direction, but right now that's not a goal on its own for us.
