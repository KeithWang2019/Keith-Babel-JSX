import { ToolKit } from "@keithwang/keith-core";
import { VClass } from "@keithwang/keith-core";
import { VNode } from "@keithwang/keith-core";

async function transformElement(vnode) {
  if (vnode instanceof Promise) {
    return await vnode;
  }

  switch (typeof vnode) {
    case "string":
    case "number":
      let text = new VNode("#text");
      text.value = vnode.toString();
      return text;
    case "function":
      return vnode();
    default:
      return vnode;
  }
}

const appendChildren = async (vnode, children) => {
  if (Array.isArray(children)) {
    for (let i = 0; i < children.length; i++) {
      let childNode = children[i];
      const transformChild = await transformElement(childNode);
      if (Array.isArray(transformChild)) {
        vnode = await appendChildren(vnode, transformChild);
      } else {
        vnode.appendChild(transformChild);
      }
    }
  } else {
    const transformChild = await transformElement(children);
    vnode.appendChild(transformChild);
  }
  return vnode;
};

/**
 * babel plugin-transform-react-jsx 入口
 * @param {*} tag
 * @param {*} param1
 * @returns
 */
const jsx = async (tag, { ref, children, ...allProps } = {}, key) => {
  let props = {};
  let events = {};
  let className = {};
  let style = {};
  Object.keys(allProps).forEach((propKey) => {
    let name = propKey.toLowerCase();
    if (name.startsWith("on")) {
      events[propKey] = allProps[propKey];
    } else if (name == "classname") {
      className = allProps[propKey];
    } else if (name == "style") {
      style = allProps[propKey];
    } else {
      props[propKey] = allProps[propKey];
    }
  });

  if (typeof tag === "string") {
    let vnode = new VNode(tag);
    vnode.key = key;

    Object.keys(events).forEach((eventName) => {
      if (typeof events[eventName] === "function") {
        switch (eventName.toLowerCase()) {
          case "onclick":
            vnode.addEventListener("click", events[eventName]);
            break;
          default:
            // 过滤方法，防止闭包引起的无法释放问题。
            break;
        }
      }
    });

    vnode.setClass(className);     
    vnode.setStyle(style);

    Object.keys(props).forEach((propKey) => {
      vnode.setAttribute(propKey, props[propKey]);
    });

    if (children) {
      vnode = await appendChildren(vnode, children);
    }

    if (ref) {
      if (typeof ref === "function") {
        // ref(vnode);
        // debugger;
        vnode.setRef(ref);
      } else {
        throw "ref必须绑定方法:" + tag + "," + ref;
      }
    }

    return vnode;
  }
  if (typeof tag === "function") {
    // 自定义对象
    // 对象定义
    // let view = new tag({ ref, children, ...props, key });
    let cloneProps = ToolKit.deepClone(props); // 永远禁止子对象有机会更改父对象属性
    let vclass = new VClass(tag, {
      ref,
      children,
      props: { ...cloneProps },
      events,
      key,
    });
    return vclass;
  }
  throw new Error(`Invalid tag type: ${tag}`);
};

const jsxs = jsx;

const Fragment = ({ children } = {}) => {
  const element = document.createDocumentFragment();

  return appendChildren(element, children);
};

export { jsx, jsxs, Fragment, transformElement };
