export type LocalizedTextMap = Record<string, string>;

export function resolveLocalizedText(value: unknown, locales: unknown, locale: string): unknown {
  const baseValue = typeof value === 'string' ? value : value;
  if (!isLocalizedTextMap(locales)) return baseValue;
  const localizedValue = locales[locale];
  return typeof localizedValue === 'string' && localizedValue.trim() ? localizedValue : baseValue;
}

export function normalizeLocalizedTextMap(value: unknown): LocalizedTextMap {
  if (!isLocalizedTextMap(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, text]) => typeof text === 'string' && text.trim())
      .map(([locale, text]) => [locale, text.trim()]),
  );
}

export function isLocalizedTextMap(value: unknown): value is LocalizedTextMap {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
