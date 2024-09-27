<template>
    <div>
      <video ref="video" @loadedmetadata="onLoadedMetadata" controls>
        <source src="F:\LabelTools\label_tools_front\videos\test.mp4" type="video/mp4" />
      </video>
      <VSpacer></VSpacer>
      <!-- Canvas 用于捕获帧，不会重叠显示 -->
      <canvas ref="canvas1"></canvas>
      <canvas ref="canvas2"></canvas>
      <VSpacer></VSpacer>
      <button @click="startCapture1">Capturing1</button>
      <button @click="startCapture2">Capturing2</button>
    </div>
    <!-- <div>
      <myfabric></myfabric>
    </div> -->
</template>

<script setup>
  import { ref } from 'vue';
//   import myfabric from 'myfabric.vue';
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
    const ctx = canvas2Element.getContext('2d');

    // 设置 canvas2 尺寸与视频尺寸一致
    canvas2Element.width = videoElement.videoWidth;
    canvas2Element.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvas2Element.width, canvas2Element.height);
    // 获取帧数据
    const frameData = canvas2Element.toDataURL('image/png');
    console.log('Current Frame:', frameData);
  };
  </script>



