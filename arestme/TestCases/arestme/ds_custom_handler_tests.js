/* globals $ */
/* eslint-env node, dirigible */
require('log/loggers').setLevel(require('log/levels').LEVELS.ALL);

var data_records = [
	{id:1, text: 'text1'},
	{id:2, text: 'text2'},
	{id:3, text: 'text3'}
];

//Create custom provider with two handlers only, working wiht the data_records array as backend
var HandlersProvider = require('arestme/data_service').HandlersProvider;
var MyProvider = function(){
	HandlersProvider.call(this);
};
MyProvider.prototype = Object.create(HandlersProvider.prototype);

MyProvider.prototype.getHandlers= function(){
	return {
		query: function(ctx, io){
			try{
				io.response.println(JSON.stringify(data_records, null, 2));
			} catch (err){
				console.error(err.message, err);
				this.sendError(500, err.message);
			}
		},
		get: function(ctx, io){
			var entity = data_records.filter(function(record){
				return ''+record.id === ctx.pathParams.id;
			})[0];
			try{
				if(entity)
					io.response.println(JSON.stringify(entity, null, 2));
				else 
					this.sendError(400, 'No data record with id['+ctx.pathParams.id+']')
			} catch (err){
				console.error(err.message, err);
				this.sendError(500, err.message);
			}
		}
	};
};

//Create service using the custom provider
var MyService = function(dao){
	var provider = new MyProvider();
	require('arestme/data_service').DataService.call(this, provider, 'My service');
};
MyService.prototype = Object.create(require('arestme/data_service').DataService.prototype);
MyService.prototype.constructor = MyService;
var svc = new MyService();

var assert = require('core/assert');
try{
	console.info('-------> Test service has standard members injected');
	var members = Object.keys(svc);
	assert.assertTrue(members.indexOf("logger")>-1);
	assert.assertTrue(members.indexOf("_oConfiguration")>-1);	
	assert.assertTrue(members.indexOf("handlers")>-1);	
	assert.assertTrue(members.indexOf("handlersProvider")>-1);		
	assert.assertTrue(members.indexOf("normalizeMediaTypeHeaderValue")>-1);
	assert.assertTrue(members.indexOf("service")>-1);	
} catch(err){
	console.error(err);
}

try{
	console.info('-------> Test installed resource handlers number');
	assert.assertTrue(Object.keys(svc.handlers).length===2, 'Object.keys(svc.handlers).length===2 should be true');
} catch(err){
	console.error(err);
}

try{
	console.info('-------> Test installed resource handlers map');
	var handlersMap = svc.getResourceHandlersMap();
	console.info(Object.keys(handlersMap))
	assert.assertTrue(Object.keys(handlersMap).length===2, 'Object.keys(handlersMap).length===2 should be true');
} catch(err){
	console.error(err);
}

svc.service();