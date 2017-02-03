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

TODO: description of DAOService
