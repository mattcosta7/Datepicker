import * as React from 'react';
import { startOfMonth } from 'date-fns';
import { SET_SELECTED_DATE } from './actions';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from './rtl-locales';
import reducer from './reducer';

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

export const SelectedDateOnChangeContext = React.createContext<
  (({ value }: { value: Date }) => void) | undefined
>(undefined);
SelectedDateOnChangeContext.displayName = 'SelectedDateOnChangeContext';

interface ProviderProps {
  locale?: string | string[];
  children?: React.ReactNode;
  date?: Date;
  onChange?: (e: any) => void;
}

const Provider = ({ locale, children, date, onChange }: ProviderProps) => {
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
    if (date !== selectedDate) {
      dispatch({ type: SET_SELECTED_DATE, selectedDate: date });
    }
  }, [date, selectedDate]);
  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <LocaleContext.Provider value={innerLocale}>
        <RtlContext.Provider value={isRtl}>
          <PageDateContext.Provider value={pageDate}>
            <SelectedDateContext.Provider value={selectedDate}>
              <FocusDateContext.Provider value={focusDate}>
                <SelectedDateOnChangeContext.Provider value={onChange}>
                  {children}
                </SelectedDateOnChangeContext.Provider>
              </FocusDateContext.Provider>
            </SelectedDateContext.Provider>
          </PageDateContext.Provider>
        </RtlContext.Provider>
      </LocaleContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

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
export const useOnChange = () => {
  const onChange = React.useContext(SelectedDateOnChangeContext);
  return onChange;
};
