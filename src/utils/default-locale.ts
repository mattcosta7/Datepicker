const defaultLocale = (): string[] => {
  try {
    const locale = navigator.language ||
      (navigator as any).browserLanguage ||
      navigator.languages || ['en'];
    return Array.isArray(locale) ? locale : [locale];
  } catch {
    return ['en'];
  }
};

export default defaultLocale();
