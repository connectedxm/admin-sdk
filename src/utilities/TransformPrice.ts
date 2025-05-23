export const TransformPrice = (value: number, currency: string) => {
  if (typeof value !== "number") return undefined;

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (value === 0) return "--.--";
  if (value < 0)
    return formatter.format(-value / 100).replace(currency, `-${currency}`);
  return formatter.format(value / 100);
};
