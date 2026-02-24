export interface SubMember {
  name: string;
  contact: string;
  area: string;
  profession: string;
}

export interface MemberRegistration {
  id: string;
  fullName: string;
  fatherName: string;
  surname: string;
  birthDate: string;
  maritalStatus: string;
  occupation: string;
  mobile: string;
  whatsapp: string;
  area: string;
  registeredAt: string;
  subMembers?: SubMember[];
}

export const CITY_OPTIONS = [
  "Ajwa Road",
  "Akota",
  "Alkapuri",
  "Asoj",
  "Atladara",
  "Ampad",
  "Amodar",
  "Ankhol",
  "Bajwa",
  "Baranpura",
  "Bhayli",
  "Bill",
  "Bhakti Nagar",
  "Bapod",
  "Bodeli",
  "Bhayli Road",
  "Bapu Nagar",
  "Bill Road",
  "Bapu Nagar Society",
  "Chhani",
  "Chhani Jakat Naka",
  "Chapad",
  "Chanakyapuri Society",
  "Chandralok Society",
  "Diwalipura",
  "Danteshwar",
  "Dashrath",
  "Dattapura",
  "Dabhoi Road",
  "Ellora Park",
  "Fatehgunj",
  "Fetepura",
  "Gorwa (Gorwa)",
  "Gotri",
  "Gotri Road",
  "Govardhan Park Society",
  "Gidc Industrial Area",
  "Harni",
  "Harni Road",
  "Haripura",
  "Hari Nagar",
  "Harsol (surrounding cluster)",
  "Jambuva",
  "Jarod",
  "Jetalpur",
  "Karelibaug",
  "Kalali",
  "Kapurai",
  "Karadiya",
  "Khodiyar Nagar",
  "Kishanwadi",
  "Laxmipura",
  "Madhyasth City Vista",
  "Makarpura",
  "Mandvi",
  "Maneja",
  "Manjalpur",
  "Navapura",
  "Nizampura",
  "New Alkapuri",
  "New Sama",
  "New Karelibaug",
  "Old Padra Road",
  "OP Road (extended part within city)",
  "Nandesari (on the fringe urban limits)",
  "Padra Road",
  "Pratapgunj",
  "Panchvati",
  "Pariwar Char Rasta (Waghodia Road)",
  "Race Course",
  "Sama-Savil Road",
  "Savli (Vadodara District part)",
  "Sayajigunj",
  "Shree Kunj Society",
  "Sherkhi",
  "Sikandarpura",
  "Somatalav",
  "Subhanpura",
  "Sun Pharma Road",
  "Sainath Park",
  "Swati Society",
  "Tarsali",
  "Tandalja",
  "Undera",
  "Vadsar (Vadsar Road)",
  "Vasna",
  "Vasna Road",
  "Vasna-Bhayli Road",
  "Vemali",
  "Vasant Vihar",
  "Vishwamitri",
  "Vrajpark (Navapura)",
  "Vyara",
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
