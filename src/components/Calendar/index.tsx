/** @jsx jsx */
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import * as React from 'react';
import { endOfMonth, getDaysInMonth, getDay, addDays } from 'date-fns';
import CalendarContext, {
  CalendarContextProvider,
} from '../../context/Calendar';
import { Weekday, Day } from '../Day';
import { Header } from '../Header';
export interface CalendarProps {
  date?: Date;
  weekDays?: string[];
  weekStart?: number;
  locale?: string;
}

const containerCss = ({ rtl }: any) => css`
  display: flex;
  flex-wrap: wrap;

  direction: ${rtl ? 'rtl' : 'ltr'};
`;

const CalendarRows = React.memo(() => {
  const { locale, pageDate, rtl } = React.useContext(CalendarContext);
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

  const daysInMonth = React.useMemo(() => {
    return [
      ...Array.from({ length: getDay(pageDate) }),
      ...Array.from({ length: getDaysInMonth(pageDate) }),
      ...Array.from({
        length: 6 - getDay(endOfMonth(pageDate)),
      }),
    ].map((_, i) => addDays(pageDate, i - getDay(pageDate)));
  }, [pageDate]);

  return (
    <main css={containerCss({ rtl })}>
      {weekDays.map((v, i) => {
        return (
          <Weekday key={v} dayNumber={i}>
            {v}
          </Weekday>
        );
      })}

      {daysInMonth.map(v => {
        return <Day key={v} date={v} />;
      })}
    </main>
  );
});

const defaultLocale = () => {
  try {
    return (
      navigator.language ||
      (navigator as any).browserLanguage ||
      (navigator.languages || ['en'])[0]
    );
  } catch {
    return 'en';
  }
};

export const Calendar = React.memo(
  ({ date, locale = defaultLocale() }: CalendarProps) => {
    return (
      <CalendarContextProvider locale={locale} date={date}>
        <React.Fragment>
          <Header />
          <CalendarRows />
        </React.Fragment>
      </CalendarContextProvider>
    );
  }
);
