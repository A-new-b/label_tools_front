  <template>
    <div>
      <label>Threshold：{{ threshold }}</label>
      <input type="range" min="0" max="255" step="1" v-model.number="threshold" @input="emitThreshold" />
      <input type="number" min="0" max="255" step="1" v-model.number="threshold" @input="onInput" />
    </div>
  </template>
    
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Number,
      default: 10,
    },
  });
  
  const emits = defineEmits(['update:modelValue']);
  
  const threshold = ref(props.modelValue);
  
  const emitThreshold = () => {
    emits('update:modelValue', Math.round(threshold.value)); 
  };
  
  const onInput = () => {
    if (threshold.value < 0) threshold.value = 0;
    if (threshold.value > 255) threshold.value = 255;
    threshold.value = Math.round(threshold.value); 
    emitThreshold();
  };
  
  watch(
    () => props.modelValue,
    (newVal) => {
      threshold.value = Math.round(newVal); 
    }
  );
  
  watch(threshold, (newVal) => {
    if (newVal < 0) threshold.value = 0;
    if (newVal > 255) threshold.value = 255;
    threshold.value = Math.round(newVal); 
    emitThreshold();
  });
  </script>
  
  <style scoped>
  
  </style>
  