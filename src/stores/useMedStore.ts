import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// กำหนด Type ของ State และ Action
interface MedState {
  bookmarks: (number | string)[];                   // เก็บเฉพาะ Array ของ ID ยาที่ถูก Bookmark (Client State)
  toggleBookmark: (id: number | string) => void;    // ฟังก์ชันสำหรับ สลับสถานะ Bookmark (เพิ่ม/ลบ)
}

// สร้าง Store ด้วย create() และครอบด้วย persist() เพื่อบันทึกลง LocalStorage อัตโนมัติ
export const useMedStore = create<MedState>()(
  persist(
    (set) => ({
      bookmarks: [], 

      toggleBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((mId) => mId !== id) 
            : [...state.bookmarks, id],                   
        })),
    }),
    {
      name: 'med-storage', // คีย์สำหรับจัดเก็บใน window.localStorage
    }
  )
);