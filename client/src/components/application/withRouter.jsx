const { useParams } = require("react-router-dom");

const withRouter = (C) => (props) => {
  const params = useParams();

  return <C {...props} params={params} />;
};

export default withRouter;
