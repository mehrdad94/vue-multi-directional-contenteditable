export const isRTL = s => {
    const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' + '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
    const rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
    const rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']')

    return rtlDirCheck.test(s)
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

export const textToHTMLTag = text => {
    return text.split('\n').map(function (part) {
        return `<div>${part}</div>`
    }).join('')
}

export const removeType_mozInFirefox = () => {
    document.querySelectorAll('.custom-contenteditable br[type=_moz]').forEach(item => {
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
    setTimeout(function () {
        const result = document.execCommand('formatblock', false, 'div')
        if (!result) {
            document.execCommand('formatblock', false, '<div>')
        }
        if (clb) clb()
    })
}
