import {
  addDays,
  addMonths,
  addYears,
  isValid,
  setMonth,
  setYear,
  startOfMonth,
} from 'date-fns/esm';
import {
  DECREMENT_FOCUS_DATE,
  DECREMENT_FOCUS_MONTH,
  DECREMENT_FOCUS_YEAR,
  DECREMENT_PAGE_MONTH,
  DECREMENT_PAGE_YEAR,
  INCREMENT_FOCUS_DATE,
  INCREMENT_FOCUS_MONTH,
  INCREMENT_FOCUS_YEAR,
  INCREMENT_PAGE_MONTH,
  INCREMENT_PAGE_YEAR,
  SET_FOCUS_DATE,
  SET_GIVEN_DATE,
  SET_PAGE_DATE,
  SET_PAGE_MONTH,
  SET_PAGE_YEAR,
  SET_SELECTED_DATE,
} from './actions';

type ActionType =
  | {
      type:
        | typeof SET_SELECTED_DATE
        | typeof SET_PAGE_DATE
        | typeof SET_FOCUS_DATE
        | typeof SET_GIVEN_DATE;
      date: number;
    }
  | {
      type:
        | typeof INCREMENT_FOCUS_DATE
        | typeof DECREMENT_FOCUS_DATE
        | typeof DECREMENT_PAGE_MONTH
        | typeof DECREMENT_PAGE_YEAR
        | typeof INCREMENT_PAGE_MONTH
        | typeof INCREMENT_PAGE_YEAR
        | typeof INCREMENT_FOCUS_MONTH
        | typeof DECREMENT_FOCUS_MONTH
        | typeof INCREMENT_FOCUS_YEAR
        | typeof DECREMENT_FOCUS_YEAR;
      count: number;
    }
  | {
      type: typeof SET_PAGE_MONTH;
      month: number;
    }
  | {
      type: typeof SET_PAGE_MONTH;
      month: number;
    }
  | {
      type: typeof SET_PAGE_YEAR;
      year: number;
    };

export default (
  state: {
    pageDate: number;
    focusDate?: number;
    selectedDate?: number;
    givenDate?: number;
  },
  action: ActionType
) => {
  switch (action.type) {
    case SET_GIVEN_DATE: {
      const { date } = action;
      return {
        ...state,
        pageDate: date,
        selectedDate: date,
        focusDate: date,
        givenDate: date,
      };
    }
    case SET_SELECTED_DATE: {
      const nextSelectedDate = new Date(action.date);
      const nextPageDate = startOfMonth(nextSelectedDate);
      if (!isValid(nextSelectedDate) || !isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
        selectedDate: nextSelectedDate.getTime(),
      };
    }
    case DECREMENT_PAGE_MONTH: {
      const nextPageDate = addMonths(state.pageDate, -(action.count || 1));
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case DECREMENT_PAGE_YEAR: {
      const nextPageDate = addYears(state.pageDate, -(action.count || 1));
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case INCREMENT_PAGE_MONTH: {
      const nextPageDate = addMonths(state.pageDate, action.count || 1);
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case INCREMENT_PAGE_YEAR: {
      const nextPageDate = addYears(state.pageDate, action.count || 1);
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case SET_PAGE_MONTH: {
      const { month } = action;
      if (!month && month !== 0) return state;

      const nextPageDate = setMonth(state.pageDate, month);
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case SET_PAGE_YEAR: {
      const { year } = action;
      if (!year && year !== 0) return state;

      const nextPageDate = setYear(state.pageDate, year);
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case SET_PAGE_DATE: {
      const nextPageDate = new Date(action.date);
      if (!isValid(nextPageDate)) return state;
      return {
        ...state,
        pageDate: nextPageDate.getTime(),
      };
    }
    case SET_FOCUS_DATE: {
      const nextFocusDate = new Date(action.date);
      if (!isValid(nextFocusDate)) return state;
      return {
        ...state,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case INCREMENT_FOCUS_DATE: {
      const nextFocusDate = addDays(state.focusDate as any, action.count || 1);
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case DECREMENT_FOCUS_DATE: {
      const nextFocusDate = addDays(
        state.focusDate as any,
        -(action.count || 1)
      );
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case INCREMENT_FOCUS_MONTH: {
      const nextFocusDate = addMonths(
        state.focusDate as any,
        action.count || 1
      );
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case DECREMENT_FOCUS_MONTH: {
      const nextFocusDate = addMonths(
        state.focusDate as any,
        -(action.count || 1)
      );
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case INCREMENT_FOCUS_YEAR: {
      const nextFocusDate = addYears(state.focusDate as any, action.count || 1);
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    case DECREMENT_FOCUS_YEAR: {
      const nextFocusDate = addYears(
        state.focusDate as any,
        -(action.count || 1)
      );
      if (!isValid(nextFocusDate)) return state;
      const nextPageDate = startOfMonth(nextFocusDate);
      return {
        ...state,
        pageDate: isValid(nextPageDate)
          ? nextPageDate.getTime()
          : state.pageDate,
        focusDate: nextFocusDate.getTime(),
      };
    }
    default: {
      throw new Error('Invalid type');
    }
  }
};
