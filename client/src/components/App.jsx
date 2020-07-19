import React, { Component, Fragment } from 'react';
import localforage from 'localforage';
import { Helmet } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';

import Courses from './Courses';
import CourseDetail from './CourseDetail';
import CreateCourse from './CreateCourse';
import Forbidden from './Forbidden';
import Header from './Header';
import NotFound from './NotFound';
import PrivateRoute from './PrivateRoute';
import UnhandledError from './UnhandledError';
import UpdateCourse from './UpdateCourse';
import UserSignIn from './UserSignIn';
import UserSignOut from './UserSignOut';
import UserSignUp from './UserSignUp';

// The App component renders the Header and whatever components match the current route path. The
// App component should only by wrapped by Context providers (Helmet and React Router, in this
// case). The App component is responsible for storing the current authenticated user in memory
// (state), persisting and retrieving the user from browser storage, and providing methods for
// setting (sign-in) or removing (sign-out) the user.
class App extends Component {
  constructor(props) {
    super(props);

    // Using localforage as it determines the best browser storage (localStorage, IndexedDB, WebSQL)
    // for us and handles serializing/deserializing data.
    this.localforage = localforage.createInstance({
      name: 'treehouse-techdegree',
      storeName: 'state',
    });

    // All components check if the user is strictly equal to null, so never set this to some other
    // falsy value. Even though we aren't using TypeScript, it's still important to pay attention to
    // value types.
    this.state = {
      user: null,
      loading: true,
    };
  }

  // When the app first renders, check if there is a user in browser storage and set in App state.
  async componentDidMount() {
    let user;

    try {
      // Returns `null` if the user doesn't exist.
      user = await this.localforage.getItem('user');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
      // The `finally` block will always run, even if there was an error.
    } finally {
      // Be careful calling setState in componentDidMount as you don't want an infinite loop.
      if (user !== null && this.state.user === null) {
        this.setState({
          user: { ...user, password: atob(user.password) },
          loading: false,
        });
      }
    }
  }

  // Persist the user in browser storage and App state. In a production-ready application, I would
  // choose between using a session cookie (easiest), JSON Web Token, or a 3rd-party OAuth provider.
  signIn = async (user) => {
    try {
      // base64 encode the password (not secure, but better than nothing). Keep in mind we are
      // already using Basic Auth over HTTP, so it's inherently insecure.
      await this.localforage.setItem('user', { ...user, password: btoa(user.password) });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
    } finally {
      this.setState({
        user,
      });
    }
  };

  // Clear the user from browser storage and App state.
  signOut = async () => {
    try {
      await this.localforage.removeItem('user');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
    } finally {
      this.setState({
        user: null,
      });
    }
  };

  render() {
    const { user, loading } = this.state;

    if (loading) {
      return (
        <div className="header">
          <div className="bounds">
            <h1 className="header--logo">Loading...</h1>
          </div>
        </div>
      );
    }

    // React Router's `Switch` component renders the first component that matches the path, which is
    // what we want.
    return (
      <Fragment>
        <Helmet titleTemplate="%s | Treehouse Courses" />
        <Header user={user} />
        <Switch>
          <Route exact path="/" component={Courses} />
          <PrivateRoute
            // It's important that this component is listed before `CourseDetail`, as the path
            // `/courses/create` technically does match `/courses/:id`.
            path="/courses/create"
            user={user}
            component={CreateCourse}
          />
          <PrivateRoute path="/courses/:id/update" user={user} component={UpdateCourse} />
          <Route path="/courses/:id" render={(props) => <CourseDetail {...props} user={user} />} />
          <Route
            path="/signin"
            render={(props) => <UserSignIn {...props} signIn={this.signIn} />}
          />
          <Route
            path="/signout"
            render={(props) => <UserSignOut {...props} signOut={this.signOut} user={user} />}
          />
          <Route
            path="/signup"
            render={(props) => <UserSignUp {...props} signIn={this.signIn} />}
          />
          <Route path="/forbidden" component={Forbidden} />
          <Route path="/error" component={UnhandledError} />
          <Route path="/notfound" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </Fragment>
    );
  }
}

export default App;
