/** @jsx jsx */
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import * as React from 'react';
import {
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  getDay,
  addDays,
  getDate,
  isSameDay,
  isWeekend,
  isSameMonth,
} from 'date-fns';

export interface CalendarProps {
  date?: Date;
  weekDays?: string[];
  weekStart?: number;
  locale?: string;
}

interface CalendarItemProps {
  weekend?: boolean;
  today?: boolean;
}

const CalendarContext = React.createContext({
  locale: undefined,
  monthStart: startOfMonth(new Date()),
});

const CalendarContextProvider = ({ locale, children, monthStart }: any) => {
  const value = React.useMemo(() => ({ locale, monthStart }), []);
  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

const containerCss = css`
  display: flex;
  flex-wrap: wrap;
`;

const itemCss = ({ weekend, today }: CalendarItemProps = {}) => css`
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
`;

export const Calendar = React.memo(({ date, locale }: CalendarProps) => {
  const weekDays = React.useMemo(() => {
    const arr = [];
    for (var day = 4; day <= 10; day++) {
      arr.push(
        new Date(1970, 0, day).toLocaleString(locale, {
          weekday: 'short',
        })
      );
    }
    return arr;
  }, []);

  const monthStart = React.useMemo(() => {
    return startOfMonth(date || new Date());
  }, [date]);

  const blankDaysStart = React.useMemo(() => {
    return Array.from({ length: getDay(monthStart) }, (_, i) => {
      addDays(monthStart, -i);
    });
  }, [monthStart]);

  const daysInMonth = React.useMemo(() => {
    return [
      ...Array.from({ length: getDaysInMonth(monthStart) }),
      ...Array.from({
        length: 6 - getDay(endOfMonth(monthStart)),
      }),
    ];
  }, [monthStart]);

  return (
    <CalendarContextProvider locale={locale} monthStart={monthStart}>
      <div css={containerCss}>
        {weekDays.map((v, i) => (
          <span css={itemCss({ weekend: i === 0 || i === 6 })} key={v}>
            {v}
          </span>
        ))}
        {blankDaysStart.map((_, i) => {
          return <span role="presentational" css={itemCss()} key={i} />;
        })}
        {daysInMonth.map((_, i) => {
          return <CalendarDay key={i} daysSinceMonthStart={i} />;
        })}
      </div>
    </CalendarContextProvider>
  );
});

const CalendarDay = React.memo(({ daysSinceMonthStart }: any) => {
  const { locale, monthStart } = React.useContext(CalendarContext);

  const date = React.useMemo(() => addDays(monthStart, daysSinceMonthStart), [
    monthStart,
    daysSinceMonthStart,
  ]);

  const dateString = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }, [date, locale]);

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
      disabled={!isSameMonth(monthStart, date)}
    >
      {getDate(date)}
    </button>
  );
});
