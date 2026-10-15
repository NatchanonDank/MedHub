// ไฟล์: src/hooks/useMedications.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMedicationsApi,
  fetchMedicationByIdApi,
  type Medication,
  type MedicationApiResponse,
} from '../api/medicationApi';

export type { Medication, MedicationApiResponse };

// 1. Custom Hook สำหรับดึงรายการยาทั้งหมด (หน้ารายการ)
export const useMedications = () => {
  return useQuery<MedicationApiResponse>({
    queryKey: ['medications'], // คีย์สำหรับระบุ Cache ของรายการยา
    queryFn: async () => {
      // เรียกผ่าน API Layer ที่จำลอง HTTP Request
      return await fetchMedicationsApi();
    },
    staleTime: 1000 * 60 * 5, // ข้อมูลถือว่าสดใหม่ 5 นาที (ไม่ต้อง Fetch ซ้ำจาก Network)
  });
};

// 2. Custom Hook สำหรับดึงรายละเอียดยาตัวที่ต้องการ (หน้ารายละเอียด)
export const useMedicationDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery<Medication>({
    queryKey: ['medication', id], // คีย์แยกต่างหากตาม ID ของยาแต่ละตัว
    queryFn: async () => {
      // ลองดึงจาก API โดยตรง
      try {
        return await fetchMedicationByIdApi(id!);
      } catch (err) {
        console.warn('API error, reading from cache...', err);
      }

      // Fallback: หาก API มีปัญหา ดึงข้อมูลจาก Cache รายการยาที่โหลดไว้แล้ว
      const medsData = queryClient.getQueryData<MedicationApiResponse>(['medications']);
      const cached = medsData?.results.find((m) => String(m.id) === String(id));
      if (cached) return cached;

      throw new Error('ไม่สามารถดึงข้อมูลยาตัวนี้ได้');
    },
    initialData: () => {
      // ดึงข้อมูลจาก Cache ของรายการยามาแสดงทันที (0ms) ระหว่างรอ Network
      const medsData = queryClient.getQueryData<MedicationApiResponse>(['medications']);
      return medsData?.results.find((m) => String(m.id) === String(id));
    },
    enabled: !!id,             // ทำงานเมื่อมี id เท่านั้น
    staleTime: 1000 * 60 * 10, // แคชรายละเอียดไว้นาน 10 นาที
  });
};