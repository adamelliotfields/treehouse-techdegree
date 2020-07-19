import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import ValidationErrors from './ValidationErrors';
import { getCourseById, updateCourseByIdWithAuth } from '../services';

class UpdateCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      loading: true,
      errors: [],
    };
  }

  async componentDidMount() {
    const { history, match, user } = this.props;
    const courseId = match.params.id;
    const userId = user.id;

    try {
      const { data: course } = await getCourseById({ id: courseId });

      // If the user is not authorized to update the course, redirect to `/forbidden`.
      if (course.User.id !== userId) {
        history.push(`/forbidden`);
        return;
      }

      // Populate the form fields with the existing course data.
      this.setState({
        title: course.title,
        description: course.description,
        // These properties are not required, so the database could return `null`.
        estimatedTime: course.estimatedTime ?? '',
        materialsNeeded: course.materialsNeeded ?? '',
        loading: false,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError = (error) => {
    const { history } = this.props;

    // Redirect to `/notfound` if the course isn't found.
    if (typeof error?.response?.status !== 'undefined' && error.response.status === 404) {
      history.push('/notfound');
      return;
    }

    // If the `errors` array exists, it means there were validation errors (400 status code).
    if (typeof error?.response?.data?.errors !== 'undefined') {
      this.setState({
        loading: false,
        errors: error.response.data.errors,
      });
      return;
    }

    // Redirect to `/error` for any other errors.
    history.push('/error');
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;

    this.setState((state) => ({
      [name]: value,
      // Only reset validation errors when the user changes the title or description fields.
      errors: name === 'title' || name === 'description' ? [] : state.errors,
    }));
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();

    const { history, match, user } = this.props;
    const { title, description, estimatedTime, materialsNeeded } = this.state;

    try {
      const { data: course } = await updateCourseByIdWithAuth({
        id: match.params.id,
        emailAddress: user.emailAddress,
        password: user.password,
        title,
        description,
        estimatedTime,
        materialsNeeded,
      });

      history.push(`/courses/${course.id}`);
    } catch (error) {
      this.handleError(error);
    }
  };

  handleCancelClick = () => {
    const { history, match } = this.props;

    history.push(`/courses/${match.params.id}`);
  };

  render() {
    const { user } = this.props;
    const { title, description, estimatedTime, materialsNeeded, loading, errors } = this.state;

    if (loading) {
      return (
        <div className="bounds course--detail">
          <h1>Loading...</h1>
        </div>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>Update Course</title>
        </Helmet>
        <div className="bounds course--detail">
          <h1>Update Course</h1>
          <div>
            <ValidationErrors errors={errors} />
            <form onSubmit={this.handleFormSubmit}>
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <div>
                    <input
                      // Note that we could check for validation errors before submitting the form,
                      // but the requirements are to render the validation errors from the server.
                      name="title"
                      type="text"
                      className="input-title course--title--input"
                      placeholder="Course title..."
                      value={title}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <p>{`By ${user.firstName} ${user.lastName}`}</p>
                </div>
                <div className="course--description">
                  <div>
                    <textarea
                      name="description"
                      placeholder="Course description..."
                      value={description}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <div>
                        <input
                          name="estimatedTime"
                          type="text"
                          className="course--time--input"
                          placeholder="Hours"
                          value={estimatedTime}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <div>
                        <textarea
                          name="materialsNeeded"
                          placeholder="List materials..."
                          value={materialsNeeded}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">
                  Update Course
                </button>
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
        </div>
      </Fragment>
    );
  }
}

UpdateCourse.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    emailAddress: PropTypes.string,
    password: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

export default UpdateCourse;
