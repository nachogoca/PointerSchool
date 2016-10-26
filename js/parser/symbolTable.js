var symbolTable = {};

var free = module.exports.free = function(){
    symbolTable = {};
}

var insert = module.exports.insert = function(key){
    symbolTable[key] = {type: undefined, object: undefined};
}

var setObject = module.exports.setObject = function(key, object){
    symbolTable[key].object = object;
}

var getObject = module.exports.getObject = function(key){
    return symbolTable[key].object;
}

var setType = module.exports.setType = function(key, type){
    symbolTable[key].type = type;
}

var getType = module.exports.getType = function(key){
    return symbolTable[key].type;
}

var lookUpSymbolTable = module.exports.lookUp = function(key){
    return symbolTable.hasOwnProperty(key);
}

var print =  module.exports.print  = function(){
    console.log("Print symbol table.");
    for(key in symbolTable){
        if(symbolTable[key].object === undefined)
            console.log("Key: " + key + ", Object value: undefined, Type: " + symbolTable[key].type);
        else
            console.log("Key: " + key + " Object value: " + symbolTable[key].object.value + " Type: " + symbolTable[key].type);
    }
}