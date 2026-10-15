import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchMedicationsApi,
  fetchMedicationByIdApi,
  type Medication,
  type MedicationApiResponse,
} from '../api/medicationApi';

export type { Medication, MedicationApiResponse };

// Hook สำหรับดึงรายการยาทั้งหมด
export const useMedications = () => {
  return useQuery<MedicationApiResponse>({
    queryKey: ['medications'],
    queryFn: async () => {
      return await fetchMedicationsApi();
    },
    staleTime: 1000 * 60 * 5, 
  });
};

// Hook สำหรับดึงรายละเอียดยาตัวที่ต้องการ
export const useMedicationDetail = (id: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery<Medication>({
    queryKey: ['medication', id], // Key แยกต่างหากตาม ID ของยาแต่ละตัว
    queryFn: async () => {
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