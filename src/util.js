const getRates = (baseCurrency, currencies, quotes) => {
  const rates = {};

  [baseCurrency, ...currencies].forEach((c) => {
    rates[c] = quotes[`USD${c}`] / quotes[`USD${baseCurrency}`];
  });

  return rates;
};

export default getRates;
