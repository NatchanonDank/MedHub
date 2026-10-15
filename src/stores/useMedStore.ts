// ไฟล์: src/stores/useMedStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 1. กำหนด Type ของ State และ Action
interface MedState {
  bookmarks: number[];                    // เก็บเฉพาะ Array ของ ID ยาที่ถูก Bookmark (Client State)
  toggleBookmark: (id: number) => void;   // ฟังก์ชันสำหรับ สลับสถานะ Bookmark (เพิ่ม/ลบ)
}

// 2. สร้าง Store ด้วย create() และครอบด้วย persist() เพื่อบันทึกลง LocalStorage อัตโนมัติ
export const useMedStore = create<MedState>()(
  persist(
    (set) => ({
      bookmarks: [], // ค่าเริ่มต้น: ยังไม่มียาที่ถูกบุ๊กมาร์ก

      // Action: ถ้ามี id อยู่แล้วให้คัดออก (Filter out), ถ้ายังไม่มีให้เพิ่มเข้าไปใหม่
      toggleBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.includes(id)
            ? state.bookmarks.filter((mId) => mId !== id) // เลิก Bookmark: ลบ ID ออก
            : [...state.bookmarks, id],                   // Bookmark: เพิ่ม ID เข้าไป
        })),
    }),
    {
      name: 'med-storage', // คีย์สำหรับจัดเก็บใน window.localStorage
    }
  )
);