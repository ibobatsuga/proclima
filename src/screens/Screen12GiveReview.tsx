import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Smile, 
  Thermometer,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const Screen12GiveReview: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    users, 
    submitCustomerReview, 
    setActiveScreen 
  } = useApp();

  const [rating, setRating] = useState<number>(5);
  const [aspects, setAspects] = useState({
    punctuality: true,
    cleanliness: true,
    coolingResult: true,
    technicianAttitude: true
  });
  const [comment, setComment] = useState<string>('Teknisi sangat profesional, datang on-time dan area kerja ditinggalkan dalam kondisi bersih. AC kembali dingin menggigil!');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const customer = customers.find(c => c.id === activeJob?.customerId) || customers[0];
  const technician = users.find(u => u.id === activeJob?.technicianId) || users[1];

  const toggleAspect = (key: keyof typeof aspects) => {
    setAspects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeJob) {
      submitCustomerReview({
        jobId: activeJob.id,
        customerId: customer.id,
        rating,
        aspects,
        comment
      });
      setSubmitted(true);
      try {
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch (err) {}
    }
  };

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title="Ulasan & Penilaian Kualitas" 
        subtitle="Suara Anda sangat berarti untuk kemajuan kami" 
        showBack={true}
        onBack={() => setActiveScreen('screen-9')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {submitted ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200 shadow-md space-y-3">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display font-bold text-lg text-navy">
              Terima Kasih Banyak!
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Ulasan Anda telah kami terima dan menjadi motivasi bagi teknisi kami untuk terus memberikan servis AC terbaik di Yogyakarta.
            </p>
            <div className="pt-3">
              <button
                onClick={() => setActiveScreen('screen-9')}
                className="touch-target bg-navy text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow"
              >
                Kembali ke Beranda Pelanggan
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Technician Profile Card */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
              <img
                src={technician.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"}
                alt="Teknisi"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Teknisi Servis Anda</span>
                <h4 className="font-display font-bold text-sm text-navy">{technician.name}</h4>
                <p className="text-xs text-slate-500">Bagaimana pengalaman servis AC hari ini?</p>
              </div>
            </div>

            {/* Star Rating Interactive */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-2">
              <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                Beri Nilai Bintang
              </span>
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-300 hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Star
                      className={`w-9 h-9 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-600 block">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Sangat Memuaskan!' : rating === 4 ? '⭐⭐⭐⭐ Bagus & Rapi' : 'Cukup Baik'}
              </span>
            </div>

            {/* Aspek Layanan Chips */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <span className="text-xs font-bold text-navy uppercase tracking-wider block">
                Aspek Yang Anda Sukai:
              </span>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'punctuality', label: 'Tepat Waktu', icon: Clock },
                  { id: 'cleanliness', label: 'Bersih & Rapi', icon: Sparkles },
                  { id: 'coolingResult', label: 'AC Sangat Dingin', icon: Thermometer },
                  { id: 'technicianAttitude', label: 'Ramah & Sopan', icon: Smile },
                ].map((item) => {
                  const isChecked = aspects[item.id as keyof typeof aspects];
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAspect(item.id as keyof typeof aspects)}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 text-left ${
                        isChecked 
                          ? 'bg-brandOrange/10 border-brandOrange text-brandOrange-dark' 
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Comment Box */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block">
                Pesan / Testimoni Anda:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Ceritakan pengalaman Anda memakai jasa servis AC Berkah Cool Mandiri..."
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-navy text-navy"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brandOrange/30 active:bg-brandOrange-dark transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Ulasan Pelanggan</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
