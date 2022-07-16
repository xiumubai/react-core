/*
 * @Author: 朽木白
 * @Date: 2022-07-16 11:18:52
 * @LastEditors: 1547702880@qq.com
 * @LastEditTime: 2022-07-16 11:26:00
 * @Description:
 */
export function scheduleCallback(callback) {
  const currentTime = getCurrentTime();
  const timeout = -1;

  const expirtationTime = currentTime - timeout;

  const newTask = {
    id: taskIdCounter++,
    callback,
    expirtationTime,
    sortIndex: expirtationTime,
  };
}

export function getCurrentTime() {
  return performance.now();
}
