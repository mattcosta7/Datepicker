import * as React from 'react';
import {
  CalendarDispatchContext,
  PageDateContext,
  LocaleContext,
  RtlContext,
  FocusDateContext,
  ShowWeekNumberContext,
  SelectedDateContext,
  SelectedDateOnChangeContext,
} from 'context/Calendar';
import { endOfMonth, getDaysInMonth, getDay, addDays } from 'date-fns/esm';

import { chunk } from '../utils/array';

export const useCalendarDispatch = () => {
  const dispatch = React.useContext(CalendarDispatchContext);
  if (!dispatch) throw new Error('Cannot use dispatch outside of a context');
  return dispatch;
};
export const usePageDate = () => {
  const pageDate = React.useContext(PageDateContext);
  if (!pageDate) throw new Error('Cannot use dispatch outside of a context');
  return pageDate;
};
export const useLocale = (): [string | string[], boolean] => {
  const locale = React.useContext(LocaleContext);
  const rtl = React.useContext(RtlContext);
  if (typeof locale === 'undefined' || typeof rtl === 'undefined') {
    throw new Error('Must be in a context');
  }
  return [locale, rtl];
};

export const useFocusDate = () => {
  const focusDate = React.useContext(FocusDateContext);
  return focusDate;
};

export const useShowWeekNumbers = () => {
  const showWeekNumbers = React.useContext(ShowWeekNumberContext);
  return showWeekNumbers;
};

export const useSelectedDate = () => {
  const selectedDate = React.useContext(SelectedDateContext);
  return selectedDate;
};
export const useOnChange = () => {
  const onChange = React.useContext(SelectedDateOnChangeContext);
  return onChange;
};

export const useWeekdays = () => {
  const [locale] = useLocale();
  const weekDays = React.useMemo(() => {
    const arr: string[] = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    for (var day = 4; day <= 10; day++) {
      arr.push(formatter.format(new Date(1970, 0, day)));
    }
    return arr;
  }, [locale]);
  return weekDays;
};

export const useCalendarDaysByWeek = () => {
  const pageDate = usePageDate();

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

  return weeks;
};

export const useMonthNames = () => {
  const [locale] = useLocale();
  const months = React.useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: 'long' });
    const _months: string[] = [];
    for (let month = 0; month < 12; month++) {
      const testDate = new Date(new Date().getFullYear(), month, 1, 0, 0, 0);
      _months.push(format.format(testDate));
    }
    return _months;
  }, [locale]);
  return months;
};
