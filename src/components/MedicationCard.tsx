import { Link } from 'react-router';
import { useMedStore } from '../stores/useMedStore';

const MedicationCard = ({ medication }: { medication: any }) => {
  const { bookmarks, toggleBookmark } = useMedStore();
  const isSaved = bookmarks.includes(medication.id);
  const medImage = medication.imageUrl || medication.image;

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
      <figure className="px-4 pt-6 h-44 bg-transparent">
        <img 
          src={medImage} 
          alt={medication.name} 
          className="h-full object-contain drop-shadow-md"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/icon.png';
          }}
        />
      </figure>
      <div className="card-body p-5 flex flex-col flex-1 text-center items-center">     
        <div className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wider mb-1">
          {medication.category || medication.drugClass || 'ทั่วไป'}
        </div>
        <h2 className="card-title text-lg font-bold text-base-content leading-tight justify-center w-full">
          {medication.name}
        </h2>
        
        <div className="flex flex-col gap-1 mt-2 w-full">
          {medication.indications && Array.isArray(medication.indications) ? (
            medication.indications.slice(0, 2).map((ind: string, idx: number) => (
              <span key={idx} className="text-xs text-base-content/70 truncate w-full px-2">
                {ind}
              </span>
            ))
          ) : (
            <span className="text-xs text-base-content/70 truncate w-full px-2">
              {medication.description || 'ไม่มีข้อมูลสังเขป'}
            </span>
          )}
        </div>

        <div className="flex-1"></div>

        <div className="card-actions justify-center mt-4 w-full flex flex-col gap-2">
          <Link to={`/med/${medication.id}`} className="btn btn-primary btn-sm w-full font-medium">
            ดูข้อมูล
          </Link>

        </div>
      </div>
    </div>
  );
};

export default MedicationCard;