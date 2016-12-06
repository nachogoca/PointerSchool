var symbolTable = require('./symbolTable.js');

var getStructElementValue = module.exports.getStructElementValue = function(structVariableName, elementName){
    var structVariable = symbolTable.getObject(structVariableName);
    return structVariable.value[elementName].value;
}