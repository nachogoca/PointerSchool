/* lexical grammar */
%{
    var symbolTable;
%}
%lex
%%

[\t\v\n\f\s]+                           /* IGNORE */                                 
"//".*                                  /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     /* IGNORE */

[0-9]+("."[0-9]+)?\b    return 'CONSTANT'

">>="               return 'RIGHT_ASSIGN'
"<<="               return 'LEFT_ASSIGN'
"+="                return 'ADD_ASSIGN'
"-="                return 'SUB_ASSIGN'
"*="                return 'MUL_ASSIGN'
"/="                return 'DIV_ASSIGN'
"%="                return 'MOD_ASSIGN'
"&="                return 'AND_ASSIGN'
"^="                return 'XOR_ASSIGN'
"|="                return 'OR_ASSIGN'
">>"                return 'RIGHT_OP'
"<<"                return 'LEFT_OP'
"++"                return 'INC_OP'
"--"                return 'DEC_OP'
"->"                return 'PTR_OP'
"&&"                return 'AND_OP'
"||"                return 'OR_OP'
"<="                return 'LE_OP'
">="                return 'GE_OP'
"=="                return 'EQ_OP'
"!="                return 'NE_OP'
";"                 return ';'
"{"                 return '{'
"}"                 return '}'
","                 return ','
":"                 return ':'
"="                 return '='
"("                 return '('
")"                 return ')'
"["                 return '['
"]"                 return ']'
"."                 return '.'
"&"                 return '&'
"!"                 return '!'
"~"                 return '~'
"-"                 return '-'
"+"                 return '+'
"*"                 return '*'
"/"                 return '/'
"%"                 return '%'
"<"                 return '<'
">"                 return '>'
"^"                 return '^'
"|"                 return '|'
"?"                 return '?'

"break"             return 'BREAK'
"case"              return 'CASE'
"char"              return 'CHAR'
"continue"          return 'CONTINUE'
"default"           return 'DEFAULT'
"do"                return 'DO'
"double"            return 'DOUBLE'
"else"              return 'ELSE'
"float"             return 'FLOAT'
"for"               return 'FOR'
"if"                return 'IF'
"int"               return 'INT'
"long"              return 'LONG'
"return"            return 'RETURN'
"short"             return 'SHORT'
"signed"            return 'SIGNED'
"sizeof"            return 'SIZEOF'
"struct"            return 'STRUCT'
"switch"            return 'SWITCH'
"typedef"           return 'TYPEDEF'
"union"             return 'UNION'
"unsigned"          return 'UNSIGNED'
"void"              return 'VOID'
"while"             return 'WHILE'

[_a-zA-Z][_a-zA-Z0-9]*  return 'IDENTIFIER' 


\"[^"]+\"               return 'STRING_LITERAL'

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex
%token IDENTIFIER CONSTANT STRING_LITERAL SIZEOF
%token PTR_OP INC_OP DEC_OP LEFT_OP RIGHT_OP LE_OP GE_OP EQ_OP NE_OP
%token AND_OP OR_OP MUL_ASSIGN DIV_ASSIGN MOD_ASSIGN ADD_ASSIGN
%token SUB_ASSIGN LEFT_ASSIGN RIGHT_ASSIGN AND_ASSIGN
%token XOR_ASSIGN OR_ASSIGN

%token TYPEDEF EXTERN STATIC AUTO REGISTER
%token CHAR SHORT INT LONG SIGNED UNSIGNED FLOAT DOUBLE VOID
%token STRUCT UNION ENUM ELLIPSIS

%token CASE DEFAULT IF ELSE SWITCH WHILE DO FOR CONTINUE BREAK RETURN

%nonassoc IF_WITHOUT_ELSE
%nonassoc ELSE

%start start
%%

start
	: translation_unit EOF 
    { 
        return $$; 
    }
	;

primary_expression
	: IDENTIFIER
    {
        $$ = parserUtils.generateTuple($IDENTIFIER, parserUtils.typeEnum.ID);
    }
	| CONSTANT 
    {
        number = Number($CONSTANT);
        // Return pair of value with its type
        // Only int and double are supported
        // TODO Support more types
        if(number % 1 === 0){
            $$ = parserUtils.generateTuple(number, parserUtils.typeEnum.INT);
        } else {
            $$ = parserUtils.generateTuple(number, parserUtils.typeEnum.DOUBLE);
        } 
    }
	| STRING_LITERAL -> [$1]
	| '(' expression ')' -> [$2]
	;

postfix_expression
	: primary_expression -> $1
	| postfix_expression '[' expression ']' -> [$1, $3]
	| postfix_expression '(' ')' -> [$1]
	| postfix_expression '(' argument_expression_list ')' -> [$1, $3]
	| postfix_expression '.' IDENTIFIER -> [$3]
	| postfix_expression PTR_OP IDENTIFIER -> [$1, $2, $3]
	| postfix_expression INC_OP -> [$1, $2]
	| postfix_expression DEC_OP-> [$1, $2]
	;

argument_expression_list
	: assignment_expression -> $1
	| argument_expression_list ',' assignment_expression -> [$1, $2]
	;

unary_expression
	: postfix_expression -> $1
	| INC_OP unary_expression // Not implemented
	| DEC_OP unary_expression // Not implemented
	| unary_operator cast_expression 
	| SIZEOF unary_expression // Not implemented yet
	| SIZEOF '(' type_name ')' // Not implemented yet
	;

unary_operator
	: '&' -> $1
	| '*' -> $1
	| '+' -> $1
	| '-' -> $1
	| '~' -> $1
	| '!' -> $1
	;

cast_expression
	: unary_expression -> $1
	| '(' type_name ')' cast_expression // TODO Implement cast
	;

multiplicative_expression
	: cast_expression -> $1
	| multiplicative_expression '*' cast_expression
    {
        $$ = arithmetic.multiply($multiplicative_expression, $cast_expression);
    }
	| multiplicative_expression '/' cast_expression //TODO nice type checking and tuple formatting
    {
        $$ = arithmetic.divide($multiplicative_expression, $cast_expression);
    }
	| multiplicative_expression '%' cast_expression //TODO nice type checking and tuple formatting
    {
        $$ = arithmetic.mod($multiplicative_expression, $cast_expression);
    }
	;

additive_expression
	: multiplicative_expression -> $1
	| additive_expression '+' multiplicative_expression
    {
        //console.log("Addition found at line " + @1.first_line + ", col" + @1.first_column);
        $$ = arithmetic.add($additive_expression, $multiplicative_expression);
    }
	| additive_expression '-' multiplicative_expression
    {
        $$ = arithmetic.subtract($additive_expression, $multiplicative_expression);
    }
	;

shift_expression
	: additive_expression -> $1
	| shift_expression LEFT_OP additive_expression //TODO
	| shift_expression RIGHT_OP additive_expression //TODO
	;

relational_expression
	: shift_expression -> $1
	| relational_expression '<' shift_expression //TODO
	| relational_expression '>' shift_expression //TODO
	| relational_expression LE_OP shift_expression //TODO
	| relational_expression GE_OP shift_expression //TODO
	;

equality_expression
	: relational_expression -> $1
	| equality_expression EQ_OP relational_expression //TODO
	| equality_expression NE_OP relational_expression //TODO
	;

and_expression
	: equality_expression -> $1 
	| and_expression '&' equality_expression //TODO
	;

exclusive_or_expression
	: and_expression -> $1
	| exclusive_or_expression '^' and_expression //TODO
	;

inclusive_or_expression
	: exclusive_or_expression -> $1 
	| inclusive_or_expression '|' exclusive_or_expression //TODO
	;

logical_and_expression
	: inclusive_or_expression -> $1
	| logical_and_expression AND_OP inclusive_or_expression //TODO
	;

logical_or_expression
	: logical_and_expression -> $1
	| logical_or_expression OR_OP logical_and_expression //TODO
	;

conditional_expression
	: logical_or_expression -> $1
	| logical_or_expression '?' expression ':' conditional_expression //TODO
	;

assignment_expression
	: conditional_expression -> $1
	| unary_expression assignment_operator assignment_expression
    {
        $$ = assignment.compoundAssign($unary_expression, $assignment_operator, $assignment_expression);
    }
	;

assignment_operator
	: '='
/*	| MUL_ASSIGN
	| DIV_ASSIGN
	| MOD_ASSIGN
	| ADD_ASSIGN
	| SUB_ASSIGN
	| LEFT_ASSIGN
	| RIGHT_ASSIGN
	| AND_ASSIGN
	| XOR_ASSIGN
	| OR_ASSIGN 
*/	;

expression
	: assignment_expression -> [$1]
	| expression ',' assignment_expression -> [$1, $2]
	;

constant_expression
	: conditional_expression -> [$1]
	;

declaration
	: declaration_specifiers ';' -> [$1] // Ignore
	| declaration_specifiers init_declarator_list ';' 
    {
        declaration.declareType($init_declarator_list, $declaration_specifiers);
        symbolTable.saveCurrentState(@1.first_line);
		$$ = [$1, $2]
    }
	;

declaration_specifiers
	: type_specifier -> $1
	| type_specifier declaration_specifiers -> [$1, $2] // Not supported
	| storage_class_specifier -> $1
	| storage_class_specifier declaration_specifiers -> [$1, $2] //Not supported
	;

init_declarator_list
	: init_declarator -> $1
//	| init_declarator_list ',' init_declarator -> [$1, $3] // Not supported
	;

init_declarator
	: declarator
    {
        declaration.simpleDeclare($declarator);
        $$ = $declarator;
    }
	| declarator '=' initializer
    {
        declaration.complexDeclare($declarator, $initializer);
        $$ = $declarator;
    }
	;

storage_class_specifier
	: TYPEDEF -> $1
	;

type_specifier
    : TYPE_NAME -> $1
//	| VOID -> [$1]  // Not supported yet
	| CHAR -> $1
//	| SHORT -> [$1] // Not supported yet
	| INT 	-> $1
//	| LONG -> [$1]   // Not supported yet
//	| FLOAT -> [$1]  // Not supported yet
	| DOUBLE -> $1 
//	| SIGNED -> [$1] // Not supported yet
//	| UNSIGNED -> [$1] // Not supported yet
	| struct_or_union_specifier -> $1
//	| enum_specifier -> [$1] // Not supported yet
	;

struct_or_union_specifier
	: struct_or_union IDENTIFIER '{' struct_declaration_list '}' // When declaring a struct
	{
		symbolTable.insert($IDENTIFIER);
		symbolTable.setType($IDENTIFIER, parserUtils.typeEnum.STRUCT_TYPE);
		symbolTable.setObject($IDENTIFIER, $struct_declaration_list);

		symbolTable.saveCurrentState(@1.first_line);
		$$ = [$1, $2, $3]; 
	}
//	| struct_or_union '{' struct_declaration_list '}' -> [$1, $3] // Unnamed structs are not supported
	| struct_or_union IDENTIFIER
	{
		$$ = parserUtils.generateTuple($IDENTIFIER, parserUtils.typeEnum.STRUCT_TYPE);
	}
	;

struct_or_union
	: STRUCT -> $1
//	| UNION -> $1 // Only structs are supported now
	;

struct_declaration_list
	: struct_declaration 
	{
		$$ = [$struct_declaration];
	}
	| struct_declaration_list struct_declaration
	{ 
		$struct_declaration_list.push( $struct_declaration );
		$$ = $struct_declaration_list;	
	}
	;


/*
* Each one of 
*/
struct_declaration
	: specifier_qualifier_list struct_declarator_list ';'  // For example: 'int' 'x' ';'
	{
		if(typeof $specifier_qualifier_list === "string"){
			var normType = parserUtils.typeEnum[$specifier_qualifier_list.toUpperCase()];
			$$ = parserUtils.generateTuple($struct_declarator_list.value, normType);
		} else if( typeof $specifier_qualifier_list === object) {
			$$ = parserUtils.generateTuple($struct_declarator_list.value, $specifier_qualifier_list);
		} else {
			throw new Error("Unknown type " + $specifier_qualifier_list + " in struct declaration");
		}
			
	}
	;

specifier_qualifier_list
	: type_specifier -> $1
//	| type_specifier specifier_qualifier_list  // Not supported
//	{		$$ = $specifier_qualifier_list.push($type_specifier);	}
	;

struct_declarator_list
	: struct_declarator -> $1
//	| struct_declarator_list ',' struct_declarator -> [$1, $3] //Not supported yet. Example case: int x, y;
	;

struct_declarator
	: declarator -> $1
//	| ':' constant_expression -> [$2]
//	| declarator ':' constant_expression -> [$1, $3]
	;

enum_specifier // Not supported
	: ENUM '{' enumerator_list '}' // Not supported
	| ENUM IDENTIFIER '{' enumerator_list '}' // Not supported
	| ENUM IDENTIFIER // Not supported
	;

enumerator_list
	: enumerator // Not supported
	| enumerator_list ',' enumerator // Not supported
	;

enumerator
	: IDENTIFIER // Not supported
	| IDENTIFIER '=' constant_expression // Not supported
	;

declarator
	: pointer direct_declarator -> [$1, $2] //TODO
	| direct_declarator -> $1 //Directly sends tuple of identifier
	;

direct_declarator
	: IDENTIFIER
    {
        $$ = parserUtils.generateTuple($IDENTIFIER, parserUtils.typeEnum.ID);
    }
	| '(' declarator ')'
	| direct_declarator '[' constant_expression ']'
	| direct_declarator '[' ']'
	| direct_declarator '(' parameter_type_list ')'
	| direct_declarator '(' identifier_list ')'
	| direct_declarator '(' ')'
	;

pointer
	: '*' -> [$1]//TODO
	| '*' pointer -> [$1, $2] //TODO
	;

parameter_type_list
	: parameter_list
	| parameter_list ',' ELLIPSIS
	;

parameter_list
	: parameter_declaration
	| parameter_list ',' parameter_declaration
	;

parameter_declaration
	: declaration_specifiers declarator
	| declaration_specifiers abstract_declarator
	| declaration_specifiers
	;

identifier_list
	: IDENTIFIER
	| identifier_list ',' IDENTIFIER
	;

type_name
	: specifier_qualifier_list
	| specifier_qualifier_list abstract_declarator
	;

abstract_declarator
	: pointer -> [$1]
	| direct_abstract_declarator -> [$1]
	| pointer direct_abstract_declarator -> [$1, $2]
	;

direct_abstract_declarator
	: '(' abstract_declarator ')'
	| '[' ']'
	| '[' constant_expression ']'
	| direct_abstract_declarator '[' ']'
	| direct_abstract_declarator '[' constant_expression ']'
	| '(' ')'
	| '(' parameter_type_list ')'
	| direct_abstract_declarator '(' ')'
	| direct_abstract_declarator '(' parameter_type_list ')'
	;

initializer
	: assignment_expression -> $1
	| '{' initializer_list '}' -> [$2]
	| '{' initializer_list ',' '}' -> [$2]
	;

initializer_list
	: initializer -> [$1]
	| initializer_list ',' initializer -> [$1, $3]
	;

statement
	: labeled_statement -> [$1]
	| compound_statement -> [$1]
	| expression_statement -> [$1]
	| selection_statement -> [$1]
	| iteration_statement -> [$1]
	| jump_statement -> [$1]
	;

labeled_statement
	: IDENTIFIER ':' statement -> [$1, $3]
	| CASE constant_expression ':' statement -> [$1, $2, $4]
	| DEFAULT ':' statement -> [$1, $3]
	;

compound_statement
	: '{' '}'
	| '{' statement_list '}' -> [$2]
	| '{' declaration_list '}' -> [$2]
	| '{' declaration_list statement_list '}' -> [$2, $3]
	;

declaration_list
	: declaration ->[$1]
	| declaration_list declaration ->[$1, $2]
	;

statement_list
	: statement -> [$1]
	| statement_list statement -> [$1, $2]
	;

expression_statement
	: ';' -> [$1] //no use
	| expression ';'
    {
        symbolTable.saveCurrentState(@1.first_line);
    }
	;

selection_statement
	: IF '(' expression ')' statement %prec IF_WITHOUT_ELSE
	| IF '(' expression ')' statement ELSE statement
	| SWITCH '(' expression ')' statement
	;

iteration_statement
	: WHILE '(' expression ')' statement
	| DO statement WHILE '(' expression ')' ';'
	| FOR '(' expression_statement expression_statement ')' statement
	| FOR '(' expression_statement expression_statement expression ')' statement
	;

jump_statement
	: CONTINUE ';' -> [$1]
	| BREAK ';' -> [$1]
	| RETURN ';' -> [$1]
	| RETURN expression ';' -> [$1, $2]
	;

translation_unit
	: external_declaration -> [$1]
	| translation_unit external_declaration -> [$1, $2]
	;

external_declaration
	: function_definition -> [$1]
	| declaration -> [$1]
	;

function_definition
	: declaration_specifiers declarator declaration_list compound_statement -> [$1, $2, $3, $4]
	| declaration_specifiers declarator compound_statement -> [$1, $2, $3]
	| declarator declaration_list compound_statement -> [$1, $2, $3]
	| declarator compound_statement -> [$1, $2]
	;
    
    
%% 
var symbolTable = require('./symbolTable.js');
var parserUtils = require('./parserUtils.js');
var arithmetic = require('./arithmetic.js');
var assignment = require('./assignment.js');
var declaration = require('./declaration.js');