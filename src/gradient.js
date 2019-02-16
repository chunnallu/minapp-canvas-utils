/**
 * 渐变
 */
import utils from './utils/index'

const linearGradientRegex = /^(linear-gradient)\((-?\d+deg,(#[0-9a-fA-F]{6} \d+%,?)+)\);?$/g

// 判断一个字符串是否是符合规范的线性渐变字符串
export function isLinearGradientString(gradientString) {
  // linear-gradient(-180deg, #FFFFFF 0%, #D7EAFF 100%)
  gradientString = gradientString.replace(/, /g, ',')
  return linearGradientRegex.test(gradientString)
}

// 将线性渐变字符串转成对象表示
export function parseLinearGradientString(gradientString) {
  gradientString = gradientString.replace(/, /g, ',')
  const type = gradientString.replace(linearGradientRegex, '$1')
  const paramArray = gradientString.replace(linearGradientRegex, '$2').split(',')

  // 将所有角度转成正角
  let deg = parseFloat(paramArray[0])

  let factors = [1, 1]
  switch (deg % 360) {
    case 0: {
      factors = factors.concat([1, 0])
      break
    }
    case 90: {
      factors = factors.concat([0, 1])
      break
    }
    case 180: {
      factors = factors.concat([0, -1])
      break
    }
    case 270: {
      factors = factors.concat([-1, 0])
      break
    }
    default: {
      factors = factors.concat([1, 1 / Math.tan(utils.degToRad(deg))])
    }
  }

  let stops = []
  for (let i = 1; i < paramArray.length; i++) {
    const arr = paramArray[i].split(' ')
    stops.push([parseFloat(arr[1]) / 100, arr[0]])
  }

  return {
    type,
    factors,
    stops,
  }
}

// 创建线性渐变
// 注意： 1. gradientString 的角度不支持负数
export function createLinearGradient(x, y, width, height, gradientString) {
  const ctx = this.getContext()
  const gradientParams = parseLinearGradientString(gradientString)
  console.log(x, y, x + Math.abs(width * gradientParams.factors[2]), y + Math.abs(height * gradientParams.factors[3]))
  const grd = ctx.createLinearGradient(
    x,
    y,
    x + Math.abs(width * gradientParams.factors[2]),
    y + Math.abs(height * gradientParams.factors[3])
  )
  const stops = gradientParams.stops
  console.log(stops)
  stops.forEach(item => {
    grd.addColorStop(item[0], item[1])
  })
  return grd
}

const circularGradientRegex = /^(circular-gradient)\(((#[0-9a-fA-F]{6} \d+%,?)+)\);?$/g

// 判断一个字符串是否是符合规范的径向渐变字符串
export function isCircularGradientString(gradientString) {
  gradientString = gradientString.replace(/, /g, ',')
  return circularGradientRegex.test(gradientString)
}

// 将径向渐变字符串转成对象表示
export function parseCircularGradientString(gradientString) {
  gradientString = gradientString.replace(/, /g, ',')
  const type = gradientString.replace(circularGradientRegex, '$1')
  const paramArray = gradientString.replace(circularGradientRegex, '$2').split(',')
  let stops = []
  for (let i = 0; i < paramArray.length; i++) {
    const arr = paramArray[i].split(' ')
    stops.push([parseFloat(arr[1]) / 100, arr[0]])
  }

  return {
    type,
    stops,
  }
}

export function createCircularGradient(x, y, radius, gradientString) {
  const ctx = this.getContext()
  const gradientParams = parseCircularGradientString(gradientString)
  const stops = gradientParams.stops
  const grd = ctx.createCircularGradient(x, y, radius)
  stops.forEach(item => {
    grd.addColorStop(item[0], item[1])
  })
  return grd
}
