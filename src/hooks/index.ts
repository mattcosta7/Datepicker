import { addDays, endOfMonth, getDay, getDaysInMonth } from 'date-fns/esm';
import * as React from 'react';
import {
  CalendarDispatchContext,
  FocusDateContext,
  LocaleContext,
  PageDateContext,
  RtlContext,
  SelectedDateContext,
  SelectedDateOnChangeContext,
  ShowWeekNumberContext,
} from '../context';
import { chunk } from '../utils/array';

export function useCalendarDispatch() {
  const dispatch = React.useContext(CalendarDispatchContext);
  if (!dispatch) throw new Error('Cannot use dispatch outside of a context');
  return dispatch;
}
export function usePageDate() {
  const pageDate = React.useContext(PageDateContext);
  if (!pageDate) throw new Error('Cannot use dispatch outside of a context');
  return pageDate;
}
export function useLocale(): [string | string[], boolean] {
  const locale = React.useContext(LocaleContext);
  const rtl = React.useContext(RtlContext);
  if (typeof locale === 'undefined' || typeof rtl === 'undefined') {
    throw new Error('Must be in a context');
  }
  return [locale, rtl];
}

export function useFocusDate() {
  const focusDate = React.useContext(FocusDateContext);
  return focusDate;
}

export function useShowWeekNumbers() {
  const showWeekNumbers = React.useContext(ShowWeekNumberContext);
  return showWeekNumbers;
}

export function useSelectedDate() {
  const selectedDate = React.useContext(SelectedDateContext);
  return selectedDate;
}
export function useOnChange() {
  const selectedDate = useSelectedDate();
  const onChange = React.useContext(SelectedDateOnChangeContext);

  React.useEffect(() => {
    if (onChange) {
      onChange({ value: selectedDate ? new Date(selectedDate) : undefined });
    }
  }, [onChange, selectedDate]);
  return onChange;
}

export function useWeekdays() {
  const [locale] = useLocale();
  const weekDays = React.useMemo(() => {
    const arr: string[] = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    for (let day = 4; day <= 10; day++) {
      arr.push(formatter.format(new Date(1970, 0, day)));
    }
    return arr;
  }, [locale]);
  return weekDays;
}

export function useDays() {
  const pageDate = usePageDate();
  const days = React.useMemo(
    () =>
      [
        ...Array.from({ length: getDay(pageDate) }),
        ...Array.from({ length: getDaysInMonth(pageDate) }),
        ...Array.from({
          length: 6 - getDay(endOfMonth(pageDate)),
        }),
      ].map((_, i) => addDays(pageDate, i - getDay(pageDate))),
    [pageDate]
  );
  return days;
}

export function useCalendarDaysByWeek() {
  const days = useDays();

  const weeks = React.useMemo(() => {
    return chunk(days, 7);
  }, [days]);

  return weeks;
}

export function useMonthNames() {
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
}
