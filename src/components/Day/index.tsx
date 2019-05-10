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
  useOnChange,
} from '../../context/Calendar';
import {
  SET_FOCUS_DATE,
  INCREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_YEAR,
  SET_SELECTED_DATE,
} from '../../context/Calendar/actions';
const Day = ({ date }: any) => {
  const ref = React.useRef<HTMLAnchorElement>(null);
  const pageDate = usePageDate();
  const [locale, rtl] = useLocale();
  const dispatch = useCalendarDispatch();
  const focusDate = useFocusDate();
  const selectedDate = useSelectedDate();
  const onChange = useOnChange();

  const dateString = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }, [date, locale]);

  const sameMonth = React.useMemo(() => isSameMonth(pageDate, date), [
    pageDate,
    date,
  ]);

  const handleClick = React.useCallback(
    (_e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      dispatch({ type: SET_SELECTED_DATE, selectedDate: date });
      if (onChange) {
        onChange({ value: date });
      }
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
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
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
          dispatch({ type: SET_SELECTED_DATE, selectedDate: date });
          if (onChange) {
            onChange({ value: date });
          }
          break;
        }
        case ' ': {
          dispatch({ type: SET_SELECTED_DATE, selectedDate: date });
          if (onChange) {
            onChange({ value: date });
          }
          break;
        }
      }
    },
    [dispatch, rtl]
  );

  const getTabIndex = React.useCallback(
    d => (isSameDay(date, d) && isSameMonth(pageDate, d) ? 0 : -1),
    [date]
  );
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

  const ariaSelected = React.useMemo(() => {
    return selectedDate && isSameDay(date, selectedDate) ? 'true' : 'false';
  }, [selectedDate, date]);

  React.useEffect(() => {
    if (
      ref.current &&
      focusDate &&
      focusDate.getTime() === date.getTime() &&
      sameMonth
    ) {
      ref.current.focus();
    }
  }, [focusDate, date, sameMonth]);

  const Component = !sameMonth ? 'span' : 'a';
  return (
    <Component
      ref={ref}
      css={(_theme: any) => css`
          border: 0;
          cursor: pointer;
          display: block;
          flex: 1 0 ${100 / 7}%;
          text-align: center;
          height: 100%;

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

          ${!sameMonth &&
            css`
              cursor: not-allowed;
              color: grey;

              &:focus {
                appearance: none;
                outline: 0;
              }
            `}
        `}
      id={dateString}
      tabIndex={canTabTo}
      title={dateString}
      aria-label={dateString}
      onClick={sameMonth ? handleClick : undefined}
      aria-selected={ariaSelected}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    >
      {formattedDay}
    </Component>
  );
};

export default React.memo(Day);
