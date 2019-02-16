/**
 * 图像
 * 要实现的效果如下：
 * 1. 能够设置图片的圆角
 * 2. 能够描边，支持矩形/圆角形状
 * 3. 能够设置图片的裁剪效果和缩放，和微信 image 的 mode 对应
 */
import utils from './utils/index'

export function loadImages(srcs) {
  const promises = srcs.map(item => {
    return new Promise((resolve, reject) => {
      // TODO 要缓存图片
      wx.getImageInfo({
        src: item,
        success: res => resolve(res),
        fail: err => reject(err),
      })
    })
  })
  return Promise.all(promises)
}

// 画图像
export function drawImage(
  image,
  x,
  y,
  {
    mode = 'scaleToFill',
    width = image.width,
    height = image.height,
    borderRadius = 0,
    borderWidth = 0,
    borderColor = '#000',
    draw = true,
  } = {}
) {
  const ctx = this.getContext()
  // 图形裁剪
  let imgX = 0
  let imgY = 0
  let imgWidth = image.width
  let imgHeight = image.height
  const apsectWidth = width / imgWidth
  const apsectHeight = height / imgHeight
  const isWidthMoreLong = apsectWidth < apsectHeight
  /** 安卓下会出现裁剪 gif 失败， 图片完全显示白色背景的现象 */
  let needCutOut = !/\.gif$/.test(image.path)
  switch (mode) {
    case 'aspectFit': {
      if (isWidthMoreLong) {
        height = imgHeight * apsectWidth
      } else {
        width = imgWidth * apsectHeight
      }
      break
    }
    case 'aspectFill': {
      if (isWidthMoreLong) {
        imgX = (imgWidth - width / apsectHeight) / 2
        imgWidth = width / apsectHeight
      } else {
        imgY = (imgHeight - height / apsectWidth) / 2
        imgHeight = height / apsectWidth
      }
      break
    }
    case 'widthFix': {
      height = imgHeight * apsectWidth
      break
    }
    case 'center': {
      imgX = (imgWidth - width) / 2
      imgY = (imgHeight - height) / 2
      imgWidth = width
      imgHeight = height
      break
    }
    case 'top': {
      imgX = (imgWidth - width) / 2
      imgWidth = width
      imgHeight = height
      break
    }
    case 'bottom': {
      imgX = (imgWidth - width) / 2
      imgY = imgHeight - height
      imgWidth = width
      imgHeight = height
      break
    }
    case 'left': {
      imgY = (imgHeight - height) / 2
      imgWidth = width
      imgHeight = height
      break
    }
    case 'right': {
      imgX = imgWidth - width
      imgY = (imgHeight - height) / 2
      imgWidth = width
      imgHeight = height
      break
    }
    case 'none': {
      needCutOut = false
      break
    }
    default: {
      break
    }
  }

  if (draw) {
    // 画边框
    if (borderWidth > 0) {
      // TODO 存在bug,不用 strokeRect(x, y, width, height, borderRadius, borderWidth, borderColor)
      this.fillRect(
        x - borderWidth,
        y - borderWidth,
        width + 2 * borderWidth,
        height + 2 * borderWidth,
        borderRadius + borderWidth,
        borderColor
      )
    }

    // 图形圆角效果
    ctx.save()
    this.createRectPath(x, y, width, height, borderRadius)
    ctx.clip()
    if (needCutOut) {
      ctx.drawImage(image.path, imgX, imgY, imgWidth, imgHeight, x, y, width, height)
    } else {
      ctx.drawImage(image.path, x, y, width, height)
    }
    ctx.restore()
  }

  let rect = {
    x: x - borderWidth,
    y: y - borderWidth,
    width: width + 2 * borderWidth,
    height: height + 2 * borderWidth,
  }
  return utils.calcBoundingRect(rect)
}
