import React from 'react';
import { useParams, Link } from 'react-router';
import { useMedicationDetail } from '../hooks/useMedications';
import { useMedStore } from '../stores/useMedStore';

export const MedDetailPage: React.FC = () => {
  // ดึง ID จาก Dynamic Route Parameter
  const { id } = useParams<{ id: string }>();

  // ดึงข้อมูลยาตัวนี้จาก TanStack Query
  const { data: med, isLoading, isError, error, refetch } = useMedicationDetail(id);

  // ดึงสถานะ Bookmark และฟังก์ชัน toggle จาก Zustand
  const { bookmarks, toggleBookmark } = useMedStore();

  // สถานะ Loading: แสดง Skeleton Pulse รูปทรงหน้ารายละเอียดด้วย DaisyUI
  if (isLoading)
    return (
      <div className="card max-w-xl mx-auto bg-base-100 shadow-xl border border-base-300 p-6 space-y-4 my-8">
        <div className="skeleton h-5 w-32 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-5 w-1/2 rounded" />
        <div className="skeleton h-64 w-48 mx-auto rounded-lg" />
        <div className="skeleton h-5 w-2/3 mx-auto rounded" />
        <div className="skeleton h-12 w-48 mx-auto rounded-lg" />
      </div>
    );

  // สถานะ Error: แสดงข้อความแจ้งเตือน พร้อมปุ่ม Retry และปุ่มย้อนกลับด้วย DaisyUI Alert
  if (isError || !med)
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg flex flex-col items-center gap-4 text-center">
        <div>
          <h3 className="font-bold text-lg">ไม่พบข้อมูลยาตัวนี้</h3>
          {error && <p className="text-xs opacity-80 mt-1">{(error as Error).message}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn btn-sm btn-primary">
            ลองใหม่ (Retry)
          </button>
          <Link to="/" className="btn btn-sm btn-ghost">
            ย้อนกลับหน้ารายการ
          </Link>
        </div>
      </div>
    );

  // ตรวจสอบว่ายาตัวนี้ถูก Bookmark ไว้หรือไม่
  const isSaved = bookmarks.includes(med.id);

  // แสดงผลข้อมูลรายละเอียดของยาด้วย DaisyUI Card
  return (
    <div className="card max-w-xl mx-auto bg-base-100 shadow-2xl border border-base-300 p-6 my-8">
      <div className="mb-4 text-left">
        <Link to="/" className="link link-primary inline-flex items-center gap-1 text-sm no-underline hover:underline">
          ← ย้อนกลับไปหน้ารายการ
        </Link>
      </div>

      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-base-content">{med.name}</h1>
        <p className="text-sm text-base-content/70">
          ชื่อสามัญ: <span className="font-medium text-base-content">{med.genericName || med.name}</span>
        </p>

        {med.image && (
          <figure className="py-2">
            <img
              src={med.image}
              alt={med.name}
              className="rounded-xl shadow-md max-h-72 object-contain bg-base-200 p-4 mx-auto"
            />
          </figure>
        )}

        <div className="badge badge-outline badge-lg text-xs py-3 px-4">
          💊 หมวดหมู่: {med.category || med.drugClass || 'ทั่วไป'}
        </div>

        {(med.description || med.indications || med.dosage || med.sideEffects || med.warnings) && (
          <div className="text-left space-y-2 bg-base-200/60 p-4 rounded-xl text-sm">
            {med.description && <p><strong>รายละเอียด:</strong> {med.description}</p>}
            {med.indications && (
              <p>
                <strong>สรรพคุณ/ข้อบ่งใช้:</strong>{' '}
                {Array.isArray(med.indications) ? med.indications.join(', ') : med.indications}
              </p>
            )}
            {med.dosage && <p><strong>ขนาดการใช้ยา:</strong> {med.dosage}</p>}
            {med.sideEffects && (
              <p>
                <strong>ผลข้างเคียง:</strong>{' '}
                {Array.isArray(med.sideEffects) ? med.sideEffects.join(', ') : med.sideEffects}
              </p>
            )}
            {med.warnings && (
              <p className="text-error">
                <strong>คำเตือน:</strong>{' '}
                {Array.isArray(med.warnings) ? med.warnings.join(', ') : med.warnings}
              </p>
            )}
          </div>
        )}

        <div className="pt-4">
          <button
            onClick={() => toggleBookmark(med.id)}
            className={`btn btn-wide ${isSaved ? 'btn-warning' : 'btn-primary'} shadow-md`}
          >
            {isSaved ? '★ บุ๊กมาร์กแล้ว (Saved)' : '☆ บันทึกลงรายการโปรด'}
          </button>
        </div>
      </div>
    </div>
  );
};