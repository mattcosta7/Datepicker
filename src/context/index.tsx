import * as React from 'react';
import { startOfMonth } from 'date-fns/esm';

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
  DateChangeHandler | undefined
>(undefined);
SelectedDateOnChangeContext.displayName = 'SelectedDateOnChangeContext';

export type DateChangeHandler = (arg: { value?: Date }) => void;
