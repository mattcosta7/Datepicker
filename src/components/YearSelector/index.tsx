/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useCalendarDispatch, useLocale, usePageDate } from '../../hooks';
import { SET_PAGE_YEAR } from '../Calendar/actions';

const YearSelector = ({
  handleKeyDown,
  decrementPageYear,
  incrementPageYear,
}: any) => {
  const dispatch = useCalendarDispatch();
  const [locale] = useLocale();
  const pageDate = usePageDate();

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: SET_PAGE_YEAR,
      year: parseInt(e.target.value || '0', 10),
    });
  };

  const yearFormatted = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
  }).format(pageDate);

  return (
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
  );
};

export default YearSelector;
