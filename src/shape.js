/**
 * 基本图形
 */
import utils from './utils/index'

// 填充矩形
export function fillRect(x, y, width, height, borderRadius = 0, color = '#fff') {
  const ctx = this.getContext()
  this.createRectPath(x, y, width, height, borderRadius)
  if (this.isLinearGradientString(color)) {
    ctx.setFillStyle(this.createLinearGradient(x, y, x + width, y + height, color))
  } else if (this.isCircularGradientString(color)) {
    ctx.setFillStyle(this.createCircularGradient(x + width / 2, y + height / 2, Math.max(width, height) / 2, color))
  } else {
    ctx.setFillStyle(color)
  }
  ctx.fill()
  // 微信小程序bug：两个路径有重叠时，使用clip会有问题，用如下代码可以解决
  ctx.fillRect(0, 0, 0, 0)
  let rect = {
    x,
    y,
    width,
    height,
  }
  return utils.calcBoundingRect(rect)
}

// 描边矩形
export function strokeRect(x, y, width, height, borderRadius = 0, borderWidth = 0, borderColor = '#fff') {
  const ctx = this.getContext()
  for (let i = 1; i <= borderWidth; i++) {
    const currBorderWidth = i
    this.createRectPath(
      x - currBorderWidth,
      y - currBorderWidth,
      width + 2 * currBorderWidth,
      height + 2 * currBorderWidth,
      borderRadius + currBorderWidth
    )
    ctx.setStrokeStyle(borderColor)
    ctx.stroke()
  }
  // 微信小程序bug：两个路径有重叠时，使用clip会有问题，用如下代码可以解决
  ctx.fillRect(0, 0, 0, 0)
  let rect = {
    x,
    y,
    width: width + 2 * borderWidth,
    height: height + 2 * borderWidth,
  }
  return utils.calcBoundingRect(rect)
}
