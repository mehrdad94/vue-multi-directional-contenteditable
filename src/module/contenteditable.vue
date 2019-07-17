<template>
    <div contenteditable="true" ref="contenteditable" class="custom-contenteditable">
        <div>
        </div>
    </div>
</template>
<script>
    import {
        insertHTML,
        setChildrenDirection,
        formatBlock,
        moveCursorToLastElement,
        removeType_mozInFirefox,
        textToDivTags,
        insertParagraph
    } from './domHelper'

    const isEmpty = text => text === ''

    export default {
        name: 'vue-contenteditable-plugin',
        props: {
            content: {
                type: String,
                default: () => {
                    return ''
                }
            },
            imgContentAttr: {
                type: String,
                default: () => {
                    return 'alt'
                }
            },
            paragraphKeyDetection: {
                type: Function,
                default: function (event) {
                    return (event.which === 13)
                }
            },
            beforeSetContent: {
                type: Function,
                default: function (text) {
                    return text
                }
            }
        },
        computed: {
          computedContent () {
                return this.beforeSetContent(this.content)
            }
        },
        watch: {
          computedContent (value) {
                this.setContentEditableContent(value)
          }
        },
        mounted () {
            this.$refs.contenteditable.addEventListener('paste', this.onPaste)
            this.$refs.contenteditable.addEventListener('keyup', this.onKeyUp)
            this.$refs.contenteditable.addEventListener('keydown', this.onKeyDown)
            this.$refs.contenteditable.addEventListener('input', this.onInput)
            this.setContentEditableContent(this.computedContent)
        },
        methods: {
            getClipboardDate (event) {
                let text = ''
                if (event.clipboardData) text = event.clipboardData.getData('text/plain')
                else text = window.clipboardData.getData('text')
                return text
            },
            setContentEditableContent (content) {
                const contenteditable = this.$refs.contenteditable

                contenteditable.innerHTML = `${textToDivTags(content)}`
                contenteditable.focus()
                moveCursorToLastElement(contenteditable)
                formatBlock(() => {
                    setChildrenDirection(contenteditable)
                    removeType_mozInFirefox(contenteditable)
                })
            },
            getTextNodeContent (node) {
                return node.innerText || node.textContent
            },
            getImgContent (img) {
              return img[this.imgContentAttr]
            },
            getContentEditableContent () {
                const contenteditable = this.$refs.contenteditable

                const contentEditableChildren = Array.from(contenteditable.childNodes)

                return contentEditableChildren.map(childNode => {
                    return Array.from(childNode.childNodes).map(node => {
                        if (node.nodeName === '#text') return this.getTextNodeContent(node)
                        else if (node.nodeName === 'IMG') return this.getImgContent(node)
                        else return ''
                    }).join('')
                }).filter((item, index) => {
                    return !(contentEditableChildren.length - 1 === index && isEmpty(item))
                }).join('\n')
            },
            insertHTMLManually (text) {
                const splitByEnter = text.split('\n')

                splitByEnter.forEach(function (part, index) {
                    insertHTML(part)
                    if (index !== splitByEnter.length - 1) {
                        insertParagraph()
                    }
                })
            },
            onPaste (event) {
                event.preventDefault()

                this.insertHTMLManually(this.getClipboardDate(event))
            },
            isPrintableKey (event) {
                switch (event.which) {
                    case 16:
                    case 17:
                    case 18:
                    case 27:
                    case 35:
                    case 36:
                    case 37:
                    case 38:
                    case 39:
                    case 40:
                    case 78:
                    case 110:
                    case 190:
                        return false
                    default:
                        return true
                }
            },
            onKeyDown (event) {
                if (this.paragraphKeyDetection(event)) event.preventDefault()
            },
            onKeyUp (event) {
                if (!this.isPrintableKey(event)) return

                if (this.paragraphKeyDetection(event)) {
                    event.preventDefault()
                    insertParagraph(this.$refs.contenteditable)
                    setChildrenDirection(this.$refs.contenteditable)
                } else {
                    formatBlock(() => {
                        setChildrenDirection(this.$refs.contenteditable)
                        this.$emit('change-event', this.getContentEditableContent())
                    })
                }
            },
            onInput () {
                setChildrenDirection(this.$refs.contenteditable)
            }
        }
    }
</script>
<style>
    .custom-contenteditable div {
        height: 20px;
    }
</style>
