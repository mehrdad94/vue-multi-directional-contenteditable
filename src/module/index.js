import './array.from.polyfill'
import './element.remove.pollyfill'
import MDContenteditable from './contenteditable.vue'

export default {
  install (Vue) {
    Vue.component('mdir-contenteditable', MDContenteditable);
  }
}
