// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authority = localStorage.getItem(`kg-utomarket-authority-${__KG_API_ENV__}`);
  return authority ? JSON.parse(authority) : '';
}

export function setAuthority(authority) {
  return localStorage.setItem(
    `kg-utomarket-authority-${__KG_API_ENV__}`,
    authority ? JSON.stringify(authority) : ''
  );
}

// get user locale language
export function getLocale() {
  const browserLang = window.navigator.browserLanguage
    ? window.navigator.browserLanguage
    : window.navigator.language;
  let defLang = 'zh_CN';
  if (browserLang.indexOf('en') > -1) defLang = 'en_GB';
  return localStorage.getItem(`kg-utomarket-locale-${__KG_API_ENV__}`);
}

export function setLocale(locale) {
  return localStorage.setItem(`kg-utomarket-locale-${__KG_API_ENV__}`, locale);
}
