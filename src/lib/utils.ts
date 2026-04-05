export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function formatPhone(value: string): string {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length <= 3) return nums;
  if (nums.length <= 7) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7)}`;
}

export function formatBusinessNumber(value: string): string {
  const nums = value.replace(/\D/g, "").slice(0, 10);
  if (nums.length <= 3) return nums;
  if (nums.length <= 5) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  return `${nums.slice(0, 3)}-${nums.slice(3, 5)}-${nums.slice(5)}`;
}
