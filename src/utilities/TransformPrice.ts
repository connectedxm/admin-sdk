// Zero-decimal currencies (currencies that don't use decimal places)
export const ZERO_DECIMAL_CURRENCIES = [
  "BIF", // Burundian Franc
  "CLP", // Chilean Peso
  "DJF", // Djiboutian Franc
  "GNF", // Guinean Franc
  "JPY", // Japanese Yen
  "KMF", // Comorian Franc
  "KRW", // South Korean Won
  "MGA", // Malagasy Ariary
  "PYG", // Paraguayan Guaraní
  "RWF", // Rwandan Franc
  "UGX", // Ugandan Shilling
  "VND", // Vietnamese Dong
  "VUV", // Vanuatu Vatu
  "XAF", // Central African CFA Franc
  "XOF", // West African CFA Franc
  "XPF", // CFP Franc
];

/**
 * Checks if a currency code uses zero decimal places
 */
export const isZeroDecimalCurrency = (currencyCode: string): boolean => {
  return ZERO_DECIMAL_CURRENCIES.includes(currencyCode.toUpperCase());
};

/**
 * Gets the currency symbol for a given currency code
 */
export const getCurrencySymbol = (currencyCode: string): string => {
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const parts = formatter.formatToParts(0);
    const symbolPart = parts.find((part) => part.type === "currency");
    return symbolPart?.value || currencyCode;
  } catch {
    // Fallback to currency code if Intl API fails
    return currencyCode;
  }
};

export const TransformPrice = (
  value: number,
  currency: string,
  freeText?: string
) => {
  if (typeof value !== "number") return undefined;

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: isZeroDecimalCurrency(currency) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (value === 0) return freeText || "--.--";
  if (value < 0)
    return formatter.format(-value / 100).replace(currency, `-${currency}`);
  return formatter.format(value / 100);
};
