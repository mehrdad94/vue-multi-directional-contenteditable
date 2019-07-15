import Vue from 'vue'
import App from './App.vue'
import MDContenteditable from './module'

Vue.use(MDContenteditable)

new Vue({
  el: '#app',
  render: h => h(App)
})
