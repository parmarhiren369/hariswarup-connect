export interface MemberRegistration {
  id: string;
  fullName: string;
  fatherName: string;
  surname: string;
  birthDate: string;
  bloodGroup: string;
  maritalStatus: string;
  occupation: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  pinCode: string;
  isAmbarish: string;
  memberType: string;
  category: string;
  pujaRegular: string;
  sabhaRegular: string;
  dashmoVisamo: string;
  registeredAt: string;
}

export const CITY_OPTIONS = [
  "Alkapuri",
  "Akota / Akota Road",
  "Gotri / Gotri Road",
  "Manjalpur",
  "Karelibaug",
  "Nizampura",
  "Subhanpura",
  "Fatehgunj",
  "Padra Road",
  "Sevasi",
  "Tarsali",
  "Vasna / Vasna Road / Vasna-Bhayli Road",
  "Gorwa",
  "Harni / Harni Road",
  "Makarpura",
  "Ellora Park",
  "VIP Road / New VIP Road",
  "Sama / Sama-Savli Road",
  "Productivity Road",
  "Bhayli / Bhayli Road",
  "Pratapgunj",
  "Airport Harni Main Road",
  "Chhani Jakat Naka",
  "Race Course Area",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function getRegistrations(): MemberRegistration[] {
  const data = localStorage.getItem("satsang_registrations");
  return data ? JSON.parse(data) : [];
}

export function saveRegistration(reg: MemberRegistration) {
  const existing = getRegistrations();
  existing.push(reg);
  localStorage.setItem("satsang_registrations", JSON.stringify(existing));
}

export function deleteRegistration(id: string) {
  const existing = getRegistrations().filter((r) => r.id !== id);
  localStorage.setItem("satsang_registrations", JSON.stringify(existing));
}
