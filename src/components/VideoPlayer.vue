<template>
    <div>
      <video ref="video" @loadedmetadata="onLoadedMetadata" controls>
        <source src="F:\LabelTools\label_tools_front\videos\test.mp4" type="video/mp4" />
      </video>
      <VSpacer></VSpacer>
      <canvas width="640" height="480" ref="canvas1"></canvas>
      <Edit_canvas ref="canvas2"></Edit_canvas>
      <VSpacer></VSpacer>
      <button @click="startCapture1">Capturing1</button>
      <button @click="startCapture2">Capturing2</button>
    </div>
</template>

<script setup>
  import { ref } from 'vue';
  // import myfabric from './myfabric.vue';
  import Edit_canvas from './edit_canvas.vue';
  import { fabric } from 'fabric'
  // 创建响应式引用
  const video = ref(null);
  const canvas1 = ref(null);
  const canvas2 = ref(null);

  // 加载视频元数据
  const onLoadedMetadata = () => {
    console.log('Video metadata loaded.');
  };

  // 开始捕获帧
  const startCapture1 = () => {
    const videoElement = video.value;
    const canvas1Element = canvas1.value;
    const ctx = canvas1Element.getContext('2d');

    // 设置 canvas1 尺寸与视频尺寸一致
    canvas1Element.width = videoElement.videoWidth;
    canvas1Element.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvas1Element.width, canvas1Element.height);
    // 获取帧数据
    const frameData = canvas1Element.toDataURL('image/png');
    console.log('Current Frame:', frameData);
  };

  const startCapture2 = () => {
    const videoElement = video.value;
    const canvas2Element = canvas2.value;

    // 设置 canvas2 尺寸与视频尺寸一致
    canvas2Element.width = videoElement.videoWidth;
    canvas2Element.height = videoElement.videoHeight;

    canvas2Element.drawImage(videoElement);
    // 获取帧数据
    const frameData = canvas2Element.toDataURL('image/png');
    console.log('Current Frame:', frameData);
    // init_canvas2(canvas2)
  };

  // onMounted(() => {
  //   init()
  // })
  </script>



