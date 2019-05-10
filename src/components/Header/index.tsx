/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import {
  useCalendarDispatch,
  usePageDate,
  useLocale,
} from '../../context/Calendar';

import { addMonths, addYears, getMonth } from 'date-fns';
import Button from '../Button';
import {
  DECREMENT_PAGE_MONTH,
  DECREMENT_PAGE_YEAR,
  INCREMENT_PAGE_MONTH,
  INCREMENT_PAGE_YEAR,
  SET_PAGE_MONTH,
  SET_PAGE_YEAR,
} from '../../types/actions';

const Header = () => {
  const dispatch = useCalendarDispatch();
  const pageDate = usePageDate();
  const [locale, rtl] = useLocale();

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
      dispatch({ type: SET_PAGE_MONTH, month: parseInt(e.target.value, 10) });
    },
    []
  );

  const handleYearChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: SET_PAGE_YEAR,
        year: parseInt(e.target.value || '0', 10),
      });
    },
    []
  );

  const currentMonthIndex = React.useMemo(() => getMonth(pageDate), [pageDate]);

  const yearFormatted = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(pageDate),
    [locale, pageDate]
  );

  const prevMonth = React.useMemo(() => addMonths(pageDate, -1), [pageDate]);
  const prevYear = React.useMemo(() => addYears(pageDate, -1), [pageDate]);
  const nextMonth = React.useMemo(() => addMonths(pageDate, 1), [pageDate]);
  const nextYear = React.useMemo(() => addYears(pageDate, 1), [pageDate]);

  const decrementPageYear = React.useCallback(() => {
    dispatch({ type: DECREMENT_PAGE_YEAR });
  }, [dispatch]);
  const incrementPageYear = React.useCallback(() => {
    dispatch({ type: INCREMENT_PAGE_YEAR });
  }, [dispatch]);
  const decrementPageMonth = React.useCallback(() => {
    dispatch({ type: DECREMENT_PAGE_MONTH });
  }, [dispatch]);
  const incrementPageMonth = React.useCallback(() => {
    dispatch({ type: INCREMENT_PAGE_MONTH });
  }, [dispatch]);

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
    [pageDate]
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
      <div
        css={(_theme: any) => css`
          order: 1;
        `}
      >
        <Button date={prevYear} onClick={decrementPageYear}>
          {'<<'}
        </Button>

        <Button date={prevMonth} onClick={decrementPageMonth}>
          {'<'}
        </Button>
      </div>
      <div
        css={(_theme: any) => css`
          order: 3;
        `}
      >
        <Button date={nextMonth} onClick={incrementPageMonth}>
          {'>'}
        </Button>

        <Button date={nextYear} onClick={incrementPageYear}>
          {'>>'}
        </Button>
      </div>
      <div
        css={(_theme: any) => css`
          order: 2;
        `}
      >
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
            value={yearFormatted}
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
    </header>
  );
};

export default React.memo(Header);
