var typeEnum = module.exports.typeEnum = {
    INT: 1,
    DOUBLE: 2,
    ID: 3,
    STRUCT_TYPE : 4,
    STRUCT_DECLARATION_LIST : 5
};

var getReversedTypeEnum = module.exports.getReversedTypeEnum = function(typeNumber){
    for(var key in typeEnum){
        if(typeEnum[key] === typeNumber)
            return key;
    }
    
    throw new Error("Type number not found.");
}

var generateTuple = module.exports.generateTuple = function(val, typ){
    return Object.freeze({value: val, type: typ });
}