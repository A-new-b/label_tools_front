<template>
  <div>
    <canvas width="640" height="480" id="canvas" style="border: 1px solid #ccc;"></canvas>
    <v-btn @click="toggleDrawing" color="primary">{{ isDrawing ? 'Finish Drawing' : 'New Polygon' }}</v-btn>
    <v-btn @click="deleteSelected" color="error">Delete</v-btn>
    <v-btn @click="exportPoint" color="primary">Export</v-btn>
  </div>
</template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import { fabric } from 'fabric'

  const canvas = ref(null)
  let isDrawing = ref(false) // 开关：控制多边形绘制模式
  let currentPolygon = null
  let currentCircleList = []
  let points = []
  let polygons = []
  let backgroundImage = null // 用于存储背景视频帧
  
  function init() {
    // 初始化 canvas
    canvas.value = new fabric.Canvas('canvas')
  
    // 监听画布上的点击事件，用于创建新的多边形
    canvas.value.on('mouse:down', function (options) {
      if (isDrawing.value) {
        const pointer = canvas.value.getPointer(options.e)
        addPoint(pointer.x, pointer.y)
      }
    })
  
    // 监听多边形的移动
    canvas.value.on('object:moving', function(e) {
      let target = e.target
      if (target.type === 'polygon' && target.circles) {
        // 更新多边形移动时的控制点位置
        target.circles.forEach((circle, index) => {
          circle.left = target.points[index].x + target.left
          circle.top = target.points[index].y + target.top
          circle.setCoords()
        })
      }
  
      // 监听控制点的移动
      if ('cid' in target && target.cid.match(/circle-/)) {
        let index = target.cid.split('-')[1]
        // 从控制点获取关联的多边形
        let polygon = target.polygon
        let points = polygon.points
        points[index].x = target.left - polygon.left
        points[index].y = target.top - polygon.top
        canvas.value.renderAll()
      }
    })
  }
  
  // 添加点到多边形
// 添加点到多边形
  function addPoint(x, y) {
    points.push({ x, y })
    
    // 创建控制点
    const circle = new fabric.Circle({
      left: x,
      top: y,
      strokeWidth: 5,
      radius: 6,
      fill: '#fff',
      stroke: '#666',
      originX: 'center',
      originY: 'center',
      hasControls: false,
      hasBorders: false,
      cid: `circle-${points.length - 1}`
    })
    currentCircleList.push(circle)
    canvas.value.add(circle)

    // 如果有3个及以上的点，允许创建多边形
    if (points.length > 2) {
      if (currentPolygon) {
        canvas.value.remove(currentPolygon)
      }
      currentPolygon = new fabric.Polygon(points, {
        fill: '#ffd3b6',
        stroke: '#6639a6',
        strokeWidth: 5,
        selectable: false, // 禁止选择多边形
        hasControls: false, // 禁止缩放
        objectCaching: false
      })
      currentPolygon.circles = currentCircleList // 关联多边形和控制点
      canvas.value.add(currentPolygon)
    }
  }
  
  // 启动或结束绘制多边形模式
  function toggleDrawing() {
    if (isDrawing.value) {
      // 如果当前处于绘制模式，完成当前多边形
      finishDrawing()
    } else {
      // 启动绘制多边形模式
      resetCurrentPolygon()
      isDrawing.value = true
    }
  }
  
  // 完成绘制多边形
  function finishDrawing() {
    if (currentPolygon) {
      polygons.push({
        polygon: currentPolygon,
        circles: currentCircleList
      })
      currentPolygon.selectable = true // 结束绘制后，允许选择多边形
      currentPolygon.hasControls = true // 允许缩放
    }
    isDrawing.value = false
  }
  
  // 删除选中的多边形
  function deleteSelected() {
    const activeObject = canvas.value.getActiveObject()
    if (activeObject && activeObject.type === 'polygon') {
      // 从画布中移除选中的多边形
      canvas.value.remove(activeObject)
  
      // 移除对应的控制点
      if (activeObject.circles) {
        activeObject.circles.forEach(circle => canvas.value.remove(circle))
      }

      // 从 polygons 数组中移除
      const index = polygons.findIndex(p => p.polygon === activeObject)
      if (index !== -1) {
        polygons.splice(index, 1)
      }
    }
  }
  
  // 重置当前多边形
  function resetCurrentPolygon() {
    if (currentPolygon) {
      polygons.push({
        polygon: currentPolygon,
        circles: currentCircleList
      })
      currentPolygon.selectable = true
    }
    currentPolygon = null
    currentCircleList = []
    points = []
  }

  function drawImage(image) {
    // 将临时 Canvas 作为背景图像
    // const imgData = image
    console.log(image)
    fabric.Image.fromURL(image, (img) => {
      img.set({
        left: 0,
        top: 0,
        selectable: false // 禁止选中背景图像
      })
       // 移除旧背景
       if (backgroundImage) {
          canvas.value.remove(backgroundImage)
        }
        
        // 添加新的背景图像
        backgroundImage = img
        canvas.value.add(backgroundImage)
        canvas.value.sendToBack(backgroundImage) // 将背景图像置于底层
        canvas.value.renderAll()
    })
  }

  // function drawImage(videoElement) {
  //   // 创建临时 Canvas 以获取视频帧
  //   const tempCanvas = document.createElement('canvas')
  //   tempCanvas.width = canvas.value.width
  //   tempCanvas.height = canvas.value.height
  //   const context = tempCanvas.getContext('2d')

  //   // 清空画布并绘制视频帧
  //   context.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
  //   context.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height)

  //   // 将临时 Canvas 作为背景图像
  //   const imgData = tempCanvas.toDataURL('image/png')
    // fabric.Image.fromURL(imgData, (img) => {
    //   img.set({
    //     left: 0,
    //     top: 0,
    //     selectable: false // 禁止选中背景图像
    //   })
      
    //   // 移除旧背景
    //   if (backgroundImage) {
    //     canvas.value.remove(backgroundImage)
    //   }
      
    //   // 添加新的背景图像
    //   backgroundImage = img
    //   canvas.value.add(backgroundImage)
    //   canvas.value.sendToBack(backgroundImage) // 将背景图像置于底层
    //   canvas.value.renderAll()
    // })
  // }
  
  onMounted(() => {
    init()
  })

  defineExpose({
    drawImage
  })
  </script>
  
