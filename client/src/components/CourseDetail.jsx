import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { deleteCourseByIdWithAuth, getCourseById } from '../services';
import { renderHtmlFromMarkdown } from '../utils';

function ActionsBar({ course, user, match, onClick }) {
  return (
    <div className="actions--bar">
      <div className="bounds">
        <div className="grid-100">
          {course !== null && user !== null && course.User.id === user.id && (
            // Only display the buttons if the user is authorized to edit/delete the course.
            <span>
              <Link className="button" to={`/courses/${match.params.id}/update`}>
                Update Course
              </Link>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events */}
              <a className="button" role="button" tabIndex="0" onClick={onClick}>
                Delete Course
              </a>
            </span>
          )}
          <Link className="button button-secondary" to="/">
            Return to List
          </Link>
        </div>
      </div>
    </div>
  );
}

ActionsBar.defaultProps = {
  course: null,
  user: null,
};

ActionsBar.propTypes = {
  course: PropTypes.shape({
    User: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
  }),
};

// This component renders the course description, estimated time, and materials needed. The
// aforementioned properties can be written in markdown and they will be rendered as HTML. If there
// is an authenticated user in App state, and the user has authorization to edit/delete the course,
// then the appropriate buttons will be rendered.
class CourseDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      course: null,
      loading: true,
    };
  }

  // When the component first renders, display the `Loading...` text and fetch the course. Display
  // the course or handle the error, if any.
  async componentDidMount() {
    const { id } = this.props.match.params;

    try {
      const { data: course } = await getCourseById({ id });

      this.setState({
        course,
        loading: false,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Handle data fetching errors by redirecting to /notfound or /error accordingly.
  handleError = (error) => {
    const { history } = this.props;

    // The API could respond with a 403 if an unauthorized user sends a delete request.
    if (typeof error?.response?.status !== 'undefined' && error.response.status === 403) {
      history.push('/forbidden');
      return;
    }

    if (typeof error?.response?.status !== 'undefined' && error.response.status === 404) {
      history.push('/notfound');
      return;
    }

    history.push('/error');
  };

  // Allow the user to delete the course if they are authenticated and authorized to do so.
  handleDeleteButtonClick = async () => {
    const { history, user } = this.props;
    const { course } = this.state;

    // The button shouldn't render, but adding a couple checks just for safety.
    if (user === null || course === null) return;

    if (user.id !== course.User.id) {
      history.push('/forbidden');
      return;
    }

    try {
      await deleteCourseByIdWithAuth({
        id: course.id,
        emailAddress: user.emailAddress,
        password: user.password,
      });

      history.push('/');
    } catch (error) {
      this.handleError(error);
    }
  };

  render() {
    const { course, loading } = this.state;
    const { match, user } = this.props;

    if (loading) {
      return (
        <div>
          <ActionsBar match={match} onClick={this.handleDeleteButtonClick} />
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">Loading...</h3>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Fragment>
        <Helmet>
          <title>{course !== null ? course.title : 'Course'}</title>
        </Helmet>
        <div>
          <ActionsBar
            course={course}
            user={user}
            match={match}
            onClick={this.handleDeleteButtonClick}
          />
          <div className="bounds course--detail">
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{course.title}</h3>
                <p>{`By ${course.User.firstName} ${course.User.lastName}`}</p>
              </div>
              <div
                className="course--description"
                dangerouslySetInnerHTML={{ __html: renderHtmlFromMarkdown(course.description) }}
              />
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    {course.estimatedTime !== null && <h3>{course.estimatedTime}</h3>}
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    {course.materialsNeeded !== null && (
                      <ul
                        dangerouslySetInnerHTML={{
                          __html: renderHtmlFromMarkdown(course.materialsNeeded),
                        }}
                      />
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

CourseDetail.defaultProps = {
  user: null,
};

CourseDetail.propTypes = {
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
  }),
};

export default CourseDetail;
