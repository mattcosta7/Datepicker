import * as React from 'react';
import styled, { css } from 'styled-components';
import { isSameDay, isWeekend, isSameMonth } from 'date-fns';
import CalendarContext from '../../context/Calendar';

interface CalendarItemProps {
  isWeekend?: boolean;
  isToday?: boolean;
  isWeekdayName?: boolean;
}

const Button = styled.button<CalendarItemProps>`
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  flex: 1 0 ${100 / 7}%;
  text-align: center;

  ${({ isWeekend: weekend }) =>
    weekend &&
    css`
      color: green;
    `}
  ${({ isToday: today }) =>
    today &&
    css`
      color: red;
    `}

  &[disabled] {
    cursor: not-allowed;
    color: grey;
  }

  ${({ isWeekdayName }) =>
    isWeekdayName &&
    css`
      cursor: default;
    `}
`;

const Day = ({ date }: any) => {
  const { locale, pageDate } = React.useContext(CalendarContext);

  const dateString = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(date);
  }, [date, locale]);

  const sameMonth = React.useMemo(() => isSameMonth(pageDate, date), [
    pageDate.getTime(),
    date,
  ]);

  const formattedDay = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
    }).format(date);
  }, [locale, date]);

  return (
    <Button
      isWeekend={isWeekend(date)}
      isToday={isSameDay(new Date(), date)}
      key={dateString}
      title={dateString}
      aria-label={dateString}
      disabled={!sameMonth}
      onClick={sameMonth ? () => alert(dateString) : undefined}
    >
      {formattedDay}
    </Button>
  );
};

export default React.memo(Day);
