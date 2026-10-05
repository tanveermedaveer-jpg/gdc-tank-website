export const COLLEGE_ADDRESS = 'Main Bannu Road, Opposite Polytechnic Institute, District Tank';
export const COLLEGE_PHONE = '+92 306 5927447';
export const COLLEGE_ADDRESS_URDU = 'مین بنوں روڈ، پولی ٹیکنک انسٹی ٹیوٹ کے بالمقابل، ضلع ٹانک';

const LEGACY_PHONES = new Set(['+92 (0963) 510111', '0963-510111', '+92 963 510111']);
const LEGACY_ADDRESSES = new Set([
  'Near City Canal, Tank City, Khyber Pakhtunkhwa (KP), Pakistan.',
  'Near City Canal, Tank, Khyber Pakhtunkhwa (KP), Pakistan',
  'Near City Canal, Tank, Khyber Pakhtunkhwa (KP), Pakistan.',
  'GDC Tank, Khyber Pakhtunkhwa, Pakistan'
]);

export const resolveCollegePhone = (value) =>
  !value || LEGACY_PHONES.has(value.trim()) ? COLLEGE_PHONE : value;

export const resolveCollegeAddress = (value) =>
  !value || LEGACY_ADDRESSES.has(value.trim()) ? COLLEGE_ADDRESS : value;
