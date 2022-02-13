export default function setCurrentDate(dateObj: any) {
  // todo: 타입 지정
  dateObj.setHours(dateObj.getHours() + 9);
  return dateObj.toISOString().replace('T', ' ').substring(0, 19);
}
