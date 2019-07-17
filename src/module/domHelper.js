export const isIE = /Trident/.test(navigator.userAgent)

export const insertAfter = (newElement,targetElement) => {
    // target is what you want it to go after. Look for this elements parent.
    const parent = targetElement.parentNode

    // if the parents last child is the targetElement...
    if (parent.lastChild === targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement)
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling)
    }
}

export const isRTL = s => {
    const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
    const rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
    const rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']')

    return rtlDirCheck.test(s)
}

export const getAllSiblings = (elm, includeElm = false) => {
    const result = []
    if (!elm) return result
    if (includeElm) result.push(elm)

    while (elm.nextSibling) {
        result.push(elm.nextSibling)
        elm = elm.nextSibling
    }

    return result
}
export const setElmDirection = (elm, dir) => {
    elm.dir = dir
}

export const getInnerTextDirection = elm => {
    return isRTL(elm.innerText) ? 'rtl' : 'ltr'
}

export const getFirstTextNodes = elm => {
    for (let i = 0; i < elm.childNodes.length; i++) {
        if (elm.childNodes[i].nodeName === '#text') {
            return elm.childNodes[i]
        }
    }
    return null
}

export const textToDivTags = text => {
    return text.split('\n').map(function (part) {
        return `<div>${part}</div>`
    }).join('')
}

export const removeType_mozInFirefox = elm => {
    Array.from(elm.querySelectorAll('br[type=_moz]')).forEach(item => {
        item.remove()
    })
}

export const removePraghraphsIE = elm => {
    Array.from(elm.querySelectorAll('p')).forEach(item => {
        item.remove()
    })
}


export const moveCursorToLastElement = el => {
    if (window.getSelection) {
        const range = document.createRange()
        const sel = window.getSelection()
        const childNodes = el.childNodes
        const childNodesLength = el.childNodes.length
        range.setStart(childNodes[childNodesLength - 1], childNodes[childNodesLength - 1].length)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
    }
}

export const setChildrenDirection = elm => {
    Array.from(elm.children).forEach(child => {
        const firstTextNode = getFirstTextNodes(child)
        if (!firstTextNode) setElmDirection(child, 'ltr')
        else setElmDirection(child, getInnerTextDirection(child))
    })
}

export const insertHTML = (html, selectPastedContent) => {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();

            var el = document.createElement("div");
            el.innerHTML = html;
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            var firstNode = frag.firstChild;
            range.insertNode(frag);

            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                if (selectPastedContent) {
                    range.setStartBefore(firstNode);
                } else {
                    range.collapse(true);
                }
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
}

export const formatBlock = (clb) => {
    return
    // setTimeout(function () {
    //     const result = document.execCommand('formatblock', false, 'div')
    //     if (!result) {
    //         document.execCommand('formatblock', false, '<p>')
    //     }
    //     if (clb) clb()
    // })
}

export const insertParagraph = () => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)

    // create a container for rest of nodes in endContainer
    const container = document.createElement('div')
    const { startOffset, endOffset } = range
    let endContainer
    let includeElm = false // element will included in next line
    const isEndContainerDiv = range.endContainer.nodeName === 'DIV'

    if (isEndContainerDiv) {
        endContainer = range.endContainer.childNodes[range.endOffset]
        includeElm = true
    } else {
        endContainer = range.endContainer
    }

    let textBeforeCaret
    let textAfterCaret
    if (endContainer && endContainer.nodeValue !== undefined) {
        textBeforeCaret = endContainer.nodeValue.slice(0, startOffset)
        textAfterCaret = document.createTextNode(endContainer.nodeValue.slice(endOffset))
    } else {
        textAfterCaret = document.createTextNode('\u00A0')
    }

    const nodesAfterCaret = getAllSiblings(endContainer, includeElm)

    // create next line
    container.appendChild(textAfterCaret)
    nodesAfterCaret.forEach(node => {
        container.appendChild(node)
    })

    // insert dom
    if (endContainer) {
        if (isEndContainerDiv) insertAfter(container, range.endContainer)
        else insertAfter(container, range.endContainer.parentNode)
    } else {
        insertAfter(container, range.endContainer)
    }

    // remove every thing between
    range.deleteContents()

    // remove text after caret
    if (textBeforeCaret !== undefined) endContainer.nodeValue = textBeforeCaret

    // move cursor to end of next line
    range.setStart(textAfterCaret, 0)
}
