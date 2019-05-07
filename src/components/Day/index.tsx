/** @jsx jsx */
import * as React from 'react';
import { jsx, css } from '@emotion/core';
import { isSameDay, isWeekend, isSameMonth } from 'date-fns';
import CalendarContext from '../../context/Calendar';

const Day = ({ date }: any) => {
  const { locale, pageDate } = React.useContext(CalendarContext);

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

  const handleClick = React.useCallback(() => {
    sameMonth ? alert(dateString) : undefined;
  }, [sameMonth, dateString]);

  const formattedDay = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
    }).format(date);
  }, [locale, date]);

  return (
    <button
      key={dateString}
      title={dateString}
      aria-label={dateString}
      disabled={!sameMonth}
      onClick={handleClick}
      css={(_theme: any) => css`
        appearance: none;
        border: 0;
        background: transparent;
        cursor: pointer;
        flex: 1 0 ${100 / 7}%;
        text-align: center;

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
    >
      {formattedDay}
    </button>
  );
};

export default React.memo(Day);
