export class Complex {
  constructor(real = 0, imaginary = 0) {
    this.real = real.toFixed(2);
    this.imaginary = imaginary.toFixed(2);
  }

  toString() {
    if (this.imaginary === 0) { return `${this.real}`; }
    if (this.real === 0) { return `${this.imaginary}i`; }

    const sign = this.imaginary >= 0 ? "+" : "-";
    return `${this.real}${sign}${Math.abs(this.imaginary)}i`;
  }
}

export function convertToComplex(value) {
  if (value === "" || value === null || value === undefined) { return new Complex(0, 0); }

  const clean_1 = String(value).replace(/\s+/g, "");
  const clean = clean_1.replace(/[()]/g, "");
  const full = /^([+-]?\d*\.?\d+)?([+-]\d*\.?\d+)i$/;

  const match = clean.match(full);

  if (match) { return new Complex(parseFloat(match[1] || 0), parseFloat(match[2] || 0)); }
  
  if (!clean.includes("i")) { return new Complex(parseFloat(clean), 0); }

  const imag = clean.replace("i", "");
  return new Complex(0,parseFloat(imag));
}
