export interface Medication {
  id: number;
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
  image?: string;
}

export interface MedicationApiResponse {
  count: number;
  results: Medication[];
}

// Network Skeleton Loading
const simulateNetworkDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ป้องกัน Vite ส่ง <!doctype html> กลับมา
const fetchJsonSafely = async (): Promise<unknown> => {
  // วางไฟล์ไว้ที่ public/api/
  const candidatePaths = [
    '/api/medications.json',
    '/api/mock-medications.json',
    '/mock-medications.json',
  ];

  for (const path of candidatePaths) {
    try {
      const res = await fetch(path);
      const contentType = res.headers.get('content-type') || '';

      // ตรวจสอบว่าต้องได้ status 200 และไม่ใช่ไฟล์ index.html
      if (res.ok && !contentType.includes('text/html')) {
        return await res.json();
      }
    } catch {}
  }

  throw new Error(
    'ไม่พบไฟล์ของยา!'
  );
};

// แปลงข้อมูล JSON ให้เป็น Array ของ Medication พร้อมผูก Path รูปภาพ
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
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const rawImage = item.image ? String(item.image) : '';

    return {
      ...item,
      id: typeof item.id === 'number' ? item.id : Number(item.id) || index + 1,
      name,
      image: rawImage
        ? rawImage.startsWith('/') || rawImage.startsWith('http')
          ? rawImage
          : `/images/${rawImage}`
        : `/images/${cleanName}.png`,
    } as Medication;
  });
};

// API Endpoint: ดึงรายการยาทั้งหมด
export const fetchMedicationsApi = async (): Promise<MedicationApiResponse> => {
  await simulateNetworkDelay(400);
  const rawData = await fetchJsonSafely();
  const results = normalizeMedications(rawData);

  return {
    count: results.length,
    results,
  };
};

// จำลอง API Endpoint: ดึงข้อมูลยารายตัวตาม ID
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