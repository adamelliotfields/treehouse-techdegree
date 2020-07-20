import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';

import UserSignOut from '../components/UserSignOut';

const signOut = jest.fn();
let location;

beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  act(() => {
    render(
      <MemoryRouter initialEntries={['/signout']}>
        <UserSignOut user={null} signOut={signOut} />
        <Route
          // Update location when the component renders so we can access it in our tests.
          render={(props) => {
            location = props.location;
            return null;
          }}
        />
      </MemoryRouter>,
      root,
    );
  });
});

afterEach(() => {
  const root = document.getElementById('root');
  document.body.removeChild(root);
});

describe('<UserSignOut />', () => {
  it('should call signOut', () => {
    expect(signOut).toHaveBeenCalled();
  });

  it('should redirect to /', () => {
    expect(location.pathname).toBe('/');
  });
});
