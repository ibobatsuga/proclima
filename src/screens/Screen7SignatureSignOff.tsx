import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TopAppBar } from '../components/TopAppBar';
import { 
  PenTool, 
  RotateCcw, 
  CheckCircle2, 
  DollarSign, 
  FileText, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const Screen7SignatureSignOff: React.FC = () => {
  const { 
    activeJob, 
    customers, 
    services, 
    signAndCompleteJob, 
    setActiveScreen 
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const customer = customers.find(c => c.id === activeJob?.customerId);
  const service = services.find(s => s.id === activeJob?.serviceId);

  const servicePrice = service?.price || 75000;
  const partsTotal = activeJob?.spareparts?.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0) || 0;
  const grandTotal = servicePrice + partsTotal;

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize properly for devicePixelRatio
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#253067';
    ctx.lineWidth = 2.5;
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleCompleteJob = () => {
    if (!hasSignature) {
      alert('Mohon minta tanda tangan digital pelanggan di kotak yang tersedia sebagai bukti serah terima.');
      return;
    }

    const canvas = canvasRef.current;
    const signatureUrl = canvas ? canvas.toDataURL() : '';

    if (activeJob) {
      const res = signAndCompleteJob(activeJob.id, signatureUrl);
      if (res.success) {
        setActiveScreen('screen-8'); // Proceed to celebration & job complete
      }
    }
  };

  return (
    <div className="pb-32 min-h-screen bg-surface">
      <TopAppBar 
        title="Tanda Tangan & Selesai" 
        subtitle="Tahap 2: Bukti persetujuan pelanggan" 
        showBack={true}
        onBack={() => setActiveScreen('screen-6')}
      />

      <div className="p-4 space-y-4 max-w-xl mx-auto">
        {/* Bill Breakdown Summary Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Ringkasan Tagihan</span>
              <h3 className="font-display font-bold text-base text-navy">{customer?.name}</h3>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
              Pekerjaan Selesai
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>{service?.name}</span>
              <span className="font-semibold text-navy">Rp {servicePrice.toLocaleString('id-ID')}</span>
            </div>

            {activeJob?.spareparts?.map(part => (
              <div key={part.id} className="flex justify-between text-slate-600">
                <span>{part.name} ({part.quantity}x)</span>
                <span className="font-semibold text-navy">
                  Rp {(part.quantity * part.unitPrice).toLocaleString('id-ID')}
                </span>
              </div>
            ))}

            <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-navy">Total Pembayaran Jasa:</span>
              <span className="font-display font-bold text-lg text-brandOrange">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Digital Signature Pad (Proof by default - Principle 4) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-brandOrange" />
              <span>Tanda Tangan Digital Pelanggan</span>
            </label>
            <button
              onClick={clearCanvas}
              className="text-xs text-slate-400 hover:text-navy flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Bersihkan</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Silakan serahkan HP ini kepada pelanggan untuk membubuhkan tanda tangan dengan jari:
          </p>

          <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 touch-none overflow-hidden h-44">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs">
                <span>Tanda tangan di sini menggunakan jari</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeCheck"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 rounded text-brandOrange focus:ring-brandOrange"
            />
            <label htmlFor="agreeCheck" className="text-xs text-slate-600 select-none">
              Pelanggan mengonfirmasi AC telah dingin dan area pengerjaan bersih rapi.
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl safe-area-bottom">
        <div className="max-w-xl mx-auto">
          <button
            onClick={handleCompleteJob}
            disabled={!hasSignature || !agreed}
            className="touch-target w-full bg-brandOrange text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brandOrange/30 disabled:opacity-50 active:bg-brandOrange-dark transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Tutup Job & Terbitkan Invoice Same-Day</span>
          </button>
        </div>
      </div>
    </div>
  );
};
