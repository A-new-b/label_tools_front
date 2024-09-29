/* eslint-disable import/no-extraneous-dependencies */
import {fabric} from 'fabric'
// import * as fabric from 'fabric';

// 删除img
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
const deleteIconImg = document.createElement('img');
deleteIconImg.src = deleteIcon;

class myFabric {
  /**
   * 构造函数
   * @param {object} params 构造函数参数
   */
  constructor(params) {
    this.canvas = null; // 画布对象
    this.isOff = true; // 是否开启画画模式
    this.downPoint = null; // 按下鼠标时的坐标
    this.upPoint = null; // 松开鼠标时的坐标
    this.label = '';
    this.change = null;
    this.initCanvas(params);
  }
  /**
   * 初始化画布
   * @param {object}   params  { imgUrl, data } 图片路径，标注数据
   */
  initCanvas(params) {
    const { imgUrl, data, change } = params;
    this.change = change;
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      this.canvas = new fabric.Canvas('canvas');

      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerColor = 'white';
      fabric.Object.prototype.cornerStyle = 'circle';
      // console.log(this.canvas, fabric);

      // 创建删除按钮
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: () => {
          this.delete();
        },
        render: (ctx, left, top, styleOverride, fabricObject) => {
          const size = 24;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(deleteIconImg, -size / 2, -size / 2, size, size);
          ctx.restore();
        },
        cornerSize: 24,
      });
      fabric.Image.fromURL(imgUrl, (imgs) => {
        this.canvas.setBackgroundImage(imgs, this.canvas.renderAll.bind(this.canvas));
      });
      this.canvas.setWidth(img.width);
      this.canvas.setHeight(img.height);
      // 选中
      this.canvas.on('selection:created', (e) => {
        this.isOff = false;
        // console.log('选中');
      });

      // 取消选中
      this.canvas.on('selection:cleared', () => {
        this.isOff = true;
        // console.log('取消选中');
      });
      this.canvas.on('selection:updated', () => {
        // console.log('选中updated');
      });

      // mouse:move
      // 鼠标在画布上按下
      this.canvas.on('mouse:down', (e) => {
        if (this.isOff) {
          fabric.Object.prototype.selectable = false;
        }
        // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
        this.downPoint = e.absolutePointer;
        // console.log('鼠标左键按下时');
      });
      // 松开鼠标左键时
      this.canvas.on('mouse:up', (e) => {
        if (this.isOff) {
          fabric.Object.prototype.selectable = true;
        }
        // console.log('松开鼠标左键时');
        // 同步外部数据
        // change(this.getAll());

        // 绘制矩形的模式下，才执行下面的代码
        // 松开鼠标左键时，将当前坐标 赋值给 upPoint
        // 调用 创建矩形 的方法
        this.createPolygon();
        change(this.getAll());
      }); // 鼠标在画布上松开

      data.forEach((item) => {
        this.canvas.add(this.creatGroup(item));
        this.canvas.renderAll();
      });
      // 将矩形添加到画布上
    };
  }

  /**
   * 创建矩形和text组
   * @param {object}   item   {x,y,w,h,r,label}
   */
    
  creatGroup(item) {
    const {points, angle } = item;
    const polygon = new fabric.Polygon({
      points,
      angle,
      padding: 0,
      strokeUniform: true,
      noScaleCache: false,
      stroke: this.label ? 'lightgreen' : 'red',
      strokeWidth: 1,
      fill: 'rgba(0,0,255,0.2)', // 填充色：透明
    });
    // 矩形对象
    const text = new fabric.Textbox(this.label, {
      top: top + height / 2.3,
      left,
      width,
      height,
      fontFamily: 'Helvetica',
      fill: 'white', // 设置字体颜色
      fontSize: 14,
      textAlign: 'center',
    });
    const group = new fabric.Group([polygon, text]);
    return group;
  }
  
  //创建点

  creatGroup(subpoint) {
    const {x, y } = subpoint;
    const polygon = new fabric.Polygon({
      points,
      angle,
      padding: 0,
      strokeUniform: true,
      noScaleCache: false,
      stroke: this.label ? 'lightgreen' : 'red',
      strokeWidth: 1,
      fill: 'rgba(0,0,255,0.2)', // 填充色：透明
    });
    // 矩形对象
    const text = new fabric.Textbox(this.label, {
      top: top + height / 2.3,
      left,
      width,
      height,
      fontFamily: 'Helvetica',
      fill: 'white', // 设置字体颜色
      fontSize: 14,
      textAlign: 'center',
    });
    const group = new fabric.Group([polygon, text]);
    return group;
  }

  createPoint() {
    if (!this.isOff) return;
    // 如果点击和松开鼠标，都是在同一个坐标点，不会生成矩形
    if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
      return;
    }685189
    
    // 创建矩形
    // 矩形参数计算
    const x = Math.min(this.downPoint.y, this.upPoint.y);
    const y = Math.min(this.downPoint.x, this.upPoint.x);

    this.canvas.add(
      this.creatGroup({
        x,y
      })
    );
  }
   // 创建多边形
   createPolygon() {
    if (!this.isOff) return;
    // 如果点击和松开鼠标，都是在同一个坐标点，不会生成矩形
    if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
      return;
    }
    // 创建矩形
    // 矩形参数计算
    const top = Math.min(this.downPoint.y, this.upPoint.y);
    const left = Math.min(this.downPoint.x, this.upPoint.x);
    const width = Math.abs(this.downPoint.x - this.upPoint.x);
    const height = Math.abs(this.downPoint.y - this.upPoint.y);
    if (width < 2 || height < 2) return;
    // 将矩形添加到画布上
    this.canvas.add(
      this.creatGroup({
        top,
        left,
        width,
        height,
        angle: 0,
        label: this.label,
      })
    );
    this.canvas.renderAll();
    // 创建完矩形，清空 downPoint 和 upPoint
    this.downPoint = null;
    this.upPoint = null;
  }
  /**
   * 画布缩放
   * @param {Boolean}   type   true放大 false缩小
   */

  setZoom(type) {
    let scale = this.canvas.getZoom();
    if (type) {
      scale += 0.1;
    } else {
      scale -= 0.1;
    }
    this.canvas.setZoom(scale);
  }

  /**
   * 画布上的元素数据
   */
  getAll() {
    const allTarget = this.canvas.getObjects().map((item) => ({
      label: item._objects[1].text,
      width: item.width,
      height: item.height,
      left: item.left,
      top: item.top,
      angle: item.angle || 0,
    }));
    return allTarget;
  }

  // 更新标注框文字
  updateLabel(label) {
    var active = this.canvas.getActiveObject();
    if (active) {
      active.item(0).set({
        stroke: label ? 'lightgreen' : 'red',
      });
      active.item(1).set({
        text: label,
      });
      this.canvas.renderAll();
    }
    // active && active.set(active._objects[1], 'text', '444');
    // active._objects.
    this.label = label;
  }

  // 删除标注框
  delete() {
    var active = this.canvas.getActiveObject();
    if (active) {
      this.canvas.remove(active);
      if (active.type == 'activeSelection') {
        active.getObjects().forEach((x) => this.canvas.remove(x));
        this.canvas.discardActiveObject().renderAll();
      }
    }
  }

  // 销毁
  dispose() {
    this.canvas.dispose();
  }
}
export default myFabric;

