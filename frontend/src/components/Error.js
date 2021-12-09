const Error = (props) => {
  const { message } = props
  return (
    <div className="ui icon error message">
      <i className="exclamation circle icon"></i>      
      <div className="header">
        {message}
      </div>
    </div>
  );
}
export default Error
