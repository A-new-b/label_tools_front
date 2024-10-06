<template>
    <div>
      <label>Opacity: {{ localValue }}</label>
      <input type="range" min="0" max="1" step="0.1" v-model.number="localValue" @input="updateValue" />
    </div>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: Number,
        default: 0.5,
      },
    },
    data() {
      return {
        localValue: this.modelValue,
      };
    },
    watch: {
      modelValue(val) {
        this.localValue = val;
      },
    },
    methods: {
      updateValue() {
        this.$emit('update:modelValue', this.localValue);
      },
    },
  };
  </script>
  