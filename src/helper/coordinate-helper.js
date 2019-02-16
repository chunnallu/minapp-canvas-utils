/**
 * 参考系统
 */
export function drawCoordinate(options) {
  const config = this.config
  const ctx = this.getContext()
  Object.assign(config.coordinate, options)
  const {CANVAS_HEIGHT, CANVAS_WIDTH} = config
  const {gear, lineWidth, dashWidth, gapWidth} = config.coordinate
  const times = CANVAS_HEIGHT / gear
  ctx.setLineWidth(lineWidth)
  ctx.setLineDash([dashWidth, gapWidth], 0)
  ctx.setStrokeStyle('#CCC')
  for (let i = 0; i < times; i++) {
    ctx.beginPath()
    ctx.moveTo(0, i * gear)
    ctx.lineTo(CANVAS_WIDTH, i * gear)
    ctx.stroke()
    ctx.moveTo(i * gear, 0)
    ctx.lineTo(i * gear, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.closePath()
  }
}
