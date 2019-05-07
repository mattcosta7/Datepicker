/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import CalendarContext from '../../context/Calendar';
import { addMonths, addYears, getMonth } from 'date-fns';
import Button from '../Button';

const Header = () => {
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

  const handleMonthChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setPageMonth(parseInt(e.target.value, 10));
    },
    [setPageMonth]
  );

  const handleYearChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e.target.value);

      setPageYear(parseInt(e.target.value || '0', 10));
    },
    [setPageMonth]
  );

  const currentMonthIndex = React.useMemo(() => getMonth(pageDate), [pageDate]);

  const yearFormatter = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric' }).format,
    [locale]
  );

  const prevMonth = React.useMemo(() => addMonths(pageDate, -1), [pageDate]);
  const prevYear = React.useMemo(() => addYears(pageDate, -1), [pageDate]);
  const nextMonth = React.useMemo(() => addMonths(pageDate, 1), [pageDate]);
  const nextYear = React.useMemo(() => addYears(pageDate, 1), [pageDate]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowUp':
          incrementPageYear();
          break;
        case 'ArrowDown':
          decrementPageYear();
          break;
      }
    },
    [pageDate, incrementPageYear, decrementPageYear]
  );
  return (
    <header
      css={(_theme: any) => css`
        direction: ${rtl ? 'rtl' : 'ltr'};
        display: flex;
        justify-content: space-between;
        padding: 1rem;
      `}
    >
      <div>
        <Button date={prevYear} onClick={decrementPageYear}>
          {'<<'}
        </Button>

        <Button date={prevMonth} onClick={decrementPageMonth}>
          {'<'}
        </Button>
      </div>

      <div>
        <select value={currentMonthIndex} onChange={handleMonthChange}>
          {months.map((month, i) => (
            <option key={`${month}${i}`} value={i}>
              {month}
            </option>
          ))}
        </select>
        <div
          css={(_theme: any) => css`
            position: relative;
          `}
        >
          <input
            css={(_theme: any) => css`
              appearance: none;
              border: 0;
              background: transparent;
            `}
            value={yearFormatter(pageDate)}
            onChange={handleYearChange}
            onKeyDown={handleKeyDown}
          />
          <div
            css={(_theme: any) => css`
              display: flex;
              flex-direction: column;
              position: absolute;
              right: 0;
              top: 0;
            `}
          >
            <button
              css={(_theme: any) => css`
                border: 0;
                padding: 0;
              `}
              onClick={incrementPageYear}
            >
              +
            </button>
            <button
              css={(_theme: any) => css`
                border: 0;
                padding: 0;
              `}
              onClick={decrementPageYear}
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div>
        <Button date={nextMonth} onClick={incrementPageMonth}>
          {'>'}
        </Button>

        <Button date={nextYear} onClick={incrementPageYear}>
          {'>>'}
        </Button>
      </div>
    </header>
  );
};

export default React.memo(Header);
