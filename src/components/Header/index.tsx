/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import { useCalendarDispatch, usePageDate, useLocale } from '../../hooks';
import { addMonths, addYears } from 'date-fns/esm';
import Button from '../Button';
import {
  DECREMENT_PAGE_MONTH,
  DECREMENT_PAGE_YEAR,
  INCREMENT_PAGE_MONTH,
  INCREMENT_PAGE_YEAR,
} from '../../context/Calendar/actions';
import MonthSelector from '../MonthSelector';
import YearSelector from '../YearSelector';

const Header = () => {
  const dispatch = useCalendarDispatch();
  const pageDate = usePageDate();
  const [locale, rtl] = useLocale();

  const dateFormatter = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric',
    }).format;
  }, [locale]);

  const prevMonth = React.useMemo(
    () => dateFormatter(addMonths(pageDate, -1)),
    [pageDate, dateFormatter]
  );
  const prevYear = React.useMemo(() => dateFormatter(addYears(pageDate, -1)), [
    pageDate,
    dateFormatter,
  ]);
  const nextMonth = React.useMemo(() => dateFormatter(addMonths(pageDate, 1)), [
    pageDate,
    dateFormatter,
  ]);
  const nextYear = React.useMemo(() => dateFormatter(addYears(pageDate, 1)), [
    pageDate,
    dateFormatter,
  ]);

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
    [pageDate, incrementPageYear, decrementPageYear]
  );

  const headerStyle = React.useCallback(
    (_theme: any) => css`
      direction: ${rtl ? 'rtl' : 'ltr'};
      display: flex;
      justify-content: space-between;
      padding: 1rem;
    `,
    [rtl]
  );

  const cssOrder1 = React.useCallback(
    (_theme: any) => css`
      order: 1;
    `,
    []
  );
  const cssOrder2 = React.useCallback(
    (_theme: any) => css`
      order: 2;
    `,
    []
  );
  const cssOrder3 = React.useCallback(
    (_theme: any) => css`
      order: 3;
    `,
    []
  );
  return (
    <header css={headerStyle}>
      <div css={cssOrder1}>
        <Button
          aria-label={prevYear}
          title={prevYear}
          onClick={decrementPageYear}
        >
          {'<<'}
        </Button>

        <Button
          aria-label={prevMonth}
          title={prevMonth}
          onClick={decrementPageMonth}
        >
          {'<'}
        </Button>
      </div>
      <div css={cssOrder3}>
        <Button
          aria-label={nextMonth}
          title={nextMonth}
          onClick={incrementPageMonth}
        >
          {'>'}
        </Button>

        <Button
          aria-label={nextYear}
          title={nextYear}
          onClick={incrementPageYear}
        >
          {'>>'}
        </Button>
      </div>
      <div css={cssOrder2}>
        <MonthSelector />
        <YearSelector
          handleKeyDown={handleKeyDown}
          decrementPageYear={decrementPageYear}
          incrementPageYear={incrementPageYear}
        />
      </div>
    </header>
  );
};

export default React.memo(Header);
