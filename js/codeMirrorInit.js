var ansic = require('./parser/ansic.js');

window.onload = function init(){
    
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
    
    CodeMirror.commands.evaluate = function(cm) {
        evaluateText(console, editor.getValue());  
    }
    
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
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
    
    var console = CodeMirror.fromTextArea(document.getElementById("console"), {
        readOnly: true,
        theme: '3024-night',
        mode: 'none'
    });
    
    
}

function evaluateText(consoleWindow, text) {

    
    var ast;
    var a = 3;
    try{
        ast = ansic.parse(text);
        consoleWindow.setValue(ast);
        console.log(ast);
    } catch (exception) {
        consoleWindow.setValue("Parse Error: " + exception.message);
    }
    
}
