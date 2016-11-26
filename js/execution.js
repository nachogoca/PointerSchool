var editMode;
var step;

enterEditMode = module.exports.enterEditMode = function(){
    editMode = true;
    step = -1;
}

enterVisualMode = module.exports.enterVisualMode = function(){
    editMode = false;
    step = -1;
}

incrementStep = module.exports.incrementStep = function(){
    ++step;
}

decrementStep = module.exports.decementStep = function(){
    --step;
}

isOnEditMode = module.exports.isOnEditMode = function(){
    return editMode;
}

getCurrentStep = module.exports.getCurrentStep = function(){
    return step;
}