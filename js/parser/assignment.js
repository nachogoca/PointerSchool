var parserUtils = require('./parserUtils.js');
var symbolTable = require('./symbolTable');
var structManager = require('./struct.js');

var compoundAssign = module.exports.compoundAssign = function(identifier, operator, tuple){
    if(operator === '=')
        return assign(identifier, tuple);
    else
        throw new TypeError('Assignment operator ' + operator + ' not supported');  
}

var assign = function(receiver, tuple){
	console.log('assign function');
	console.log('receiver');
	console.log(receiver);
	console.log('tuple');
	console.log(tuple);

    // If it is an identifier, convert to its value
    if(tuple.type === parserUtils.typeEnum.ID)
        tuple = symbolTable.getObject(tuple.value);
    
    if(tuple.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        tuple = structManager.getStructElementValue(tuple.structVariable, tuple.structMember);

    if(receiver.type == parserUtils.typeEnum.STRUCT_ELEMENT){
        assignStructElement(receiver, tuple);
        return tuple;
    }

    if(tuple.type == parserUtils.typeEnum.ADDRESS_TYPE){
        assignPointer(receiver, tuple);
        return symbolTable.getObject(receiver.value);
    }

    // Check if receiver has already been defined in symbol table
    if(!symbolTable.lookUp(receiver.value))
        throw new Error('Identifier ' + receiver.value + ' is not defined.');

    // Compare types
    var idType = symbolTable.getType(receiver.value);
    var tupleType = tuple.type;
   
	console.log(tuple);

    if(!isAssignable(idType.type, tupleType)){
	    console.log(idType);
	    console.log(tupleType);
	    throw new Error('Type ' + tupleType + ' can not be assigned to type ' + idType);
    }	
    
    // Cast according to type
    var objectToAssign = cast(symbolTable.getType(receiver.value), tuple);
    
    // Apply assignment operator
    symbolTable.setObject(receiver.value, tuple);
    return symbolTable.getObject(receiver.value);
}

var assignStructElement = function(receiver, exprToAssign){
    var structObject = symbolTable.getObject(receiver.structVariable);

    if(structObject === undefined)
        throw new Error("Undefined structure variable: " + receiver.structVariable);
    
    if(! structObject.value.hasOwnProperty(receiver.structMember))
        throw new Error("Undefined member " + receiver.structMember + " of structure " + receiver.structVariable );

    var memberPrototypeType = structObject.value[receiver.structMember].type;

    // If it is an identifier, convert to its value
    if(exprToAssign.type === parserUtils.typeEnum.ID)
        exprToAssign = symbolTable.getObject(exprToAssign.value);

    if(!isAssignable(memberPrototypeType.type, exprToAssign.type))
        throw new Error("Mismatch type in assignment of member " + receiver.structMember  + " of structure " + receiver.structVariable  );

    structObject.value[receiver.structMember] = parserUtils.generateTuple(exprToAssign, memberPrototypeType) ;
    symbolTable.setObject(receiver.structVariable, structObject);
}

var assignPointer = function(receiver, exprToAssign){
    symbolTable.setObject(receiver.value, exprToAssign.value.value);
}

// TODO: With more types the cast is more complex
var cast = module.exports.cast = function(objectiveType, object){
    return parserUtils.generateTuple(object.value, objectiveType);
}

var isAssignable = module.exports.isAssignable = function(objectiveType , receivedType){
    if(objectiveType === receivedType)
        return true;
    
    if(objectiveType === parserUtils.typeEnum.DOUBLE){
        if(receivedType === parserUtils.typeEnum.INT)
            return true;
    }
    
    return false;
}
