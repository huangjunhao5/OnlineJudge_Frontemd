// 展示tag
export function getStatusTagType(status) {
  if (status === 'Accepted') {
    return 'success'; // 绿色
  } else if (status === 'Pending') {
    return 'info'; // 蓝色
  } else if (status === 'Compile Error') {
    return 'warning'; // 黄色
  } else {
    return 'danger'; // 红色
  }
}
