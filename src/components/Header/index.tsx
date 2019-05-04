/** @jsx jsx */
import { jsx } from '@emotion/core';
import css from '@emotion/css';
import * as React from 'react';
import CalendarContext from '../../context/Calendar';
import { addMonths, addYears, getMonth, getYear } from 'date-fns';

const headerCss = ({ rtl }: any) => css`
  display: flex;
  justify-content: space-between;

  direction: ${rtl ? 'rtl' : 'ltr'};
`;

export const Header = React.memo(() => {
  const {
    locale,
    decrementPageMonth,
    incrementPageMonth,
    pageDate,
    decrementPageYear,
    incrementPageYear,
    setPageMonth,
    setPageYear,
    rtl,
  } = React.useContext(CalendarContext);
  const months = React.useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: 'long' });
    const _months: string[] = [];
    for (let month = 0; month < 12; month++) {
      const testDate = new Date(new Date().getFullYear(), month, 1, 0, 0, 0);
      _months.push(format.format(testDate));
    }
    return _months;
  }, [locale]);
  const dateFormatter = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format;
  }, [locale]);

  const nextMonthDateString = React.useMemo(() => {
    return dateFormatter(addMonths(pageDate, 1));
  }, [pageDate, dateFormatter]);

  const nextYearDateString = React.useMemo(() => {
    return dateFormatter(addYears(pageDate, 1));
  }, [pageDate, dateFormatter]);

  const prevMonthDateString = React.useMemo(() => {
    return dateFormatter(addMonths(pageDate, -1));
  }, [pageDate, dateFormatter]);

  const prevYearDateString = React.useMemo(() => {
    return dateFormatter(addYears(pageDate, -1));
  }, [pageDate, dateFormatter]);

  const handleMonthChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageMonth(parseInt(e.target.value, 10));
    },
    [setPageMonth]
  );

  const handleYearChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPageYear(parseInt(e.target.value, 10));
    },
    [setPageMonth]
  );

  const currentMonthIndex = React.useMemo(() => {
    return getMonth(pageDate);
  }, [pageDate]);

  const currentYearIndex = React.useMemo(() => {
    return getYear(pageDate);
  }, [pageDate]);

  return (
    <header css={headerCss({ rtl })}>
      <div>
        <button
          title={`Set calendar date to ${prevYearDateString}`}
          aria-label={`Set calendar date to ${prevYearDateString}`}
          onClick={decrementPageYear}
        >
          {'<<'}
        </button>
        <button
          title={`Set calendar date to ${prevMonthDateString}`}
          aria-label={`Set calendar date to ${prevMonthDateString}`}
          onClick={decrementPageMonth}
        >
          {'<'}
        </button>
      </div>

      <div>
        <select value={currentMonthIndex} onChange={handleMonthChange}>
          {months.map((month, i) => (
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={currentYearIndex}
          onChange={handleYearChange}
        />
      </div>

      <div>
        <button
          onClick={incrementPageMonth}
          title={`Set calendar date to ${nextMonthDateString}`}
          aria-label={`Set calendar date to ${nextMonthDateString}`}
        >
          {'>'}
        </button>
        <button
          title={`Set calendar date to ${nextYearDateString}`}
          aria-label={`Set calendar date to ${nextYearDateString}`}
          onClick={incrementPageYear}
        >
          {'>>'}
        </button>
      </div>
    </header>
  );
});
