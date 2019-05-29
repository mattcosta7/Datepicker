/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getWeek } from 'date-fns/esm';
import * as React from 'react';
import {
  useCalendarDaysByWeek,
  useCalendarDispatch,
  useLocale,
  useShowWeekNumbers,
} from '../../hooks';
import {
  DECREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_YEAR,
  INCREMENT_FOCUS_DATE,
  SET_FOCUS_DATE,
  SET_SELECTED_DATE,
} from '../Calendar/actions';
import Day from '../Day';

const CalendarDays = () => {
  const showWeekNumbers = useShowWeekNumbers();
  const dispatch = useCalendarDispatch();
  const [locale, rtl] = useLocale();
  const weeks = useCalendarDaysByWeek();

  const formatter = new Intl.DateTimeFormat(locale).format;

  const dayFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
  }).format;

  const dateStringFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format;

  const numberFormatter = new Intl.NumberFormat(locale).format;

  const handleFocus = (date: Date) => {
    dispatch({ type: SET_FOCUS_DATE, date });
  };

  const handleClick = (date: Date) => {
    dispatch({ type: SET_SELECTED_DATE, date });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    date: Date
  ) => {
    switch (e.key) {
      case 'ArrowUp': {
        dispatch({ type: DECREMENT_FOCUS_DATE, count: 7 });
        break;
      }
      case 'ArrowDown': {
        dispatch({ type: INCREMENT_FOCUS_DATE, count: 7 });
        break;
      }
      case 'ArrowLeft': {
        if (rtl) {
          dispatch({ type: INCREMENT_FOCUS_DATE });
        } else {
          dispatch({ type: DECREMENT_FOCUS_DATE });
        }
        break;
      }
      case 'ArrowRight': {
        if (rtl) {
          dispatch({ type: DECREMENT_FOCUS_DATE });
        } else {
          dispatch({ type: INCREMENT_FOCUS_DATE });
        }
        break;
      }
      case 'PageDown': {
        dispatch({ type: DECREMENT_FOCUS_MONTH });
        break;
      }
      case 'PageUp': {
        dispatch({ type: DECREMENT_FOCUS_MONTH });
        break;
      }
      case 'Home': {
        dispatch({ type: DECREMENT_FOCUS_YEAR });
        break;
      }
      case 'End': {
        dispatch({ type: DECREMENT_FOCUS_YEAR });
        break;
      }
      case 'Enter': {
        dispatch({ type: SET_SELECTED_DATE, date });
        // if (onChange) {
        //   onChange({ value: date });
        // }
        break;
      }
      case ' ': {
        dispatch({ type: SET_SELECTED_DATE, date });
        // if (onChange) {
        //   onChange({ value: date });
        // }
        break;
      }
    }
  };

  return (
    <React.Fragment>
      {weeks.map(daysInWeek => {
        const weekNumber = numberFormatter(getWeek(daysInWeek[0]));
        const day0 = formatter(daysInWeek[0]);
        const day6 = formatter(daysInWeek[6]);
        return (
          <tr
            key={weekNumber}
            aria-label={rtl ? `${day6} - ${day0}` : `${day0} - ${day6}`}
          >
            {showWeekNumbers && <td>{weekNumber}</td>}
            {daysInWeek.map(v => {
              const dateString = dateStringFormatter(v);
              return (
                <td key={v.toLocaleDateString()}>
                  <Day
                    date={v.getTime()}
                    title={dateString}
                    id={dateString}
                    aria-label={dateString}
                    handleFocus={handleFocus}
                    handleClick={handleClick}
                    handleKeyDown={handleKeyDown}
                  >
                    {dayFormatter(v)}
                  </Day>
                </td>
              );
            })}
          </tr>
        );
      })}
    </React.Fragment>
  );
};

export default CalendarDays;
