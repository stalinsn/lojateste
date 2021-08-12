export const mountReactComponent = (component, container) => {
  const e = React.createElement;
  window.ReactDOM.render(e(component), container);
};

export const unmountReactComponent = (container) => {
  ReactDOM.unmountComponentAtNode(container);
};
