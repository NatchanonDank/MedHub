# MedHub (Medication Hub)

**MedHub** คือเว็บแอปพลิเคชันศูนย์รวมข้อมูลยาและการจัดการกระเป๋ายาส่วนตัว (CS319 Mini Project 2) ที่ออกแบบมาเพื่อยกระดับความปลอดภัยในการใช้ยาของผู้ป่วย โดยมีระบบตรวจสอบปฏิกิริยาระหว่างยา (Drug Interaction Checker) เพื่อป้องกันความเสี่ยงจากการใช้ยาตีกัน

## Features (ฟีเจอร์หลัก)

- **Search & Filter:** ค้นหาข้อมูลยาจากชื่อยา ชื่อสามัญ และกรองตามหมวดหมู่ได้แบบเรียลไทม์
- **Medication Details:** แสดงรายละเอียดของยา ข้อบ่งใช้ ผลข้างเคียง และคำเตือนอย่างชัดเจน
- **My Kit:** บันทึกยาที่กำลังใช้งานอยู่ (ข้อมูลไม่สูญหายเมื่อรีเฟรชหน้าเว็บ)
- **Interaction Checker:** ระบบตรวจสอบความปลอดภัยเมื่อใช้ยา 2 ชนิดร่วมกัน พร้อมแจ้งเตือนระดับความเสี่ยง (Safe, Warning, Danger)

## Tech Stack (เทคโนโลยีที่ใช้)

- **Frontend Framework:** React (Vite) + TypeScript
- **Styling:** Tailwind CSS / DaisyUI (อ้างอิงตามคลาส UI)
- **State Management:** Zustand (พร้อม Persist Middleware เพื่อเชื่อมต่อกับ LocalStorage)
- **Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router DOM (พร้อมรองรับ Dynamic Routing)

## โครงสร้างทางเทคนิคที่สำคัญ (Technical Implementation)

โปรเจกต์นี้ได้พัฒนาขึ้นตามข้อกำหนดของ Mini Project 2 อย่างเคร่งครัด:

1. **TanStack Query สำหรับจำลองการเรียก API:**
   - ข้อมูลยาถูกเก็บไว้ที่ `public/data/mock-medications.json`
   - ใช้ `fetch` ทำงานร่วมกับ `useQuery` เพื่อดึงข้อมูลเสมือนการยิง API จริง
   - จัดการ State ของ Loading และ Error อัตโนมัติ พร้อมตั้งค่า `staleTime: 5 นาที` เพื่อทำ Data Caching ลดการโหลดซ้ำซ้อน

2. **Zustand & LocalStorage:**
   - จัดการ Global State ของกระเป๋ายา (My Kit) เพื่อให้ Component ต่างๆ เช่น หน้า Detail และ Navbar อัปเดตข้อมูลได้ตรงกันทันที
   - ใช้ `persist` middleware เพื่อให้ข้อมูลกระเป๋ายายังคงอยู่แม้ผู้ใช้จะปิดหรือรีเฟรชเบราว์เซอร์

3. **React Router & Dynamic Routing:**
   - ทำงานในรูปแบบ Single Page Application (SPA)
   - ใช้ Dynamic Route เช่น `/medication/:id` ร่วมกับ `useParams` เพื่อดึงข้อมูลยาแต่ละชนิดมาแสดงผลในหน้ารายละเอียดได้อย่างถูกต้อง

## การติดตั้งและรันโปรเจกต์ (Installation & Setup)

1. **Clone repository:**
   ```bash
   git clone https://github.com/your-username/medication-hub.git
   cd medication-hub
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **รันเซิร์ฟเวอร์จำลอง (Development Server):**
   ```bash
   npm run dev
   ```

4. เปิดเบราว์เซอร์และเข้าไปที่ `http://localhost:5173`

---
*Developed for CS319 Mini Project 2*
