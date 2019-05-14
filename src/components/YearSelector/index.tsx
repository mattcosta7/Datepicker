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

  const handleYearChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: SET_PAGE_YEAR,
        year: parseInt(e.target.value || '0', 10),
      });
    },
    [dispatch]
  );

  const yearFormatted = React.useMemo(
    () => new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(pageDate),
    [locale, pageDate]
  );

  const containerStyle = React.useCallback(
    (_theme: any) => css`
      position: relative;
    `,
    []
  );
  const inputStyle = React.useCallback(
    (_theme: any) => css`
      appearance: none;
      border: 0;
      background: transparent;
    `,
    []
  );
  const buttonContainerStyles = React.useCallback(
    (_theme: any) => css`
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      top: 0;
    `,
    []
  );
  const buttonStyles = React.useCallback(
    (_theme: any) => css`
      border: 0;
      padding: 0;
    `,
    []
  );

  return (
    <div css={containerStyle}>
      <input
        css={inputStyle}
        value={yearFormatted}
        onChange={handleYearChange}
        onKeyDown={handleKeyDown}
      />

      <div css={buttonContainerStyles}>
        <button css={buttonStyles} onClick={incrementPageYear}>
          +
        </button>
        <button css={buttonStyles} onClick={decrementPageYear}>
          -
        </button>
      </div>
    </div>
  );
};

export default React.memo(YearSelector);
