/**
 * TODO:
 * 1. 文本下划线，波浪下划线
 * 
 */
const CanvasUtils = function(id, component = this) {
  const ctx = wx.createCanvasContext(id, component);
  const DEFAULT_TEXT_CONFIG = {
    fontSize: 16,
    color: '#000',
    baseLine: 'top',
    textAlign: 'left',
    lineHeight: 16,
    bold: false,
    maxWidth: undefined,
    draw: true, /** 是否需要绘制出来，当测量时不需要绘制出来 */
    textIndent: 0,
  }

  let config = {
    CANVAS_HEIGHT: 1750,
    CANVAS_WIDTH: 1750,
    /** 当前的文字配置 */
    text: Object.assign({}, DEFAULT_TEXT_CONFIG),
    coordinate: {
      gear: 50,
      lineWidth: 1,
      dashWidth: 1,
      gapWidth: 5,
    }
  }

  /** 渲染树，保存画布的渲染信息 */
  let RenderTree = {}; 

  /**
   * 实用函数
   */
  const degToRad = function(deg) {
    return Math.PI * deg / 180
  }

  const getContext = function() {
    return ctx;
  }

  // 计算矩形的bounding rect
  const calcBoundingRect = function(rect) {
    const boundingRect = {
      top: rect.y,
      bottom: rect.y + rect.height,
      left: rect.x,
      right: rect.x + rect.width
    }
    return Object.assign({}, rect, boundingRect)
  }

  /**
   * 参考系统
   */

  const drawCoordinate =  function(options) {
    Object.assign(config.coordinate, options)
    const {CANVAS_HEIGHT, CANVAS_WIDTH} = config;
    const {gear, lineWidth, dashWidth, gapWidth} = config.coordinate;
    const times = CANVAS_HEIGHT / gear;
    ctx.setLineWidth(lineWidth);
    ctx.setLineDash([dashWidth, gapWidth], 0);
    ctx.setStrokeStyle("#CCC");
    for(let i = 0 ; i < times ; i++ ) {
      ctx.beginPath()
      ctx.moveTo(0 , i * gear)
      ctx.lineTo(CANVAS_WIDTH, i * gear)
      ctx.stroke()
      ctx.moveTo(i * gear , 0)
      ctx.lineTo(i * gear, CANVAS_HEIGHT)
      ctx.stroke()
      ctx.closePath()
    }
  }

  /**
   * 文字处理
   * 要实现：
   * 1. 文本换行
   * 2. 文本加粗
   */
  
  // 重新计算对齐方式不同的文本的 rect
  const _recalcAlignTextRect = function(rect, textAlign) {
    if(textAlign === "right") {
      rect.x -= rect.width;
      return rect;
    }else if(textAlign === "center") {
      rect.x -= rect.width/2;
      return rect;
    }else {
      return rect;
    }
  }
  
  // 画文字
  const _drawText = function(text = "", x = 0, y = 0, draw = true, textIndent = 0) {
    const doNoThing = undefined;
    const {lineHeight, fontSize, color, bold, textAlign} = config.text;
    const rowSpace = (lineHeight - fontSize) / 2;
    const offsetY = -3; /** 修复文字上方的默认空隙 */
    ctx.setFontSize(fontSize)
    ctx.setFillStyle(color)
    ctx.setTextAlign(textAlign)
    draw ? ctx.fillText(text, x + rowSpace + textIndent, y + rowSpace + offsetY) : doNoThing;
    // 用 stroke 会导致字体模糊
    // if(bold) {
    //   ctx.setStrokeStyle(color)
    //   draw ? ctx.strokeText(text, x + rowSpace + textIndent, y + rowSpace + offsetY) : doNoThing;
    // }
    
    // 当前行
    const rect = {
      x,
      y,
      width: ctx.measureText(""+text).width + textIndent,
      height: lineHeight,
    };

    return calcBoundingRect(rect);
  };

  // 画下一行文字
  const _nextLine = function (text, prevLine, draw = true) {
    const {x , y , height} = prevLine;
    return _drawText(text, x, y + height, draw)
  };

  // 判断是否是换行符
  const isLineBreak = function(char){
    const regex = /\n|\r/;
    return regex.test(char)
  }

  // 判断是否含有换行符
  const containsLineBreak = function(text) {
    const regex = /\n|\r/g;
    return regex.test(text)
  }

  const isOverMaxWidth = function(text, fontSize, textIndent = 0, maxWidth) {
    ctx.setFontSize(fontSize)
    return ctx.measureText(text+"").width +  textIndent > maxWidth
  }

  const setText = function(text, x, y , options) {
    Object.assign(config.text, DEFAULT_TEXT_CONFIG, options)

    // 状态的设置要尽快执行，不然会影响到 measureText
    const {fontSize, baseLine, draw , lineLimit, textAlign, textIndent} = config.text;
    let {maxWidth, lineHeight} = config.text;
    maxWidth = maxWidth ? maxWidth : config.CANVAS_WIDTH;
    if(lineHeight < fontSize) {
      lineHeight = fontSize;
      config.text.lineHeight = fontSize;
    }
    ctx.setFontSize(fontSize)
    ctx.setTextBaseline(baseLine);

    if(isOverMaxWidth(text, fontSize, textIndent, maxWidth)||containsLineBreak(text)) { 
      // 需要分行
      let prevLine = {}, lineNumber = 0;
      for(let i = 1; i <= text.length; i++) {
        // 到达限制行数
        if(lineLimit > 0 && lineNumber === lineLimit) {
          text = ""
          break;
        }

        let lineText = text.substring(0, i)
        // 换行
        if(isOverMaxWidth(lineText, fontSize, (lineNumber === 0 ? textIndent : 0) , maxWidth) || isLineBreak(lineText[lineText.length - 1])) {
          let printText;
          if(isLineBreak(lineText[lineText.length - 1])) {
            // 换行符换行
            printText = lineText.slice(0, lineText.length - 1);
            text = text.slice(lineText.length, text.length)
          }else{
            // 普通换行
            printText = lineText.slice(0, lineText.length -1);
            text = text.slice(printText.length, text.length)
          }
          if(lineNumber === 0) {
            prevLine = _drawText(printText, x, y, draw, textIndent)
          }else{
            prevLine = _nextLine(printText, prevLine, draw)
          }
          i = 0;
          lineNumber++;
        }
      }

      // 区分最后一行有无文字
      if(text) {
        _nextLine(text, prevLine, draw)
        lineNumber++;
      }
      
      let rect = {
        x,
        y,
        width: maxWidth,
        height: lineNumber * lineHeight
      }
      rect = _recalcAlignTextRect(rect, textAlign)
      return calcBoundingRect(rect)
    }else{
      // 不需要分行
      let rect = _drawText(text, x, y, draw, textIndent)
      rect = _recalcAlignTextRect(rect, textAlign)
      return calcBoundingRect(rect)
    }
  }

  // 计算文字的包围盒
  const calcTextBoundingRect = function(text, x, y , options) {
    return setText(text, x, y , {...options, draw: false})
  }

  /**
   * 图像
   * 要实现的效果如下：
   * 1. 能够设置图片的圆角
   * 2. 能够描边，支持矩形/圆角形状
   * 3. 能够设置图片的裁剪效果和缩放，和微信 image 的 mode 对应
   */

  const loadImages = function(srcs) {
    const promises = srcs.map(item => {
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: item,
          success: res => resolve(res),
          fail: err => reject(err),
        });
      })
    });

    return Promise.all(promises)
  }

  // 创建矩形路径
  const createRectPath = function(x, y, width, height, radius){
    const leftTop = { x, y } , rightTop = { x: x + width, y}, rightBottom = { x: x+ width, y: y + height}, leftBottom = {x, y: y + height};
    ctx.beginPath()
    ctx.moveTo(leftTop.x , leftTop.y+radius)
    ctx.arc(leftTop.x+radius , leftTop.y+radius, radius, degToRad(180), degToRad(270))
    ctx.lineTo(rightTop.x-radius, rightTop.y)
    ctx.arc(rightTop.x-radius, rightTop.y+radius, radius, degToRad(270), degToRad(360))
    ctx.lineTo(rightBottom.x, rightBottom.y - radius)
    ctx.arc(rightBottom.x-radius, rightBottom.y-radius, radius, degToRad(0), degToRad(90))
    ctx.lineTo(leftBottom.x+radius, leftBottom.y)
    ctx.arc(leftBottom.x+radius, leftBottom.y-radius, radius, degToRad(90), degToRad(180))
    ctx.lineTo(leftTop.x, leftTop.y+radius)
    ctx.closePath()
  }
  
  // 画图像
  const drawImage = function(image, x, y, {mode = "scaleToFill",width = image.width, height = image.height, borderRadius = 0, borderWidth = 0, borderColor = "#000", draw = true} = {}) {
    // 图形裁剪
    let imgX = 0, imgY = 0, imgWidth = image.width, imgHeight = image.height;
    const apsectWidth = width / imgWidth, apsectHeight = height / imgHeight, isWidthMoreLong = apsectWidth < apsectHeight;
    /** 安卓下会出现裁剪 gif 失败， 图片完全显示白色背景的现象 */
    let needCutOut = !/\.gif$/.test(image.path);
    switch(mode) {
      case "aspectFit": {
        if(isWidthMoreLong) {
          height = imgHeight * apsectWidth;
        }else{
          width = imgWidth * apsectHeight;
        }
        break;
      }
      case "aspectFill": {
        if (isWidthMoreLong) {
          imgX = (imgWidth - width / apsectHeight) / 2;
          imgWidth = width / apsectHeight;
        } else {
          imgY = (imgHeight - height / apsectWidth) / 2;
          imgHeight = height / apsectWidth;
        }
        break;
      }
      case "widthFix": {
        height = imgHeight * apsectWidth;
        break;
      }
      case "center": {
        imgX = (imgWidth - width) / 2;
        imgY = (imgHeight - height) /2;
        imgWidth = width;
        imgHeight = height;
        break;
      }
      case "top": {
        imgX = (imgWidth - width) / 2;
        imgWidth = width;
        imgHeight = height;
        break;
      }
      case "bottom": {
        imgX = (imgWidth - width) / 2;
        imgY = imgHeight - height;
        imgWidth = width;
        imgHeight = height;
        break;
      }
      case "left": {
        imgY = (imgHeight - height) /2;
        imgWidth = width;
        imgHeight = height;
        break;
      }
      case "right": {
        imgX = imgWidth - width;
        imgY = (imgHeight - height) /2;
        imgWidth = width;
        imgHeight = height;
        break;
      }
      case "none": {
        needCutOut = false;
        break;
      }
      default: {
        break;
      }
    }

    if (draw) {
      // 画边框
      if (borderWidth > 0) {
        // TODO 存在bug,不用 strokeRect(x, y, width, height, borderRadius, borderWidth, borderColor)
        fillRect(x - borderWidth, y - borderWidth, width + 2*borderWidth, height+ 2*borderWidth, borderRadius + borderWidth, borderColor)
      }

      // 图形圆角效果
      ctx.save()
      createRectPath(x, y, width, height, borderRadius)
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
      width: width + 2*borderWidth,
      height: height + 2*borderWidth
    }
    return calcBoundingRect(rect)
  }

   /**
   * 基本图形
   */

   // 填充矩形
   const fillRect = function(x, y, width, height, borderRadius = 0, color = '#fff') {
    createRectPath(x, y, width, height, borderRadius)
    ctx.setFillStyle(color)
    ctx.fill()
    // 微信小程序bug：两个路径有重叠时，使用clip会有问题，用如下代码可以解决 
    ctx.fillRect(0, 0, 0, 0);
    let rect = {
      x,
      y,
      width,
      height
    }
    return calcBoundingRect(rect)
}

// 描边矩形
const strokeRect = function(x, y, width, height, borderRadius = 0, borderWidth = 0, borderColor = '#fff') {
  for(let i = 1; i <= borderWidth; i++) {
    const currBorderWidth = i;
    createRectPath(x-currBorderWidth, y-currBorderWidth, width+2*currBorderWidth, height+2*currBorderWidth, borderRadius+currBorderWidth)
    ctx.setStrokeStyle(borderColor)
    ctx.stroke()
  }
  // 微信小程序bug：两个路径有重叠时，使用clip会有问题，用如下代码可以解决 
  ctx.fillRect(0, 0, 0, 0);
  let rect = {
    x,
    y,
    width: width+2*borderWidth,
    height: height+2*borderWidth
  }
  return calcBoundingRect(rect)
}

/**
 * 像素操作
 */

  // 拷贝像素区域
  const copy = function (rect) {
    return new Promise((resolve, reject) => {
      const { x, y, width, height } = rect;
      wx.canvasGetImageData({
        canvasId:id,
        x,
        y,
        width,
        height,
        success: res => resolve(res),
        fail: err => reject(err)
      }, component)
    });
  }

  // 粘贴像素区域
  const paste = function(data, rect){
    return new Promise((resolve, reject) => {
      const { x, y, width, height } = rect;
      wx.canvasPutImageData({
        canvasId:id,
        data,
        x,
        y,
        width,
        height,
        success: res => resolve(res),
        fail: err => reject(err)
      }, component)
    })
  }

  /**
   * 渲染
   */
  const draw = function(reverse = true) {
    return new Promise(resolve => {
      ctx.draw(reverse, () => {
        resolve()
      })
    })
    
  }

 

  /**
   * 排版
   * 要实现的规则如下：
   * 1. 一个元素能相对于另外一个元素定位，相对于另外一个元素设置 margin
   * 2. 一个元素自动占一行，下个元素自动起新行
   * 3. 可以设置元素的 width 和 height
   * 4. 支持元素的 overflow 和 text overflow
   */

  return {
    getContext,
    drawCoordinate,
    calcBoundingRect,
    setText,
    calcTextBoundingRect,
    loadImages,
    drawImage,
    fillRect,
    strokeRect,
    createRectPath,
    copy,
    paste,
    draw,
  }
}

export default CanvasUtils