import {isProxy, toRaw} from "vue";

export function deepUnProxy(val: any): any {
  // 若是 Vue Proxy，则先拿到原始对象
  if (isProxy(val)) {
    val = toRaw(val);
  }
  // 数组：递归映射
  if (Array.isArray(val)) {
    return val.map(deepUnProxy);
  }
  // 普通对象：递归解绑所有字段
  if (val && typeof val === 'object') {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [k, deepUnProxy(v)])
    );
  }
  // 原始值：直接返回
  return val;
}
