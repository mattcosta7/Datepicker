import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Calendar } from '../src';

const App = () => {
  return (
    <div>
      <Calendar />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
