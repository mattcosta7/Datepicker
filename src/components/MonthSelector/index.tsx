/** @jsx jsx */
import { jsx } from '@emotion/core';
import { getMonth } from 'date-fns/esm';
import * as React from 'react';
import { useCalendarDispatch, useMonthNames, usePageDate } from '../../hooks';
import { SET_PAGE_MONTH } from '../Calendar/actions';

const MonthSelector = () => {
  const dispatch = useCalendarDispatch();
  const pageDate = usePageDate();
  const months = useMonthNames();

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: SET_PAGE_MONTH, month: parseInt(e.target.value, 10) });
  };

  const currentMonthIndex = getMonth(pageDate);

  return (
    <select value={currentMonthIndex} onChange={handleMonthChange}>
      {months.map((month, i) => (
        <option key={`${month}${i}`} value={i}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthSelector;
