import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import ValidationErrors from './ValidationErrors';
import { createCourseWithAuth } from '../services';

class CreateCourse extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      errors: [],
    };
  }

  handleError = (error) => {
    const errors = error?.response?.data?.errors ?? [error.message];

    this.setState({
      errors,
    });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;

    this.setState((state) => ({
      [name]: value,
      // Only reset validation errors when the user changes the title or description fields.
      errors: name === 'title' || name === 'description' ? [] : state.errors,
    }));
  };

  handleFormSubmit = async (e) => {
    e.preventDefault();

    const { history, user } = this.props;
    const { title, description, estimatedTime, materialsNeeded } = this.state;

    try {
      const { data: course } = await createCourseWithAuth({
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
    this.props.history.push('/');
  };

  render() {
    const { user } = this.props;
    const { title, description, estimatedTime, materialsNeeded, errors } = this.state;

    return (
      <Fragment>
        <Helmet>
          <title>Create Course</title>
        </Helmet>
        <div className="bounds course--detail">
          <h1>Create Course</h1>
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
                  Create Course
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

CreateCourse.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    emailAddress: PropTypes.string,
    password: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }).isRequired,
};

export default CreateCourse;
