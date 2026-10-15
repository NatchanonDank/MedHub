// ไฟล์: src/api/medicationApi.ts

export interface Medication {
  id: number | string;
  name: string;
  genericName?: string;
  brandName?: string;
  category?: string;
  drugClass?: string;
  description?: string;
  indications?: string | string[];
  dosage?: string;
  sideEffects?: string | string[];
  warnings?: string | string[];
  interactions?: string[];
  strength?: string;
  dosageForm?: string;
  prescriptionType?: string;
  specialTag?: string;
  dosageInstruction?: string;
  appearance?: string;
  pregnancyCategory?: string;
  image?: string;
  imageUrl?: string;
}

export interface MedicationApiResponse {
  count: number;
  results: Medication[];
}

const simulateNetworkDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchJsonSafely = async (): Promise<unknown> => {
  const candidatePaths = [
    '/api/mock-medications.json',
    '/data/mock-medications.json',
    '/mock-medications.json',
  ];

  for (const path of candidatePaths) {
    try {
      const res = await fetch(path);
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && !contentType.includes('text/html')) {
        return await res.json();
      }
    } catch {}
  }

  throw new Error('ไม่พบไฟล์ JSON ของยาในโฟลเดอร์ public/api/');
};

// ฟังก์ชันแปลงข้อมูลและจัดการ Path รูปภาพให้ถูกต้อง
const normalizeMedications = (raw: unknown): Medication[] => {
  let list: Record<string, unknown>[] = [];

  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.results)) list = obj.results;
    else if (Array.isArray(obj.medications)) list = obj.medications;
    else if (Array.isArray(obj.data)) list = obj.data;
  }

  return list.map((item, index) => {
    const name = String(item.name || item.title || `Medication ${index + 1}`);
    
    // ทำความสะอาดชื่อยาเพื่อใช้หาไฟล์รูปสำรอง (เช่น "Albuterol Sulfate HFA" -> "albuterol")
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');

    // รองรับทั้งฟิลด์ image และ imageUrl จาก JSON
    const rawImage = String(item.imageUrl || item.image || '');
    
    let resolvedImage = '';
    if (rawImage) {
      if (rawImage.startsWith('http') || rawImage.startsWith('/images/')) {
        resolvedImage = rawImage;
      } else {
        resolvedImage = `/images/${rawImage.replace(/^\/+/, '')}`;
      }
    } else {
      // หากไม่มีฟิลด์รูป ให้ดึงจากชื่อไฟล์ใน public/images/ อัตโนมัติ
      resolvedImage = `/images/${cleanName}.png`;
    }

    return {
      ...item,
      id: item.id ?? index + 1,
      name,
      image: resolvedImage,
      imageUrl: resolvedImage,
    } as Medication;
  });
};

export const fetchMedicationsApi = async (): Promise<MedicationApiResponse> => {
  await simulateNetworkDelay(400);
  const rawData = await fetchJsonSafely();
  const results = normalizeMedications(rawData);

  return {
    count: results.length,
    results,
  };
};

export const fetchMedicationByIdApi = async (id: string | number): Promise<Medication> => {
  await simulateNetworkDelay(300);
  const rawData = await fetchJsonSafely();
  const results = normalizeMedications(rawData);
  const found = results.find((med) => String(med.id) === String(id));

  if (!found) {
    throw new Error(`ไม่พบข้อมูลยารหัส ${id}`);
  }

  return found;
};