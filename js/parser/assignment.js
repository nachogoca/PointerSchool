var parserUtils = require('./parserUtils.js');
var symbolTable = require('./symbolTable');

var compoundAssign = module.exports.compoundAssign = function(identifier, operator, tuple){
    if(operator === '=')
        return assign(identifier, tuple);
    else
        throw new TypeError('Assignment operator ' + operator + ' not supported');
    
    
}

var assign = function(receiver, tuple){

    if(receiver.type == parserUtils.typeEnum.STRUCT_ELEMENT){
        assignStructElement(receiver, tuple);
        return tuple;
    }

    // Check if receiver has already been defined in symbol table
    if(!symbolTable.lookUp(receiver.value))
        throw new Error('Identifier ' + receiver.value + ' is not defined.');
    
    // If it is an receiver, convert to its value
    if(tuple.type === parserUtils.typeEnum.ID)
        tuple = symbolTable.getObject(tuple.value);
    
    // Compare types
    var idType = symbolTable.getType(receiver.value);
    var tupleType = tuple.type;
    
    if(!isAssignable(idType.type, tupleType))
        throw new Error('Type ' + parserUtils.getReversedTypeEnum(tupleType) + ' can not be assigned to type ' + parserUtils.getReversedTypeEnum(idType));
    
    // Cast according to type
    var objectToAssign = cast(symbolTable.getType(receiver.value), tuple);
    
    // Apply assignment operator
    symbolTable.setObject(receiver.value, tuple);
    return symbolTable.getObject(receiver.value);
}

var assignStructElement = function(receiver, exprToAssign){
    console.log("assignStructElement");
    console.log(receiver);
    console.log(exprToAssign);
    var structObject = symbolTable.getObject(receiver.structVariable);
    console.log(structObject);

    if(structObject === undefined)
        throw new Error("Undefined structure variable: " + receiver.structVariable);
    
    if(! structObject.value.hasOwnProperty(receiver.structMember))
        throw new Error("Undefined member " + receiver.structMember + " of structure " + receiver.structVariable );

    var memberPrototypeType = structObject.value[receiver.structMember].type;

    if(!isAssignable(memberPrototypeType.type, exprToAssign.type))
        throw new Error("Mismatch type in assignment of member " + receiver.structMember  + " of structure " + receiver.structVariable  );

    structObject.value[receiver.structMember] = parserUtils.generateTuple(exprToAssign, memberPrototypeType) ;
    symbolTable.setObject(receiver.structVariable, structObject);
    console.log(structObject);
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