import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import ValidationErrors from './ValidationErrors';
import { getUserWithAuth } from '../services';

// This component renders the sign-in form and sends the user's credentials to the API server via
// basic auth. It also displays any errors that come back from the server. If authentication was
// successful, it stores the user in the App component's state and redirects to the previous path in
// the history stack.
class UserSignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailAddress: '',
      password: '',
      errors: [],
    };
  }

  handleError = (error) => {
    const errors = error?.response?.data?.errors ?? [error.message];
    // If there were errors on submit, reset the form and display the errors.
    this.setState({
      emailAddress: '',
      password: '',
      errors,
    });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
      // Reset the valiation errors on any key press.
      errors: [],
    });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { signIn, history } = this.props;
    const { emailAddress, password } = this.state;

    try {
      // It's much simpler to display errors in the component and handle navigation changes if we
      // fetch the data in the component.
      const { data: user } = await getUserWithAuth({ emailAddress, password });

      // The global `signIn` function is still responsible for setting the user in global state and
      // persisting to local storage.
      await signIn({ ...user, password });

      // Redirect to the previous location in the history stack.
      history.goBack();
    } catch (error) {
      this.handleError(error);
    }
  };

  // Redirect to the home page if the user wants to cancel signing in.
  handleCancelClick = () => {
    this.props.history.push('/');
  };

  render() {
    const { emailAddress, password, errors } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Sign In</title>
        </Helmet>
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign In</h1>
            <div>
              {errors.length > 0 && <ValidationErrors errors={errors} />}
              <form onSubmit={this.handleFormSubmit}>
                <div>
                  <input
                    name="emailAddress"
                    type="email"
                    placeholder="Email Address"
                    value={emailAddress}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    minLength={1}
                    onChange={this.handleInputChange}
                    required
                  />
                </div>
                <div className="grid-100 pad-bottom">
                  <input className="button" type="submit" value="Sign In" />
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={this.handleCancelClick}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
            <p>&nbsp;</p>
            <p>
              Don&apos;t have a user account? <Link to="/signup">Click here</Link> to sign up!
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

UserSignIn.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    goBack: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  signIn: PropTypes.func.isRequired,
};

export default UserSignIn;
