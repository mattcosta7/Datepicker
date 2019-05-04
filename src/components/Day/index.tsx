/** @jsx jsx */
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import * as React from 'react';
import { getDate, isSameDay, isWeekend, isSameMonth } from 'date-fns';
import CalendarContext from '../../context/Calendar';

interface CalendarItemProps {
  weekend?: boolean;
  today?: boolean;
  isWeekdayName?: boolean;
}

const itemCss = ({
  weekend,
  today,
  isWeekdayName,
}: CalendarItemProps = {}) => css`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  flex: 1 0 ${100 / 7}%;
  text-align: center;

  ${weekend &&
    css`
      color: green;
    `}
  ${today &&
    css`
      color: red;
    `}

  &[disabled] {
    cursor: not-allowed;
    color: grey;
  }

  ${isWeekdayName &&
    css`
      cursor: default;
    `}
`;

export const Weekday = React.memo(({ dayNumber, children }: any) => {
  return (
    <span
      css={itemCss({
        weekend: dayNumber === 0 || dayNumber === 6,
        isWeekdayName: true,
      })}
      key={dayNumber}
    >
      {children}
    </span>
  );
});

export const Day = React.memo(({ date }: any) => {
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
  const styles = React.useMemo(
    () =>
      itemCss({
        weekend: isWeekend(date),
        today: isSameDay(new Date(), date),
      }),
    []
  );

  return (
    <button
      css={styles}
      key={dateString}
      title={dateString}
      aria-label={dateString}
      disabled={!sameMonth}
      onClick={sameMonth ? () => alert(dateString) : undefined}
    >
      {getDate(date)}
    </button>
  );
});
