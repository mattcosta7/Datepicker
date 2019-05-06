import styled from 'styled-components';
import * as React from 'react';
import CalendarContext from '../../context/Calendar';
import { addMonths, addYears, getMonth, getYear } from 'date-fns';
import Button from '../Button';
import { MAX_DATE_YEAR, MIN_DATE_YEAR } from '../../utils/date';

const Container = styled.header<{ rtl?: boolean }>`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const allYears = Array.from(
  { length: MAX_DATE_YEAR - MIN_DATE_YEAR },
  (_k, v) => v + MIN_DATE_YEAR
);

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
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = parseInt(e.target.value, 10);
      setPageYear(value);
    },
    [setPageMonth]
  );

  const currentMonthIndex = React.useMemo(() => getMonth(pageDate), [
    pageDate.getTime(),
  ]);

  const currentYearIndex = React.useMemo(() => getYear(pageDate), [
    pageDate.getTime(),
  ]);

  const prevMonth = React.useMemo(() => addMonths(pageDate, -1), [
    pageDate.getTime(),
  ]);
  const prevYear = React.useMemo(() => addYears(pageDate, -1), [
    pageDate.getTime(),
  ]);
  const nextMonth = React.useMemo(() => addMonths(pageDate, 1), [
    pageDate.getTime(),
  ]);
  const nextYear = React.useMemo(() => addYears(pageDate, 1), [
    pageDate.getTime(),
  ]);
  return (
    <Container rtl={rtl}>
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
            <option key={month} value={i}>
              {month}
            </option>
          ))}
        </select>
        <select value={currentYearIndex} onChange={handleYearChange}>
          {allYears.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Button date={nextMonth} onClick={incrementPageMonth}>
          {'>'}
        </Button>

        <Button date={nextYear} onClick={incrementPageYear}>
          {'>>'}
        </Button>
      </div>
    </Container>
  );
};

export default React.memo(Header);
