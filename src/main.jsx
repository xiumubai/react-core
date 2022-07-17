/*
 * @Author: 朽木白
 * @Date: 2022-06-12 19:12:11
 * @LastEditors: 1547702880@qq.com
 * @LastEditTime: 2022-07-17 17:06:26
 * @Description:
 */
import { ReactDOM, Component } from '../lib/index';
import './index.css';
function FunctionComponent(props) {
  return (
    <div className='border'>
      <h3>{props.name}</h3>
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div className='border'>
        <h3>{this.props.name}</h3>
        我是文本节点
      </div>
    );
  }
}

function FragmentComponent(props) {
  return (
    <div className='border'>
      <h3>{props.name}</h3>
      <ul>
        <>
          <li>part1</li>
          <li>part2</li>
        </>
      </ul>
    </div>
  );
}

const jsx = (
  <div className='border'>
    <h1>react</h1>
    <a href='https://github.com/bubucuo/mini-react'>mini react</a>
    <FunctionComponent name='我是函数组件' />
    <ClassComponent name='我是类组件' />
    <FragmentComponent name='我是Fragment组件' />
  </div>
);
ReactDOM.createRoot(document.getElementById('root')).render(jsx);
