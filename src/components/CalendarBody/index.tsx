import styled from 'styled-components';
import * as React from 'react';
import { endOfMonth, getDaysInMonth, getDay, addDays } from 'date-fns';
import CalendarContext from '../../context/Calendar';
import Day from '../Day';
import Weekday from '../Weekday';

const Container = styled.header<{ rtl?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
`;

const CalendarBody = () => {
  const { locale, pageDate, rtl } = React.useContext(CalendarContext);

  const weekDays = React.useMemo(() => {
    const arr = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    for (var day = 4; day <= 10; day++) {
      arr.push(formatter.format(new Date(1970, 0, day)));
    }
    return arr;
  }, [locale]);

  const daysInMonth = React.useMemo(() => {
    return [
      ...Array.from({ length: getDay(pageDate) }),
      ...Array.from({ length: getDaysInMonth(pageDate) }),
      ...Array.from({
        length: 6 - getDay(endOfMonth(pageDate)),
      }),
    ].map((_, i) => addDays(pageDate, i - getDay(pageDate)));
  }, [pageDate.getTime()]);

  return (
    <main>
      <Container rtl={rtl}>
        {weekDays.map((v, i) => {
          return (
            <Weekday key={v} dayNumber={i}>
              {v}
            </Weekday>
          );
        })}
      </Container>
      <Container as="section">
        {daysInMonth.map(v => {
          return <Day key={v} date={v} />;
        })}
      </Container>
    </main>
  );
};

export default React.memo(CalendarBody);