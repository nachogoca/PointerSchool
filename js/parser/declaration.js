symbolTable = require('./symbolTable.js');
assignment = require('./assignment.js');

/* 
* Receives an identifier, wrapped in a tuple with value and type elements.
* The identifier represents the name of a variable declared without initialization.
* E.g. int a;   declarator -> a
*/ 
simpleDeclare = module.exports.simpleDeclare = function(declarator){
    if(symbolTable.lookUp(declarator.value)){
        symbolTable.free();
        throw new Error('Multiple definition of ' + declarator.value);
    }
    
    symbolTable.insert(declarator.value);
}

/* 
* Receives an identifier, wrapped in a tuple with value and type elements,
* and an initializer, also wrapped.
* The identifier represents the name of a variable initialized with 'initializer'
* E.g. int a = 3;   declarator -> a , initializer -> 3
*/ 
complexDeclare = module.exports.complexDeclare = function(declarator, initializer){
    
    simpleDeclare(declarator);
    
    // Convert identifiers to its value
    if(initializer.type === parserUtils.typeEnum.ID)
        initializer = symbolTable.getObject(initializer.value);
    
    symbolTable.setObject(declarator.value, initializer);
}

/*
* Receives an identifier and a type. Both wrapped in a tuple with value and type elements. See parserUtils.
* Set type to the identifier in symbol table.
* Because of grammar structure, initialization of value with variable occurs first.
* Therefore type should be checked.
* In case of struct type, all members should be initialized with undefined value.
*/
declareType = module.exports.declareType = function(declarator, type){
    
    console.log("Declaration.Declare type. Declarator:" + declarator + ", type:" + type);

    // Send to struct initialization. Type is not yet assigned.
    if(type.type == parserUtils.typeEnum.STRUCT_TYPE){
        var members = initializeStruct(declarator, type);
        symbolTable.setObject(declarator.value, members);
    }

    // Declarator has no object assigned
    var objectAssigned = symbolTable.getObject(declarator.value);
    
    if(objectAssigned === undefined){
        symbolTable.setType(declarator.value, type);
        return;
    }
    
    // Check if type can be assigned
    if(!assignment.isAssignable(type.type, objectAssigned.type)){
        console.log("Type is not assignable");
        console.log("Intended type:");
        console.log(type.type);
        console.log("Variable type:");
        console.log(objectAssigned.type);
        symbolTable.free();
        throw new TypeError('Type ' + parserUtils.getReversedTypeEnum(objectAssigned.type) + 
                           ' can not be assigned to type ' + parserUtils.getReversedTypeEnum(type.type));
    }
    
    symbolTable.setType(declarator.value, type);
    
}

/* 
*   Initializes a struct in the symbol table. 
*   All members of struct have undefined value.
*   The value property of a struct variable is a hashmap of tuples, 
*   with value and type.
*/
initializeStruct = function(structDeclarator, structType){
    var structMembersInitialized = {};

    // Get struct members from original struct specification
    var structMembersPrototype =  symbolTable.getObject(structType.value);
    
    for(var i = 0; i < structMembersPrototype.length; i++){
        var structProtoMember = structMembersPrototype[i];

        // TODO Consider struct case
        // TODO Consider pointer case
        var initializedMember = parserUtils.generateTuple(undefined, structProtoMember.type);
        structMembersInitialized[structProtoMember.value] = initializedMember;
    }

    return parserUtils.generateTuple(structMembersInitialized, parserUtils.typeEnum.STRUCT_TYPE);
}