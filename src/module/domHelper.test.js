import {
    isElementDiv,
    setElmDirection,
    isRTL,
    getInnerTextDirection,
    getFirstTextNodes,
    textToDivTags
} from './domHelper'

describe('dom helper', function () {
    let div
    const rtlText = '1.سلام'
    const ltrText = 'hi'

    beforeEach(() => {
        div = document.createElement('div')
    })

    it('should check is element div', function () {
        expect(isElementDiv(div)).toBeTruthy()
    });

    it('should detect text direction', function () {
        expect(isRTL(rtlText)).toBe(true)
        expect(isRTL(ltrText)).toBe(false)
    });

    it('should set element direction', function () {
        const direction = 'rtl'
        setElmDirection(div, direction)

        expect(div.dir).toBe(direction)
    });

    it('should evaluate inner text real direction', function () {
        div.innerText = rtlText

        expect(getInnerTextDirection(div)).toBe('rtl')

        div.innerText = ltrText

        expect(getInnerTextDirection(div)).toBe('ltr')
    });

    it('should get first text node in an element', function () {
        const textNodeContent = 'text node'

        div.appendChild(document.createElement('img'))
        div.appendChild(document.createTextNode(textNodeContent))

        const result = getFirstTextNodes(div)

        expect(result.wholeText).toBe(textNodeContent)
    });

    it('should turn raw text to div elements', function () {
        const textNode = 'hi\nhi'

        const result = textToDivTags(textNode)

        expect(result).toBe('<div>hi</div><div>hi</div>')
    });
})
