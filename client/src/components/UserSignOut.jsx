import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

// Rendering this component fires the `signOut` function (a side-effect) and then renders a Redirect
// component which redirects to the home page.
function UserSignOut({ signOut, user }) {
  useEffect(() => {
    // This function is asynchronous, but we aren't doing anything after, so no need to use `then`
    // or `await`.
    signOut();
  });

  // Wait for `signOut` to finish before rendering the Redirect component.
  if (user !== null) return null;

  return <Redirect to="/" />;
}

UserSignOut.defaultProps = {
  user: null,
};

UserSignOut.propTypes = {
  signOut: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  user: PropTypes.object,
};

export default UserSignOut;
