// 创建矩形路径
import utils from './utils/index'

export function createRectPath(x, y, width, height, radius) {
  const ctx = this.getContext()
  const leftTop = {x, y}
  const rightTop = {x: x + width, y}
  const rightBottom = {x: x + width, y: y + height}
  const leftBottom = {x, y: y + height}
  ctx.beginPath()
  ctx.moveTo(leftTop.x, leftTop.y + radius)
  ctx.arc(leftTop.x + radius, leftTop.y + radius, radius, utils.degToRad(180), utils.degToRad(270))
  ctx.lineTo(rightTop.x - radius, rightTop.y)
  ctx.arc(rightTop.x - radius, rightTop.y + radius, radius, utils.degToRad(270), utils.degToRad(360))
  ctx.lineTo(rightBottom.x, rightBottom.y - radius)
  ctx.arc(rightBottom.x - radius, rightBottom.y - radius, radius, utils.degToRad(0), utils.degToRad(90))
  ctx.lineTo(leftBottom.x + radius, leftBottom.y)
  ctx.arc(leftBottom.x + radius, leftBottom.y - radius, radius, utils.degToRad(90), utils.degToRad(180))
  ctx.lineTo(leftTop.x, leftTop.y + radius)
  ctx.closePath()
}
