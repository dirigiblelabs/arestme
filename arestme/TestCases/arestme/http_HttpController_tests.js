/* globals $ */
/* eslint-env node, dirigible */
var HttpController = require('arestme/http').HttpController;
var http = new HttpController()
.addResourceHandlers({
	"":{
		"get": [{
			produces: ['application/json'],
			handler: function(context, io){
				io.response.setStatus(io.response.OK);
				io.response.println('OK');
			}	
		}]
	}
})
.addResourceHandler("{id}","get", function(ctx, io){
	io.response.setStatus(io.response.OK);
	io.response.println(ctx.pathParams.id);
}).addResourceHandler("{id}/{path}","get", function(ctx, io){
	io.response.setStatus(io.response.OK);
	io.response.println(ctx.pathParams.id + '  ' + ctx.pathParams.path);
}).addResourceHandler("error","get", function(ctx, io){
	this.sendError(io.response.BAD_REQUEST, 'sample error response');
});
http.service();
