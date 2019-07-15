<template>
  <div>
    <md-contenteditable v-on:change-event="onContenteditableChange" :content="content"/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      content: '1, 2, 3 \n how you doing'
    }
  },
  methods: {
    onContenteditableChange (value) {
      this.content = value
    }
  }
}
</script>

<style>
</style>
