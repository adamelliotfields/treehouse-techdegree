// Constants.
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';
const AUTHORIZATION = 'Authorization';
const CONTENT_TYPE = 'Content-Type';
const APPLICATION_JSON = 'application/json';

// Custom error class similar to the error Axios returns.
class HttpError extends Error {
  constructor(message, response = {}) {
    super(message);
    this.response = response;
    this.name = 'HttpError';
  }
}

// Return a custom response object or throw if the status code is not 2xx.
const handleJsonResponse = async (response) => {
  // Note that if the response body is not valid JSON this will throw, so we need to ensure all API
  // routes return JSON. It's simpler to be consistent with our API than to keep track of which
  // routes return no content, plain text, or JSON.
  const data = await response.json();
  const { status, statusText, headers } = response;

  // Fetch doesn't throw on 4xx/5xx statuses like Axios.
  if (!response.ok) throw new HttpError(statusText, { data, status, headers });

  // Return an object similar to Axios.
  return {
    data,
    status,
    statusText,
    headers,
  };
};

// Get an array of courses from the database.
async function getAllCourses() {
  const response = await fetch('/api/courses');
  return handleJsonResponse(response);
}

// Get a single course.
async function getCourseById({ id }) {
  const response = await fetch(`/api/courses/${id}`);
  return handleJsonResponse(response);
}

// Create a new course.
async function createCourseWithAuth({
  emailAddress,
  password,
  title,
  description,
  estimatedTime,
  materialsNeeded,
}) {
  // Binary-to-ascii (i.e., string to base64).
  const ascii = btoa(`${emailAddress}:${password}`);
  const response = await fetch('/api/courses', {
    method: POST,
    headers: {
      [AUTHORIZATION]: `Basic ${ascii}`,
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      title,
      description,
      estimatedTime,
      materialsNeeded,
    }),
  });
  return handleJsonResponse(response);
}

// Update a single course with basic auth.
async function updateCourseByIdWithAuth({
  id,
  emailAddress,
  password,
  title,
  description,
  estimatedTime,
  materialsNeeded,
}) {
  const ascii = btoa(`${emailAddress}:${password}`);
  const response = await fetch(`/api/courses/${id}`, {
    method: PUT,
    headers: {
      [AUTHORIZATION]: `Basic ${ascii}`,
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      title,
      description,
      estimatedTime,
      materialsNeeded,
    }),
  });
  return handleJsonResponse(response);
}

// Delete a single course with basic auth.
async function deleteCourseByIdWithAuth({ id, emailAddress, password }) {
  const ascii = btoa(`${emailAddress}:${password}`);
  const response = await fetch(`/api/courses/${id}`, {
    method: DELETE,
    headers: {
      [AUTHORIZATION]: `Basic ${ascii}`,
    },
  });
  return handleJsonResponse(response);
}

// Get a single user with basic auth.
async function getUserWithAuth({ emailAddress, password }) {
  const ascii = btoa(`${emailAddress}:${password}`);
  const response = await fetch('/api/users', { headers: { [AUTHORIZATION]: `Basic ${ascii}` } });
  return handleJsonResponse(response);
}

// Create a new user.
async function createUser({ firstName, lastName, emailAddress, password }) {
  const response = await fetch('/api/users', {
    method: POST,
    headers: {
      [CONTENT_TYPE]: APPLICATION_JSON,
    },
    body: JSON.stringify({
      firstName,
      lastName,
      emailAddress,
      password,
    }),
  });
  return handleJsonResponse(response);
}

export {
  getAllCourses,
  getCourseById,
  createCourseWithAuth,
  updateCourseByIdWithAuth,
  deleteCourseByIdWithAuth,
  getUserWithAuth,
  createUser,
};
