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
    
    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "clike",
        matchBrackets: true
    });
    
    var console = CodeMirror.fromTextArea(document.getElementById("console"), {
        readOnly: true,
        theme: '3024-night'
    });
    
    editor.on("change", function(){
        console.setValue(editor.getValue());
        document.getElementById('console').textContent = editor.getValue();
    });
    
    editor.setOption("extraKeys", {
        "Ctrl-Space": "autocomplete"
    });
    
    
}