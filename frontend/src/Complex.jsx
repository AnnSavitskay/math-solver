export class Complex {
  constructor(real = 0, imaginary = 0) {
    this.real = isNaN(real) ? 0 : Number(real);
    this.imaginary = isNaN(imaginary) ? 0 : Number(imaginary);
  }
  toString() {
    const r = this.real.toFixed(2);
    const i = Math.abs(this.imaginary).toFixed(2);
    if (this.imaginary === 0) return `${r}`;
    if (this.real === 0) return `${this.imaginary < 0 ? "-" : ""}${i}i`;
    const sign = this.imaginary >= 0 ? "+" : "-";
    return `${r}${sign}${i}i`;
  }
}

export function convertToComplex(value) {
  if (value === "" || value === null || value === undefined) { return new Complex(0, 0); }
  
  //console.log(value);
  const clean = String(value).replace(/j/g, "i").replace(/\s+/g, "").replace(/[()]/g, "");
  //console.log(clean);
  if (!clean.includes("i")) { return new Complex(parseFloat(clean), 0); }
  
  const full = /^([+-]?\d+\.?\d*)([+-]?\d*\.?\d*)?i$/;

  const fullMatch = clean.match(full);
  if (fullMatch && typeof fullMatch[2] !== "undefined") {
    const real = parseFloat(fullMatch[1]);
    const imagStr = fullMatch[2];
    const imag = imagStr === "+" ? 1 : imagStr === "-" ? -1 : parseFloat(imagStr);
    return new Complex(real, imag);
  }
  
  const imagOnly = clean.match(/^([+-]?\d*\.?\d*)i$/);
  if (imagOnly) {
    const imagStr = imagOnly[1];
    const imag = (imagStr === "" || imagStr === "+") ? 1 : imagStr === "-" ? -1 : parseFloat(imagStr);
    return new Complex(0, imag);
  }

  return new Complex(0, 0);
}
