import { mount } from '@vue/test-utils'
import contenteditable from './contenteditable.vue'

describe('contenteditable', function () {
    it('contenteditable should starts with empty div child tag', function () {
        const wrapper = mount(contenteditable)

        const contenteditableRef = wrapper.find({ ref: 'contenteditable' })

        expect(contenteditableRef.contains('div')).toBe(true)
    });
})
