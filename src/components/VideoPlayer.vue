<template>
    <div>
      <video ref="video" @loadedmetadata="onLoadedMetadata" controls>
        <source src="F:\LabelTools\label_tools_front\videos\test.mp4" type="video/mp4" />
      </video>
      <VSpacer></VSpacer>
      <v-file-input
        label="Select Video"
        accept="video/mp4"
        v-model="selectedFile"
        @change="onFileChange"
      ></v-file-input>
      <VSpacer></VSpacer>
      <canvas width="640" height="480" ref="canvas1"></canvas>
      <canvas width="640" height="480" ref="canvas2"></canvas>
      <v-btn color="primary" @click="Diff">Diff</v-btn>

      <Edit_canvas ref="canvas3"></Edit_canvas>
      <VSpacer></VSpacer>
      <v-btn color="primary" @click="startCapture1">Capturing1</v-btn>
      <v-btn color="primary" @click="startCapture2">Capturing2</v-btn>

    </div>
</template>

<script setup>
  import { ref } from 'vue';
  // import myfabric from './myfabric.vue';
  import Edit_canvas from './edit_canvas.vue';
  import axios from 'axios';
  // 创建响应式引用
  const video = ref(null);
  const canvas1 = ref(null);
  const canvas2 = ref(null);
  const canvas3 = ref(null);
  let bg=null;
  let gas = null;
  let threshold = 0;
  let selectedFile = null;


  // 加载视频元数据
  const onLoadedMetadata = () => {
    console.log('Video metadata loaded.');
  };
  // 更新视频
  const onFileChange = () => {
    const file = selectedFile.value;
    if (file) {
        videoSrc.value = URL.createObjectURL(file);
        video.value.load();
    }
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
    bg = frameData;
    console.log('Current Frame:', frameData);
  };

  const startCapture2 = () => {
    const videoElement = video.value;
    const canvas2Element = canvas2.value;
    const ctx = canvas2Element.getContext('2d');

    // 设置 canvas1 尺寸与视频尺寸一致
    canvas2Element.width = videoElement.videoWidth;
    canvas2Element.height = videoElement.videoHeight;

    ctx.drawImage(videoElement, 0, 0, canvas2Element.width, canvas2Element.height);
    // 获取帧数据
    const frameData = canvas2Element.toDataURL('image/png');
    gas = frameData;
    console.log('Current Frame:', frameData);
  };

  const Diff = () => {
    threshold = 10;
    axios.post('/api/image_diff', {
      image1: bg,
      image2: gas,
      threshold: threshold
    })
    .then(function (response) {
      const editCanvasElement = canvas3.value;
      let image = response.data.diff_image;
      editCanvasElement.drawImage(image);
      console.log(image);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  // const Diff = () => {
  //   threshold = 10;

  //   const videoElement = video.value;
  //   const canvas2Element = canvas3.value;

  //   // 设置 canvas3 尺寸与视频尺寸一致
  //   canvas2Element.width = videoElement.videoWidth;
  //   canvas2Element.height = videoElement.videoHeight;

  //   canvas2Element.drawImage(videoElement);
  //   // 获取帧数据
  //   const frameData = canvas2Element.toDataURL('image/png');
  //   console.log('Current Frame:', frameData);
  //   // init_canvas2(canvas3)
  // };

  // onMounted(() => {
  //   init()
  // })
  </script>



