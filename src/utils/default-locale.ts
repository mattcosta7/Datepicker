const defaultLocale = () => {
  try {
    return (
      navigator.language ||
      (navigator as any).browserLanguage ||
      (navigator.languages || ['en'])[0]
    );
  } catch {
    return 'en';
  }
};

export default defaultLocale();
