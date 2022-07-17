/*
 * @Author: 朽木白
 * @Date: 2022-07-16 08:00:37
 * @LastEditors: 1547702880@qq.com
 * @LastEditTime: 2022-07-17 22:04:32
 * @Description:
 */

import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from './ReactFiberReconciler';
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags';
import { scheduleCallback } from './scheduler';
import { Placement, Update, updateNode } from './utils';
let wip = null; // work in progress 当前正在工作中的
let wipRoot = null;
// 初次渲染和更新
export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;

  scheduleCallback(workLoop);
}
function performUnitWork() {
  const { tag } = wip;
  // console.log('tag', tag);
  // todo 1. 更新当前组件
  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;

    case FunctionComponent:
      updateFunctionComponent(wip);
      break;

    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  // 更新下一个：深度优先遍历 （国王的故事）
  // 子节点存在指向子节点
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;
  // 不存在子节点，去找兄弟节点，
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    // 没有兄弟节点，找到父节点，然后再找父节点的兄弟节点
    next = next.return;
  }

  wip = null;
}

function workLoop() {
  // console.log('IdleDeadLine', IdleDeadLine);
  // 使用requestIdleCallback调用
  // while (wip && IdleDeadLine.timeRemaining) {
  //   performUnitWork();
  // }

  // 使用scheduler调度算法
  while (wip) {
    performUnitWork();
  }
  if (!wip && wipRoot) {
    commitRoot();
  }
}
// 浏览器在空闲时间执行workloop

requestIdleCallback(workLoop);

function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // 1. 提交自己
  // parentNode是父DOM节点
  const parentNode = getParentNode(wip.return); // wip.return.stateNode;
  const { flags, stateNode } = wip;

  if (flags & Placement && stateNode) {
    // parentNode.appendChild(stateNode);
    parentNode.appendChild(stateNode);
  }

  if (flags & Update && stateNode) {
    // 更新属性
    updateNode(stateNode, wip.alternate.props, wip.props);
  }

  if (wip.deletions) {
    // 删除wip的子节点
    commitDeletions(wip.deletions, stateNode || parentNode);
  }
  // 2. 提交子节点
  commitWorker(wip.child);
  // 3. 提交兄弟
  commitWorker(wip.sibling);
}

function getParentNode(wip) {
  let tem = wip;
  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}

function commitDeletions(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    parentNode.removeChild(getStateNode(deletions[i]));
  }
}

// 不是每个fiber都有dom节点
function getStateNode(fiber) {
  let tem = fiber;

  while (!tem.stateNode) {
    tem = tem.child;
  }

  return tem.stateNode;
}
