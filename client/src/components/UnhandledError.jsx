import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

// Redirect to this component on any unhandled API request errors. We currently handle 403
// (forbidden) and 404 (not found).
function UnhandledError() {
  return (
    <Fragment>
      <Helmet>
        <title>Error</title>
      </Helmet>
      <div className="bounds">
        <h1>Error</h1>
        <p>Sorry! We just encountered an unexpected error.</p>
      </div>
    </Fragment>
  );
}

export default UnhandledError;
