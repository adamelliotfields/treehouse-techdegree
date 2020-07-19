import React from 'react';
import PropTypes from 'prop-types';

// This component is used anywhere we accept user input.
function ValidationErrors({ errors }) {
  if (errors.length < 1) return null;

  return (
    <div>
      <h2 className="validation--errors--label">Validation Errors</h2>
      <div className="validation-errors">
        <ul>
          {errors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

ValidationErrors.defaultProps = {
  errors: [],
};

ValidationErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.string),
};

export default ValidationErrors;
