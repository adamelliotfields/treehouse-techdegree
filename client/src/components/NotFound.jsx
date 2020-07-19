import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

// Redirect any 404 status codes to this component.
function NotFound() {
  return (
    <Fragment>
      <Helmet>
        <title>Not Found</title>
      </Helmet>
      <div className="bounds">
        <h1>Not Found</h1>
        <p>Sorry! We couldn&apos;t find the page you&apos;re looking for.</p>
      </div>
    </Fragment>
  );
}

export default NotFound;
