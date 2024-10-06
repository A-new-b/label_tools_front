<!-- <template>
  <div>
    <v-file-input
      label="Select Video"
      accept="video/mp4"
      v-model="selectedFile"
      @change="onFileChange"
    ></v-file-input>
    <video ref="video" @loadedmetadata="onLoadedMetadata" controls>
      <source :src="videoSrc" type="video/mp4" />
    </video>
    
    <VSpacer></VSpacer>

    <Edit_canvas ref="canvas3"></Edit_canvas>

    <v-btn color="primary" @click="startCapture1">Capturing1</v-btn>
    <v-btn color="primary" @click="startCapture2">Capturing2</v-btn>
    <v-btn color="primary" @click="Diff">Diff</v-btn>

    <VSpacer></VSpacer>
    <canvas width="640" height="480" ref="canvas1"></canvas>
    <canvas width="640" height="480" ref="canvas2"></canvas>

    <VSpacer></VSpacer>
    <AdjustThreshold v-model="threshold"></AdjustThreshold>
    <AdjustOpacity v-model="opacity"></AdjustOpacity>
  
  </div>
</template> -->

<template>
  <div>
    <v-file-input
      label="Select Video"
      accept="video/mp4"
      v-model="selectedFile"
      @change="onFileChange"
    ></v-file-input>

    <v-row>
      <v-col cols="5">
        <video ref="video" @loadedmetadata="onLoadedMetadata" controls>
          <source :src="videoSrc" type="video/mp4" />
        </video>
      </v-col>
      <v-col cols="5">
        <Edit_canvas ref="canvas3"></Edit_canvas>
      </v-col>
      <v-col cols="2">
        <AdjustThreshold v-model="threshold"></AdjustThreshold>
        <AdjustOpacity v-model="opacity"></AdjustOpacity>
      </v-col>
    </v-row>

    <VSpacer></VSpacer>

    <v-btn color="primary" @click="startCapture1">Capturing1</v-btn>
    <v-btn color="primary" @click="startCapture2">Capturing2</v-btn>
    <v-btn color="primary" @click="Diff">Diff</v-btn>

    <VSpacer></VSpacer>

    <v-row>
      <v-col cols="5">
        <canvas width="640" height="480" ref="canvas1"></canvas>
      </v-col>
      <v-col cols="5">
        <canvas width="640" height="480" ref="canvas2"></canvas>
      </v-col>
    </v-row>

  </div>
</template>










<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';
import AdjustThreshold from './AdjustThreshold.vue';
import AdjustOpacity from './AdjustOpacity.vue'; 
import Edit_canvas from './edit_canvas.vue';
import axios from 'axios';



const video = ref(null);
const canvas1 = ref(null);
const canvas2 = ref(null);
const canvas3 = ref(null);
const canvas4 = ref(null);
const selectedFile = ref(null);
const videoSrc = ref(null);

let bg = null;
let gas = null;
const threshold = ref(5);
const opacity = ref(0.5);

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
  axios
    .post('/api/image_diff', {
      image1: bg,
      image2: gas,
      threshold: threshold.value,
      transparency: opacity.value,
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

// 使用防抖函数，延迟 300ms 执行 Diff 函数
const debouncedDiff = debounce(Diff, 300);
// 监听 threshold 和 opacity 的变化
watch([threshold, opacity], () => {
  debouncedDiff();
});
</script>