<template>
  <view class="content">
    <div>Handwriting</div>
    <div class="canvas-box">
      <canvas
        type="2d"
        class="handwriting"
        disable-scroll="true"
        @touchstart="uploadScaleStart"
        @touchmove="uploadScaleMove"
        @touchend="uploadScaleEnd"
        canvas-id="handwriting"
        id="handwriting"
      ></canvas>
    </div>
    <div>
      <button @tap="retDraw" class="del-btn">清除</button>
      <button @tap="subCanvas" class="sub-btn">横向签字板</button>
      <button @tap="onConfirm" class="sub-btn">保存</button>
      <button @tap="onConfirmWithTag" class="sub-btn">保存（水印）</button>
    </div>
    <div>
      <img :src="filePath" alt />
    </div>
  </view>
</template>

<script lang="ts">
import Vue from 'vue';
import SignaturePad from '../../common/signaturePad.js'

let penColor = 'black';
let lineWidth = 0.6;

export default Vue.extend({
  data() {
    return {
      signaturePad: SignaturePad,
      penColor: 'black',
      lineWidth: 0.6,
      isEmpty: true,
      filePath: '',
      pix: 7,
      width: 0,
      height: 0,
    }
  },
  onLoad() {
    let self = this
    const query = wx.createSelectorQuery()
    query.select('#handwriting')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        console.log(ctx)
        const data = {
          devicePixelRatio: this.pix,
          minWidth: 0.6,
          maxWidth: 5,
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: "rgb(66, 133, 244)"
        };

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        ctx.scale(dpr, dpr)

        self.signaturePad = new SignaturePad(canvas, ctx, data)
      })

    // let self = this
    // wx.getSystemInfo({
    //   success: function (res) {
    //     self.pix = res.pixelRatio
    //     self.width = res.windowWidth * self.pix
    //     self.height = res.windowHeight * self.pix
    //   }
    // })
    // const query = wx.createSelectorQuery()
    // const canvas = query.select("#handwriting")
    // let ctx = canvas.context(res => {
    //   console.log(res.context)
    //   // res.getContext('2d')
    //   // console.log(res)
    // })
    // this.signaturePad = new SignaturePad(ctx)
    // canvas.context(res => {
    //   console.log(res)
    //   ctx = res.context
    //   const data = {
    //     devicePixelRatio: this.pix,
    //     minWidth: 0.6,
    //     maxWidth: 5,
    //     backgroundColor: 'rgba(255, 255, 255, 0)',
    //     penColor: "rgb(66, 133, 244)"
    //   };
    //   this.signaturePad = new SignaturePad(ctx, data)
    //   console.log(this.signaturePad)
    // }).exec()

  },
  methods: {
    uploadScaleStart(e) {
      const item = {
        penColor: penColor,
        lineWidth: lineWidth
      };
      this.signaturePad.handleTouchStart(e, item);
    },
    uploadScaleMove(e) {
      this.signaturePad.handleTouchMove(e);
    },
    uploadScaleEnd(e) {
      this.signaturePad.handleTouchEnd(e);
      // const isEmpty = signaturePad.isEmpty();
      // this.isEmpty = isEmpty
    },
    retDraw() {
      this.signaturePad.clear();
      const isEmpty = this.signaturePad.isEmpty();
      this.isEmpty = isEmpty
    },
    subCanvas: function () {
      if (this.isEmpty) {
        return false
      }
    },
    onConfirm: function () {
      if (this.isEmpty) {
        return false
      }
      const self = this;
      wx.canvasToTempFilePath({
        canvasId: 'handwriting',
        success: function (res) {
          console.log(res.tempFilePath)
          self.filePath = res.tempFilePath
        },
        fail: function (res) {
          console.log(res)
        },
        complete: function (res) {
          console.log(res)
        }
      })
    },
    onConfirmWithTag() {}
  }
});
</script>

<style>
.canvas-box {
  margin: 30rpx;
  height: 500rpx;
  border: 1px solid #666;
  border-radius: 50rpx;
}
#handwriting {
  /* width: 80vw;
  height: 50vh; */
  width: 100%;
  height: 100%;
}
</style>
