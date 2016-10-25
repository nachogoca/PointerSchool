module.exports.debug = function(){
    console.log('exports is of course working');
}

var symbolTable = {};
module.exports.symbolTable = symbolTable;

var typeEnum = {
    INT: 1,
    DOUBLE : 2
};
module.exports.typeEnum = typeEnum;


var clearSymbolTable = function(){
    symbolTable = {};
}
module.exports.clearSymbolTable = clearSymbolTable;

var addInitialSymbolTable = function(key, value){
    symbolTable[key] = value;
}

module.exports.addInitialSymbolTable = addInitialSymbolTable;

var printSymbolTable  = function(){
    console.log("Print symbol table.");
    for(key in symbolTable){
        console.log("Key: " + key + " Value: " + symbolTable[key]);
    }
}

module.exports.printSymbolTable = printSymbolTable;

var generateTuple = function(val, typ){
    return Object.freeze({value: val, type: typ });
}

module.exports.generateTuple = generateTuple;