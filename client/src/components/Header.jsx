import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

// This is our "nav bar" that displays a welcome message and sign-out link if there is an
// authenticated user in App state, or sign-up/sign-in links otherwise.
function Header({ user }) {
  return (
    <div className="header">
      <div className="bounds">
        <h1 className="header--logo">
          <NavLink exact to="/">
            Courses
          </NavLink>
        </h1>

        {user !== null ? (
          <nav>
            <span>{`Welcome ${user.firstName} ${user.lastName}!`}</span>
            <NavLink className="signout" to="/signout">
              Sign Out
            </NavLink>
          </nav>
        ) : (
          <nav>
            <NavLink className="signup" to="/signup">
              Sign Up
            </NavLink>
            <NavLink className="signin" to="/signin">
              Sign In
            </NavLink>
          </nav>
        )}
      </div>
    </div>
  );
}

Header.defaultProps = {
  user: null,
};

Header.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export default Header;
