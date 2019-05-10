/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';
import { isSameDay, isWeekend, isSameMonth } from 'date-fns';
import {
  usePageDate,
  useFocusDate,
  useCalendarDispatch,
  useLocale,
} from '../../context/Calendar';
import {
  SET_FOCUS_DATE,
  INCREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_YEAR,
} from '../../actions/types';
const Day = ({ date }: any) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const pageDate = usePageDate();
  const [locale] = useLocale();
  const dispatch = useCalendarDispatch();
  const focusDate = useFocusDate();

  const dateString = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }, [date, locale]);

  const sameMonth = React.useMemo(() => isSameMonth(pageDate, date), [
    pageDate.getTime(),
    date.getTime(),
  ]);

  const handleClick = React.useCallback(
    (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      console.log(date);
    },
    [date]
  );

  const formattedDay = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
    }).format(date);
  }, [locale, date]);

  const handleFocus = React.useCallback(() => {
    dispatch({ type: SET_FOCUS_DATE, focusDate: date });
  }, [date, dispatch]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (e.key) {
        case 'ArrowLeft': {
          dispatch({ type: DECREMENT_FOCUS_DATE });
          break;
        }
        case 'ArrowRight': {
          dispatch({ type: INCREMENT_FOCUS_DATE });
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
      }
    },
    [dispatch]
  );
  React.useEffect(() => {
    if (ref.current && focusDate && focusDate.getTime() === date.getTime()) {
      ref.current.focus();
    }
  }, [focusDate, date]);
  return (
    <li
      css={css`
        flex: 1 0 calc(100% / 7);
      `}
    >
      <button
        ref={ref}
        css={(_theme: any) => css`
          appearance: none;
          border: 0;
          background: transparent;
          cursor: pointer;
          flex: 1 0 ${100 / 7}%;
          text-align: center;
          height: 100%;
          width: 100%;
          ${isWeekend(date) &&
            css`
              color: green;
            `}
          ${isSameDay(new Date(), date) &&
            css`
              color: red;
            `}

          &[disabled] {
            cursor: not-allowed;
            color: grey;
          }
        `}
        title={dateString}
        aria-label={dateString}
        onClick={handleClick}
        disabled={!sameMonth}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {formattedDay}
      </button>
    </li>
  );
};

export default React.memo(Day);
