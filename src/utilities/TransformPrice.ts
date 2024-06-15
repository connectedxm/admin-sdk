export const TransformPrice = (
  value: number,
  withDollar: boolean = false,
  freeText: string = "FREE"
) => {
  if (typeof value !== "number") return undefined;

  const dollarUSLocale = Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (value === 0) return freeText;

  if (withDollar) {
    return "$" + dollarUSLocale.format(value / 100);
  } else {
    return dollarUSLocale.format(value / 100);
  }
};
