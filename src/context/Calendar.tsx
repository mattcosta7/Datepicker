import * as React from 'react';
import {
  startOfMonth,
  addMonths,
  addYears,
  setMonth,
  setYear,
  addDays,
} from 'date-fns';
import {
  MIN_DATE,
  MAX_DATE,
  MIN_DATE_YEAR,
  MAX_DATE_YEAR,
} from '../utils/date';
import {
  DECREMENT_PAGE_MONTH,
  DECREMENT_PAGE_YEAR,
  INCREMENT_PAGE_MONTH,
  INCREMENT_PAGE_YEAR,
  SET_PAGE_MONTH,
  SET_PAGE_YEAR,
  SET_PAGE_DATE,
  SET_FOCUS_DATE,
  INCREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_DATE,
  INCREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_MONTH,
  INCREMENT_FOCUS_YEAR,
  DECREMENT_FOCUS_YEAR,
  SET_SELECTED_DATE,
} from '../types/actions';

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

export const PageDateContext = React.createContext(startOfMonth(new Date()));
export const FocusDateContext = React.createContext<Date | undefined>(
  undefined
);
export const LocaleContext = React.createContext(undefined);
export const RtlContext = React.createContext(false);
export const CalendarDispatchContext = React.createContext<React.Dispatch<
  any
> | void>(undefined);

PageDateContext.displayName = 'PageDateContext';
LocaleContext.displayName = 'LocaleContext';
RtlContext.displayName = 'RtlContext';
CalendarDispatchContext.displayName = 'CalendarDispatchContext';

const ensureValidDate = (dateToTry: Date, fallbackDate: Date) => {
  if (dateToTry.getTime() !== dateToTry.getTime()) {
    console.error(`
        Attempted to set an invalid date, it may be because Javascript dates only support dates with times between ${MIN_DATE} and ${MAX_DATE}.
      `);
    return fallbackDate;
  }
  const year = dateToTry.getFullYear();
  if (year > MAX_DATE_YEAR || year < MIN_DATE_YEAR) {
    console.error(`
       Javascript dates only support dates between ${MAX_DATE_YEAR} ${MIN_DATE_YEAR}.
     `);
    return fallbackDate;
  }
  return dateToTry;
};

const reducer = (
  state: { pageDate: Date; focusDate?: Date; selectedDate?: Date },
  { type, ...payload }: any
) => {
  switch (type) {
    case SET_SELECTED_DATE: {
      return {
        ...state,
        selectedDate: payload.selectedDate,
      };
    }
    case DECREMENT_PAGE_MONTH: {
      return {
        ...state,
        pageDate: ensureValidDate(
          addMonths(state.pageDate, -1),
          state.pageDate
        ),
      };
    }
    case DECREMENT_PAGE_YEAR: {
      return {
        ...state,
        pageDate: ensureValidDate(addYears(state.pageDate, -1), state.pageDate),
      };
    }
    case INCREMENT_PAGE_MONTH: {
      return {
        ...state,
        pageDate: ensureValidDate(addMonths(state.pageDate, 1), state.pageDate),
      };
    }
    case INCREMENT_PAGE_YEAR: {
      return {
        ...state,
        pageDate: ensureValidDate(addYears(state.pageDate, 1), state.pageDate),
      };
    }
    case SET_PAGE_MONTH: {
      const { month } = payload;
      if (!month && month !== 0) return state;
      return {
        ...state,
        pageDate: ensureValidDate(
          setMonth(state.pageDate, month),
          state.pageDate
        ),
      };
    }
    case SET_PAGE_YEAR: {
      const { year } = payload;
      if (!year && year !== 0) return state;
      return {
        ...state,
        pageDate: ensureValidDate(
          setYear(state.pageDate, year),
          state.pageDate
        ),
      };
    }
    case SET_PAGE_DATE: {
      return {
        ...state,
        pageDate: ensureValidDate(payload.date, state.pageDate),
      };
    }
    case SET_FOCUS_DATE: {
      return {
        ...state,
        focusDate: ensureValidDate(payload.focusDate, state.focusDate as any),
      };
    }
    case INCREMENT_FOCUS_DATE: {
      const newFocusDate = ensureValidDate(
        addDays(state.focusDate as any, payload.days || 1),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    case DECREMENT_FOCUS_DATE: {
      const newFocusDate = ensureValidDate(
        addDays(state.focusDate as any, -(payload.days || 1)),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    case INCREMENT_FOCUS_MONTH: {
      const newFocusDate = ensureValidDate(
        addMonths(state.focusDate as any, 1),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    case DECREMENT_FOCUS_MONTH: {
      const newFocusDate = ensureValidDate(
        addMonths(state.focusDate as any, -1),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    case INCREMENT_FOCUS_YEAR: {
      const newFocusDate = ensureValidDate(
        addYears(state.focusDate as any, 1),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    case DECREMENT_FOCUS_YEAR: {
      const newFocusDate = ensureValidDate(
        addYears(state.focusDate as any, -1),
        state.focusDate as any
      );
      return {
        ...state,
        pageDate: newFocusDate ? startOfMonth(newFocusDate) : state.pageDate,
        focusDate: newFocusDate,
      };
    }
    default: {
      throw new Error('Invalid type');
    }
  }
};

const Provider = ({ locale, children, date }: any) => {
  const [{ pageDate, focusDate, selectedDate }, dispatch] = React.useReducer(
    reducer,
    {
      pageDate: startOfMonth(date || new Date()),
      focusDate: undefined,
      selectedDate: date,
    }
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

  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <LocaleContext.Provider value={locale}>
        <RtlContext.Provider value={rtl}>
          <PageDateContext.Provider value={pageDate}>
            <SelectedDateContext.Provider value={selectedDate}>
              <FocusDateContext.Provider value={focusDate}>
                {children}
              </FocusDateContext.Provider>
            </SelectedDateContext.Provider>
          </PageDateContext.Provider>
        </RtlContext.Provider>
      </LocaleContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

export const SelectedDateContext = React.createContext<Date | undefined>(
  undefined
);

export const CalendarContextProvider = React.memo(Provider);

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

export const useSelectedDate = () => {
  const selectedDate = React.useContext(SelectedDateContext);
  return selectedDate;
};
