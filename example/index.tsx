import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DatePicker } from '../src';
import locales from './locales';

const App = () => {
  const [{ locale, showWeekNumbers }, setState] = React.useState<any>({});

  return (
    <div>
      <form
        onChange={e => {
          if (
            e.target instanceof HTMLInputElement ||
            e.target instanceof HTMLSelectElement
          ) {
            const replacementValue = {
              [e.target.name]: e.target.value,
            };
            setState(s => ({
              ...s,
              ...replacementValue,
            }));
          }
        }}
      >
        <div>
          <ul>
            <li>
              <input name="showWeekNumbers" type="radio" value="true" /> Show
              Weeks
            </li>
            <li>
              {' '}
              <input name="showWeekNumbers" type="radio" value="" /> Don't Show
              Weeks
            </li>
          </ul>
        </div>

        <select name="locale">
          <option />
          {Object.entries(locales).map(([key, value]) => (
            <option key={key} value={key.replace(/_/g, '-')}>
              {value}
            </option>
          ))}
        </select>
      </form>
      <DatePicker locale={locale} showWeekNumbers={showWeekNumbers} />
    </div>
  );
};

(ReactDOM as any)
  .unstable_createRoot(document.getElementById('root'))
  .render(<App />);
