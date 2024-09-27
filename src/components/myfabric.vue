<template>
    <div class="markbox">
      <!-- 操作区域 -->
      <div class="markbox-left">
        <div class="markbox-left-small">
          <a-button shape="circle" @click="cF.setZoom(true)">
            <Icon icon="ant-design:zoom-in-outlined" />
          </a-button>
          <a-button shape="circle" @click="cF.setZoom(false)">
            <Icon icon="ant-design:zoom-out-outlined" />
          </a-button>
  
          <a-button shape="circle" @click="cF.delete()">
            <Icon icon="ant-design:delete-outlined" />
          </a-button>
        </div>
      </div>
      <!-- 画布区域 -->
      <div class="markbox-center">
        <a-tabs v-model:activeKey="activeKey" @change="tabChange">
          <a-tab-pane key="1" tab="全部" />
          <a-tab-pane key="2" tab="有标注" force-render />
          <a-tab-pane key="3" tab="无标注" />
        </a-tabs>
        <a-button type="primary" @click="getCfData">保存当前标注（s）</a-button>
  
        <!-- 画布 -->
        <canvas id="canvas"></canvas>
  
        <!-- 切换区域 -->
        <div class="markbox-img">
          <img :src="item.url" v-for="(item, i) in imgList" :key="i" @click="beforeChange(item)" />
        </div>
      </div>
      <!-- 标签区域 -->
      <div class="markbox-right">
        <a-input v-model:value="searchValue" @change="onSearch" placeholder="请输入标签" style="width: 200px">
          <template #suffix>
            <Icon icon="ant-design:search-outlined" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </template>
        </a-input>
        <a-divider class="markbox-right-border" />
        <div class="markbox-right-tag">
          <a-button :type="actionTag == item ? 'primary' : 'dashed'" v-for="item in targetList" @click="tagChange(item)" :key="item">
            <Icon icon="ant-design:tag-outlined" />
            {{ item }}</a-button
          >
        </div>
      </div>
    </div>
  </template>
  <script lang="ts">
    import { defineComponent, nextTick, onMounted, reactive, toRefs } from 'vue';
    //import { useMessage } from '/@/hooks/web/useMessage'; 
    import myFabric from '@/utils/draw.js';
    const { createMessage } = useMessage();
    export default defineComponent({
      setup() {
        const state = reactive({
          // tab
          activeKey: '1',
          // 搜索标签
          searchValue: '',
          // 选中标签
          actionTag: '',
          imgList: [
            {
              id: '333',
              url: `https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fphoto%2F2009-7-30%2Fenterdesk.com-13DD143D384A30C48832CDACBC54153B.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666170017&t=b9f0ab6a04b1b2c33b55fbca22aa6def`,
              markList: [
                {
                  top: 100,
                  left: 300,
                  width: 510,
                  height: 100,
                  angle: 0,
                  label: '1',
                },
                {
                  top: 200,
                  left: 100,
                  width: 50,
                  height: 100,
                  angle: 0,
                  label: '2',
                },
              ],
            },
            {
              id: 1,
              url: `https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fspider20220812%2F27%2Fw930h697%2F20220812%2F3525-535aaec9331cf54852b2c350eeb03394.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665803609&t=4a6b257e41e2d2ae49485665b648d8aa`,
              markList: [
                {
                  top: 300,
                  left: 100,
                  width: 510,
                  height: 100,
                  angle: 0,
                  label: '1',
                },
                {
                  top: 200,
                  left: 100,
                  width: 50,
                  height: 100,
                  angle: 0,
                  label: '2',
                },
              ],
            },
          ],
          targetList: ['car', 'person'],
          originalTargetList: ['car', 'person'],
          cF: null,
        });
        const getImgUrl = (i: number) => {
          return state.imgList[i];
        };
  
        const beforeChange = (item) => {
          // 如果有标签为空不能切换
          if (state.cF.getAll().some((item) => !item.label)) {
            createMessage.warn('所有标注必须设有标签');
            return;
          }
          initMyFabric(item);
        };
  
        const initMyFabric = ({ url, markList }) => {
          state.cF && state.cF.dispose();
          state.actionTag = '';
          nextTick(() => {
            // 初始化画布
            state.cF = new myFabric({
              imgUrl: url,
              data: markList,
              // 监听画布操作
              change: (e) => moveChange(e),
            });
          });
        };
  
        const moveChange = (e) => {
          // console.log(e);
        };
        // 获取画布所有元素
        const getCfData = () => {
          console.log(state.cF.getAll());
        };
  
        const onSearch = () => {
          // value:要查询的字符串
          if (state.searchValue) {
            let arr = [];
            state.targetList.forEach((el) => {
              if (el.indexOf(state.searchValue) >= 0) {
                arr.push(el);
              }
            });
            state.targetList = arr;
          } else {
            state.targetList = state.originalTargetList;
          }
        };
  
        const tagChange = (val) => {
          state.actionTag = val;
          state.cF.updateLabel(val);
        };
  
        const tabChange = (val) => {
          // 初始化
          initMyFabric(state.imgList[0]);
        };
  
        onMounted(() => {
          initMyFabric(state.imgList[0]);
        });
  
        return {
          ...toRefs(state),
          tabChange,
          onSearch,
          moveChange,
          tagChange,
          getCfData,
          initMyFabric,
          getImgUrl,
          beforeChange,
        };
      },
    });
  </script>
  <style lang="scss" scoped>
    /* For demo */
    .markbox {
      position: relative;
      display: flex;
      justify-content: space-between;
      background-color: #fff;
    }
  
   
    .markbox-left {
      width: 50px;
      display: flex;
      align-items: center;
      .markbox-left-small {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border: 1px solid #ddd;
        border-left: none;
        border-radius: 0 3px 3px 0;
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);
        color: #979797;
        font-size: 18px;
        padding: 15px;
        button {
          width: 40px;
          height: 40px;
          margin: 15px;
        }
      }
    }
    .markbox-right {
      position: relative;
      width: 250px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-left: none;
      border-radius: 0 3px 3px 0;
      box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);
      color: #979797;
      font-size: 18px;
      padding: 15px;
      z-index: 100;
      .markbox-right-border {
        position: absolute;
        left: 0;
        width: 100%;
      }
      .markbox-right-tag {
        margin-top: 45px;
        button {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
    .markbox-img {
      display: flex;
      width: 100%;
      padding: 20px 0;
      img {
        width: 100px;
        margin-right: 10px;
      }
    }
  </style>
  