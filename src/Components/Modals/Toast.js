import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Toast = props => {
  const [node] = useState(document.createElement('div'));

  const removeNode = () => {
    if (!document.getElementsByClassName('toast-wrapper')[0]) return;
    if (document.getElementsByClassName('toast-wrapper')[0].children.length) {
      document.getElementsByClassName('toast-wrapper')[0].childNodes[0].remove();
    }
  };

  useEffect(() => {
    if (props.show) {
      node.style=`background: ${window.color}`;
      document
        .getElementsByClassName('toast-wrapper')[0]
        .appendChild(node)
        .classList.add('toast');

      setTimeout(() => {
        removeNode();
        props.hideToast();
      }, 2500);
    } else {
      removeNode();
    }

    return () => removeNode();
  }, [node, props]);

  return ReactDOM.createPortal(props.children, node);
};

export default Toast;