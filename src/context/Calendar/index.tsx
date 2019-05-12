import * as React from 'react';
import { startOfMonth } from 'date-fns/esm';
import { SET_SELECTED_DATE } from './actions';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from './rtl-locales';
import reducer from './reducer';
import { isValid } from 'date-fns/esm';

export const PageDateContext = React.createContext(startOfMonth(new Date()));
PageDateContext.displayName = 'PageDateContext';

export const FocusDateContext = React.createContext<Date | undefined>(
  undefined
);
FocusDateContext.displayName = 'FocusDateContext';

export const LocaleContext = React.createContext<string[] | undefined>(
  undefined
);
LocaleContext.displayName = 'LocaleContext';

export const RtlContext = React.createContext(false);
RtlContext.displayName = 'RtlContext';

export const CalendarDispatchContext = React.createContext<React.Dispatch<
  any
> | void>(undefined);
CalendarDispatchContext.displayName = 'CalendarDispatchContext';

export const SelectedDateContext = React.createContext<Date | undefined>(
  undefined
);
SelectedDateContext.displayName = 'SelectedDateContext';
export const ShowWeekNumberContext = React.createContext<boolean | undefined>(
  false
);
ShowWeekNumberContext.displayName = 'ShowWeekNumberContext';

export const SelectedDateOnChangeContext = React.createContext<
  (({ value }: { value: Date }) => void) | undefined
>(undefined);
SelectedDateOnChangeContext.displayName = 'SelectedDateOnChangeContext';

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

interface ProviderProps {
  locale?: string | string[];
  children?: React.ReactNode;
  showWeekNumbers?: boolean;
  date?: Date;
  onChange?: (e: any) => void;
}

const Provider = ({
  locale,
  children,
  date,
  onChange,
  showWeekNumbers,
}: ProviderProps) => {
  const [{ pageDate, focusDate, selectedDate }, dispatch] = React.useReducer(
    reducer,
    {
      pageDate: startOfMonth(date || new Date()),
      focusDate: undefined,
      selectedDate: date,
    }
  );

  const innerLocale = React.useMemo(() => {
    return Intl.getCanonicalLocales(locale || defaultLocale);
  }, [locale]);

  const isRtl = React.useMemo(() => {
    return !!innerLocale.find((locale: string) => {
      return (
        rtlLocales.hasOwnProperty(locale) ||
        rtlLocales.hasOwnProperty(locale.split('-')[0])
      );
    });
  }, [innerLocale]);

  React.useEffect(() => {
    if (date !== selectedDate && isValid(date) && date) {
      dispatch({ type: SET_SELECTED_DATE, date });
    }
  }, [date, selectedDate]);

  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <LocaleContext.Provider value={innerLocale}>
        <RtlContext.Provider value={isRtl}>
          <ShowWeekNumberContext.Provider value={showWeekNumbers}>
            <PageDateContext.Provider value={pageDate}>
              <SelectedDateContext.Provider value={selectedDate}>
                <FocusDateContext.Provider value={focusDate}>
                  <SelectedDateOnChangeContext.Provider value={onChange}>
                    {children}
                  </SelectedDateOnChangeContext.Provider>
                </FocusDateContext.Provider>
              </SelectedDateContext.Provider>
            </PageDateContext.Provider>
          </ShowWeekNumberContext.Provider>
        </RtlContext.Provider>
      </LocaleContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

export const CalendarContextProvider = React.memo(Provider);
