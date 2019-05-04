import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Calendar } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Calendar />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
