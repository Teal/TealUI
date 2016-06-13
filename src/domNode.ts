
enum NodeType {

    element = 1,

    attribute = 2,

    textNode = 3,

    comment = 4,

    document = 9,

}

interface DOMNode {

    // #region 属性

    nodeName: string;

    nodeValue: string;

    nodeType: NodeType;

    ownerDocument: DOMDocument;

    // #endregion

    // #region 增

    prependChild(child: DOMNode)

    appendChild(child: DOMNode)

    insertBefore(child: DOMNode, ref: DOMNode);

    // #endregion

    // #region 删

    removeChild(child: DOMNode);

    // #endregion

    // #region 改

    replaceChild(child: DOMNode, ref: DOMNode);

    // #endregion

    // #region 查

    parentNode: DOMNode;

    firstChild: DOMNode;

    lastChild: DOMNode;

    childNodes: DOMNode[];

    nextSibling: DOMNode;

    previousSibling: DOMNode;

    // #endregion

}

interface DOMElement extends DOMNode {

    attributes: DOMAttribute[];

    getAttributeNode(name: string): DOMAttribute;

    getAttribute(name: string): string;

    setAttribute(name: string, value: string): string;

    removeAttribute(name: string): void;

}

interface DOMAttribute extends DOMNode {
}

interface DOMTextNode extends DOMNode {

}

interface DOMDocument extends DOMNode {

    createAttribute(nodeName: string): DOMAttribute;

    createTextNode(nodeName: string): DOMTextNode;

    createElement(nodeName: string): DOMElement;

}





interface HTMLElement extends Element {

    id: string;

}

interface HTMLAnchorElement extends HTMLElement {

    href: string;

}

interface HTMLDocument extends DOMDocument {

}
