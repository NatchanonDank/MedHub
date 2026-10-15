import React, { useState, useMemo } from 'react';
import { useMedications } from '../hooks/useMedications';
import MedicationCard from '../components/MedicationCard';

export const MedListPage: React.FC = () => {
  // TanStack Query
  const { data: medicationsData, isLoading, isError, refetch } = useMedications();
  
  // State สำหรับช่องค้นหา ตัวกรองหมวดหมู่ และการเรียงลำดับ
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('A-Z');

  // ดึงข้อมูลผลลัพธ์ยาทั้งหมดจากโครงสร้าง API response
  const medications = medicationsData?.results || [];

  const categories = useMemo(() => {
    if (!medicationsData) return [];
    const cats = medications.map((med: any) => med.category || med.drugClass);
    return Array.from(new Set(cats.filter(Boolean)));
  }, [medicationsData, medications]);

  // จัดการข้อมูลการค้นหาและกรอง
  const filteredMedications = useMemo(() => {
    if (!medications) return [];
    let result = medications;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((med: any) => 
        med.name.toLowerCase().includes(lowerSearch) ||
        (med.genericName && med.genericName.toLowerCase().includes(lowerSearch)) ||
        (med.brandName && med.brandName.toLowerCase().includes(lowerSearch))
      );
    }

    // หมวดหมู่ 
    if (selectedCategory) {
      result = result.filter((med: any) => (med.category || med.drugClass) === selectedCategory);
    }

    // A-Z / Z-A 
    result = [...result].sort((a: any, b: any) => {
      if (sortOrder === 'A-Z') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return result;
  }, [medications, searchTerm, selectedCategory, sortOrder]);

  // กรณีดึงข้อมูลยังไม่เสร็จ!!!!!
  if (isLoading) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-base-content/60 font-medium">กำลังโหลดฐานข้อมูลยา...</p>
      </div>
    );
  }

  // กรณีดึงข้อมูลหรือหา JSON ไม่เจอ!!!!
  if (isError || !medicationsData) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-error font-bold text-lg">ไม่สามารถโหลดข้อมูลยาได้ โปรดตรวจสอบไฟล์ JSON</p>
        <button onClick={() => refetch()} className="btn btn-sm btn-primary">ลองใหม่ (Retry)</button>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* ช่องค้นหา, เลือกหมวดหมู่, เรียงลำดับ A-Z/Z-A) */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
        <div className="form-control flex-1">
          <input 
            type="text" 
            placeholder="ค้นหาชื่อยา, ชื่อสามัญ..." 
            className="input input-bordered w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="form-control w-full md:w-48 shrink-0">
          <select 
            className="select select-bordered w-full"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat as string}>{cat as string}</option>
            ))}
          </select>
        </div>
        <div className="form-control w-full md:w-32 shrink-0">
          <select 
            className="select select-bordered w-full"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="A-Z">A - Z</option>
            <option value="Z-A">Z - A</option>
          </select>
        </div>
      </div>

      {filteredMedications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMedications.map((med: any) => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-base-100 rounded-xl border border-base-200 border-dashed">
          <p className="text-lg font-medium text-base-content/60">ไม่พบยาที่คุณค้นหา</p>
          <button 
            className="btn btn-ghost mt-4"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
            }}
          >
            ล้างการค้นหา
          </button>
        </div>
      )}
    </div>
  );
};