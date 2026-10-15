import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMedStore } from '../stores/useMedStore';
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

// Hook สำหรับจัดการกระเป๋ายา
export const useMyKit = () => {
  const { data } = useMedications();
  const { bookmarks, toggleBookmark } = useMedStore();

  const medications = data?.results || [];
  
  // กรองเอารายการยาที่อยู่ใน bookmarks มาแสดงในกระเป๋า
  const myKit = medications.filter((med) => bookmarks.includes(med.id));

  // ฟังก์ชันตรวจสอบว่ายาตัวนี้อยู่ในกระเป๋าแล้วหรือยัง
  const isInKit = (id: string | number) => bookmarks.includes(id);

  // ฟังก์ชันสลับสถานะเพิ่ม/ลบออกจากกระเป๋า 
  const toggleMyKit = (medOrId: any) => {
    const id = typeof medOrId === 'object' && medOrId !== null ? medOrId.id : medOrId;
    toggleBookmark(id);
  };

  // ฟังก์ชันล้างกระเป๋ายาทั้งหมด
  const clearKit = () => {
    bookmarks.forEach((id) => toggleBookmark(id));
  };

  return {
    myKit,
    isInKit,
    toggleMyKit,
    addToKit: toggleBookmark,
    removeFromKit: toggleBookmark,
    clearKit,
  };
};