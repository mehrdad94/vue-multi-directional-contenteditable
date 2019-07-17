<template>
  <div>
    <mdir-contenteditable v-on:change-event="onContenteditableChange" :content="content"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      content: '1, 2, 3 <img alt="img" src=""/> \n how you doing \n well'
    }
  },
  methods: {
    onContenteditableChange (value) {
      console.log(value)
    }
  }
}
</script>

<style>
</style>
