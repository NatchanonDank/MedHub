import React from 'react';

export const AboutPage: React.FC = () => {
  const teamMembers = [
    {
      id: '1650701343',
      name: 'นายณัฐชนน ด่านกิจยิ่งยง',
      nickname: 'เอฟ',
      role: 'พัฒนาแอปพลิเคชันทั้งหมด (Frontend/Backend, Routing, State Management)',
      img: '/images/profile1.jpg',
    },
    {
      id: '1660701648',
      name: 'นายณัฐภพ สมิทธินันต์',
      nickname: 'เต้',
      role: 'ออกแบบหาข้อมูลยาและรูปภาพประกอบ (Mock JSON Data Server, Data Attribution, UX/UI)',
      img: '/images/profile2.jpg',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-primary">ทีมผู้จัดทำ</h1>
        <p className="text-base-content/70">Mini Project 2 - Modern Decoupled SPA</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="card bg-base-100 shadow-lg border border-base-200 items-center text-center p-6 flex flex-col justify-between">
            <div className="flex flex-col items-center w-full">
              <div className="avatar mb-4">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={member.img} alt={member.name} />
                </div>
              </div>
              <h2 className="card-title text-xl text-white justify-center">{member.name} ({member.nickname})</h2>
              <p className="font-mono text-sm text-primary mt-1">{member.id}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-base-200/30 w-full text-center">
              <p className="text-sm text-white/80 leading-relaxed"><b>หน้าที่:</b> {member.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-100/50 border border-base-300 p-6 text-center">
        <h3 className="font-bold text-lg mb-2 text-white">ข้อมูลอ้างอิง (Data Attribution)</h3>
        <p className="text-sm text-white/90 leading-relaxed space-y-1">
          ข้อมูลยาทั้งหมดภายในแอปพลิเคชันนี้อ้างอิงข้อมูลและอินโฟกราฟิกจาก <b>@pharmacology.studies</b> บน Instagram
          <br />
          รวมถึงเรียบเรียงและตรวจสอบข้อมูลเพิ่มเติมจากตำราเภสัชวิทยามาตรฐานและเวชปฏิบัติสากล (Standard Pharmacology & Clinical References)
          <br />
          โดยนำมาผ่านกระบวนการคัดกรองและจัดทำเป็น Mock JSON Data Server เพื่อใช้สำหรับการศึกษาในรายวิชา CS319 เท่านั้น
        </p>
      </div>
    </div>
  );
};