export const degToRad = function(deg) {
  return (Math.PI * deg) / 180
}

// 计算矩形的bounding rect
export const calcBoundingRect = function(rect) {
  const boundingRect = {
    top: rect.y,
    bottom: rect.y + rect.height,
    left: rect.x,
    right: rect.x + rect.width,
  }
  return Object.assign({}, rect, boundingRect)
}
