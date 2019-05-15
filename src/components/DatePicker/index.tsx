import * as React from 'react';
import { createPortal } from 'react-dom';
import { parse } from 'date-fns/esm';
import Calendar from '../Calendar';
import { LocaleContext, RtlContext } from '../../context';
import defaultLocale from '../../utils/default-locale';
import rtlLocales from '../../utils/rtl-locales';
import Input from '../Input';

const defaultParseDate = (s: any) => {
  if (s instanceof Date) {
    return s;
  }
  const d = s.split('/');
  return new Date(
    parseInt(d[2], 10),
    parseInt(d[0], 10) - 1,
    parseInt(d[1], 10)
  );
};

const DatePicker = ({
  locale,
  date,
  showWeekNumbers,
  portalContainer = document.body,
  parseDate = defaultParseDate,
  closeOnSelect,
  closeOnClickOutside = true,
  onChange,
}: any) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setOpen] = React.useState(false);

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

  const [{ currentDate, inputDate = '' }, setState] = React.useState<any>({
    currentDate: (date && parseDate(date).getTime()) || '',
    inputDate: date || '',
  });

  const onBlur = React.useCallback(
    e => {
      if (e.target instanceof HTMLInputElement) {
        const { value } = e.target;
        setState((s: any) => ({
          ...s,
          currentDate: parse(value, 'M/d/yyyy', new Date()),
          inputDate: value,
        }));
      }
    },
    [setState]
  );

  const onKeyDown = React.useCallback(
    e => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          onBlur(e);
          return;
      }
    },
    [onBlur]
  );

  const handleChange = React.useCallback(
    e => {
      if (e.target instanceof HTMLInputElement) {
        const { value } = e.target;
        setState((s: any) => ({
          ...s,
          inputDate: value,
        }));
      }
    },
    [setState]
  );

  const onCalendarChange = React.useCallback(
    (e: any) => {
      if (e.value) {
        setState((s: any) => ({
          ...s,
          currentDate: e.value,
          inputDate: e.value,
        }));
      }
      if (closeOnSelect) {
        setOpen(false);
      }
      if (onChange && typeof onChange === 'function') {
        onChange({ value: new Date(e.value) });
      }
    },
    [setOpen, setState, closeOnSelect, onChange]
  );

  console.log(currentDate, inputDate);

  const calendar = (
    <Calendar
      ref={calendarRef}
      locale={locale}
      date={currentDate}
      showWeekNumbers={!!showWeekNumbers}
      onChange={onCalendarChange}
    />
  );

  const calendarContainer = portalContainer
    ? createPortal(calendar, portalContainer)
    : calendar;

  const value = React.useMemo(() => {
    return inputDate instanceof Date
      ? new Intl.DateTimeFormat(innerLocale).format(inputDate as Date)
      : inputDate;
  }, [inputDate, innerLocale]);

  const openCalendar = React.useCallback(() => setOpen(true), [setOpen]);

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!closeOnClickOutside) return;
      if (!isOpen) return;
      if (
        inputRef.current &&
        (event.target === inputRef.current ||
          (event.target instanceof Node &&
            inputRef.current.contains(event.target)))
      ) {
        return;
      }
      if (
        calendarRef.current &&
        (event.target === calendarRef.current ||
          (event.target instanceof Node &&
            calendarRef.current.contains(event.target)))
      ) {
        return;
      }

      setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('click', handler);
    };
  }, [isOpen, closeOnClickOutside]);

  return (
    <LocaleContext.Provider value={innerLocale}>
      <RtlContext.Provider value={isRtl}>
        <Input
          ref={inputRef}
          name="inputDate"
          value={value}
          onBlur={onBlur}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          onFocus={openCalendar}
        />
        {isOpen && calendarContainer}
      </RtlContext.Provider>
    </LocaleContext.Provider>
  );
};

export default React.memo(DatePicker);
