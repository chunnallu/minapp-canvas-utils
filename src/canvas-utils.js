export default class CanvasUtils {
  constructor(id, component) {
    this.args = {
      id,
      component,
    }
    this.ctx = wx.createCanvasContext(id, component)
    this.DEFAULT_TEXT_CONFIG = {
      fontSize: 16,
      color: '#000',
      baseLine: 'top',
      textAlign: 'left',
      lineHeight: 16,
      bold: false,
      maxWidth: undefined,
      draw: true /** 是否需要绘制出来，当测量时不需要绘制出来 */,
      textIndent: 0,
    }

    this.config = {
      CANVAS_HEIGHT: 1750,
      CANVAS_WIDTH: 1750,
      /** 当前的文字配置 */
      text: Object.assign({}, this.DEFAULT_TEXT_CONFIG),
      coordinate: {
        gear: 50,
        lineWidth: 1,
        dashWidth: 1,
        gapWidth: 5,
      },
    }
  }

  getContext() {
    return this.ctx
  }

  getCanvasId() {
    return this.args.id
  }

  getComponent() {
    return this.args.component
  }

  /**
   * 渲染
   */
  draw(reverse = true) {
    return new Promise(resolve => {
      this.ctx.draw(reverse, () => {
        resolve()
      })
    })
  }
}
