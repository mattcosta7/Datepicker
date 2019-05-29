/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addMonths, addYears } from 'date-fns/esm';
import * as React from 'react';
import { useCalendarDispatch, useLocale, usePageDate } from '../../hooks';
import Button from '../Button';
import {
  DECREMENT_PAGE_MONTH,
  DECREMENT_PAGE_YEAR,
  INCREMENT_PAGE_MONTH,
  INCREMENT_PAGE_YEAR,
} from '../Calendar/actions';
import MonthSelector from '../MonthSelector';
import YearSelector from '../YearSelector';

const Header = () => {
  const dispatch = useCalendarDispatch();
  const pageDate = usePageDate();
  const [locale, rtl] = useLocale();

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  });

  const prevMonth = dateFormatter.format(addMonths(pageDate, -1));
  const prevYear = dateFormatter.format(addYears(pageDate, -1));
  const nextMonth = dateFormatter.format(addMonths(pageDate, 1));
  const nextYear = dateFormatter.format(addYears(pageDate, 1));

  const decrementPageYear = () => {
    dispatch({ type: DECREMENT_PAGE_YEAR });
  };
  const incrementPageYear = () => {
    dispatch({ type: INCREMENT_PAGE_YEAR });
  };
  const decrementPageMonth = () => {
    dispatch({ type: DECREMENT_PAGE_MONTH });
  };
  const incrementPageMonth = () => {
    dispatch({ type: INCREMENT_PAGE_MONTH });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowUp':
        incrementPageYear();
        break;
      case 'ArrowDown':
        decrementPageYear();
        break;
    }
  };

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
      <div
        css={(_theme: any) => css`
          order: 3;
        `}
      >
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
      <div
        css={(_theme: any) => css`
          order: 2;
        `}
      >
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

export default Header;
