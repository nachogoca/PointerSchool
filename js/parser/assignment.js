var parserUtils = require('./parserUtils.js');
var symbolTable = require('./symbolTable');

var compoundAssign = module.exports.compoundAssign = function(identifier, operator, tuple){
    if(operator === '=')
        return assign(identifier, tuple);
    else
        throw new TypeError('Assignment operator ' + operator + ' not supported');
    
    
}

var assign = function(identifier, tuple){
    // Check if identifier has already been defined in symbol table
    if(!symbolTable.lookUp(identifier))
        throw new Error('Identifier ' + identifier + ' is not defined.');
    
    // Compare types
    var idType = symbolTable.getType(identifier);
    var tupleType = tuple.type;
    
    if(!isAssignable(idType, tupleType))
        throw new Error('Type ' + parserUtils.getReversedTypeEnum(tupleType) + ' can not be assigned to type ' + parserUtils.getReversedTypeEnum(idType));
    
    // Cast according to type
    var objectToAssign = cast(symbolTable.getType(identifier), tuple);
    
    // Apply assignment operator
    symbolTable.setObject(identifier, tuple);
    return symbolTable.getObject(identifier);
}

// TODO: With more types the cast is more complex
var cast = function(objectiveType, object){
    return parserUtils.generateTuple(object.value, objectiveType);
}

var isAssignable = function(objectiveType , receivedType){
    if(objectiveType === receivedType)
        return true;
    
    if(objectiveType === parserUtils.typeEnum.DOUBLE){
        if(receivedType === parserUtils.typeEnum.INT)
            return true;
    }
    
    return false;
}