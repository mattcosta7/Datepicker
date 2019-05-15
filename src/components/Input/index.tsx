/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import CalendarIcon from '../CalendarIcon';

const Input = ({ forwardedRef, onFocus, onBlur, ...props }: any) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [focused, setFocused] = React.useState(false);

  const focusInput = React.useCallback(() => {
    if (inputRef.current instanceof HTMLInputElement) {
      setFocused(true);
      inputRef.current.focus();
    }
  }, [setFocused]);

  const blurInput = React.useCallback(() => {
    if (inputRef.current instanceof HTMLInputElement) {
      setFocused(false);
      inputRef.current.blur();
    }
  }, [setFocused]);

  const handleFocus = React.useCallback(
    e => {
      setFocused(true);
      if (onFocus && typeof onFocus === 'function') {
        onFocus(e);
      }
    },
    [setFocused, onFocus]
  );

  const handleBlur = React.useCallback(
    e => {
      setFocused(false);
      if (onBlur && typeof onBlur === 'function') {
        onBlur(e);
      }
    },
    [setFocused, onBlur]
  );

  React.useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (focused) {
        if (
          containerRef.current === event.target ||
          (event.target instanceof Node &&
            containerRef.current &&
            containerRef.current.contains(event.target))
        ) {
          return;
        }
        setFocused(false);
      }
    };
    window.addEventListener('click', handler);

    return () => {
      window.removeEventListener('click', handler);
    };
  }, [focused]);

  React.useImperativeHandle(forwardedRef, () => ({
    blur() {
      blurInput();
    },
    focus() {
      focusInput();
    },
    contains(other: Node | null) {
      if (inputRef.current instanceof HTMLInputElement) {
        return inputRef.current.contains(other);
      }
      return false;
    },
  }));

  return (
    <div
      ref={containerRef}
      css={(_theme: any) => css`
        align-items: center;
        border: 1px solid black;
        display: inline-flex;

        ${focused &&
          css`
            outline: 1px solid blue;
          `}
      `}
      onClick={focusInput}
    >
      <input
        css={(_theme: any) =>
          css`
            appearance: none;
            border: 0;
            outline: 0;
          `
        }
        ref={inputRef}
        placeholder="MM/DD/YYYY"
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      <CalendarIcon />
    </div>
  );
};

const ForwardRefInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => <Input forwardedRef={ref} {...props} />);

ForwardRefInput.displayName = 'ForwardRef(Input)';

const Memo = React.memo(ForwardRefInput);

Memo.displayName = `Memo(${ForwardRefInput.displayName})`;

export default Memo;
