/**
 * 文字处理
 * 要实现：
 * 1. 文本换行
 * 2. 文本加粗
 */
import utils from './utils/index'
let config
let ctx
let DEFAULT_TEXT_CONFIG

// 重新计算对齐方式不同的文本的 rect
function _recalcAlignTextRect(rect, textAlign) {
  if (textAlign === 'right') {
    rect.x -= rect.width
    return rect
  } else if (textAlign === 'center') {
    rect.x -= rect.width / 2
    return rect
  } else {
    return rect
  }
}

// 画文字
function _drawText(text = '', x = 0, y = 0, draw = true, textIndent = 0) {
  const {lineHeight, fontSize, color, textAlign} = config.text
  const rowSpace = (lineHeight - fontSize) / 2
  const offsetY = -3 /** 修复文字上方的默认空隙 */
  ctx.setFontSize(fontSize)
  ctx.setFillStyle(color)
  ctx.setTextAlign(textAlign)
  if (draw) {
    ctx.fillText(text, x + rowSpace + textIndent, y + rowSpace + offsetY)
  }
  // 用 stroke 会导致字体模糊
  // if(bold) {
  //   ctx.setStrokeStyle(color)
  //   draw ? ctx.strokeText(text, x + rowSpace + textIndent, y + rowSpace + offsetY) : doNoThing;
  // }

  // 当前行
  const rect = {
    x,
    y,
    width: ctx.measureText('' + text).width + textIndent,
    height: lineHeight,
  }

  return utils.calcBoundingRect(rect)
}

// 画下一行文字
function _nextLine(text, prevLine, draw = true) {
  const {x, y, height} = prevLine
  return _drawText(text, x, y + height, draw)
}

// 判断是否是换行符
function _isLineBreak(char) {
  const regex = /\n|\r/
  return regex.test(char)
}

// 判断是否含有换行符
function _containsLineBreak(text) {
  const regex = /\n|\r/g
  return regex.test(text)
}

const _isOverMaxWidth = function(text, fontSize, textIndent = 0, maxWidth) {
  ctx.setFontSize(fontSize)
  return ctx.measureText(text + '').width + textIndent > maxWidth
}

export function setText(text, x, y, options) {
  config = this.config
  DEFAULT_TEXT_CONFIG = this.DEFAULT_TEXT_CONFIG
  ctx = this.getContext()
  Object.assign(config.text, DEFAULT_TEXT_CONFIG, options)

  // 状态的设置要尽快执行，不然会影响到 measureText
  const {fontSize, baseLine, draw, lineLimit, textAlign, textIndent} = config.text
  let {maxWidth, lineHeight} = config.text
  maxWidth = maxWidth || config.CANVAS_WIDTH
  if (lineHeight < fontSize) {
    lineHeight = fontSize
    config.text.lineHeight = fontSize
  }
  ctx.setFontSize(fontSize)
  ctx.setTextBaseline(baseLine)

  if (_isOverMaxWidth(text, fontSize, textIndent, maxWidth) || _containsLineBreak(text)) {
    // 需要分行
    let prevLine = {}
    let lineNumber = 0
    for (let i = 1; i <= text.length; i++) {
      // 到达限制行数
      if (lineLimit > 0 && lineNumber === lineLimit) {
        text = ''
        break
      }

      let lineText = text.substring(0, i)
      // 换行
      if (
        _isOverMaxWidth(lineText, fontSize, lineNumber === 0 ? textIndent : 0, maxWidth) ||
        _isLineBreak(lineText[lineText.length - 1])
      ) {
        let printText
        if (_isLineBreak(lineText[lineText.length - 1])) {
          // 换行符换行
          printText = lineText.slice(0, lineText.length - 1)
          text = text.slice(lineText.length, text.length)
        } else {
          // 普通换行
          printText = lineText.slice(0, lineText.length - 1)
          text = text.slice(printText.length, text.length)
        }
        if (lineNumber === 0) {
          prevLine = _drawText(printText, x, y, draw, textIndent)
        } else {
          prevLine = _nextLine(printText, prevLine, draw)
        }
        i = 0
        lineNumber++
      }
    }

    // 区分最后一行有无文字
    if (text) {
      _nextLine(text, prevLine, draw)
      lineNumber++
    }

    let rect = {
      x,
      y,
      width: maxWidth,
      height: lineNumber * lineHeight,
    }
    rect = _recalcAlignTextRect(rect, textAlign)
    return utils.calcBoundingRect(rect)
  } else {
    // 不需要分行
    let rect = _drawText(text, x, y, draw, textIndent)
    rect = _recalcAlignTextRect(rect, textAlign)
    return utils.calcBoundingRect(rect)
  }
}

// 计算文字的包围盒
export const calcTextBoundingRect = function(text, x, y, options) {
  return setText(text, x, y, {...options, draw: false})
}
