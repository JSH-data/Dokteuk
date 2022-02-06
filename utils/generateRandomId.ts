export default function generateRandomCode() {
  return Math.random().toString(36).substring(2, 11);
}
