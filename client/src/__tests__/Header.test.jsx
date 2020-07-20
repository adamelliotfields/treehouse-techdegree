import React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';

import Header from '../components/Header';

beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
});

afterEach(() => {
  const root = document.getElementById('root');
  document.body.removeChild(root);
});

describe('<Header />', () => {
  it('should render the welcome message and sign out link', () => {
    const root = document.getElementById('root');

    // If we have a user object, we should render the welcome message and sign out link.
    act(() => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Header brand="Courses" user={{ firstName: 'Adam', lastName: 'Fields' }} />
        </MemoryRouter>,
        root,
      );
    });

    const [span] = document.getElementsByTagName('span');
    // The first link is the navbar brand link ("Courses").
    const [, link] = document.getElementsByTagName('a');

    expect(span.textContent).toBe('Welcome Adam Fields!');
    expect(link.textContent).toBe('Sign Out');
  });

  it('should render the sign up and sign in links', () => {
    const root = document.getElementById('root');

    // If user is null, we should render the sign up and sign in links.
    act(() => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <Header brand="Courses" user={null} />
        </MemoryRouter>,
        root,
      );
    });

    const [, link1, link2] = document.getElementsByTagName('a');
    const link1Url = new URL(link1.href);
    const link2Url = new URL(link2.href);

    expect(link1.textContent).toBe('Sign Up');
    expect(link1Url.pathname).toBe('/signup');
    expect(link2.textContent).toBe('Sign In');
    expect(link2Url.pathname).toBe('/signin');
  });
});
