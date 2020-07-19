import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

// Redirect any 403 status codes to this component.
function Forbidden() {
  return (
    <Fragment>
      <Helmet>
        <title>Forbidden</title>
      </Helmet>
      <div className="bounds">
        <h1>Forbidden</h1>
        <p>Oh oh! You can&apos;t access this page.</p>
      </div>
    </Fragment>
  );
}

export default Forbidden;
