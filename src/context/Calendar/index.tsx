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
