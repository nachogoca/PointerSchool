(function() {
    var templates = {
        "name": "clike",
        "context": "clike",
        "templates": [{
            "name": "struct",
            "description": "A structure is an object of a sequence of named members of various types.",
            "template": "struct ${structName} {\n\t${type} ${variableName};\n}${cursor}"
        },{
            "name": "struct",
            "description": "A structure is an object of a sequence of named members of various types.",
            "template": "struct ${structName} {\n\t${type} ${variableName};\n\tstruct ${otherStructName}* ${reference};\n}${cursor}"
        },{
            "name": "typedef",
            "description": "Creates new data type names.",
            "template": "typedef ${definedDataType} ${NewName};${cursor}"
        },{
            "name": "typedef",
            "description": "Creates a synonym for a struct.",
            "template": "typedef struct ${structName} ${NewName};${cursor}"
        },{
            "name": "typedef",
            "description": "Creates a synonym for a struct pointer.",
            "template": "typedef struct ${structName}* ${NewPtrName};${cursor}"
        },{
            "name": "for",
            "description": "iterate over array",
            "template": "for (int ${index} = 0; ${index} < ${LIMIT}; ${index}++) {\n\t${line_selection}${cursor}\n}"
        },{
            "name": "for",
            "description": "iterate over array",
            "template": "for (int ${index} = 0; ${index} < ${LIMIT}; ${index}++) {\n\t${line_selection}${cursor}\n}"
        }, {
            "name": "do",
            "description": "do while statement",
            "template": "do {\n\t${line_selection}${cursor}\n} while (${condition});"
        }, {
            "name": "while",
            "description": "while loop with condition",
            "template": "while (${condition}) {\n\t${line_selection}${cursor}\n}"
        }, {
            "name": "switch",
            "description": "switch case statement",
            "template": "switch (${key}) {\n\tcase ${value}:\n\t\t${cursor}\n\t\tbreak;\n\n\tdefault:\n\t\tbreak;\n}"
        }, {
            "name": "if",
            "description": "if statement",
            "template": "if (${condition}) {\n\t${line_selection}${cursor}\n}"
        }, {
            "name": "ifelse",
            "description": "if else statement",
            "template": "if (${condition}) {\n\t${cursor}\n} else {\n\t\n}"
        }, {
            "name": "elseif",
            "description": "else if block",
            "template": "else if (${condition}) {\n\t${cursor}\n}"
        }, {
            "name": "else",
            "description": "else block",
            "template": "else {\n\t${cursor}\n}"
        }, {
            "name": "function",
            "description": "function",
            "template": "${returnType} ${name}(${paramType} ${param}) {\n\t${cursor}\n}"
        }, {
            "name": "malloc",
            "description": "Obtains blocks of memory dynamically.",
            "template": "${PtrType} ${prtName} = (${PtrType}) malloc( sizeof( struct ${structName} ) );${cursor}"
        }]
    };
    CodeMirror.templatesHint.addTemplates(templates);
})();