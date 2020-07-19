import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { getAllCourses } from '../services';

// This component renders a list of courses from the database and forwards to /notfound and /error
// if there are any errors fetching the courses. Even if there are no courses, it will always render
// a link to /courses/create.
class Courses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: [],
      loading: true,
    };
  }

  // Display the `Loading...` text and fetch the courses. Handle any errors appropriately.
  async componentDidMount() {
    try {
      const { data: courses } = await getAllCourses();

      this.setState({
        courses,
        loading: false,
      });
    } catch (error) {
      const { history } = this.props;

      if (typeof error.response.status !== 'undefined' && error.response.status === 404) {
        history.push('/notfound');
        return;
      }

      history.push('/error');
    }
  }

  render() {
    const { courses, loading } = this.state;

    if (loading) {
      return (
        <div className="bounds">
          <div className="grid-33">
            <span className="course--module course--link">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">Loading...</h3>
            </span>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>Home</title>
        </Helmet>

        <div className="bounds">
          {courses.map((course) => (
            <div className="grid-33" key={course.id}>
              <Link className="course--module course--link" to={`/courses/${course.id}`}>
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
              </Link>
            </div>
          ))}

          <div className="grid-33">
            <Link className="course--module course--add--module" to="/courses/create">
              <h3 className="course--add--title">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 13 13"
                  className="add"
                >
                  <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 " />
                </svg>
                New Course
              </h3>
            </Link>
          </div>
        </div>
      </Fragment>
    );
  }
}

Courses.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Courses;
