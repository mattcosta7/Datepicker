import * as React from 'react';
import { startOfMonth, addMonths, addYears, setMonth, setYear } from 'date-fns';
import {
  MIN_DATE,
  MAX_DATE,
  MIN_DATE_YEAR,
  MAX_DATE_YEAR,
} from '../utils/date';

const rtlLocales = [
  'ae' /* Avestan */,
  'ar' /* 'العربية', Arabic */,
  'arc' /* Aramaic */,
  'bcc' /* 'بلوچی مکرانی', Southern Balochi */,
  'bqi' /* 'بختياري', Bakthiari */,
  'ckb' /* 'Soranî / کوردی', Sorani */,
  'dv' /* Dhivehi */,
  'fa' /* 'فارسی', Persian */,
  'glk' /* 'گیلکی', Gilaki */,
  'he' /* 'עברית', Hebrew */,
  'ku' /* 'Kurdî / كوردی', Kurdish */,
  'mzn' /* 'مازِرونی', Mazanderani */,
  'nqo' /* N'Ko */,
  'pnb' /* 'پنجابی', Western Punjabi */,
  'ps' /* 'پښتو', Pashto, */,
  'sd' /* 'سنڌي', Sindhi */,
  'ug' /* 'Uyghurche / ئۇيغۇرچە', Uyghur */,
  'ur' /* 'اردو', Urdu */,
  'yi' /* 'ייִדיש', Yiddish */,
];

const CalendarContext = React.createContext({
  locale: undefined,
  pageDate: startOfMonth(new Date()),
  decrementPageMonth: () => {},
  incrementPageMonth: () => {},
  decrementPageYear: () => {},
  incrementPageYear: () => {},
  setPageMonth: (_month: number) => {},
  setPageYear: (_year: number) => {},
  rtl: false,
});

export default CalendarContext;

export const CalendarContextProvider = ({ locale, children, date }: any) => {
  const [pageDate, setPageDate] = React.useState(
    startOfMonth(date || new Date())
  );

  const makeErrorFormatter = React.useCallback(
    (locale?: string) =>
      new Intl.DateTimeFormat(locale, {
        era: 'short',
        year: 'numeric',
        month: 'long',
      }).format,
    [locale]
  );

  const handleSetPageDate = React.useCallback(
    date => {
      if (date.getTime() !== date.getTime()) {
        const formatter = makeErrorFormatter(locale);
        console.error(`
        Attempted to set an invalid date, it may be because Javascript dates only support dates between ${formatter(
          MIN_DATE
        )} and ${formatter(MAX_DATE)}.
    `);
        return;
      }

      const year = date.getFullYear();
      if (year > MAX_DATE_YEAR || year < MIN_DATE_YEAR) {
        const formatter = makeErrorFormatter(locale);
        console.error(`
        Javascript dates only support dates between ${formatter(
          MIN_DATE
        )} and ${formatter(MAX_DATE)}.
      `);
        return;
      }

      setPageDate(date);
    },
    [setPageDate, locale]
  );

  const decrementPageMonth = React.useCallback(() => {
    handleSetPageDate(addMonths(pageDate, -1));
  }, [pageDate, handleSetPageDate]);

  const incrementPageMonth = React.useCallback(() => {
    handleSetPageDate(addMonths(pageDate, 1));
  }, [pageDate, handleSetPageDate]);

  const decrementPageYear = React.useCallback(() => {
    handleSetPageDate(addYears(pageDate, -1));
  }, [pageDate, handleSetPageDate]);

  const incrementPageYear = React.useCallback(() => {
    handleSetPageDate(addYears(pageDate, 1));
  }, [pageDate, handleSetPageDate]);

  const setPageMonth = React.useCallback(
    (month: number) => {
      if (!month && month !== 0) return;
      handleSetPageDate(setMonth(pageDate, month));
    },
    [pageDate, handleSetPageDate]
  );

  const setPageYear = React.useCallback(
    (year: number) => {
      if (!year && year !== 0) return;
      handleSetPageDate(setYear(pageDate, year));
    },
    [pageDate, handleSetPageDate]
  );

  const rtl = React.useMemo(() => {
    return !!rtlLocales.find(rtlLocale => {
      return !!locale.find(
        (l: string) =>
          l === rtlLocale ||
          l.startsWith(rtlLocale) ||
          rtlLocale.split('-')[0] === l.split('-')[0]
      );
    });
  }, [locale]);

  const value = React.useMemo(
    () => ({
      locale,
      pageDate,
      decrementPageMonth,
      incrementPageMonth,
      decrementPageYear,
      incrementPageYear,
      setPageMonth,
      setPageYear,
      rtl,
    }),
    [
      locale,
      pageDate,
      decrementPageMonth,
      incrementPageMonth,
      decrementPageYear,
      incrementPageYear,
      setPageMonth,
      setPageYear,
      rtl,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};
