window.onload = function init(){
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
    
    
    
}