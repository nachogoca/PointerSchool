var paper = {};
var temporalSymbolTable = {};

module.exports.init = function(){
    paper = Raphael(document.getElementById("paper"), 0,0);
}

updateSymbolTable = module.exports.updateSymbolTable = function(updatedSymbolTable){
    temporalSymbolTable = updateSymbolTable;
    draw();
}

draw = module.exports.draw = function(){
    // get temporal symbol table and draw it
    //var rect1 = paper.rect(20,20,100,100).attr({fill: "blue"});
}

                