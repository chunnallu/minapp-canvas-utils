/**
 * 像素操作
 */

// 拷贝像素区域
export function copyPixel(rect) {
  const id = this.getCanvasId()
  const component = this.getComponent()
  return new Promise((resolve, reject) => {
    const {x, y, width, height} = rect
    wx.canvasGetImageData(
      {
        canvasId: id,
        x,
        y,
        width,
        height,
        success: res => resolve(res),
        fail: err => reject(err),
      },
      component
    )
  })
}

// 粘贴像素区域
export function pastePixel(data, rect) {
  const id = this.getCanvasId()
  const component = this.getComponent()
  return new Promise((resolve, reject) => {
    const {x, y, width, height} = rect
    wx.canvasPutImageData(
      {
        canvasId: id,
        data,
        x,
        y,
        width,
        height,
        success: res => resolve(res),
        fail: err => reject(err),
      },
      component
    )
  })
}
