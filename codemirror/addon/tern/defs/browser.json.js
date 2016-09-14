(function() {
var def = {
  "!name": "browser",
  "!define": {
    "canvas.context2d": {
      "canvas": "+Element",
      "width": "number",
      "height": "number",
      "commit": "fn()",
      "save": "fn()",
      "restore": "fn()",
      "currentTransform": "?",
      "scale": "fn(x: number, y: number)",
      "rotate": "fn(angle: number)",
      "translate": "fn(x: number, y: number)",
      "transform": "fn(a: number, b: number, c: number, d: number, e: number, f: number)",
      "setTransform": "fn(a: number, b: number, c: number, d: number, e: number, f: number)",
      "resetTransform": "fn()",
      "globalAlpha": "number",
      "globalCompositeOperation": "string",
      "imageSmoothingEnabled": "bool",
      "strokeStyle": "string",
      "fillStyle": "string",
      "createLinearGradient": "fn(x0: number, y0: number, x1: number, y1: number) -> ?",
      "createPattern": "fn(image: ?, repetition: string) -> ?",
      "shadowOffsetX": "number",
      "shadowOffsetY": "number",
      "shadowBlur": "number",
      "shadowColor": "string",
      "clearRect": "fn(x: number, y: number, w: number, h: number)",
      "fillRect": "fn(x: number, y: number, w: number, h: number)",
      "strokeRect": "fn(x: number, y: number, w: number, h: number)",
      "fillRule": "string",
      "fill": "fn()",
      "beginPath": "fn()",
      "stroke": "fn()",
      "clip": "fn()",
      "resetClip": "fn()",
      "measureText": "fn(text: string) -> ?",
      "drawImage": "fn(image: ?, dx: number, dy: number)",
      "createImageData": "fn(sw: number, sh: number) -> ?",
      "getImageData": "fn(sx: number, sy: number, sw: number, sh: number) -> ?",
      "putImageData": "fn(imagedata: ?, dx: number, dy: number)",
      "lineWidth": "number",
      "lineCap": "string",
      "lineJoin": "string",
      "miterLimit": "number",
      "setLineDash": "fn(segments: [number])",
      "getLineDash": "fn() -> [number]",
      "lineDashOffset": "number",
      "font": "string",
      "textAlign": "string",
      "textBaseline": "string",
      "direction": "string",
      "closePath": "fn()",
      "moveTo": "fn(x: number, y: number)",
      "lineTo": "fn(x: number, y: number)",
      "quadraticCurveTo": "fn(cpx: number, cpy: number, x: number, y: number)",
      "bezierCurveTo": "fn(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number)",
      "arcTo": "fn(x1: number, y1: number, x2: number, y2: number, radius: number)",
      "rect": "fn(x: number, y: number, w: number, h: number)",
      "arc": "fn(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: bool)",
      "ellipse": "fn(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: bool)"
    }
  },
  "location": {
    "assign": {
      "!type": "fn(url: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Load the document at the provided URL."
    },
    "replace": {
      "!type": "fn(url: string)",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Replace the current document with the one at the provided URL. The difference from the assign() method is that after using replace() the current page will not be saved in session history, meaning the user won't be able to use the Back button to navigate to it."
    },
    "reload": {
      "!type": "fn()",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "Reload the document from the current URL. forceget is a boolean, which, when it is true, causes the page to always be reloaded from the server. If it is false or not specified, the browser may reload the page from its cache."
    },
    "origin": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The origin of the URL."
    },
    "hash": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The part of the URL that follows the # symbol, including the # symbol."
    },
    "search": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The part of the URL that follows the ? symbol, including the ? symbol."
    },
    "pathname": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The path (relative to the host)."
    },
    "port": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The port number of the URL."
    },
    "hostname": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The host name (without the port number or square brackets)."
    },
    "host": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The host name and port number."
    },
    "protocol": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The protocol of the URL."
    },
    "href": {
      "!type": "string",
      "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
      "!doc": "The entire URL."
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.location",
    "!doc": "Returns a location object with information about the current location of the document. Assigning to the location property changes the current page to the new address."
  },
  "Node": {
    "!type": "fn()",
    "prototype": {
      "parentElement": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.parentElement",
        "!doc": "Returns the DOM node's parent Element, or null if the node either has no parent, or its parent isn't a DOM Element."
      },
      "textContent": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.textContent",
        "!doc": "Gets or sets the text content of a node and its descendants."
      },
      "baseURI": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.baseURI",
        "!doc": "The absolute base URI of a node or null if unable to obtain an absolute URI."
      },
      "localName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.localName",
        "!doc": "Returns the local part of the qualified name of this node."
      },
      "prefix": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.prefix",
        "!doc": "Returns the namespace prefix of the specified node, or null if no prefix is specified. This property is read only."
      },
      "namespaceURI": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.namespaceURI",
        "!doc": "The namespace URI of the node, or null if the node is not in a namespace (read-only). When the node is a document, it returns the XML namespace for the current document."
      },
      "ownerDocument": {
        "!type": "+Document",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.ownerDocument",
        "!doc": "The ownerDocument property returns the top-level document object for this node."
      },
      "attributes": {
        "!type": "+NamedNodeMap",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.attributes",
        "!doc": "A collection of all attribute nodes registered to the specified node. It is a NamedNodeMap,not an Array, so it has no Array methods and the Attr nodes' indexes may differ among browsers."
      },
      "nextSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nextSibling",
        "!doc": "Returns the node immediately following the specified one in its parent's childNodes list, or null if the specified node is the last node in that list."
      },
      "previousSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.previousSibling",
        "!doc": "Returns the node immediately preceding the specified one in its parent's childNodes list, null if the specified node is the first in that list."
      },
      "lastChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lastChild",
        "!doc": "Returns the last child of a node."
      },
      "firstChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.firstChild",
        "!doc": "Returns the node's first child in the tree, or null if the node is childless. If the node is a Document, it returns the first node in the list of its direct children."
      },
      "childNodes": {
        "!type": "+NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.childNodes",
        "!doc": "Returns a collection of child nodes of the given element."
      },
      "parentNode": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.parentNode",
        "!doc": "Returns the parent of the specified node in the DOM tree."
      },
      "nodeType": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeType",
        "!doc": "Returns an integer code representing the type of the node."
      },
      "nodeValue": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeValue",
        "!doc": "Returns or sets the value of the current node."
      },
      "nodeName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeName",
        "!doc": "Returns the name of the current node as a string."
      },
      "tagName": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.nodeName",
        "!doc": "Returns the name of the current node as a string."
      },
      "insertBefore": {
        "!type": "fn(newElt: +Element, before: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.insertBefore",
        "!doc": "Inserts the specified node before a reference element as a child of the current node."
      },
      "replaceChild": {
        "!type": "fn(newElt: +Element, oldElt: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.replaceChild",
        "!doc": "Replaces one child node of the specified element with another."
      },
      "removeChild": {
        "!type": "fn(oldElt: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.removeChild",
        "!doc": "Removes a child node from the DOM. Returns removed node."
      },
      "appendChild": {
        "!type": "fn(newElt: +Element) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.appendChild",
        "!doc": "Adds a node to the end of the list of children of a specified parent node. If the node already exists it is removed from current parent node, then added to new parent node."
      },
      "hasChildNodes": {
        "!type": "fn() -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.hasChildNodes",
        "!doc": "Returns a Boolean value indicating whether the current Node has child nodes or not."
      },
      "cloneNode": {
        "!type": "fn(deep: bool) -> +Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.cloneNode",
        "!doc": "Returns a duplicate of the node on which this method was called."
      },
      "normalize": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.normalize",
        "!doc": "Puts the specified node and all of its subtree into a \"normalized\" form. In a normalized subtree, no text nodes in the subtree are empty and there are no adjacent text nodes."
      },
      "isSupported": {
        "!type": "fn(features: string, version: number) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isSupported",
        "!doc": "Tests whether the DOM implementation implements a specific feature and that feature is supported by this node."
      },
      "hasAttributes": {
        "!type": "fn() -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.hasAttributes",
        "!doc": "Returns a boolean value of true or false, indicating if the current element has any attributes or not."
      },
      "lookupPrefix": {
        "!type": "fn(uri: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lookupPrefix",
        "!doc": "Returns the prefix for a given namespaceURI if present, and null if not. When multiple prefixes are possible, the result is implementation-dependent."
      },
      "isDefaultNamespace": {
        "!type": "fn(uri: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isDefaultNamespace",
        "!doc": "Accepts a namespace URI as an argument and returns true if the namespace is the default namespace on the given node or false if not."
      },
      "lookupNamespaceURI": {
        "!type": "fn(uri: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.lookupNamespaceURI",
        "!doc": "Takes a prefix and returns the namespaceURI associated with it on the given node if found (and null if not). Supplying null for the prefix will return the default namespace."
      },
      "removeEventListener": {
        "!type": "fn(type: string, listener: fn(), capture: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.removeEventListener",
        "!doc": "Allows the removal of event listeners from the event target."
      },
      "isSameNode": {
        "!type": "fn(other: +Node) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isSameNode",
        "!doc": "Tests whether two nodes are the same, that is they reference the same object."
      },
      "isEqualNode": {
        "!type": "fn(other: +Node) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.isEqualNode",
        "!doc": "Tests whether two nodes are equal."
      },
      "compareDocumentPosition": {
        "!type": "fn(other: +Node) -> number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.compareDocumentPosition",
        "!doc": "Compares the position of the current node against another node in any other document."
      },
      "contains": {
        "!type": "fn(other: +Node) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Node.contains",
        "!doc": "Indicates whether a node is a descendent of a given node."
      },
      "dispatchEvent": {
        "!type": "fn(event: +Event) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.dispatchEvent",
        "!doc": "Dispatches an event into the event system. The event is subject to the same capturing and bubbling behavior as directly dispatched events."
      },
      "ELEMENT_NODE": "number",
      "ATTRIBUTE_NODE": "number",
      "TEXT_NODE": "number",
      "CDATA_SECTION_NODE": "number",
      "ENTITY_REFERENCE_NODE": "number",
      "ENTITY_NODE": "number",
      "PROCESSING_INSTRUCTION_NODE": "number",
      "COMMENT_NODE": "number",
      "DOCUMENT_NODE": "number",
      "DOCUMENT_TYPE_NODE": "number",
      "DOCUMENT_FRAGMENT_NODE": "number",
      "NOTATION_NODE": "number",
      "DOCUMENT_POSITION_DISCONNECTED": "number",
      "DOCUMENT_POSITION_PRECEDING": "number",
      "DOCUMENT_POSITION_FOLLOWING": "number",
      "DOCUMENT_POSITION_CONTAINS": "number",
      "DOCUMENT_POSITION_CONTAINED_BY": "number",
      "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC": "number"
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Node",
    "!doc": "A Node is an interface from which a number of DOM types inherit, and allows these various types to be treated (or tested) similarly."
  },
  "Element": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype",
      "getAttribute": {
        "!type": "fn(name: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttribute",
        "!doc": "Returns the value of the named attribute on the specified element. If the named attribute does not exist, the value returned will either be null or \"\" (the empty string)."
      },
      "setAttribute": {
        "!type": "fn(name: string, value: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttribute",
        "!doc": "Adds a new attribute or changes the value of an existing attribute on the specified element."
      },
      "removeAttribute": {
        "!type": "fn(name: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttribute",
        "!doc": "Removes an attribute from the specified element."
      },
      "getAttributeNode": {
        "!type": "fn(name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNode",
        "!doc": "Returns the specified attribute of the specified element, as an Attr node."
      },
      "getElementsByTagName": {
        "!type": "fn(tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getElementsByTagName",
        "!doc": "Returns a list of elements with the given tag name. The subtree underneath the specified element is searched, excluding the element itself. The returned list is live, meaning that it updates itself with the DOM tree automatically. Consequently, there is no need to call several times element.getElementsByTagName with the same element and arguments."
      },
      "getElementsByTagNameNS": {
        "!type": "fn(ns: string, tagName: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getElementsByTagNameNS",
        "!doc": "Returns a list of elements with the given tag name belonging to the given namespace."
      },
      "getAttributeNS": {
        "!type": "fn(ns: string, name: string) -> string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNS",
        "!doc": "Returns the string value of the attribute with the specified namespace and name. If the named attribute does not exist, the value returned will either be null or \"\" (the empty string)."
      },
      "setAttributeNS": {
        "!type": "fn(ns: string, name: string, value: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNS",
        "!doc": "Adds a new attribute or changes the value of an attribute with the given namespace and name."
      },
      "removeAttributeNS": {
        "!type": "fn(ns: string, name: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttributeNS",
        "!doc": "removeAttributeNS removes the specified attribute from an element."
      },
      "getAttributeNodeNS": {
        "!type": "fn(ns: string, name: string) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getAttributeNodeNS",
        "!doc": "Returns the Attr node for the attribute with the given namespace and name."
      },
      "hasAttribute": {
        "!type": "fn(name: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.hasAttribute",
        "!doc": "hasAttribute returns a boolean value indicating whether the specified element has the specified attribute or not."
      },
      "hasAttributeNS": {
        "!type": "fn(ns: string, name: string) -> bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.hasAttributeNS",
        "!doc": "hasAttributeNS returns a boolean value indicating whether the current element has the specified attribute."
      },
      "focus": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.focus",
        "!doc": "Sets focus on the specified element, if it can be focused."
      },
      "blur": {
        "!type": "fn()",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.blur",
        "!doc": "The blur method removes keyboard focus from the current element."
      },
      "scrollIntoView": {
        "!type": "fn(top: bool)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollIntoView",
        "!doc": "The scrollIntoView() method scrolls the element into view."
      },
      "scrollByLines": {
        "!type": "fn(lines: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollByLines",
        "!doc": "Scrolls the document by the given number of lines."
      },
      "scrollByPages": {
        "!type": "fn(pages: number)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.scrollByPages",
        "!doc": "Scrolls the current document by the specified number of pages."
      },
      "getElementsByClassName": {
        "!type": "fn(name: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/document.getElementsByClassName",
        "!doc": "Returns a set of elements which have all the given class names. When called on the document object, the complete document is searched, including the root node. You may also call getElementsByClassName on any element; it will return only elements which are descendants of the specified root element with the given class names."
      },
      "querySelector": {
        "!type": "fn(selectors: string) -> +Node",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.querySelector",
        "!doc": "Returns the first element that is a descendent of the element on which it is invoked that matches the specified group of selectors."
      },
      "querySelectorAll": {
        "!type": "fn(selectors: string) -> +NodeList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.querySelectorAll",
        "!doc": "Returns a non-live NodeList of all elements descended from the element on which it is invoked that match the specified group of CSS selectors."
      },
      "getClientRects": {
        "!type": "fn() -> [+ClientRect]",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getClientRects",
        "!doc": "Returns a collection of rectangles that indicate the bounding rectangles for each box in a client."
      },
      "getBoundingClientRect": {
        "!type": "fn() -> +ClientRect",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.getBoundingClientRect",
        "!doc": "Returns a text rectangle object that encloses a group of text rectangles."
      },
      "setAttributeNode": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNode",
        "!doc": "Adds a new Attr node to the specified element."
      },
      "removeAttributeNode": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.removeAttributeNode",
        "!doc": "Removes the specified attribute from the current element."
      },
      "setAttributeNodeNS": {
        "!type": "fn(attr: +Attr) -> +Attr",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.setAttributeNodeNS",
        "!doc": "Adds a new namespaced attribute node to an element."
      },
      "insertAdjacentHTML": {
        "!type": "fn(position: string, text: string)",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.insertAdjacentHTML",
        "!doc": "Parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not reparse the element it is being used on and thus it does not corrupt the existing elements inside the element. This, and avoiding the extra step of serialization make it much faster than direct innerHTML manipulation."
      },
      "children": {
        "!type": "+HTMLCollection",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.children",
        "!doc": "Returns a collection of child elements of the given element."
      },
      "childElementCount": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.childElementCount",
        "!doc": "Returns the number of child elements of the given element."
      },
      "className": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.className",
        "!doc": "Gets and sets the value of the class attribute of the specified element."
      },
      "style": {
        "cssText": "string",
        "alignmentBaseline": "string",
        "background": "string",
        "backgroundAttachment": "string",
        "backgroundClip": "string",
        "backgroundColor": "string",
        "backgroundImage": "string",
        "backgroundOrigin": "string",
        "backgroundPosition": "string",
        "backgroundPositionX": "string",
        "backgroundPositionY": "string",
        "backgroundRepeat": "string",
        "backgroundRepeatX": "string",
        "backgroundRepeatY": "string",
        "backgroundSize": "string",
        "baselineShift": "string",
        "border": "string",
        "borderBottom": "string",
        "borderBottomColor": "string",
        "borderBottomLeftRadius": "string",
        "borderBottomRightRadius": "string",
        "borderBottomStyle": "string",
        "borderBottomWidth": "string",
        "borderCollapse": "string",
        "borderColor": "string",
        "borderImage": "string",
        "borderImageOutset": "string",
        "borderImageRepeat": "string",
        "borderImageSlice": "string",
        "borderImageSource": "string",
        "borderImageWidth": "string",
        "borderLeft": "string",
        "borderLeftColor": "string",
        "borderLeftStyle": "string",
        "borderLeftWidth": "string",
        "borderRadius": "string",
        "borderRight": "string",
        "borderRightColor": "string",
        "borderRightStyle": "string",
        "borderRightWidth": "string",
        "borderSpacing": "string",
        "borderStyle": "string",
        "borderTop": "string",
        "borderTopColor": "string",
        "borderTopLeftRadius": "string",
        "borderTopRightRadius": "string",
        "borderTopStyle": "string",
        "borderTopWidth": "string",
        "borderWidth": "string",
        "bottom": "string",
        "boxShadow": "string",
        "boxSizing": "string",
        "captionSide": "string",
        "clear": "string",
        "clip": "string",
        "clipPath": "string",
        "clipRule": "string",
        "color": "string",
        "colorInterpolation": "string",
        "colorInterpolationFilters": "string",
        "colorProfile": "string",
        "colorRendering": "string",
        "content": "string",
        "counterIncrement": "string",
        "counterReset": "string",
        "cursor": "string",
        "direction": "string",
        "display": "string",
        "dominantBaseline": "string",
        "emptyCells": "string",
        "enableBackground": "string",
        "fill": "string",
        "fillOpacity": "string",
        "fillRule": "string",
        "filter": "string",
        "float": "string",
        "floodColor": "string",
        "floodOpacity": "string",
        "font": "string",
        "fontFamily": "string",
        "fontSize": "string",
        "fontStretch": "string",
        "fontStyle": "string",
        "fontVariant": "string",
        "fontWeight": "string",
        "glyphOrientationHorizontal": "string",
        "glyphOrientationVertical": "string",
        "height": "string",
        "imageRendering": "string",
        "kerning": "string",
        "left": "string",
        "letterSpacing": "string",
        "lightingColor": "string",
        "lineHeight": "string",
        "listStyle": "string",
        "listStyleImage": "string",
        "listStylePosition": "string",
        "listStyleType": "string",
        "margin": "string",
        "marginBottom": "string",
        "marginLeft": "string",
        "marginRight": "string",
        "marginTop": "string",
        "marker": "string",
        "markerEnd": "string",
        "markerMid": "string",
        "markerStart": "string",
        "mask": "string",
        "maxHeight": "string",
        "maxWidth": "string",
        "minHeight": "string",
        "minWidth": "string",
        "opacity": "string",
        "orphans": "string",
        "outline": "string",
        "outlineColor": "string",
        "outlineOffset": "string",
        "outlineStyle": "string",
        "outlineWidth": "string",
        "overflow": "string",
        "overflowWrap": "string",
        "overflowX": "string",
        "overflowY": "string",
        "padding": "string",
        "paddingBottom": "string",
        "paddingLeft": "string",
        "paddingRight": "string",
        "paddingTop": "string",
        "page": "string",
        "pageBreakAfter": "string",
        "pageBreakBefore": "string",
        "pageBreakInside": "string",
        "pointerEvents": "string",
        "position": "string",
        "quotes": "string",
        "resize": "string",
        "right": "string",
        "shapeRendering": "string",
        "size": "string",
        "speak": "string",
        "src": "string",
        "stopColor": "string",
        "stopOpacity": "string",
        "stroke": "string",
        "strokeDasharray": "string",
        "strokeDashoffset": "string",
        "strokeLinecap": "string",
        "strokeLinejoin": "string",
        "strokeMiterlimit": "string",
        "strokeOpacity": "string",
        "strokeWidth": "string",
        "tabSize": "string",
        "tableLayout": "string",
        "textAlign": "string",
        "textAnchor": "string",
        "textDecoration": "string",
        "textIndent": "string",
        "textLineThrough": "string",
        "textLineThroughColor": "string",
        "textLineThroughMode": "string",
        "textLineThroughStyle": "string",
        "textLineThroughWidth": "string",
        "textOverflow": "string",
        "textOverline": "string",
        "textOverlineColor": "string",
        "textOverlineMode": "string",
        "textOverlineStyle": "string",
        "textOverlineWidth": "string",
        "textRendering": "string",
        "textShadow": "string",
        "textTransform": "string",
        "textUnderline": "string",
        "textUnderlineColor": "string",
        "textUnderlineMode": "string",
        "textUnderlineStyle": "string",
        "textUnderlineWidth": "string",
        "top": "string",
        "unicodeBidi": "string",
        "unicodeRange": "string",
        "vectorEffect": "string",
        "verticalAlign": "string",
        "visibility": "string",
        "whiteSpace": "string",
        "width": "string",
        "wordBreak": "string",
        "wordSpacing": "string",
        "wordWrap": "string",
        "writingMode": "string",
        "zIndex": "string",
        "zoom": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.style",
        "!doc": "Returns an object that represents the element's style attribute."
      },
      "classList": {
        "!type": "+DOMTokenList",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.classList",
        "!doc": "Returns a token list of the class attribute of the element."
      },
      "contentEditable": {
        "!type": "bool",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.contentEditable",
        "!doc": "Indicates whether or not the element is editable."
      },
      "firstElementChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.firstElementChild",
        "!doc": "Returns the element's first child element or null if there are no child elements."
      },
      "lastElementChild": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.lastElementChild",
        "!doc": "Returns the element's last child element or null if there are no child elements."
      },
      "nextElementSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.nextElementSibling",
        "!doc": "Returns the element immediately following the specified one in its parent's children list, or null if the specified element is the last one in the list."
      },
      "previousElementSibling": {
        "!type": "+Element",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Element.previousElementSibling",
        "!doc": "Returns the element immediately prior to the specified one in its parent's children list, or null if the specified element is the first one in the list."
      },
      "tabIndex": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.tabIndex",
        "!doc": "Gets/sets the tab order of the current element."
      },
      "title": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.title",
        "!doc": "Establishes the text to be displayed in a 'tool tip' popup when the mouse is over the displayed node."
      },
      "width": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetWidth",
        "!doc": "Returns the layout width of an element."
      },
      "height": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetHeight",
        "!doc": "Height of an element relative to the element's offsetParent."
      },
      "getContext": {
        "!type": "fn(id: string) -> canvas.context2d",
        "!url": "https://developer.mozilla.org/en/docs/DOM/HTMLCanvasElement",
        "!doc": "DOM canvas elements expose the HTMLCanvasElement interface, which provides properties and methods for manipulating the layout and presentation of canvas elements. The HTMLCanvasElement interface inherits the properties and methods of the element object interface."
      },
      "supportsContext": "fn(id: string) -> bool",
      "oncopy": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.oncopy",
        "!doc": "The oncopy property returns the onCopy event handler code on the current element."
      },
      "oncut": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.oncut",
        "!doc": "The oncut property returns the onCut event handler code on the current element."
      },
      "onpaste": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onpaste",
        "!doc": "The onpaste property returns the onPaste event handler code on the current element."
      },
      "onbeforeunload": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/HTML/Element/body",
        "!doc": "The HTML <body> element represents the main content of an HTML document. There is only one <body> element in a document."
      },
      "onfocus": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onfocus",
        "!doc": "The onfocus property returns the onFocus event handler code on the current element."
      },
      "onblur": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onblur",
        "!doc": "The onblur property returns the onBlur event handler code, if any, that exists on the current element."
      },
      "onchange": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onchange",
        "!doc": "The onchange property sets and returns the onChange event handler code for the current element."
      },
      "onclick": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onclick",
        "!doc": "The onclick property returns the onClick event handler code on the current element."
      },
      "ondblclick": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.ondblclick",
        "!doc": "The ondblclick property returns the onDblClick event handler code on the current element."
      },
      "onmousedown": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmousedown",
        "!doc": "The onmousedown property returns the onMouseDown event handler code on the current element."
      },
      "onmouseup": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseup",
        "!doc": "The onmouseup property returns the onMouseUp event handler code on the current element."
      },
      "onmousewheel": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/wheel",
        "!doc": "The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated. This event deprecates the legacy mousewheel event."
      },
      "onmouseover": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseover",
        "!doc": "The onmouseover property returns the onMouseOver event handler code on the current element."
      },
      "onmouseout": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmouseout",
        "!doc": "The onmouseout property returns the onMouseOut event handler code on the current element."
      },
      "onmousemove": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onmousemove",
        "!doc": "The onmousemove property returns the mousemove event handler code on the current element."
      },
      "oncontextmenu": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/window.oncontextmenu",
        "!doc": "An event handler property for right-click events on the window. Unless the default behavior is prevented, the browser context menu will activate. Note that this event will occur with any non-disabled right-click event and does not depend on an element possessing the \"contextmenu\" attribute."
      },
      "onkeydown": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeydown",
        "!doc": "The onkeydown property returns the onKeyDown event handler code on the current element."
      },
      "onkeyup": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeyup",
        "!doc": "The onkeyup property returns the onKeyUp event handler code for the current element."
      },
      "onkeypress": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onkeypress",
        "!doc": "The onkeypress property sets and returns the onKeyPress event handler code for the current element."
      },
      "onresize": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onresize",
        "!doc": "onresize returns the element's onresize event handler code. It can also be used to set the code to be executed when the resize event occurs."
      },
      "onscroll": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.onscroll",
        "!doc": "The onscroll property returns the onScroll event handler code on the current element."
      },
      "ondragstart": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DragDrop/Drag_Operations",
        "!doc": "The following describes the steps that occur during a drag and drop operation."
      },
      "ondragover": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragover",
        "!doc": "The dragover event is fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds)."
      },
      "ondragleave": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragleave",
        "!doc": "The dragleave event is fired when a dragged element or text selection leaves a valid drop target."
      },
      "ondragenter": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragenter",
        "!doc": "The dragenter event is fired when a dragged element or text selection enters a valid drop target."
      },
      "ondragend": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/dragend",
        "!doc": "The dragend event is fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key)."
      },
      "ondrag": {
        "!type": "?",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Mozilla_event_reference/drag",
        "!doc": "The drag event is fired when an element or text selection is being dragged (every few hundred milliseconds)."
      },
      "offsetTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetTop",
        "!doc": "Returns the distance of the current element relative to the top of the offsetParent node."
      },
      "offsetLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetLeft",
        "!doc": "Returns the number of pixels that the upper left corner of the current element is offset to the left within the offsetParent node."
      },
      "offsetHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetHeight",
        "!doc": "Height of an element relative to the element's offsetParent."
      },
      "offsetWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.offsetWidth",
        "!doc": "Returns the layout width of an element."
      },
      "scrollTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollTop",
        "!doc": "Gets or sets the number of pixels that the content of an element is scrolled upward."
      },
      "scrollLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollLeft",
        "!doc": "Gets or sets the number of pixels that an element's content is scrolled to the left."
      },
      "scrollHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollHeight",
        "!doc": "Height of the scroll view of an element; it includes the element padding but not its margin."
      },
      "scrollWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.scrollWidth",
        "!doc": "Read-only property that returns either the width in pixels of the content of an element or the width of the element itself, whichever is greater."
      },
      "clientTop": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientTop",
        "!doc": "The width of the top border of an element in pixels. It does not include the top margin or padding. clientTop is read-only."
      },
      "clientLeft": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientLeft",
        "!doc": "The width of the left border of an element in pixels. It includes the width of the vertical scrollbar if the text direction of the element is right-to-left and if there is an overflow causing a left vertical scrollbar to be rendered. clientLeft does not include the left margin or the left padding. clientLeft is read-only."
      },
      "clientHeight": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientHeight",
        "!doc": "Returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin."
      },
      "clientWidth": {
        "!type": "number",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.clientWidth",
        "!doc": "The inner width of an element in pixels. It includes padding but not the vertical scrollbar (if present, if rendered), border or margin."
      },
      "innerHTML": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/element.innerHTML",
        "!doc": "Sets or gets the HTML syntax describing the element's descendants."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Element",
    "!doc": "Represents an element in an HTML or XML document."
  },
  "Text": {
    "!type": "fn()",
    "prototype": {
      "!proto": "Node.prototype",
      "wholeText": {
        "!type": "string",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Text.wholeText",
        "!doc": "Returns all text of all Text nodes logically adjacent to the node.  The text is concatenated in document order.  This allows you to specify any text node and obtain all adjacent text as a single string."
      },
      "splitText": {
        "!type": "fn(offset: number) -> +Text",
        "!url": "https://developer.mozilla.org/en/docs/DOM/Text.splitText",
        "!doc": "Breaks the Text node into two nodes at the specified offset, keeping both nodes in the tree as siblings."
      }
    },
    "!url": "https://developer.mozilla.org/en/docs/DOM/Text",
    "!doc": "In the DOM, the Text interface represents the textual content of an Element or Attr.  If an element has no markup within its content, it has a single child implementing Text that contains the element's text.  However, if the element contains markup, it is parsed into information items and Text nodes that form its children."
  },
  "addEventListener": {
    "!type": "fn(type: string, listener: fn(e: +Event), capture: bol)",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.addEventListener",
    "!doc": "[Here2906]Registers a single event listener on a single target. The event target may be a single element in a document, the document itself, a window, or an XMLHttpRequest."
  },
  "if": {
    "!type": "fn(type: string, listener: fn(), capture: bool){}",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.removeEventListener",
    "!doc": "if struct"
  },
  "dispatchEvent": {
    "!type": "fn(event: +Event) -> bool",
    "!url": "https://developer.mozilla.org/en/docs/DOM/EventTarget.dispatchEvent",
    "!doc": "Dispatches an event into the event system. The event is subject to the same capturing and bubbling behavior as directly dispatched events."
  },
  "getComputedStyle": {
    "!type": "fn(node: +Element, pseudo?: string) -> Element.prototype.style",
    "!url": "https://developer.mozilla.org/en/docs/DOM/window.getComputedStyle",
    "!doc": "Gives the final used values of all the CSS properties of an element."
  }
}
CodeMirror.tern.addDef(def);
})();