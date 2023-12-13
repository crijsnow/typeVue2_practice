export const car_validate = (rule, value, callback) => {
  const plateNumberRegex = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使]{1}[A-Z]{1}[A-Z0-9]{5,6}$/
  if (plateNumberRegex.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的车牌号'))
  }
}
