const Alert = (props) => {
  let alert;
  if (props.alert) {
    alert =
      <div className={'alert alert-' + props.alertType} role="alert">
          {props.alert}
      </div>;
  }
  return alert;
};

export default Alert;