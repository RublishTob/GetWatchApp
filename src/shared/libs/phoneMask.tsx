export function phoneMask(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  // до 6 цифр → xx-xx-xx (2-2-2)
  if (digits.length <= 6) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return digits.replace(/(\d{2})(\d{0,2})/, "$1-$2");
    return digits.replace(/(\d{2})(\d{2})(\d{0,2})/, "$1-$2-$3");
  }

  // длинный формат X (XXX) XXX-XX-XX
  return digits
    .replace(/^(\d)(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2}).*/, (_, a, b, c, d, e) => {
      let result = a;
      if (b) result += ` (${b}`;
      if (b.length === 3) result += `)`;
      if (c) result += ` ${c}`;
      if (d) result += `-${d}`;
      if (e) result += `-${e}`;
      return result;
    });
}