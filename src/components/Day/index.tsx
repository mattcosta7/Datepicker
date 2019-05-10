/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';
import { isSameDay, isWeekend, isSameMonth, getDate } from 'date-fns';
import {
  usePageDate,
  useFocusDate,
  useCalendarDispatch,
  useLocale,
  useSelectedDate,
} from '../../context/Calendar';
import {
  SET_FOCUS_DATE,
  INCREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_YEAR,
  SET_SELECTED_DATE,
} from '../../types/actions';
const Day = ({ date }: any) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const pageDate = usePageDate();
  const [locale] = useLocale();
  const dispatch = useCalendarDispatch();
  const focusDate = useFocusDate();
  const selectedDate = useSelectedDate();

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
      dispatch({ type: SET_SELECTED_DATE, selectedDate: date });
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
        case 'ArrowUp': {
          dispatch({ type: DECREMENT_FOCUS_DATE, days: 7 });
          break;
        }
        case 'ArrowDown': {
          dispatch({ type: INCREMENT_FOCUS_DATE, days: 7 });
          break;
        }
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

  const getTabIndex = React.useCallback(d => (isSameDay(date, d) ? 0 : -1), [
    date,
  ]);
  const canTabTo = React.useMemo(() => {
    if (focusDate && isSameMonth(pageDate, focusDate)) {
      return getTabIndex(focusDate);
    } else if (selectedDate && isSameMonth(pageDate, selectedDate)) {
      return getTabIndex(selectedDate);
    } else if (isSameMonth(pageDate, new Date())) {
      return getTabIndex(new Date());
    }
    return getDate(date) === 1 ? 0 : -1;
  }, [focusDate, pageDate, selectedDate, date]);
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
          ${selectedDate &&
            isSameDay(selectedDate, date) &&
            css`
              color: blue;
            `}

          &[disabled] {
            cursor: not-allowed;
            color: grey;
          }
        `}
        tabIndex={canTabTo}
        title={dateString}
        aria-label={dateString}
        onClick={handleClick}
        disabled={!sameMonth}
        aria-selected={
          selectedDate && isSameDay(date, selectedDate) ? 'true' : 'false'
        }
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {formattedDay}
      </button>
    </li>
  );
};

export default React.memo(Day);
