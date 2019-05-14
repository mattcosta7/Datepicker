import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Calendar } from '../src';
import locales from './locales';

const App = () => {
  const [
    { locale, currentDate, inputDate = '', showWeekNumbers },
    setState,
  ] = React.useState<any>({});
  const onBlur = e => {
    if (e.target instanceof HTMLInputElement) {
      const { value } = e.target;
      console.log(value);

      setState(s => ({
        ...s,
        currentDate: value,
        inputDate: value,
      }));
    }
  };

  return (
    <div>
      <input
        name="date"
        value={inputDate.toLocaleString()}
        onBlur={onBlur}
        onChange={e => {
          const { value } = e.target;
          setState(s => ({
            ...s,
            inputDate: value,
          }));
        }}
        onKeyDown={e => {
          switch (e.key) {
            case 'Enter':
              onBlur(e);
              return;
          }
        }}
      />
      {/* <output>{date && date.toLocaleString()}</output> */}
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
      <Calendar
        locale={locale}
        date={currentDate}
        showWeekNumbers={!!showWeekNumbers}
        onChange={(e: any) => {
          if (e.value) {
            setState(s => ({
              ...s,
              currentDate: e.value,
              inputDate: e.value,
            }));
          }
        }}
        parseDate={s => {
          if (s instanceof Date) {
            return s;
          }
          const d = s.split('/');
          return new Date(
            parseInt(d[2], 10),
            parseInt(d[0], 10) - 1,
            parseInt(d[1], 10)
          );
        }}
      />
    </div>
  );
};

(ReactDOM as any)
  .unstable_createRoot(document.getElementById('root'))
  .render(<App />);
