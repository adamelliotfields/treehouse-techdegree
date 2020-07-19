import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

// This higher-order component renders a Route component if there is an authenticated user in App
// state, or it redirects to /signin otherwise.
function PrivateRoute({ component: Component, path, user, ...rest }) {
  return (
    <Route
      {...rest}
      path={path}
      render={(props) => {
        if (user !== null) return <Component {...props} user={user} />;

        return <Redirect to="/signin" />;
      }}
    />
  );
}

PrivateRoute.defaultProps = {
  user: null,
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};

export default PrivateRoute;
