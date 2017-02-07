/* globals $ */
/* eslint-env node, dirigible */
var orm2 = {
	dbName: 'TBL_B',
	properties: [{
		name: 'id',
		dbName: 'B_ID',
		required: true,
		id: true,
	},{
		name: 'text',
		dbName: 'B_TEXT'
	},{
		name: 'baId',
		dbName: 'BA_ID',
	}]
};
var testDAO2 = require('daoism/dao').get(orm2);
testDAO2.list = function(){
	return [{id:1, text:'b'}];
};

var orm1 = {
	dbName: 'TBL_A',
	properties: [{
		name: 'id',
		dbName: 'A_ID',
		required: true,
		id: true,
	},{
		name: 'text',
		dbName: 'A_TEXT'
	}],
	associationSets: {
		rel1: {
			dao: function(){return testDAO2;},
			joinKey: "baId",
			associationType: "one-to-many",
		}
	}
};
var testDAO1= require('daoism/dao').get(orm1);
testDAO1.list = function(){
	return [{id:1, text:'a'}];
};
testDAO1.find = function(id){
	return {id:1, text:'a'};//this.list().filter(function(a){ return a.id===id;})[0];
};

require('log/loggers').setLevel(6)

var HandlersProvider = require('arestme/data_service').HandlersProvider;
var MyProvider = function(){
	HandlersProvider.call(this);
};
MyProvider.prototype = Object.create(HandlersProvider.prototype);
MyProvider.prototype.getHandlers= function(){
	return {
		query: function(){console.info('I am in query');},
		get: function(){console.info('I am in get');}
	};
};
var provider = new MyProvider();
var MyService1 = function(dao){
	require('arestme/data_service').DataService.call(this, provider, 'My service');
};
MyService1.prototype = Object.create(require('arestme/data_service').DataService.prototype);
var svc1 = new MyService1();
var assert = require('core/assert');
try{
	var members = Object.keys(svc1);
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
	assert.assertTrue(Object.keys(svc1.handlers).length===2);
} catch(err){
	console.error(err);
}

try{
	var handlersMap = svc1.getResourceHandlersMap();
	assert.assertTrue(Object.keys(handlersMap).length===2);
} catch(err){
	console.error(err);
}


console.info(JSON.stringify(svc1.getResourceHandlersMap(), null, 2))
svc1.service();
//daoService.service();
//as class extensions (todo: move in naother file - at most one service() call per execution
var MyService = function(dao){
	require('arestme/data_service').DataService.call(this, dao , 'My service');
};
MyService.prototype = Object.create(require('arestme/data_service').DataService.prototype);
var svc = new MyService(testDAO1);

console.info(JSON.stringify(svc.getResourceHandlersMap(), null, 2));

svc.service();
