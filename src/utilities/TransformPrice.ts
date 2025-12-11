// Zero-decimal currencies (currencies that don't use decimal places)
const ZERO_DECIMAL_CURRENCIES = [
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

export const TransformPrice = (
  value: number,
  currency: string,
  freeText?: string
) => {
  if (typeof value !== "number") return undefined;

  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.includes(
    currency.toUpperCase()
  );

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: isZeroDecimal ? 0 : 2,
    maximumFractionDigits: 2,
  });

  if (value === 0) return freeText || "--.--";
  if (value < 0)
    return formatter.format(-value / 100).replace(currency, `-${currency}`);
  return formatter.format(value / 100);
};
