var ansic = require('./parser/ansic.js');
var raphael = require('./graphics/graphics.js');
var symbolTable = require('./parser/symbolTable.js');
var execution = require('./execution.js');

/* Graphic elements */
var editor;
var externalConsole;


window.onload = function init(){
    
    /* Graphic library init */
    raphael.init();
    
    /* Codemirror autocomplete init */
    
    function passAndHint(cm) {
        setTimeout(function() {cm.execCommand("autocomplete");}, 100);
      	return CodeMirror.Pass;
    }
      
    function myHint(cm) {
     	return CodeMirror.showHint(cm, CodeMirror.ternHint, {async: true}); 
    }
     
    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, myHint);
    }
    
    /* Code mirror init */
    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        theme: 'eclipse',
        mode: 'text/x-csrc',
        matchBrackets: true,
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-Enter": "evaluate"
        }
    });
    
    externalConsole = CodeMirror.fromTextArea(document.getElementById("console"), {
        readOnly: true,
        theme: '3024-night',
        mode: 'none'
    });
    
    
    /* Buttons init */
    document.getElementById("visualize").onclick = visualizeExecution;
    document.getElementById("back").onclick = stepBack;
    document.getElementById("forward").onclick = stepForward;
    document.getElementById("edit").onclick = editCode;
    
    /* Execution init, enter edit mode and clean canvas */
    editCode();
    
}

visualizeExecution = function(){
    var execSuccesful = evaluateText(externalConsole, editor.getValue());
    if(execSuccesful) {
        execution.enterVisualMode();
        
        /* Change buttons state */
        document.getElementById("visualize").disabled = true;
        document.getElementById("back").disabled = true;
        document.getElementById("forward").disabled = false;
        document.getElementById("edit").disabled = false;
        
        /* Disable editor */
        editor.setOption("readOnly", "nocursor");
        
        
        
    }   
}

stepBack = function(){
    if(!execution.isOnEditMode())
        execution.decrementStep();
    
    /* TODO */
    /* Draw current step */
    /* Move line in editor */
}

stepForward = function(){
    if(!execution.isOnEditMode()){
        var symTableHist = symbolTable.getSymbolTableHistory();
        
        
        if(execution.getCurrentStep() >= symTableHist.length){
            document.getElementById("forward").disabled = true;
            return;
        }
        
        var currentStep = execution.getCurrentStep();
        var symTableSnapshot = symTableHist[currentStep];
        
        console.log(symTableSnapshot);
        externalConsole.setValue(symbolTable.hello(symTableSnapshot.table));
        editor.setCursor(symTableSnapshot.line); 
        /* Draw */
        
        execution.incrementStep();
    }
}

editCode = function(){
    /* Erase canvas */
    execution.enterEditMode();
    document.getElementById("visualize").disabled = false;
    document.getElementById("back").disabled = true;
    document.getElementById("forward").disabled = true;
    document.getElementById("edit").disabled = true;
    
    /* Enable editor */
    editor.setOption("readOnly", false);
}


function evaluateText(consoleWindow, text) {
    
    var ast;
    try{
        symbolTable.free();
        ast = ansic.parse(text);
        console.log(symbolTable.getSymbolTableHistory());
        consoleWindow.setValue("Compilation success.");
    } catch (exception) {
        consoleWindow.setValue("Parse Error: " + exception.message);
        return false;
    }
    
    return true;
}
