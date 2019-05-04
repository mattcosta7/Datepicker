import * as React from 'react';
import { startOfMonth, addMonths, addYears, setMonth, setYear } from 'date-fns';

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
  setPageYear: (_month: number) => {},
  rtl: false,
});

export default CalendarContext;

export const CalendarContextProvider = ({ locale, children, date }: any) => {
  const [pageDate, setPageDate] = React.useState(() => {
    return startOfMonth(date || new Date());
  });

  const decrementPageMonth = React.useCallback(() => {
    setPageDate(addMonths(pageDate, -1));
  }, [pageDate]);

  const incrementPageMonth = React.useCallback(() => {
    setPageDate(addMonths(pageDate, 1));
  }, [pageDate]);

  const decrementPageYear = React.useCallback(() => {
    setPageDate(addYears(pageDate, -1));
  }, [pageDate]);

  const incrementPageYear = React.useCallback(() => {
    setPageDate(addYears(pageDate, 1));
  }, [pageDate]);

  const setPageMonth = React.useCallback(
    (month: number) => {
      if (!month) return;
      setPageDate(setMonth(pageDate, month));
    },
    [pageDate]
  );
  const setPageYear = React.useCallback(
    (year: number) => {
      if (!year) return;
      setPageDate(setYear(pageDate, year));
    },
    [pageDate]
  );

  const rtl = React.useMemo(() => {
    return !!rtlLocales.find(rtlLocale => {
      return rtlLocale.split('-')[0].toLowerCase() === locale.toLowerCase();
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
