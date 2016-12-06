var parserUtils = require('./parserUtils.js');
var symbolTable = require('./symbolTable.js');
var struct = require('./struct.js');


var add = module.exports.add = function(operand1, operand2){
    
    // Convert identifiers to its value
    if(operand1.type === parserUtils.typeEnum.ID)
        operand1 = symbolTable.getObject(operand1.value);
    
    if(operand2.type === parserUtils.typeEnum.ID)
        operand2 = symbolTable.getObject(operand2.value);
    
    if(operand1.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand1 = struct.getStructElementValue(operand1.structVariable, operand1.structMember);
    
    if(operand2.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand2 = struct.getStructElementValue(operand2.structVariable, operand2.structMember);
    

    console.log(operand1);
    console.log(operand2);

    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of addition");
    }
    
    // Calculate return type
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT)
        resultType = parserUtils.typeEnum.INT;
    else
        resultType = parserUtils.typeEnum.DOUBLE;
    
    return parserUtils.generateTuple(op1Val + op2Val, resultType);
    
}

var subtract = module.exports.subtract = function(operand1, operand2){
    
    if(operand1.type === parserUtils.typeEnum.ID)
        operand1 = symbolTable.getObject(operand1.value);
    
    if(operand2.type === parserUtils.typeEnum.ID)
        operand2 = symbolTable.getObject(operand2.value);
    
    if(operand1.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand1 = struct.getStructElementValue(operand1.structVariable, operand1.structMember);
    
    if(operand2.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand2 = struct.getStructElementValue(operand2.structVariable, operand2.structMember);

    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of addition");
    }
    
    // Calculate return type
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT)
        resultType = parserUtils.typeEnum.INT;
    else
        resultType = parserUtils.typeEnum.DOUBLE;
    
    return parserUtils.generateTuple(op1Val - op2Val, resultType);
    
}

var multiply = module.exports.multiply = function(operand1, operand2){
    
    // Convert identifiers to its value
    if(operand1.type === parserUtils.typeEnum.ID)
        operand1 = symbolTable.getObject(operand1.value);
    
    if(operand2.type === parserUtils.typeEnum.ID)
        operand2 = symbolTable.getObject(operand2.value);
    
    if(operand1.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand1 = struct.getStructElementValue(operand1.structVariable, operand1.structMember);
    
    if(operand2.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand2 = struct.getStructElementValue(operand2.structVariable, operand2.structMember);


    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of multiplication must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of multiplication must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of multiplication");
    }
    
    // Calculate return type
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT)
        resultType = parserUtils.typeEnum.INT;
    else
        resultType = parserUtils.typeEnum.DOUBLE;
    
    return parserUtils.generateTuple(op1Val * op2Val, resultType);
}

// TODO: Division by 0
var divide = module.exports.divide = function(operand1, operand2){
    
    // Convert identifiers to its value
    if(operand1.type === parserUtils.typeEnum.ID)
        operand1 = symbolTable.getObject(operand1.value);
    
    if(operand2.type === parserUtils.typeEnum.ID)
        operand2 = symbolTable.getObject(operand2.value);
    
    if(operand1.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand1 = struct.getStructElementValue(operand1.structVariable, operand1.structMember);
    
    if(operand2.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand2 = struct.getStructElementValue(operand2.structVariable, operand2.structMember);


    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of division must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of division must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of division");
    }
    
    // Calculate return type
    var resultDivision;
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT){
        resultDivision = ~~(op1Val / op2Val);
        resultType = parserUtils.typeEnum.INT;
    } else {
        resultDivision = op1Val / op2Val;
        resultType = parserUtils.typeEnum.DOUBLE;
    }
    
    return parserUtils.generateTuple(resultDivision, resultType);
}

var mod = module.exports.mod = function(operand1, operand2){
    // Convert identifiers to its value
    if(operand1.type === parserUtils.typeEnum.ID)
        operand1 = symbolTable.getObject(operand1.value);
    
    if(operand2.type === parserUtils.typeEnum.ID)
        operand2 = symbolTable.getObject(operand2.value);
    
    if(operand1.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand1 = struct.getStructElementValue(operand1.structVariable, operand1.structMember);
    
    if(operand2.type === parserUtils.typeEnum.STRUCT_ELEMENT)
        operand2 = struct.getStructElementValue(operand2.structVariable, operand2.structMember);

    if(operand1.type !== parserUtils.typeEnum.INT)
            throw new TypeError("Arguments of remainder must be integer numbers.");
        
    if(operand2.type !== parserUtils.typeEnum.INT)
            throw new TypeError("Arguments of remainder must be integer numbers.");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    var modulus = op1Val % op2Val;
        
    if(isNaN(op1Val) || isNaN(op2Val) || isNaN(modulus)){
        throw new TypeError("Value of remainder is invalid.");
    }
    
    return parserUtils.generateTuple(modulus, parserUtils.typeEnum.INT);
}