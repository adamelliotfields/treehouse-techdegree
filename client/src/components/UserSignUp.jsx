import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import ValidationErrors from './ValidationErrors';
import { createUser } from '../services';

// This component renders the sign-up form and sends the user's credentials to the API server via
// basic auth. It also displays any errors that come back from the server. If sign-up was
// successful, the user will be logged-in as if they had submitted the sign-in form.
class UserSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      passwordConfirm: '',
      errors: [],
    };
  }

  handleError = (error) => {
    const errors = error?.response?.data?.errors ?? [error.message];

    // If there were errors on submit, display the errors.
    this.setState({
      errors,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      errors: [],
    });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { signIn, history } = this.props;
    const { firstName, lastName, emailAddress, password, passwordConfirm } = this.state;

    if (password !== passwordConfirm) {
      this.setState({
        errors: ['passwords must be equal'],
      });
      return;
    }

    try {
      // It's much simpler to display errors in the component and handle navigation changes if we
      // fetch the data in the component.
      //
      // The global `signIn` function is still responsible for setting the user in global state and
      // persisting to local storage.
      const { data: user } = await createUser({ firstName, lastName, emailAddress, password });
      await signIn({ ...user, password });
      history.push('/');
    } catch (error) {
      this.handleError(error);
    }
  };

  // Redirect to the home page if the user wants to cancel signing up.
  handleCancelClick = () => {
    this.props.history.push('/');
  };

  render() {
    const { firstName, lastName, emailAddress, password, passwordConfirm, errors } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Sign Up</title>
        </Helmet>
        <div className="bounds">
          <div className="grid-33 centered signin">
            <h1>Sign Up</h1>
            <div>
              {errors.length > 0 && <ValidationErrors errors={errors} />}
              <form onSubmit={this.handleFormSubmit}>
                <div>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="emailAddress"
                    type="email"
                    placeholder="Email Address"
                    value={emailAddress}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <input
                    name="passwordConfirm"
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirm}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="grid-100 pad-bottom">
                  <input className="button" type="submit" value="Sign Up" />
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
              Already have a user account? <Link to="/signin">Click here</Link> to sign in!
            </p>
          </div>
        </div>
      </Fragment>
    );
  }
}

UserSignUp.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  signIn: PropTypes.func.isRequired,
};

export default UserSignUp;
