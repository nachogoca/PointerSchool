(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
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

},{"./parser/ansic.js":5}],5:[function(require,module,exports){
(function (process){
/* parser generated by jison 0.4.17 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var ansic = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,19],$V1=[1,20],$V2=[1,18],$V3=[1,12],$V4=[1,13],$V5=[1,14],$V6=[1,15],$V7=[1,16],$V8=[1,22],$V9=[1,23],$Va=[5,7,10,30,74,75,76,77,78,84,85],$Vb=[1,27],$Vc=[1,33],$Vd=[7,10,12,14,22,30,67],$Ve=[12,22,61,63,67,74,75,76,77,78,81,84,85],$Vf=[1,37],$Vg=[1,36],$Vh=[7,10,12,14,22,30,61,67,75,76,77,78,84,85],$Vi=[7,10,12,14,22],$Vj=[10,12,14,22,61,63,67,74,75,76,77,78,81,84,85],$Vk=[7,81],$Vl=[1,44],$Vm=[2,71],$Vn=[5,7,8,9,10,19,24,27,29,30,31,32,33,34,67,74,75,76,77,78,81,83,84,85,111,112,115,117,118,119,120,121,122,123],$Vo=[7,8,9,10,19,24,27,29,30,31,32,33,34,67,74,75,76,77,78,81,83,84,85,111,112,115,117,118,119,120,121,122,123],$Vp=[1,58],$Vq=[1,89],$Vr=[1,90],$Vs=[1,91],$Vt=[1,76],$Vu=[1,77],$Vv=[1,79],$Vw=[1,82],$Vx=[1,83],$Vy=[1,84],$Vz=[1,85],$VA=[1,86],$VB=[1,87],$VC=[1,61],$VD=[1,59],$VE=[1,60],$VF=[1,63],$VG=[1,64],$VH=[1,65],$VI=[1,66],$VJ=[1,67],$VK=[1,68],$VL=[1,69],$VM=[1,70],$VN=[1,105],$VO=[1,122],$VP=[5,7,8,9,10,19,24,27,29,30,31,32,33,34,67,74,75,76,77,78,81,83,84,85,111,112,115,116,117,118,119,120,121,122,123],$VQ=[7,8,9,10,19,24,27,29,30,31,32,33,34,67,81,83,111,112,115,117,118,119,120,121,122,123],$VR=[7,8,9,10,19,24,27,29,30,31,32,33,34,67,81,83,111,112,115,116,117,118,119,120,121,122,123],$VS=[2,2],$VT=[7,8,9,10,12,19,24,27,29,30,31,32,33,34,67,81,83,111,112,115,116,117,118,119,120,121,122,123],$VU=[1,131],$VV=[12,15,22,61,67],$VW=[12,15,22,61,67,83],$VX=[12,15,22,29,30,31,32,36,37,40,41,43,44,45,46,48,49,52,54,56,58,60,61,67,83],$VY=[2,28],$VZ=[12,15,22,29,30,31,32,36,37,40,41,43,44,45,46,48,49,52,54,56,58,60,61,63,67,83],$V_=[1,152],$V$=[12,15,22,58,60,61,67,83],$V01=[1,157],$V11=[10,12,14,15,17,18,19,20,22,29,30,31,32,36,37,40,41,43,44,45,46,48,49,52,54,56,58,60,61,63,67,83],$V21=[7,8,9,10,19,24,27,29,30,31,32,33,34],$V31=[12,15,22,56,58,60,61,67,83],$V41=[1,158],$V51=[12,15,22,54,56,58,60,61,67,83],$V61=[1,162],$V71=[12,15,22,52,54,56,58,60,61,67,83],$V81=[1,163],$V91=[12,15,22,29,52,54,56,58,60,61,67,83],$Va1=[1,164],$Vb1=[1,165],$Vc1=[12,15,22,29,48,49,52,54,56,58,60,61,67,83],$Vd1=[1,166],$Ve1=[1,167],$Vf1=[1,168],$Vg1=[1,169],$Vh1=[12,15,22,29,43,44,45,46,48,49,52,54,56,58,60,61,67,83],$Vi1=[1,170],$Vj1=[1,171],$Vk1=[12,15,22,29,40,41,43,44,45,46,48,49,52,54,56,58,60,61,67,83],$Vl1=[1,172],$Vm1=[1,173],$Vn1=[12,15,22,29,31,32,40,41,43,44,45,46,48,49,52,54,56,58,60,61,67,83],$Vo1=[1,174],$Vp1=[1,175],$Vq1=[1,176],$Vr1=[12,22],$Vs1=[1,186],$Vt1=[1,187],$Vu1=[75,76,77,78,83,84,85],$Vv1=[1,194],$Vw1=[7,10,12,14,30,61],$Vx1=[22,67,83],$Vy1=[1,225],$Vz1=[2,123],$VA1=[1,246],$VB1=[1,245],$VC1=[1,248],$VD1=[22,67],$VE1=[22,83],$VF1=[10,12,14,22];
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"start":3,"translation_unit":4,"EOF":5,"primary_expression":6,"IDENTIFIER":7,"CONSTANT":8,"STRING_LITERAL":9,"(":10,"expression":11,")":12,"postfix_expression":13,"[":14,"]":15,"argument_expression_list":16,".":17,"PTR_OP":18,"INC_OP":19,"DEC_OP-":20,"assignment_expression":21,",":22,"unary_expression":23,"DEC_OP":24,"unary_operator":25,"cast_expression":26,"SIZEOF":27,"type_name":28,"&":29,"*":30,"+":31,"-":32,"~":33,"!":34,"multiplicative_expression":35,"/":36,"%":37,"additive_expression":38,"shift_expression":39,"LEFT_OP":40,"RIGHT_OP":41,"relational_expression":42,"<":43,">":44,"LE_OP":45,"GE_OP":46,"equality_expression":47,"EQ_OP":48,"NE_OP":49,"and_expression":50,"exclusive_or_expression":51,"^":52,"inclusive_or_expression":53,"|":54,"logical_and_expression":55,"AND_OP":56,"logical_or_expression":57,"OR_OP":58,"conditional_expression":59,"?":60,":":61,"assignment_operator":62,"=":63,"constant_expression":64,"declaration":65,"declaration_specifiers":66,";":67,"init_declarator_list":68,"storage_class_specifier":69,"type_specifier":70,"init_declarator":71,"declarator":72,"initializer":73,"TYPEDEF":74,"TYPE_NAME":75,"CHAR":76,"INT":77,"DOUBLE":78,"struct_or_union_specifier":79,"struct_or_union":80,"{":81,"struct_declaration_list":82,"}":83,"STRUCT":84,"UNION":85,"struct_declaration":86,"specifier_qualifier_list":87,"struct_declarator_list":88,"struct_declarator":89,"enum_specifier":90,"ENUM":91,"enumerator_list":92,"enumerator":93,"pointer":94,"direct_declarator":95,"parameter_type_list":96,"identifier_list":97,"parameter_list":98,"ELLIPSIS":99,"parameter_declaration":100,"abstract_declarator":101,"direct_abstract_declarator":102,"initializer_list":103,"statement":104,"labeled_statement":105,"compound_statement":106,"expression_statement":107,"selection_statement":108,"iteration_statement":109,"jump_statement":110,"CASE":111,"DEFAULT":112,"statement_list":113,"declaration_list":114,"IF":115,"ELSE":116,"SWITCH":117,"WHILE":118,"DO":119,"FOR":120,"CONTINUE":121,"BREAK":122,"RETURN":123,"external_declaration":124,"function_definition":125,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",7:"IDENTIFIER",8:"CONSTANT",9:"STRING_LITERAL",10:"(",12:")",14:"[",15:"]",17:".",18:"PTR_OP",19:"INC_OP",20:"DEC_OP-",22:",",24:"DEC_OP",27:"SIZEOF",29:"&",30:"*",31:"+",32:"-",33:"~",34:"!",36:"/",37:"%",40:"LEFT_OP",41:"RIGHT_OP",43:"<",44:">",45:"LE_OP",46:"GE_OP",48:"EQ_OP",49:"NE_OP",52:"^",54:"|",56:"AND_OP",58:"OR_OP",60:"?",61:":",63:"=",67:";",74:"TYPEDEF",75:"TYPE_NAME",76:"CHAR",77:"INT",78:"DOUBLE",81:"{",83:"}",84:"STRUCT",85:"UNION",91:"ENUM",99:"ELLIPSIS",111:"CASE",112:"DEFAULT",115:"IF",116:"ELSE",117:"SWITCH",118:"WHILE",119:"DO",120:"FOR",121:"CONTINUE",122:"BREAK",123:"RETURN"},
productions_: [0,[3,2],[6,1],[6,1],[6,1],[6,3],[13,1],[13,4],[13,3],[13,4],[13,3],[13,3],[13,2],[13,2],[16,1],[16,3],[23,1],[23,2],[23,2],[23,2],[23,2],[23,4],[25,1],[25,1],[25,1],[25,1],[25,1],[25,1],[26,1],[26,4],[35,1],[35,3],[35,3],[35,3],[38,1],[38,3],[38,3],[39,1],[39,3],[39,3],[42,1],[42,3],[42,3],[42,3],[42,3],[47,1],[47,3],[47,3],[50,1],[50,3],[51,1],[51,3],[53,1],[53,3],[55,1],[55,3],[57,1],[57,3],[59,1],[59,5],[21,1],[21,3],[62,1],[11,1],[11,3],[64,1],[65,2],[65,3],[66,1],[66,1],[68,1],[71,1],[71,3],[69,1],[70,1],[70,1],[70,1],[70,1],[70,1],[79,5],[79,4],[79,2],[80,1],[80,1],[82,1],[82,2],[86,3],[87,2],[87,1],[88,1],[88,3],[89,1],[89,2],[89,3],[90,4],[90,5],[90,2],[92,1],[92,3],[93,1],[93,3],[72,2],[72,1],[95,1],[95,3],[95,4],[95,3],[95,4],[95,4],[95,3],[94,1],[94,2],[96,1],[96,3],[98,1],[98,3],[100,2],[100,2],[100,1],[97,1],[97,3],[28,1],[28,2],[101,1],[101,1],[101,2],[102,3],[102,2],[102,3],[102,3],[102,4],[102,2],[102,3],[102,3],[102,4],[73,1],[73,3],[73,4],[103,1],[103,3],[104,1],[104,1],[104,1],[104,1],[104,1],[104,1],[105,3],[105,4],[105,3],[106,2],[106,3],[106,3],[106,4],[114,1],[114,2],[113,1],[113,2],[107,1],[107,2],[108,5],[108,7],[108,5],[109,5],[109,7],[109,6],[109,7],[110,2],[110,2],[110,2],[110,3],[4,1],[4,2],[124,1],[124,1],[125,4],[125,3],[125,3],[125,2]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 /*typeof console !== 'undefined' ? console.log($$[$0-1]) : print($$[$0-1]);*/
        symbolTable.print();
        symbolTable.free();
        return this.$; 
    
break;
case 2: case 103:

        this.$ = parserUtils.generateTuple($$[$0], parserUtils.typeEnum.ID);
    
break;
case 3:

        number = Number($$[$0]);
        // Return pair of value with its type
        // Only int and double are supported
        // TODO Support more types
        if(number % 1 === 0){
            this.$ = parserUtils.generateTuple(number, parserUtils.typeEnum.INT);
        } else {
            this.$ = parserUtils.generateTuple(number, parserUtils.typeEnum.DOUBLE);
        } 
    
break;
case 4: case 10: case 63: case 65: case 82: case 83: case 84: case 88: case 89: case 91: case 92: case 123: case 124: case 138: case 140: case 141: case 142: case 143: case 144: case 145: case 155: case 157: case 170: case 172: case 173:
this.$ = [$$[$0]];
break;
case 5: case 136: case 150: case 151: case 166: case 167: case 168:
this.$ = [$$[$0-1]];
break;
case 6: case 14: case 16: case 22: case 23: case 24: case 25: case 26: case 27: case 30: case 34: case 37: case 40: case 45: case 50: case 54: case 56: case 58: case 60: case 68: case 69: case 70: case 73: case 74: case 75: case 76: case 102: case 135:
this.$ = $$[$0];
break;
case 7: case 9: case 80:
this.$ = [$$[$0-3], $$[$0-1]];
break;
case 8: case 137:
this.$ = [$$[$0-2]];
break;
case 11: case 175: case 176:
this.$ = [$$[$0-2], $$[$0-1], $$[$0]];
break;
case 12: case 81: case 85: case 87: case 101: case 125: case 156: case 171: case 177:
this.$ = [$$[$0-1], $$[$0]];
break;
case 15: case 64: case 152: case 169:
this.$ = [$$[$0-2], $$[$0-1]];
break;
case 28:
this.$ = $$[$0] // Obtain value of identifier;
break;
case 31:

        // Type mismatch
        if($$[$0-2].type !== parserUtils.typeEnum.INT
            && $$[$0-2].type !== parserUtils.typeEnum.DOUBLE)
            throw new TypeError("Arguments of multiplication must be numbers.");
        
        if($$[$0].type !== parserUtils.typeEnum.INT
            && $$[$0].type !== parserUtils.typeEnum.DOUBLE)
            throw new TypeError("Arguments of multiplication must be numbers.");
        
        mul = $$[$0-2].value;
        cast = $$[$0].value;
        
        if(isNaN(mul) || isNaN(cast)){
            throw new TypeError("Arguments of multiplication must be numbers.");
        }
        
        var newType;
        if($$[$0-2].type === parserUtils.typeEnum.INT && $$[$0] === parserUtils.typeEnum.INT)
            newType = parserUtils.typeEnum.INT;
        else
            newType = parserUtils.typeEnum.DOUBLE;
        this.$ = parserUtils.generateTuple(mul * cast, newType); // TODO envolve in tuple
    
break;
case 32:

        if($$[$0-2].type !== parserUtils.typeEnum.INT
            && $$[$0-2].type !== parserUtils.typeEnum.DOUBLE)
            throw new TypeError("Arguments of division must be numbers.");
        
        if($$[$0].type !== parserUtils.typeEnum.INT
            && $$[$0].type !== parserUtils.typeEnum.DOUBLE)
            throw new TypeError("Arguments of division must be numbers.");
        
        mul = $$[$0-2].value;
        cast = $$[$0].value;
        
        if(isNaN(mul) || isNaN(cast)){
            throw new TypeError("Arguments of division must be a valid numbers.");
        }
        
        // If both are integers
        if($$[$0-2].type === parserUtils.typeEnum.INT && $$[$0].type === parserUtils.typeEnum.INT){
            this.$ = parserUtils.generateTuple(~~(mul / cast),parserUtils.typeEnum.INT); //TODO check division by 0
        } else {
            this.$ = parserUtils.generateTuple(mul / cast, parserUtils.typeEnum.DOUBLE);
        }
    
break;
case 33:

        if($$[$0-2].type !== parserUtils.typeEnum.INT)
            throw new TypeError("Arguments of remainder must be integer numbers.");
        
        if($$[$0].type !== parserUtils.typeEnum.INT)
            throw new TypeError("Arguments of remainder must be integer numbers.");
        
        var mul = $$[$0-2].value;
        var cast = $$[$0].value;
        var remainder = mul % cast
        
        if(isNaN(mul) || isNaN(cast) || isNaN(remainder)){
            throw new TypeError("Value of remainder is invalid.");
        }
        
        this.$ = parserUtils.generateTuple(remainder, parserUtils.typeEnum.INT);
    
break;
case 35:

        this.$ = arithmetic.add($$[$0-2], $$[$0]);
    
break;
case 36:

        this.$ = arithmetic.subtract($$[$0-2], $$[$0]);
    
break;
case 48: case 52: case 77:
this.$ = $$[$0] ;
break;
case 61:

        this.$ = assignment.compoundAssign($$[$0-2], $$[$0-1], $$[$0]);
    
break;
case 66:
this.$ = [$$[$0-1]] // Ignore;
break;
case 67:

        declaration.declareType($$[$0-1], $$[$0-2]);
    
break;
case 71:

        declaration.simpleDeclare($$[$0]);
        this.$ = $$[$0];
    
break;
case 72:

        declaration.complexDeclare($$[$0-2], $$[$0]);
        this.$ = $$[$0-2];
    
break;
case 78:
this.$ = [$$[$0]] // Not support yet;
break;
case 79:
this.$ = ["type:struct_or_union_specifier", $$[$0-4], $$[$0-3], $$[$0-2], $$[$0-1], $$[$0]];
break;
case 86:
this.$ =[$$[$0-2], $$[$0-1], $$[$0]];
break;
case 90: case 93: case 139: case 146: case 148:
this.$ = [$$[$0-2], $$[$0]];
break;
case 147:
this.$ = [$$[$0-3], $$[$0-2], $$[$0]];
break;
case 153:
this.$ =[$$[$0]];
break;
case 154:
this.$ =[$$[$0-1], $$[$0]];
break;
case 158:
this.$ = [$$[$0-1], ";"] ;
break;
case 174:
this.$ = [$$[$0-3], $$[$0-2], $$[$0-1], $$[$0]];
break;
}
},
table: [{3:1,4:2,7:$V0,10:$V1,30:$V2,65:5,66:6,69:8,70:9,72:7,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,94:10,95:11,124:3,125:4},{1:[3]},{5:[1,24],7:$V0,10:$V1,30:$V2,65:5,66:6,69:8,70:9,72:7,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,94:10,95:11,124:25,125:4},o($Va,[2,170]),o($Va,[2,172]),o($Va,[2,173]),{7:$V0,10:$V1,30:$V2,67:$Vb,68:28,71:29,72:26,94:10,95:11},{65:32,66:34,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,84:$V8,85:$V9,106:31,114:30},o($Vd,[2,68]),o($Vd,[2,69]),{7:$V0,10:$V1,95:35},o($Ve,[2,102],{10:$Vf,14:$Vg}),o($Vd,[2,73]),o($Vh,[2,74]),o($Vh,[2,75]),o($Vh,[2,76]),o($Vh,[2,77]),o($Vh,[2,78]),o($Vi,[2,110],{94:38,30:$V2}),o($Vj,[2,103]),{7:$V0,10:$V1,30:$V2,72:39,94:10,95:11},{7:[1,40],81:[1,41]},o($Vk,[2,82]),o($Vk,[2,83]),{1:[2,1]},o($Va,[2,171]),{63:$Vl,65:32,66:34,67:$Vm,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,84:$V8,85:$V9,106:43,114:42},o($Vn,[2,66]),{67:[1,45]},{67:[2,70]},{65:47,66:34,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,84:$V8,85:$V9,106:46},o($Va,[2,177]),o($Vo,[2,153]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,65:32,66:34,67:$VC,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,83:[1,48],84:$V8,85:$V9,104:51,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,113:49,114:50,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{7:$V0,10:$V1,30:$V2,67:$Vb,68:28,71:29,72:100,94:10,95:11},o($Ve,[2,101],{10:$Vf,14:$Vg}),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,15:[1,102],19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:101},{7:[1,110],12:[1,108],66:112,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,96:106,97:107,98:109,100:111},o($Vi,[2,111]),{12:[1,113]},o($Vh,[2,81],{81:[1,114]}),{70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,82:115,84:$V8,85:$V9,86:116,87:117},{65:47,66:34,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,84:$V8,85:$V9,106:119},o($Va,[2,175]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:121,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,73:120,81:$VO},o($Vn,[2,67]),o($Va,[2,176]),o($Vo,[2,154]),o($VP,[2,149]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,83:[1,123],104:124,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,65:47,66:34,67:$VC,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,81:$Vc,83:[1,125],84:$V8,85:$V9,104:51,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,113:126,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},o($VQ,[2,155]),o($VR,[2,140]),o($VR,[2,141]),o($VR,[2,142]),o($VR,[2,143]),o($VR,[2,144]),o($VR,[2,145]),o([10,14,17,18,19,20,22,29,30,31,32,36,37,40,41,43,44,45,46,48,49,52,54,56,58,60,63,67],$VS,{61:[1,127]}),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:128},{61:[1,129]},o($VT,[2,157]),{22:$VU,67:[1,130]},{10:[1,132]},{10:[1,133]},{10:[1,134]},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:135,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{10:[1,136]},{67:[1,137]},{67:[1,138]},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:140,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:[1,139]},o($VV,[2,63]),o($VW,[2,60]),o($VX,$VY,{62:141,63:[1,142]}),o($VW,[2,58],{58:[1,144],60:[1,143]}),o($VZ,[2,16],{10:[1,146],14:[1,145],17:[1,147],18:[1,148],19:[1,149],20:[1,150]}),{6:81,7:$VN,8:$Vq,9:$Vr,10:$V_,13:75,19:$Vt,23:151,24:$Vu,25:78,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{6:81,7:$VN,8:$Vq,9:$Vr,10:$V_,13:75,19:$Vt,23:153,24:$Vu,25:78,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:154,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{6:81,7:$VN,8:$Vq,9:$Vr,10:[1,156],13:75,19:$Vt,23:155,24:$Vu,25:78,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},o($V$,[2,56],{56:$V01}),o($V11,[2,6]),o($V21,[2,22]),o($V21,[2,23]),o($V21,[2,24]),o($V21,[2,25]),o($V21,[2,26]),o($V21,[2,27]),o($V31,[2,54],{54:$V41}),o($V11,[2,3]),o($V11,[2,4]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:159,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,28:160,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,87:161},o($V51,[2,52],{52:$V61}),o($V71,[2,50],{29:$V81}),o($V91,[2,48],{48:$Va1,49:$Vb1}),o($Vc1,[2,45],{43:$Vd1,44:$Ve1,45:$Vf1,46:$Vg1}),o($Vh1,[2,40],{40:$Vi1,41:$Vj1}),o($Vk1,[2,37],{31:$Vl1,32:$Vm1}),o($Vn1,[2,34],{30:$Vo1,36:$Vp1,37:$Vq1}),o($VX,[2,30]),{63:$Vl,67:$Vm},{15:[1,177]},o($Vj,[2,106]),o([15,22,61,67],[2,65]),o($VZ,$VY),o($V11,$VS),{12:[1,178]},{12:[1,179],22:[1,180]},o($Vj,[2,109]),{12:[2,112],22:[1,181]},o($Vr1,[2,119]),o($Vr1,[2,114]),o($Vr1,[2,118],{95:11,72:182,101:183,94:184,102:185,7:$V0,10:$Vs1,14:$Vt1,30:$V2}),o($Vj,[2,104]),{70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,82:188,84:$V8,85:$V9,86:116,87:117},{70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,83:[1,189],84:$V8,85:$V9,86:190,87:117},o($Vu1,[2,84]),{7:$V0,10:$V1,30:$V2,61:$Vv1,72:193,88:191,89:192,94:10,95:11},o($Vw1,[2,88],{79:17,80:21,70:118,87:195,75:$V4,76:$V5,77:$V6,78:$V7,84:$V8,85:$V9}),o($Va,[2,174]),{67:[2,72]},o($Vx1,[2,135]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:121,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,73:197,81:$VO,103:196},o($VP,[2,150]),o($VQ,[2,156]),o($VP,[2,151]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,83:[1,198],104:124,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:199,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{61:[1,200]},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:201,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},o($VT,[2,158]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:202,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:203,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:204,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:205,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{118:[1,206]},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,107:207},o($VR,[2,166]),o($VR,[2,167]),o($VR,[2,168]),{22:$VU,67:[1,208]},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:209,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},o($V21,[2,62]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:210,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:211},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:212,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,12:[1,213],13:75,16:214,19:$Vt,21:215,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{7:[1,216]},{7:[1,217]},o($V11,[2,12]),o($V11,[2,13]),o($VZ,[2,17]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:159,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},o($VZ,[2,18]),o($VZ,[2,19]),o($VZ,[2,20]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:159,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,28:218,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,87:161},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:219},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:220},{12:[1,221],22:$VU},{12:[1,222]},{10:$Vy1,12:[2,121],14:$Vt1,30:$V2,94:224,101:223,102:185},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:226},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:227},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:228},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:229},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:230},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:231},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:232},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:233},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:234},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:235},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:236},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:237},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:238,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:239,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:240,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},o($Vj,[2,105]),o($Vj,[2,107]),o($Vj,[2,108]),{7:[1,241]},{66:112,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,99:[1,242],100:243},o($Vr1,[2,116]),o($Vr1,[2,117]),o($Vr1,$Vz1,{95:35,102:244,7:$V0,10:$Vs1,14:$Vt1}),o($Vr1,[2,124],{10:$VA1,14:$VB1}),{7:$V0,10:$Vs1,12:$VC1,14:$Vt1,30:$V2,66:112,69:8,70:9,72:39,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,94:184,95:11,96:249,98:109,100:111,101:247,102:185},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,15:[1,250],19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:251},{70:118,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,83:[1,252],84:$V8,85:$V9,86:190,87:117},o($Vh,[2,80]),o($Vu1,[2,85]),{22:[1,254],67:[1,253]},o($VD1,[2,89]),o($VD1,[2,91],{61:[1,255]}),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:256},o($Vw1,[2,87]),{22:[1,258],83:[1,257]},o($VE1,[2,138]),o($VP,[2,152]),o($VR,[2,146]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:259,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},o($VR,[2,148]),o($VV,[2,64]),{12:[1,260],22:$VU},{12:[1,261],22:$VU},{12:[1,262],22:$VU},{10:[1,263]},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,107:264},o($VR,[2,169]),o($VW,[2,61]),{22:$VU,61:[1,265]},o($V$,[2,57],{56:$V01}),{15:[1,266],22:$VU},o($V11,[2,8]),{12:[1,267],22:[1,268]},o($Vr1,[2,14]),o($V11,[2,10]),o($V11,[2,11]),{12:[1,269]},o($V31,[2,55],{54:$V41}),o($V51,[2,53],{52:$V61}),o($V11,[2,5]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:270,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB},{12:[2,122]},{10:$Vy1,12:$Vz1,14:$Vt1,102:244},{10:$Vy1,12:$VC1,14:$Vt1,30:$V2,66:112,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,94:224,96:249,98:109,100:111,101:247,102:185},o($V71,[2,51],{29:$V81}),o($V91,[2,49],{48:$Va1,49:$Vb1}),o($Vc1,[2,46],{43:$Vd1,44:$Ve1,45:$Vf1,46:$Vg1}),o($Vc1,[2,47],{43:$Vd1,44:$Ve1,45:$Vf1,46:$Vg1}),o($Vh1,[2,41],{40:$Vi1,41:$Vj1}),o($Vh1,[2,42],{40:$Vi1,41:$Vj1}),o($Vh1,[2,43],{40:$Vi1,41:$Vj1}),o($Vh1,[2,44],{40:$Vi1,41:$Vj1}),o($Vk1,[2,38],{31:$Vl1,32:$Vm1}),o($Vk1,[2,39],{31:$Vl1,32:$Vm1}),o($Vn1,[2,35],{30:$Vo1,36:$Vp1,37:$Vq1}),o($Vn1,[2,36],{30:$Vo1,36:$Vp1,37:$Vq1}),o($VX,[2,31]),o($VX,[2,32]),o($VX,[2,33]),o($Vr1,[2,120]),{12:[2,113]},o($Vr1,[2,115]),o($Vr1,[2,125],{10:$VA1,14:$VB1}),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,15:[1,271],19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:272},{12:[1,273],66:112,69:8,70:9,74:$V3,75:$V4,76:$V5,77:$V6,78:$V7,79:17,80:21,84:$V8,85:$V9,96:274,98:109,100:111},{12:[1,275]},o($VF1,[2,131]),{12:[1,276]},o($VF1,[2,127]),{15:[1,277]},o($Vh,[2,79]),o($Vu1,[2,86]),{7:$V0,10:$V1,30:$V2,61:$Vv1,72:193,89:278,94:10,95:11},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:103,64:279},o($VD1,[2,92]),o($Vx1,[2,136]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:121,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,73:281,81:$VO,83:[1,280]},o($VR,[2,147]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:282,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:283,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:284,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:285,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,11:287,12:[1,286],13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,23:104,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:288},o($V11,[2,7]),o($V11,[2,9]),{6:81,7:$VN,8:$Vq,9:$Vr,10:$Vs,13:75,19:$Vt,21:289,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72},o($VZ,[2,21]),o($VZ,[2,29]),o($VF1,[2,129]),{15:[1,290]},o($VF1,[2,133]),{12:[1,291]},o($VF1,[2,126]),o($VF1,[2,132]),o($VF1,[2,128]),o($VD1,[2,90]),o($VD1,[2,93]),o($Vx1,[2,137]),o($VE1,[2,139]),o($VQ,[2,159],{116:[1,292]}),o($VR,[2,161]),o($VR,[2,162]),{12:[1,293],22:$VU},{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:294,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{12:[1,295],22:$VU},o($VW,[2,59]),o($Vr1,[2,15]),o($VF1,[2,130]),o($VF1,[2,134]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:296,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},{67:[1,297]},o($VR,[2,164]),{6:81,7:$Vp,8:$Vq,9:$Vr,10:$Vs,11:62,13:75,19:$Vt,21:71,23:73,24:$Vu,25:78,26:99,27:$Vv,29:$Vw,30:$Vx,31:$Vy,32:$Vz,33:$VA,34:$VB,35:98,38:97,39:96,42:95,47:94,50:93,51:92,53:88,55:80,57:74,59:72,67:$VC,81:$Vc,104:298,105:52,106:53,107:54,108:55,109:56,110:57,111:$VD,112:$VE,115:$VF,117:$VG,118:$VH,119:$VI,120:$VJ,121:$VK,122:$VL,123:$VM},o($VR,[2,160]),o($VR,[2,163]),o($VR,[2,165])],
defaultActions: {24:[2,1],29:[2,70],120:[2,72],223:[2,122],242:[2,113]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        function _parseError (msg, hash) {
            this.message = msg;
            this.hash = hash;
        }
        _parseError.prototype = Error;

        throw new _parseError(str, hash);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

    var symbolTable;
 
var symbolTable = require('./symbolTable.js');
var parserUtils = require('./parserUtils.js');
var arithmetic = require('./arithmetic.js');
var assignment = require('./assignment.js');
var declaration = require('./declaration.js');/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* IGNORE */                                 
break;
case 1:/* IGNORE */
break;
case 2:/* IGNORE */
break;
case 3:return 8
break;
case 4:return 'RIGHT_ASSIGN'
break;
case 5:return 'LEFT_ASSIGN'
break;
case 6:return 'ADD_ASSIGN'
break;
case 7:return 'SUB_ASSIGN'
break;
case 8:return 'MUL_ASSIGN'
break;
case 9:return 'DIV_ASSIGN'
break;
case 10:return 'MOD_ASSIGN'
break;
case 11:return 'AND_ASSIGN'
break;
case 12:return 'XOR_ASSIGN'
break;
case 13:return 'OR_ASSIGN'
break;
case 14:return 41
break;
case 15:return 40
break;
case 16:return 19
break;
case 17:return 24
break;
case 18:return 18
break;
case 19:return 56
break;
case 20:return 58
break;
case 21:return 45
break;
case 22:return 46
break;
case 23:return 48
break;
case 24:return 49
break;
case 25:return 67
break;
case 26:return 81
break;
case 27:return 83
break;
case 28:return 22
break;
case 29:return 61
break;
case 30:return 63
break;
case 31:return 10
break;
case 32:return 12
break;
case 33:return 14
break;
case 34:return 15
break;
case 35:return 17
break;
case 36:return 29
break;
case 37:return 34
break;
case 38:return 33
break;
case 39:return 32
break;
case 40:return 31
break;
case 41:return 30
break;
case 42:return 36
break;
case 43:return 37
break;
case 44:return 43
break;
case 45:return 44
break;
case 46:return 52
break;
case 47:return 54
break;
case 48:return 60
break;
case 49:return 122
break;
case 50:return 111
break;
case 51:return 76
break;
case 52:return 121
break;
case 53:return 112
break;
case 54:return 119
break;
case 55:return 78
break;
case 56:return 116
break;
case 57:return 'FLOAT'
break;
case 58:return 120
break;
case 59:return 115
break;
case 60:return 77
break;
case 61:return 'LONG'
break;
case 62:return 123
break;
case 63:return 'SHORT'
break;
case 64:return 'SIGNED'
break;
case 65:return 27
break;
case 66:return 84
break;
case 67:return 117
break;
case 68:return 74
break;
case 69:return 85
break;
case 70:return 'UNSIGNED'
break;
case 71:return 'VOID'
break;
case 72:return 118
break;
case 73:return 7 
break;
case 74:return 9
break;
case 75:return 5
break;
case 76:return 'INVALID'
break;
}
},
rules: [/^(?:[\t\v\n\f\s]+)/,/^(?:\/\/.*)/,/^(?:[\/][*][^*]*[*]+([^\/*][^*]*[*]+)*[\/])/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:>>=)/,/^(?:<<=)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:%=)/,/^(?:&=)/,/^(?:\^=)/,/^(?:\|=)/,/^(?:>>)/,/^(?:<<)/,/^(?:\+\+)/,/^(?:--)/,/^(?:->)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:<=)/,/^(?:>=)/,/^(?:==)/,/^(?:!=)/,/^(?:;)/,/^(?:\{)/,/^(?:\})/,/^(?:,)/,/^(?::)/,/^(?:=)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\.)/,/^(?:&)/,/^(?:!)/,/^(?:~)/,/^(?:-)/,/^(?:\+)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:<)/,/^(?:>)/,/^(?:\^)/,/^(?:\|)/,/^(?:\?)/,/^(?:break\b)/,/^(?:case\b)/,/^(?:char\b)/,/^(?:continue\b)/,/^(?:default\b)/,/^(?:do\b)/,/^(?:double\b)/,/^(?:else\b)/,/^(?:float\b)/,/^(?:for\b)/,/^(?:if\b)/,/^(?:int\b)/,/^(?:long\b)/,/^(?:return\b)/,/^(?:short\b)/,/^(?:signed\b)/,/^(?:sizeof\b)/,/^(?:struct\b)/,/^(?:switch\b)/,/^(?:typedef\b)/,/^(?:union\b)/,/^(?:unsigned\b)/,/^(?:void\b)/,/^(?:while\b)/,/^(?:[_a-zA-Z][_a-zA-Z0-9]*)/,/^(?:"[^"]+")/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = ansic;
exports.Parser = ansic.Parser;
exports.parse = function () { return ansic.parse.apply(ansic, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this,require('_process'))
},{"./arithmetic.js":6,"./assignment.js":7,"./declaration.js":8,"./parserUtils.js":9,"./symbolTable.js":10,"_process":3,"fs":1,"path":2}],6:[function(require,module,exports){
var parserUtils = require('./parserUtils.js');


var add = function(operand1, operand2){
    
    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of addition");
    }
    
    // Calculate return type
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT)
        resultType = parserUtils.typeEnum.INT;
    else
        resultType = parserUtils.typeEnum.DOUBLE;
    
    return parserUtils.generateTuple(op1Val + op2Val, resultType);
    
}

module.exports.add = add;


var subtract = function(operand1, operand2){
    
    // Assure correct type of arguments
    if(operand1.type !== parserUtils.typeEnum.INT
        && operand1.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    if(operand2.type !== parserUtils.typeEnum.INT
        && operand2.type !== parserUtils.typeEnum.DOUBLE)
        throw new TypeError("Arguments of addition must be numbers");
    
    var op1Val = operand1.value;
    var op2Val = operand2.value;
    
    
    if(isNaN(op1Val) || isNaN(op2Val)){
        throw new TypeError("Invalid arguments of addition");
    }
    
    // Calculate return type
    var resultType;
    if(operand1.type === parserUtils.typeEnum.INT && operand2.type ===  parserUtils.typeEnum.INT)
        resultType = parserUtils.typeEnum.INT;
    else
        resultType = parserUtils.typeEnum.DOUBLE;
    
    return parserUtils.generateTuple(op1Val - op2Val, resultType);
    
}

module.exports.subtract = subtract;

},{"./parserUtils.js":9}],7:[function(require,module,exports){
var parserUtils = require('./parserUtils.js');
var symbolTable = require('./symbolTable');

var compoundAssign = module.exports.compoundAssign = function(identifier, operator, tuple){
    if(operator === '=')
        return assign(identifier, tuple);
    else
        throw new TypeError('Assignment operator ' + operator + ' not supported');
    
    
}

var assign = function(identifier, tuple){
    // Check if identifier has already been defined in symbol table
    if(!symbolTable.lookUp(identifier))
        throw new Error('Identifier ' + identifier + ' is not defined.');
    
    // Compare types
    var idType = symbolTable.getType(identifier);
    var tupleType = tuple.type;
    
    if(!isAssignable(idType, tupleType))
        throw new Error('Type ' + parserUtils.getReversedTypeEnum(tupleType) + ' can not be assigned to type ' + parserUtils.getReversedTypeEnum(idType));
    
    // Cast according to type
    var objectToAssign = cast(symbolTable.getType(identifier), tuple);
    
    // Apply assignment operator
    symbolTable.setObject(identifier, tuple);
    return symbolTable.getObject(identifier);
}

// TODO: With more types the cast is more complex
var cast = function(objectiveType, object){
    return parserUtils.generateTuple(object.value, objectiveType);
}

var isAssignable = module.exports.isAssignable = function(objectiveType , receivedType){
    if(objectiveType === receivedType)
        return true;
    
    if(objectiveType === parserUtils.typeEnum.DOUBLE){
        if(receivedType === parserUtils.typeEnum.INT)
            return true;
    }
    
    return false;
}
},{"./parserUtils.js":9,"./symbolTable":10}],8:[function(require,module,exports){
symbolTable = require('./symbolTable.js');
assignment = require('./assignment.js');

simpleDeclare = module.exports.simpleDeclare = function(declarator){
    if(symbolTable.lookUp(declarator.value)){
        symbolTable.free();
        throw new Error('Multiple definition of ' + declarator.value);
    }
    
    symbolTable.insert(declarator.value);
}

complexDeclare = module.exports.complexDeclare = function(declarator, initializer){
    
    simpleDeclare(declarator);
    symbolTable.setObject(declarator.value, initializer);
}

declareType = module.exports.declareType = function(declarator, type){
    var normType = parserUtils.typeEnum[type.toUpperCase()];
    
    // Declarator has no object assigned
    var objectAssigned = symbolTable.getObject(declarator.value);
    
    if(objectAssigned === undefined){
        symbolTable.setType(declarator.value, normType);
        
        return;
    }
    
    // Check if type can be assigned
    if(!assignment.isAssignable(normType, objectAssigned.type)){
        symbolTable.free();
        throw new TypeError('Type ' + parserUtils.getReversedTypeEnum(objectAssigned.type) + 
                           ' can not be assigned to type ' + normType);
    }
        
    symbolTable.setType(declarator.value, normType);
}
},{"./assignment.js":7,"./symbolTable.js":10}],9:[function(require,module,exports){
var typeEnum = module.exports.typeEnum = {
    INT: 1,
    DOUBLE: 2,
    ID: 3
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
},{}],10:[function(require,module,exports){
parserUtils = require('./parserUtils.js');

var symbolTable = {};

var free = module.exports.free = function(){
    symbolTable = {};
}

var insert = module.exports.insert = function(key){
    symbolTable[key] = {type: undefined, object: undefined};
}

var setObject = module.exports.setObject = function(key, object){
    symbolTable[key].object = object;
}

var getObject = module.exports.getObject = function(key){
    return symbolTable[key].object;
}

var setType = module.exports.setType = function(key, type){
    symbolTable[key].type = type;
}

var getType = module.exports.getType = function(key){
    return symbolTable[key].type;
}

var lookUpSymbolTable = module.exports.lookUp = function(key){
    return symbolTable.hasOwnProperty(key);
}

var print =  module.exports.print  = function(){
    console.log("Print symbol table.");
    for(key in symbolTable){
        if(symbolTable[key].object === undefined)
            console.log("Key: " + key + ", Object value: undefined, Type: " + symbolTable[key].type);
        else
            console.log("Key: " + key + " Object value: " + symbolTable[key].object.value + " Type: " + symbolTable[key].type);
    }
}
},{"./parserUtils.js":9}]},{},[4]);
