/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import { endOfMonth, getDaysInMonth, getDay, addDays } from 'date-fns';
import { LocaleContext, RtlContext, usePageDate } from '../../context/Calendar';
import Day from '../Day';
import Weekday from '../Weekday';

const listContainerCss = ({ rtl }: { rtl?: boolean }) => {
  return css`
    display: flex;
    flex-wrap: wrap;
    direction: ${rtl ? 'rtl' : 'ltr'};
    list-style: none;
  `;
};

const CalendarBody = () => {
  const locale = React.useContext(LocaleContext);
  const rtl = React.useContext(RtlContext);
  const pageDate = usePageDate();

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
    <div>
      <ol css={(_theme: any) => listContainerCss({ rtl })}>
        {weekDays.map((v, i) => {
          return (
            <Weekday key={v} dayNumber={i}>
              {v}
            </Weekday>
          );
        })}
      </ol>
      <ol
        css={(_theme: any) => listContainerCss({ rtl })}
        start={-getDay(pageDate)}
      >
        {daysInMonth.map(v => {
          return <Day key={v} date={v} />;
        })}
      </ol>
    </div>
  );
};

export default React.memo(CalendarBody);
