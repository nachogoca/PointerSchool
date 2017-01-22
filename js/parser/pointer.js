var symbolTable = require('./symbolTable');
var parserUtils = require('./parserUtils.js');

// Obtain the value of a pointer
var getValue = module.exports.getValue = function(pointer){
	console.log('pointer:getvalue');
	console.log(pointer);
	var accessedObject = symbolTable.getObject(pointer.value);
	var accessedType = symbolTable.getType(accessedObject);
	console.log(accessedType);
	console.log('endpointer');
	return parserUtils.generateTuple(accessedObject, parserUtils.typeEnum.ID);	
}
