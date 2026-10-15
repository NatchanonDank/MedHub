import { Link } from 'react-router';
import MedicationCard from '../components/MedicationCard';
import { useMyKit } from '../hooks/useMedications';

export const MyKitPage = () => {
  const { myKit, clearKit } = useMyKit();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            กระเป๋ายาของฉัน
          </h1>
          <p className="text-base-content/70 mt-2">
            รายการยาที่คุณบันทึกไว้ ({myKit.length} รายการ)
          </p>
        </div>
        
        {myKit.length > 0 && (
          <button 
            onClick={clearKit} 
            className="btn btn-outline btn-error btn-sm"
          >
            ล้างกระเป๋ายาทั้งหมด
          </button>
        )}
      </div>
      {myKit.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {myKit.map((med: any) => (
            <MedicationCard key={med.id} medication={med} />
          ))}
        </div>
      ) : (
        <div className="bg-base-100 py-20 text-center rounded-2xl border border-base-200 shadow-sm mt-8">
          <div className="bg-base-200/50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-base-content/80">กระเป๋ายาว่างเปล่า</h2>
          <p className="text-base-content/50 mt-2 mb-6">คุณยังไม่ได้เพิ่มยาใดๆ ลงในกระเป๋าของคุณ</p>
          <Link to="/" className="btn btn-primary font-medium">ไปค้นหายากันเลย</Link>
        </div>
      )}
    </div>
  );
};