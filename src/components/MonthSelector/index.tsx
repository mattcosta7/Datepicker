/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { useCalendarDispatch, usePageDate, useMonthNames } from '../../hooks';
import { getMonth } from 'date-fns/esm';
import { SET_PAGE_MONTH } from '../../context/Calendar/actions';

const MonthSelector = () => {
  const dispatch = useCalendarDispatch();
  const pageDate = usePageDate();
  const months = useMonthNames();

  const handleMonthChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch({ type: SET_PAGE_MONTH, month: parseInt(e.target.value, 10) });
    },
    []
  );

  const currentMonthIndex = React.useMemo(() => getMonth(pageDate), [pageDate]);

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

export default React.memo(MonthSelector);
