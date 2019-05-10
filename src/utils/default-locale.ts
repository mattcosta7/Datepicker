const defaultLocale = () => {
  try {
    return (
      navigator.language ||
      (navigator as any).browserLanguage ||
      (navigator.languages || ['en'])
    );
  } catch {
    return ['en'];
  }
};

export default defaultLocale();
