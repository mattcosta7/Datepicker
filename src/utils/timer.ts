interface Handle {
  value?: number;
}

export const requestTimeout = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 0
) => {
  const start = new Date().getTime();
  const handle: Handle = {
    value: undefined,
  };

  const loop = () => {
    var current = new Date().getTime(),
      delta = current - start;

    delta >= delay
      ? fn.call(null)
      : (handle.value = requestAnimationFrame(loop));
  };

  handle.value = requestAnimationFrame(loop);
  return handle;
};

export const clearRequestTimeout = (handle: Handle) => {
  if (handle && handle.value) {
    window.cancelAnimationFrame(handle.value);
  }
};
