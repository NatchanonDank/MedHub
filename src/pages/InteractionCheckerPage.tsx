import React, { useState, useEffect } from 'react';
import { useMedications } from '../hooks/useMedications'; // แก้ไขเป็นถอยกลับ 1 โฟลเดอร์

export const InteractionCheckerPage: React.FC = () => {
  const { data, isLoading, isError } = useMedications();
  const medications = data?.results || [];

  const [med1Id, setMed1Id] = useState<string>('');
  const [med2Id, setMed2Id] = useState<string>('');
  const [result, setResult] = useState<{ status: 'safe' | 'warning' | 'danger'; message: string } | null>(null);

  // เคลียร์ผลลัพธ์เก่าทิ้งทันทีเมื่อมีการเปลี่ยนตัวยา
  useEffect(() => {
    setResult(null);
  }, [med1Id, med2Id]);

  if (isLoading) {
    return <div className="text-center py-20">กำลังโหลดฐานข้อมูลยา... <span className="loading loading-spinner text-primary"></span></div>;
  }

  if (isError || !data) {
    return <div className="text-center py-20 text-error">ไม่สามารถโหลดข้อมูลเพื่อตรวจสอบได้</div>;
  }

  const checkInteraction = () => {
    if (!med1Id || !med2Id) return;
    
    if (med1Id === med2Id) {
      setResult({ 
        status: 'warning', 
        message: 'คุณเลือกยาทั้งสองชนิดซ้ำกัน กรุณาเลือกยาที่แตกต่างกันเพื่อตรวจสอบ' 
      });
      return;
    }

    const med1 = medications.find((m: any) => String(m.id) === med1Id);
    const med2 = medications.find((m: any) => String(m.id) === med2Id);

    if (!med1 || !med2) return;

    // ฟังก์ชันช่วยเช็คชื่อ/genericName ของยาแต่ละตัว
    const matchName = (med: any, ...names: string[]) => 
      names.some(n => med.name.includes(n) || med.genericName?.includes(n) || (med.brandName && med.brandName.includes(n)));

    // แยกเช็คคุณสมบัติของยาแต่ละตัวอย่างอิสระ
    const isNSAID = (med: any) => med.category === 'NSAID';
    const isBloodThinner = (med: any) => matchName(med, 'Warfarin', 'Apixaban', 'Clopidogrel', 'Enoxaparin', 'Aspirin') || med.category === 'Anticoagulant';
    const isSSRI = (med: any) => matchName(med, 'Sertraline', 'Escitalopram', 'Fluoxetine');
    const isTramadol = (med: any) => matchName(med, 'Tramadol');
    const isStatin = (med: any) => matchName(med, 'Atorvastatin', 'Rosuvastatin', 'Simvastatin');
    const isFluconazole = (med: any) => matchName(med, 'Fluconazole');
    const isWarfarin = (med: any) => matchName(med, 'Warfarin');
    const isDigoxin = (med: any) => matchName(med, 'Digoxin');
    const isDiuretic = (med: any) => med.category === 'Cardiovascular' && matchName(med, 'Furosemide', 'Hydrochlorothiazide');
    const isPotassiumSparing = (med: any) => matchName(med, 'Spironolactone');
    const isAceArb = (med: any) => matchName(med, 'Lisinopril', 'Valsartan', 'Losartan');
    const isPPI = (med: any) => matchName(med, 'Omeprazole', 'Pantoprazole');
    const isClopidogrel = (med: any) => matchName(med, 'Clopidogrel');
    const isMethotrexate = (med: any) => matchName(med, 'Methotrexate');
    const cnsList = ['Alprazolam', 'Amitriptyline', 'Gabapentin', 'Tramadol', 'Diazepam'];
    const isCNS = (med: any) => cnsList.some(d => med.genericName?.includes(d) || med.name.includes(d));

    // ตรวจสอบความสัมพันธ์แบบสลับตัวยาได้ (A+B หรือ B+A)
    const matchPair = (checkA: (m: any) => boolean, checkB: (m: any) => boolean) => 
      (checkA(med1) && checkB(med2)) || (checkA(med2) && checkB(med1));

    // --- กลุ่มเสี่ยงอันตราย (Danger) ---
    if (matchPair(isNSAID, isBloodThinner)) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาแก้ปวดกลุ่ม NSAID ร่วมกับยาละลายลิ่มเลือด/ต้านเกล็ดเลือด เพิ่มความเสี่ยงเลือดออกในทางเดินอาหารขั้นรุนแรง` });
    }
    else if (matchPair(isSSRI, isTramadol)) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาทั้งสองตัวนี้ร่วมกัน เพิ่มความเสี่ยงให้เกิดภาวะ Serotonin Syndrome (ไข้สูง, กล้ามเนื้อกระตุก, สับสน) ซึ่งเป็นอันตรายถึงชีวิต` });
    }
    else if (matchPair(isStatin, isFluconazole)) {
      setResult({ status: 'danger', message: `อันตราย! ยาฆ่าเชื้อรา Fluconazole จะเพิ่มระดับยาลดไขมัน Statin ในเลือด ทำให้เสี่ยงต่อภาวะกล้ามเนื้อลายสลายตัว (Rhabdomyolysis)` });
    }
    else if (matchPair(isWarfarin, isFluconazole)) {
      setResult({ status: 'danger', message: `อันตราย! Fluconazole เพิ่มระดับยา Warfarin ในเลือดอย่างมาก ทำให้เสี่ยงต่อภาวะเลือดออกรุนแรง ต้องปรึกษาแพทย์ทันที` });
    }
    else if (matchPair(isAceArb, isPotassiumSparing)) {
      setResult({ status: 'danger', message: `อันตราย! การใช้ยาลดความดัน (ACEi/ARB) ร่วมกับ Spironolactone อาจทำให้ระดับโพแทสเซียมในเลือดสูงเกินไป (Hyperkalemia) ซึ่งมีผลต่อจังหวะหัวใจ` });
    }
    else if ((isDigoxin(med1) && isDiuretic(med2) && !isPotassiumSparing(med2)) || (isDigoxin(med2) && isDiuretic(med1) && !isPotassiumSparing(med1))) {
      setResult({ status: 'danger', message: `อันตราย! ยาขับปัสสาวะอาจทำให้โพแทสเซียมต่ำ ซึ่งจะเพิ่มความเป็นพิษของ Digoxin (คลื่นไส้, ตาพร่า, หัวใจเต้นผิดจังหวะ)` });
    }
    
    // --- กลุ่มควรเฝ้าระวัง (Warning) ---
    else if (matchPair(isPPI, isClopidogrel)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาลดกรด (โดยเฉพาะ Omeprazole) อาจลดประสิทธิภาพของยา Clopidogrel ในการป้องกันลิ่มเลือด ควรปรึกษาแพทย์` });
    }
    else if (matchPair(isMethotrexate, isNSAID)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดการขับออกของ Methotrexate ทำให้ระดับยาในร่างกายสูงขึ้นและเกิดความเป็นพิษได้` });
    }
    else if (isCNS(med1) && isCNS(med2)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: การใช้ยากดประสาท/คลายกังวล/แก้ปวด ร่วมกัน จะเสริมฤทธิ์ทำให้ง่วงซึมรุนแรง กดการหายใจ และเสี่ยงต่ออุบัติเหตุ` });
    }
    else if (matchPair(isSSRI, isNSAID)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: การทานยาต้านเศร้ากลุ่ม SSRI ร่วมกับยาแก้ปวด NSAID เพิ่มความเสี่ยงให้เกิดแผลและเลือดออกในกระเพาะอาหาร` });
    }
    else if (matchPair(isNSAID, (m) => isAceArb(m) || isDiuretic(m))) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาแก้ปวด NSAID สามารถลดประสิทธิภาพของยาลดความดันโลหิตและยาขับปัสสาวะ และอาจทำให้การทำงานของไตแย่ลง` });
    }
    else if (med1.category && med2.category && (med1.category === med2.category) && ['Cardiovascular', 'Psychiatric'].includes(med1.category)) {
      setResult({ status: 'warning', message: `เฝ้าระวัง: ยาทั้งสองชนิดอยู่ในกลุ่มการรักษาเดียวกัน อาจเกิดการเสริมฤทธิ์กัน (เช่น ความดันตกมากเกินไป หรือง่วงซึมมาก) ควรใช้ภายใต้คำสั่งแพทย์` });
    }
    else {
      const hasInteractionJson1 = med1.interactions?.some((i: string) => i.toLowerCase().includes(med2.genericName?.toLowerCase() || '') || i.toLowerCase().includes(med2.brandName?.toLowerCase() || ''));
      const hasInteractionJson2 = med2.interactions?.some((i: string) => i.toLowerCase().includes(med1.genericName?.toLowerCase() || '') || i.toLowerCase().includes(med1.brandName?.toLowerCase() || ''));
      
      if (hasInteractionJson1 || hasInteractionJson2) {
        setResult({ status: 'warning', message: `เฝ้าระวัง: พบข้อมูลการเกิดปฏิกิริยาระหว่างยา ${med1.name} และ ${med2.name} ในฐานข้อมูล โปรดปรึกษาแพทย์หรือเภสัชกรก่อนใช้ร่วมกัน` });
      } else {
        setResult({ status: 'safe', message: `ปลอดภัย: ไม่พบปฏิกิริยารุนแรงระหว่าง ${med1.name} และ ${med2.name} ในระบบเบื้องต้น อย่างไรก็ตามหากมีอาการผิดปกติควรปรึกษาเภสัชกร` });
      }
    }
  };

  const resetChecker = () => {
    setMed1Id('');
    setMed2Id('');
    setResult(null);
  };

  return (
    <div className="w-full">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-primary">ตรวจสอบปฏิกิริยาระหว่างยา</h1>
        <p className="text-base-content/70">เลือกยา 2 ชนิดเพื่อตรวจสอบความเสี่ยงเมื่อรับประทานร่วมกัน</p>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 p-6 sm:p-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">ยาชนิดที่ 1</span></label>
            <select className="select select-bordered w-full" value={med1Id} onChange={(e) => setMed1Id(e.target.value)}>
              <option value="" disabled>เลือกยาชนิดที่ 1</option>
              {medications.map((med: any) => (
                <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
              ))}
            </select>
          </div>

          <div className="text-2xl font-bold text-base-content/30 pt-6">+</div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-semibold">ยาชนิดที่ 2</span></label>
            <select className="select select-bordered w-full" value={med2Id} onChange={(e) => setMed2Id(e.target.value)}>
              <option value="" disabled>เลือกยาชนิดที่ 2</option>
              {medications.map((med: any) => (
                <option key={med.id} value={med.id}>{med.name} ({med.category})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="btn btn-primary px-10 shadow-md" onClick={checkInteraction} disabled={!med1Id || !med2Id}>
            ตรวจสอบ
          </button>
          <button className="btn btn-ghost" onClick={resetChecker}>ล้างค่า</button>
        </div>

        {result && (
          <div className="mt-8 animate-fade-in">
            <div className={`alert ${result.status === 'safe' ? 'alert-success text-white' : result.status === 'warning' ? 'alert-warning' : 'alert-error text-white'} shadow-md`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">
                  {result.status === 'safe' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {result.status === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                  {result.status === 'danger' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {result.status === 'safe' && 'สามารถทานร่วมกันได้'}
                    {result.status === 'warning' && 'ควรระมัดระวัง'}
                    {result.status === 'danger' && 'ห้ามทานร่วมกันเด็ดขาด'}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};