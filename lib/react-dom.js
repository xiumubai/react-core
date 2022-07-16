/*
 * @Author: 朽木白
 * @Date: 2022-07-16 08:34:30
 * @LastEditors: 1547702880@qq.com
 * @LastEditTime: 2022-07-16 11:56:49
 * @Description:
 */
import { createFiber } from './ReactFiber';
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop';
function ReactDomRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDomRoot.prototype.render = function (children) {
  console.log('children', children); //sy-log
  const root = this._internalRoot;
  updateContainer(children, root);
};

function updateContainer(element, container) {
  const { containerInfo } = container;
  console.log('containerinfo', containerInfo); // sy-log

  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
  });
  console.log('fiber', fiber);

  // 组件初次渲染
  scheduleUpdateOnFiber(fiber);
}

function createRoot(container) {
  const root = { containerInfo: container };
  console.log('root', root); // sy-log
  return new ReactDomRoot(root);
}

export default { createRoot };
