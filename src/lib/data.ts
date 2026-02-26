import { collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, where, type Unsubscribe } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface SubMember {
  name: string;
  contact: string;
  area: string;
  profession: string;
}

export interface MemberRegistration {
  id: string;
  userId?: string;
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
  "Madhyasth City Vistar",
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

export async function getRegistrations(): Promise<MemberRegistration[]> {
  const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data() as Omit<MemberRegistration, "id"> & { id?: string };
    return {
      ...data,
      id: data.id || d.id,
    };
  });
}

export async function getRegistrationById(id: string): Promise<MemberRegistration | null> {
  const snapshot = await getDoc(doc(db, "registrations", id));
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as Omit<MemberRegistration, "id"> & { id?: string };
  return {
    ...data,
    id: data.id || snapshot.id,
  };
}

export async function saveRegistration(reg: MemberRegistration): Promise<void> {
  await setDoc(doc(db, "registrations", reg.id), reg);
}

export async function getRegistrationByUserId(userId: string): Promise<MemberRegistration | null> {
  const byId = await getDoc(doc(db, "registrations", userId));
  if (byId.exists()) {
    const data = byId.data() as Omit<MemberRegistration, "id"> & { id?: string };
    return {
      ...data,
      id: data.id || byId.id,
    };
  }

  const q = query(collection(db, "registrations"), where("userId", "==", userId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const first = snapshot.docs[0];
  const data = first.data() as Omit<MemberRegistration, "id"> & { id?: string };
  return {
    ...data,
    id: data.id || first.id,
  };
}

export async function saveRegistrationForUser(userId: string, reg: Omit<MemberRegistration, "id">): Promise<void> {
  await setDoc(doc(db, "registrations", userId), {
    ...reg,
    id: userId,
    userId,
  });
}

export async function getUserRegistrationProfile(userId: string): Promise<MemberRegistration | null> {
  const snapshot = await getDoc(doc(db, "users", userId));
  if (!snapshot.exists()) {
    return null;
  }

  const payload = snapshot.data() as {
    registration?: Omit<MemberRegistration, "id"> & { id?: string };
  };

  if (!payload.registration) {
    return null;
  }

  return {
    ...payload.registration,
    id: payload.registration.id || userId,
    userId,
  };
}

export async function saveUserRegistrationProfile(userId: string, reg: Omit<MemberRegistration, "id">): Promise<void> {
  await setDoc(
    doc(db, "users", userId),
    {
      registration: {
        ...reg,
        id: userId,
        userId,
      },
    },
    { merge: true },
  );
}

export async function deleteRegistration(id: string): Promise<void> {
  await deleteDoc(doc(db, "registrations", id));
}

export function listenRegistrations(
  onData: (registrations: MemberRegistration[]) => void,
  onError?: (error: unknown) => void,
): Unsubscribe {
  const q = query(collection(db, "registrations"), orderBy("registeredAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const registrations = snapshot.docs.map((d) => {
        const data = d.data() as Omit<MemberRegistration, "id"> & { id?: string };
        return {
          ...data,
          id: data.id || d.id,
        };
      });
      onData(registrations);
    },
    (error) => {
      onError?.(error);
    },
  );
}
