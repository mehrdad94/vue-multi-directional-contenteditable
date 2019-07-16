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
      content: '1, 2, 3 \n how you doing'
    }
  },
  methods: {
    onContenteditableChange (value) {
      // console.log(value)
    }
  }
}
</script>

<style>
</style>
