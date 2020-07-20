# `treehouse-techdegree`

This is the final project for the Treehouse JavaScript Techdegree.

The app itself is a course library app where users can sign up and add a "course" which consists of
instructions, materials needed, and estimated time.

**Note that this is the new final project, not the legacy "capstone" project.**

## Installation

> Please use the current LTS release of Node (v12). You can (and should) use a version manager like
> NVM. Some of the libraries used will no longer install on Node v8, which reached end-of-life in
> December, 2019.

```bash
git clone https://github.com/adamelliotfields/treehouse-techdegree.git

cd treehouse-techdegree

npm install
```

The `postinstall` script will install all dependencies for the API server and React client. If you
run into issues, please try installing the dependencies for each app individually.

```bash
# If you're using the ESLint and/or Prettier extensions in VS Code, then you need to install the
# root dependencies.
npm install --ignore-scripts

# Install API dependencies.
cd api
npm install

# Install Client dependencies.
cd ../client
npm install
```

## Usage

```bash
# Run the API server and Webpack dev server.
npm start
```

If you run into issues with the `start` script, which spawns child processes via Concurrently, try
running the server and client in separate terminal tabs.

```bash
cd api
npm start

# Open a new terminal tab (Command+T in iTerm2).

cd client
npm start
```

If your browser does not automatically open, go to <http://localhost:3000>.

## Grading Criteria

See [`client/grading_criteria.pdf`](./client/grading_criteria.pdf).

- [x] Client uses Create React App and is in the [`client`](./client) folder.
- [x] Client uses React Router DOM.
- [x] Server is in the [`api`](./api) folder and uses CORS middleware.
- [x] Both apps can be run with `npm start` and have all peer dependencies met.
- [x] The client has the following stateful class components (listed as _path: component_):
  - `*`: [App](./client/src/components/App.jsx)
    - Stores user's information (including password) in application state and browser storage and passes to children as a prop.
    - Reads browser storage on mount to check for an existing logged-in user.
    - Provides a `signIn` method as a prop that stores the logged-in user in application state and browser storage.
    - Provides a `signOut` method as a prop that removes the user from application state and browser storage.
    - Logged-in state is persisted across browser tabs and browser sessions (i.e., a user can close the browser without being logged-out).
  - `/`: [`Courses`](./client/src/components/Courses.jsx)
    - Fetches courses from `/api/courses`.
    - Renders a list/grid of courses that link to their respective `CourseDetail` component.
    - Renders a link to `/courses/create`.
  - `/courses/create`: [`CreateCourse`](./client/src/components/CreateCourse.jsx)
    - Renders a form that allows the user to create a new course.
    - Renders a "Create Course" button that sends a post request to `/api/courses`.
    - Renders a "Cancel" button that redirects the user to the home page.
    - Renders validation errors returned by the server.
  - `/courses/:id`: [`CourseDetail`](./client/src/components/CourseDetail.jsx)
    - Fetches a course from `/api/courses/:id` and renders the title, description, estimated time, and materials needed.
    - Renders course description and materials needed from Markdown.
    - Renders an "Update Course" button that redirects to `/courses/:id/update`.
    - Renders a "Delete Course" button that sends a delete request to `/api/courses/:id`.
    - The "Update Course" and "Delete Course" buttons are only rendered if the user is logged in AND authorized to update/delete the course.
    - Renders a "Return to List" button that redirects to the home page.
    - Redirects to `/notfound` if the server returns a 404 status code for that course ID.
  - `/courses/:id/update`: [`UpdateCourse`](./client/src/components/UpdateCourse.jsx)
    - Renders a form that allows a user to update an existing course.
    - Populates the form fields with the existing course details.
    - Renders an "Update Course" button that sends a put request to `/api/courses/:id`.
    - Renders a "Cancel" button that redirects the user to the course detail page.
    - Redirects to `/forbidden` if the user is not authorized to update the course.
    - Redirects to `/notfound` if the server returns a 404 status code for that course ID.
    - Redirects to the course detail page on successful update.
    - Renders validation errors returned by the server.
  - `/signin`: [`UserSignIn`](./client/src/components/UserSignIn.jsx)
    - Renders a form that accepts an existing user's email address and password.
    - Renders a "Sign In" button that sends a get request to `/api/users` with the users credentials in an `Authorization` header.
    - Renders a "Cancel" button to return the user to the home page if clicked.
    - Renders a link to `/signup` to allow the user to sign-up instead.
    - Calls the `App` component's `signIn` method and passes the user object returned from `/api/users` if the server responds with a 200 status code.
    - Redirects the user to the previous location in their history on successful sign in.
    - Renders validation errors returned by the server.
  - `/signup`: [`UserSignUp`](./client/src/components/UserSignUp.jsx)
    - Renders a form that accepts a users first name, last name, email address, and password.
    - Requires the user to verify their password.
    - Renders a "Sign Up" button that sends a post request to `/api/users`.
    - Renders a "Cancel" button that returns the user to the home page.
    - Renders a link to `/signin` to allow the user to sign-in instead.
    - Logs the user in on successful sign up and redirects them to the home page.
    - Renders validation errors returned by the server.
- [x] The client has the following stateless functional components (listed as _path: component_):
  - `*`: [`Header`](./client/src/components/Header.jsx)
    - Renders "Sign In" and "Sign Up" buttons if the user is not logged-in.
    - Renders a welcome message with the user's full name and a "Sign Out" button if the user is logged-in.
  - `/signout`: [`UserSignOut`](./client/src/components/UserSignOut.jsx)
    - Calls the `App` component's `signOut` method and redirects to the home page.
  - `/notfound`: [`NotFound`](./client/src/components/NotFound.jsx)
    - The `CourseDetail` and `UpdateCourse` components redirect to `/notfound` if the course ID is not found by the server.
    - All unmatched paths will render the `NotFound` component.
  - `/forbidden`: [`Forbidden`](./client/src/components/Forbidden.jsx)
    - The `UpdateCourse` component redirects to `/forbidden` if the user is not logged-in or not authorized to update the course.
  - `/error`: [`UnhandledError`](./client/src/components/UnhandledError.jsx)
    - All components redirect to `/error` on unhandled errors.
- [x] The client has the following higher-order components:
  - [`PrivateRoute`](./client/src/components/PrivateRoute.jsx)
    - The `PrivateRoute` component renders a `Route` component if the user is logged-in and a `Redirect` component to `/signin` otherwise.
    - The `PrivateRoute` component is used for the `/courses/create` and `/courses/:id/update` routes.

## Testing

The API server has a decent E2E test suite using Postman's Newman CLI. Note that the server must be
running and the tests expect the database to be in a freshly-seeded state. In between tests, you can
run `npm run clean` and `npm run seed` to drop and re-seed the database.

The client unit tests only cover a couple components so far, but demonstrate how to use React DOM's
built-in testing utilities with Jest.

### Testing 403 Errors

The `UpdateCourse` component will redirect to `/forbidden` and render the `Forbidden` component.

In order to test the handling of 403 errors, you must be signed-in, otherwise the `PrivateRoute`
component will redirect you to `/signin`.

If you are signed-in, simply go to `/courses/:id/update` in your browser, where `:id` is the ID of a
course you did not create.

### Testing 404 Errors

The `CourseDetail` and `UpdateCourse` components will redirect to `/notfound` and render the
`NotFound` component if the course ID in the URL does not match any courses in the database.

All other 404 errors will render the `NotFound` component without redirecting.

### Testing 500 Errors

All [route handlers](./api/handlers) are wrapped in try-catch blocks. Simply throw an error at the
beginning of the `try` block and the error handling middleware will send a 500 response to the
client.

Note that if you throw outside the `try` block, the server will hang
**because Express does not handle unhandled Promise rejections for you.**

Alternatively, you can throw an error inside of the `try` block in `componentDidMount` to trigger
the error handler, just make sure you comment out the code below it so ESLint doesn't complain about
unreachable code.

## FAQ

### What does `?.` and `??` do?

The `?.` operator is the new [Optional Chaining Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining),
which allows you to access deeply nested object properties without having the check each property in
the chain first. In other words, `foo.bar.baz` will throw if `foo` or `bar` are undefined, but
`foo?.bar?.baz` will simply return `baz` or `undefined`.

The `??` operator is the new [Nullish Coalescing Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator),
which only checks the left operand for `null` or `undefined`. This differs from the `||` operator
(or), which checks for any falsy value.

Both of these operators are supported in modern browsers, and Create React App's Babel configuration
will transpile them out of the box.

### What does [`setupProxy.js`](./client/src/setupProxy.js) do?

Create React App supports a `proxy` field in `package.json` out of the box, which forwards any not
found requests to to a URL. This allows you to send your backend requests to a path (`/api`) instead
of a full URL (`http://localhost:3001/api`).

Create React App also supports a `setupProxy.js` file that allows you access Webpack Dev Server's
`http-proxy-middleware` directly, which gives you more control over proxying requests in
development.

Note that per the requirements, the API server is using CORS middleware, so sending a request to
`localhost:3001` from `localhost:3000` will work as well.

### Why do you use `<Fragment>` instead of `<>`?

I've had issues with the Auto Rename Tag extension for VS Code when using the fragment shorthand. I
also find `<Fragment>` easier to read.

### Why are you not using hooks?

Per the requirements, all of our stateful and data-fetching components must be classes, so we can't
replace them with functional components using hooks.
