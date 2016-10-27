var parserUtils = require('./parserUtils.js');


var add = module.exports.add = function(operand1, operand2){
    
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
    
}