/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import { endOfMonth, getDaysInMonth, getDay, addDays, getWeek } from 'date-fns';
import { usePageDate, useFocusDate, useLocale } from '../../context/Calendar';
import Day from '../Day';
import Weekday from '../Weekday';
import { chunk } from '../../utils/array';

const CalendarBody = ({ showWeekNumbers }: any) => {
  const [locale, rtl] = useLocale();
  const focusDate = useFocusDate();
  const pageDate = usePageDate();

  const weekDays = React.useMemo(() => {
    const arr: string[] = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    for (var day = 4; day <= 10; day++) {
      arr.push(formatter.format(new Date(1970, 0, day)));
    }
    return arr;
  }, [locale]);

  const weeks = React.useMemo(() => {
    return chunk(
      [
        ...Array.from({ length: getDay(pageDate) }),
        ...Array.from({ length: getDaysInMonth(pageDate) }),
        ...Array.from({
          length: 6 - getDay(endOfMonth(pageDate)),
        }),
      ].map((_, i) => addDays(pageDate, i - getDay(pageDate))),
      7
    );
  }, [pageDate]);

  const activeDescendantId = React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).format(focusDate);
  }, [focusDate, locale]);

  return (
    <table
      css={css`
        direction: ${rtl ? 'rtl' : 'ltr'};
        width: 100%;
      `}
      aria-activedescendant={activeDescendantId}
    >
      <thead>
        <tr>
          {showWeekNumbers && <th />}
          {weekDays.map((v, i) => {
            return (
              <th key={v}>
                <Weekday dayNumber={i}>{v}</Weekday>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {weeks.map(daysInWeek => {
          const weekNumber = new Intl.NumberFormat(locale).format(
            getWeek(daysInWeek[0])
          );
          return (
            <tr key={weekNumber}>
              {showWeekNumbers && <td>{weekNumber}</td>}
              {daysInWeek.map(v => {
                return (
                  <td key={v.toString()}>
                    <Day key={v} date={v} />
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default React.memo(CalendarBody);
