/* globals $ */
/* eslint-env node, dirigible */
require('log/loggers').setLevel(require('log/levels').LEVELS.ALL);

var orm2 = {
	dbName: 'TBL_B',
	properties: [{
		name: 'id',
		dbName: 'B_ID',
		type: 'Long',
		required: true,
		id: true,
	},{
		name: 'text',
		dbName: 'B_TEXT',
		type: 'String'
	},{
		name: 'baId',
		dbName: 'BA_ID',
		type: 'Long'
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
		type: 'Long',
		required: true,
		id: true,
	},{
		name: 'text',
		dbName: 'A_TEXT',
		type: 'String'
	}],
	associations: [{
		name: 'rel1',
		targetDao: function(){return testDAO2;},
		joinKey: "baId",
		type: "one-to-many",
	}]
};
var testDAO1= require('daoism/dao').get(orm1);
testDAO1.list = function(){
	return [{id:1, text:'a'}, {id:2, text:'b'}, {id:3, text:'c'}];
};
testDAO1.find = function(id){
	return this.list().filter(function(a){ return ''+a.id===id;})[0];
};

// Create data service with two handlers based on readonly dao, exposing only the two coresponding functions, and working with custom backend.
var DataService = require('arestme/data_service').DataService;

console.info('----> Test data service based on dao, featuring two standard methods only (list, find) working with custom backend');
try{
	testDAO1.dropTable();
} catch(err){
}

testDAO1.createTable();

try{
	new DataService(testDAO1).service();
} finally {
	testDAO1.dropTable();
}
