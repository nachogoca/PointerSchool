parserUtils = require('./parserUtils.js');

// List of symbol tables with row number associated.
var symbolTableHistory = [];
var symbolTable = {};

var free = module.exports.free = function(){
    symbolTable = {};
    symbolTableHistory = [];
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

var getSymbolTableHistory = module.exports.getSymbolTableHistory = function(){
    return symbolTableHistory;
}

var saveCurrentState = module.exports.saveCurrentState = function(currentRow){
    symbolTableHistory.push( {table:JSON.parse(JSON.stringify(symbolTable)), line:currentRow - 1} );
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

var hello = module.exports.hello = function(snap){
        var toReturn = "Symbol table: \n";
    for(key in snap){
        if(snap[key].object === undefined){
            toReturn += ("\tKey: " + key + " Object value: undefined, Type: " + snap[key].type + "\n");
        } else if ( Array.isArray(snap[key].object)){
            var arryValue = "\n\t Object value:";
            for(var i = 0; i < snap[key].object.length; i++)
                arryValue += ("\n\t\t " + snap[key].object[i].value);
            toReturn += ("\tKey: " + key + ", " + arryValue + ",\n\t\t Type: " + snap[key].type + "\n");
        } else {
            toReturn += ("\tKey: " + key + " Object value: " + snap[key].object.value + " Type: " + snap[key].type + "\n");
        }
            
    }
    return toReturn;
}