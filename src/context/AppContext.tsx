import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Tenant,
  User,
  Customer,
  ACUnit,
  ServiceCatalog,
  Job,
  Invoice,
  Reminder,
  AuditLog,
  Review,
  UserRoleView,
  JobStatus,
  SparepartItem
} from '../types';

interface AppContextType {
  // Tenant & User
  tenant: Tenant;
  updateTenantPlan: (plan: 'Basic' | 'Pro') => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentRoleView: UserRoleView;
  setCurrentRoleView: (role: UserRoleView) => void;
  users: User[];
  
  // Offline State (Principle 3)
  isOnline: boolean;
  toggleSimulatedOffline: () => void;
  pendingOfflineSyncCount: number;
  syncOfflineQueue: () => void;

  // Data Collections
  customers: Customer[];
  acUnits: ACUnit[];
  services: ServiceCatalog[];
  jobs: Job[];
  invoices: Invoice[];
  reminders: Reminder[];
  auditLogs: AuditLog[];
  reviews: Review[];

  // Selected Active Job for Technician Flow
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
  activeJob: Job | null;

  // Active Screen Navigation (1-12 flow + admin views)
  activeScreen: string;
  setActiveScreen: (screen: string) => void;

  // Core Actions & FR Validations
  createBooking: (bookingData: {
    customerId: string;
    unitId: string;
    serviceId: string;
    technicianId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    complaint?: string;
    notes?: string;
    source: 'ADMIN' | 'LINK_PUBLIK';
  }) => { success: boolean; error?: string; conflictingJob?: Job; suggestedTechnicians?: User[] };

  assignTechnician: (jobId: string, technicianId: string) => {
    success: boolean;
    error?: string;
    conflictingJob?: Job;
    suggestedTechnicians?: User[];
  };

  updateJobStatus: (jobId: string, status: JobStatus, labelAwam: string) => void;
  saveServiceReport: (jobId: string, reportData: {
    beforePhoto?: string;
    afterPhoto?: string;
    freonPressurePSI?: number;
    outputTempCelsius?: number;
    checklist: Job['checklist'];
    technicianNotes?: string;
  }) => void;

  addSparepartsToJob: (jobId: string, spareparts: SparepartItem[]) => void;
  signAndCompleteJob: (jobId: string, signatureDataUrl: string) => { success: boolean; invoiceId: string; reminderId: string };
  
  // Invoices
  markInvoicePaid: (invoiceId: string, paymentMethod: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI') => void;

  // Customers & Units
  addCustomer: (data: Omit<Customer, 'id' | 'tenantId' | 'createdAt'>) => Customer;
  addACUnit: (data: Omit<ACUnit, 'id' | 'qrCode'>) => ACUnit;

  // Reminders & WhatsApp
  sendWhatsAppReminderNow: (reminderId: string) => boolean;
  optOutReminder: (reminderId: string) => void;

  // Reviews
  submitCustomerReview: (reviewData: Omit<Review, 'id' | 'createdAt'>) => void;

  // Exports
  exportCSV: (type: 'customers' | 'jobs' | 'invoices') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Tenant
  const [tenant, setTenant] = useState<Tenant>(() => {
    const saved = localStorage.getItem('proclima_tenant');
    if (saved) return JSON.parse(saved);
    return {
      id: 'tenant-yk-01',
      name: 'Berkah Cool Mandiri AC',
      phone: '081223344556',
      address: 'Jl. Gejayan No. 42, Sleman, D.I. Yogyakarta',
      plan: 'Basic', // Basic gratis selamanya vs Pro
      limits: {
        technicians: 2,
        admins: 1,
        customers: 50,
        acUnits: 100,
        jobsPerMonth: 100,
        whatsappPerMonth: 50
      },
      subscriptionStatus: 'ACTIVE'
    };
  });

  // Users (Owner, Admin, Technicians)
  const [users] = useState<User[]>([
    {
      id: 'usr-01',
      tenantId: 'tenant-yk-01',
      name: 'Om Bobi (Owner & Admin)',
      phone: '081223344556',
      email: 'bobi@berkahcool.id',
      role: 'OWNER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr-02',
      tenantId: 'tenant-yk-01',
      name: 'Budi Santoso',
      phone: '081399887711',
      email: 'budi.teknisi@berkahcool.id',
      role: 'TECHNICIAN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'usr-03',
      tenantId: 'tenant-yk-01',
      name: 'Rizki Pratama',
      phone: '081544332211',
      email: 'rizki.teknisi@berkahcool.id',
      role: 'TECHNICIAN',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User>(users[1]); // Default as Technician Budi Santoso
  const [currentRoleView, setCurrentRoleView] = useState<UserRoleView>('TECHNICIAN');
  const [activeScreen, setActiveScreen] = useState<string>('screen-1'); // 1: Dashboard
  const [activeJobId, setActiveJobId] = useState<string | null>('job-01');

  // Offline State (Design System Principle 3)
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingOfflineSyncCount, setPendingOfflineSyncCount] = useState<number>(0);

  const toggleSimulatedOffline = () => {
    setIsOnline(prev => !prev);
  };

  const syncOfflineQueue = () => {
    setPendingOfflineSyncCount(0);
    addAuditLog('System', 'System', 'SYNC_OFFLINE', 'Queue', 'Menyinkronkan data draft lokal ke server');
  };

  // Customers Mock
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('proclima_customers');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'cust-01',
        tenantId: 'tenant-yk-01',
        name: 'Ibu Maya Kartika',
        whatsappNumber: '081299887766',
        address: 'Jl. Kaliurang KM 5.5 Gg. Megatruh No. 14, Sleman',
        notes: 'Rumah pagar hitam, ada anjing kecil ramah',
        createdAt: '2026-10-10'
      },
      {
        id: 'cust-02',
        tenantId: 'tenant-yk-01',
        name: 'Pak Hendro Wibowo',
        whatsappNumber: '081322114455',
        address: 'Perumahan Pogung Baru Blok F-12, Mlati, Sleman',
        notes: 'AC outdoor di lantai 3 perlu tangga panjang',
        createdAt: '2026-10-15'
      },
      {
        id: 'cust-03',
        tenantId: 'tenant-yk-01',
        name: 'Klinik dr. Anita',
        whatsappNumber: '081755443322',
        address: 'Jl. Affandi (Gejayan) No. 28, Sleman',
        notes: 'Servis sebelum jam klinik buka (sebelum 09.00)',
        createdAt: '2026-10-20'
      }
    ];
  });

  // AC Units Mock
  const [acUnits, setAcUnits] = useState<ACUnit[]>(() => {
    const saved = localStorage.getItem('proclima_ac_units');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'unit-01',
        customerId: 'cust-01',
        brand: 'Daikin Inverter',
        pk: '1 PK',
        type: 'Split Wall',
        locationIndoor: 'Kamar Utama (Lt. 2)',
        locationOutdoor: 'Balkon Samping Kanan',
        qrCode: 'PRO-YK-001',
        installedYear: 2024,
        lastCleanedAt: '2026-08-08',
        notes: 'Freon R32, getaran outdoor normal'
      },
      {
        id: 'unit-02',
        customerId: 'cust-01',
        brand: 'Panasonic EcoNavi',
        pk: '0.5 PK',
        type: 'Split Wall',
        locationIndoor: 'Kamar Anak',
        locationOutdoor: 'Balkon Samping Kiri',
        qrCode: 'PRO-YK-002',
        installedYear: 2023,
        lastCleanedAt: '2026-08-08',
        notes: 'Filter cepat berdebu'
      },
      {
        id: 'unit-03',
        customerId: 'cust-02',
        brand: 'Sharp Plasmacluster',
        pk: '1.5 PK',
        type: 'Split Wall',
        locationIndoor: 'Ruang Keluarga Lt. 1',
        locationOutdoor: 'Dinding Belakang Garasi',
        qrCode: 'PRO-YK-003',
        installedYear: 2025,
        lastCleanedAt: '2026-07-20',
        notes: 'Pipa 1/4 - 1/2 tebal'
      },
      {
        id: 'unit-04',
        customerId: 'cust-03',
        brand: 'Gree Inverter',
        pk: '2 PK',
        type: 'Cassette Plafon',
        locationIndoor: 'Ruang Tunggu Pasien',
        locationOutdoor: 'Rooftop Lt. 2',
        qrCode: 'PRO-YK-004',
        installedYear: 2024,
        lastCleanedAt: '2026-08-15',
        notes: 'Perlu cuci rutin steril klinik'
      }
    ];
  });

  // Service Catalog
  const [services] = useState<ServiceCatalog[]>([
    {
      id: 'srv-01',
      name: 'Cuci & Cleaning AC Split (0.5 - 1 PK)',
      category: 'Cuci',
      price: 75000,
      estimatedMinutes: 45,
      recurrenceDays: 90,
      description: 'Pembersihan evaporator, filter, casing indoor, talang air & condenser outdoor'
    },
    {
      id: 'srv-02',
      name: 'Cuci & Cleaning AC Split (1.5 - 2 PK)',
      category: 'Cuci',
      price: 90000,
      estimatedMinutes: 60,
      recurrenceDays: 90,
      description: 'Pembersihan intensif unit kapasitas besar indoor & outdoor'
    },
    {
      id: 'srv-03',
      name: 'Tambah Freon R32 / R410A (Top-up)',
      category: 'Freon',
      price: 150000,
      estimatedMinutes: 30,
      recurrenceDays: 180,
      description: 'Pengisian tekanan freon ramah lingkungan sampai standar optimal 140-150 PSI'
    },
    {
      id: 'srv-04',
      name: 'Flushing Drainase & Perbaikan Bocor Air',
      category: 'Perbaikan',
      price: 100000,
      estimatedMinutes: 45,
      recurrenceDays: 90,
      description: 'Pembersihan saluran pembuangan air tersumbat lendir atau lumut'
    },
    {
      id: 'srv-05',
      name: 'Bongkar Pasang AC Split',
      category: 'Pasang',
      price: 350000,
      estimatedMinutes: 120,
      recurrenceDays: 90,
      description: 'Pelepasan unit lama, vacuum pipa instalasi, dan penempatan unit baru'
    }
  ]);

  // Initial Jobs
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('proclima_jobs');
    if (saved) return JSON.parse(saved);
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'job-01',
        tenantId: 'tenant-yk-01',
        customerId: 'cust-01',
        unitId: 'unit-01',
        serviceId: 'srv-01',
        technicianId: 'usr-02', // Budi Santoso
        scheduledDate: today,
        startTime: '09:00',
        endTime: '10:30',
        status: 'DITERIMA',
        statusLabelAwam: 'Teknisi telah menerima job, siap meluncur',
        source: 'ADMIN',
        complaint: 'AC Kurang Dingin & Hembusan Berdebu',
        notes: 'Pelanggan minta hati-hati air cucian di lantai parquet',
        checklist: {
          cleanFilterIndoor: true,
          cleanEvaporator: true,
          cleanDrainPipe: true,
          cleanOutdoorCondenser: true,
          electricalCheck: true
        },
        spareparts: [],
        createdAt: today
      },
      {
        id: 'job-02',
        tenantId: 'tenant-yk-01',
        customerId: 'cust-02',
        unitId: 'unit-03',
        serviceId: 'srv-01',
        technicianId: 'usr-02', // Budi Santoso
        scheduledDate: today,
        startTime: '13:00',
        endTime: '14:30',
        status: 'DITERIMA',
        statusLabelAwam: 'Dijadwalkan siang ini',
        source: 'ADMIN',
        complaint: 'Cuci rutin berkala',
        checklist: {
          cleanFilterIndoor: false,
          cleanEvaporator: false,
          cleanDrainPipe: false,
          cleanOutdoorCondenser: false,
          electricalCheck: false
        },
        spareparts: [],
        createdAt: today
      },
      {
        id: 'job-03',
        tenantId: 'tenant-yk-01',
        customerId: 'cust-03',
        unitId: 'unit-04',
        serviceId: 'srv-02',
        technicianId: 'usr-03', // Rizki Pratama
        scheduledDate: today,
        startTime: '08:00',
        endTime: '09:30',
        status: 'SELESAI',
        statusLabelAwam: 'Pekerjaan telah selesai & dingin optimal',
        source: 'LINK_PUBLIK',
        complaint: 'Pembersihan cassette ruang tunggu klinik',
        checkInTime: '08:05',
        checkInLocation: 'Gejayan No. 28, Sleman (GPS -7.7712, 110.3881)',
        beforePhoto: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
        afterPhoto: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        freonPressurePSI: 145,
        outputTempCelsius: 16.2,
        checklist: {
          cleanFilterIndoor: true,
          cleanEvaporator: true,
          cleanDrainPipe: true,
          cleanOutdoorCondenser: true,
          electricalCheck: true
        },
        spareparts: [],
        technicianNotes: 'Evaporator sangat bersih, drain lancar, freon stabil',
        completedAt: `${today} 09:25`,
        createdAt: today
      }
    ];
  });

  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('proclima_invoices');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'inv-2026-001',
        jobId: 'job-03',
        tenantId: 'tenant-yk-01',
        customerId: 'cust-03',
        amount: 90000,
        items: [
          { name: 'Cuci & Cleaning AC Split (1.5 - 2 PK)', qty: 1, price: 90000 }
        ],
        status: 'LUNAS',
        markedPaidAt: '2026-11-08 09:30',
        markedPaidBy: 'Om Bobi (Admin)',
        paymentMethod: 'QRIS',
        createdAt: '2026-11-08'
      }
    ];
  });

  // Reminders
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('proclima_reminders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rem-01',
        tenantId: 'tenant-yk-01',
        jobId: 'job-03',
        customerId: 'cust-03',
        unitId: 'unit-04',
        dueDate: '2027-02-06', // 90 days after service
        status: 'TERJADWAL',
        messageText: 'Halo Klinik dr. Anita, sudah 90 hari sejak servis AC Gree 2 PK terakhir di Berkah Cool Mandiri. Agar udara klinik tetap higienis & dingin maksimal, jadwalkan servis rutin Anda yuk! Balas pesan ini untuk pesan slot.',
        createdAt: '2026-11-08'
      }
    ];
  });

  // Audit Logs (FR-19)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('proclima_audit');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'aud-01',
        tenantId: 'tenant-yk-01',
        actor: 'Om Bobi',
        role: 'OWNER',
        action: 'CREATE_JOB',
        entity: 'Job job-01',
        details: 'Membuat booking cuci AC Ibu Maya untuk Budi Santoso',
        timestamp: '2026-11-08 19:30'
      },
      {
        id: 'aud-02',
        tenantId: 'tenant-yk-01',
        actor: 'Rizki Pratama',
        role: 'TECHNICIAN',
        action: 'COMPLETE_JOB',
        entity: 'Job job-03',
        details: 'Menyelesaikan pengerjaan AC Klinik dr. Anita & unggah bukti foto',
        timestamp: '2026-11-08 21:30'
      }
    ];
  });

  // Reviews Mock
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('proclima_reviews');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rev-01',
        jobId: 'job-03',
        customerId: 'cust-03',
        rating: 5,
        aspects: {
          punctuality: true,
          cleanliness: true,
          coolingResult: true,
          technicianAttitude: true
        },
        comment: 'Teknisi datang tepat waktu jam 8 pagi sebelum pasien datang. Kerjaannya rapi, lantai tidak becek sama sekali. Mantap!',
        createdAt: '2026-11-08 10:15'
      }
    ];
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('proclima_tenant', JSON.stringify(tenant));
  }, [tenant]);

  useEffect(() => {
    localStorage.setItem('proclima_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('proclima_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('proclima_ac_units', JSON.stringify(acUnits));
  }, [acUnits]);

  useEffect(() => {
    localStorage.setItem('proclima_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('proclima_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('proclima_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('proclima_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0] || null;

  const addAuditLog = (actor: string, role: string, action: string, entity: string, details: string) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      tenantId: tenant.id,
      actor,
      role,
      action,
      entity,
      details,
      timestamp: new Date().toLocaleString('id-ID', { hour12: false })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper time overlap in minutes (FR-09 Given-When-Then rule)
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const isTimeOverlap = (start1: string, end1: string, start2: string, end2: string) => {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return Math.max(s1, s2) < Math.min(e1, e2);
  };

  // FR-09: Anti Double-Booking Server Validation Logic
  const checkTechnicianConflict = (
    technicianId: string,
    scheduledDate: string,
    startTime: string,
    endTime: string,
    excludeJobId?: string
  ) => {
    const conflict = jobs.find(j => 
      j.id !== excludeJobId &&
      j.technicianId === technicianId &&
      j.scheduledDate === scheduledDate &&
      j.status !== 'DIBATALKAN' &&
      isTimeOverlap(j.startTime, j.endTime, startTime, endTime)
    );

    if (conflict) {
      // Find alternative technicians who are free
      const availableTechs = users.filter(u => 
        u.role === 'TECHNICIAN' &&
        u.id !== technicianId &&
        !jobs.some(j => 
          j.technicianId === u.id &&
          j.scheduledDate === scheduledDate &&
          j.status !== 'DIBATALKAN' &&
          isTimeOverlap(j.startTime, j.endTime, startTime, endTime)
        )
      );
      return { conflict, availableTechs };
    }
    return { conflict: null, availableTechs: [] };
  };

  // FR-07: Create Booking
  const createBooking = (bookingData: {
    customerId: string;
    unitId: string;
    serviceId: string;
    technicianId?: string;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    complaint?: string;
    notes?: string;
    source: 'ADMIN' | 'LINK_PUBLIK';
  }) => {
    // If technician assigned, validate conflict
    if (bookingData.technicianId) {
      const { conflict, availableTechs } = checkTechnicianConflict(
        bookingData.technicianId,
        bookingData.scheduledDate,
        bookingData.startTime,
        bookingData.endTime
      );

      if (conflict) {
        const conflictingTech = users.find(u => u.id === bookingData.technicianId)?.name || 'Teknisi';
        const custName = customers.find(c => c.id === conflict.customerId)?.name || 'Pelanggan';
        return {
          success: false,
          error: `JADWAL BENTROK: ${conflictingTech} sudah memiliki job pada pukul ${conflict.startTime} - ${conflict.endTime} untuk ${custName}. Penugasan ditolak oleh sistem.`,
          conflictingJob: conflict,
          suggestedTechnicians: availableTechs
        };
      }
    }

    const newJobId = `job-${String(jobs.length + 1).padStart(2, '0')}`;
    const newJob: Job = {
      id: newJobId,
      tenantId: tenant.id,
      customerId: bookingData.customerId,
      unitId: bookingData.unitId,
      serviceId: bookingData.serviceId,
      technicianId: bookingData.technicianId,
      scheduledDate: bookingData.scheduledDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      status: bookingData.technicianId ? 'DITERIMA' : 'MENUNGGU_PENUGASAN',
      statusLabelAwam: bookingData.technicianId ? 'Teknisi ditugaskan, siap meluncur' : 'Menunggu penugasan teknisi oleh admin',
      source: bookingData.source,
      complaint: bookingData.complaint,
      notes: bookingData.notes,
      checklist: {
        cleanFilterIndoor: false,
        cleanEvaporator: false,
        cleanDrainPipe: false,
        cleanOutdoorCondenser: false,
        electricalCheck: false
      },
      spareparts: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setJobs(prev => [newJob, ...prev]);
    addAuditLog(
      currentUser.name,
      currentUser.role,
      'CREATE_BOOKING',
      `Job ${newJobId}`,
      `Booking dibuat (${bookingData.source}) untuk tanggal ${bookingData.scheduledDate} jam ${bookingData.startTime}-${bookingData.endTime}`
    );

    return { success: true };
  };

  // FR-09: Assign Technician with Anti-Bentrok
  const assignTechnician = (jobId: string, technicianId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return { success: false, error: 'Job tidak ditemukan' };

    const { conflict, availableTechs } = checkTechnicianConflict(
      technicianId,
      targetJob.scheduledDate,
      targetJob.startTime,
      targetJob.endTime,
      jobId
    );

    if (conflict) {
      const conflictingTech = users.find(u => u.id === technicianId)?.name || 'Teknisi';
      const custName = customers.find(c => c.id === conflict.customerId)?.name || 'Pelanggan';
      return {
        success: false,
        error: `JADWAL BENTROK: ${conflictingTech} sudah terjadwal pukul ${conflict.startTime}-${conflict.endTime} melayani ${custName}. Mohon pilih teknisi yang kosong.`,
        conflictingJob: conflict,
        suggestedTechnicians: availableTechs
      };
    }

    const assignedTech = users.find(u => u.id === technicianId)?.name;
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          technicianId,
          status: 'DITERIMA',
          statusLabelAwam: `Job diterima oleh teknisi ${assignedTech}`
        };
      }
      return j;
    }));

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'ASSIGN_TECHNICIAN',
      `Job ${jobId}`,
      `Job ditugaskan ke ${assignedTech}`
    );

    return { success: true };
  };

  // FR-11: Update Status Job
  const updateJobStatus = (jobId: string, status: JobStatus, labelAwam: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        const updateData: Partial<Job> = {
          status,
          statusLabelAwam: labelAwam
        };
        if (status === 'BERANGKAT') {
          updateData.statusLabelAwam = 'Teknisi sedang dalam perjalanan ke lokasi Anda';
        } else if (status === 'DIKERJAKAN') {
          updateData.statusLabelAwam = 'Teknisi sedang melakukan pembersihan & pengecekan AC di lokasi';
          if (!j.checkInTime) {
            updateData.checkInTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            updateData.checkInLocation = 'Lokasi Pelanggan (Check-in via HP Teknisi)';
          }
        }
        return { ...j, ...updateData };
      }
      return j;
    }));

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'UPDATE_JOB_STATUS',
      `Job ${jobId}`,
      `Status diubah menjadi ${status} ("${labelAwam}")`
    );
  };

  // FR-11: Save Service Report (Checklist, Freon, Photos)
  const saveServiceReport = (jobId: string, reportData: {
    beforePhoto?: string;
    afterPhoto?: string;
    freonPressurePSI?: number;
    outputTempCelsius?: number;
    checklist: Job['checklist'];
    technicianNotes?: string;
  }) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          ...reportData
        };
      }
      return j;
    }));

    if (!isOnline) {
      setPendingOfflineSyncCount(prev => prev + 1);
    }

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'SAVE_SERVICE_REPORT',
      `Job ${jobId}`,
      `Laporan servis disimpan (Freon: ${reportData.freonPressurePSI || '-'} PSI, Suhu: ${reportData.outputTempCelsius || '-'} °C)`
    );
  };

  // FR-06 / FR-11: Add Spareparts
  const addSparepartsToJob = (jobId: string, spareparts: SparepartItem[]) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          spareparts
        };
      }
      return j;
    }));

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'ADD_PARTS',
      `Job ${jobId}`,
      `Menambahkan ${spareparts.length} item sparepart/biaya tambahan`
    );
  };

  // FR-11 & FR-13 & FR-15: Sign, Complete Job, Auto-Generate Same-day Invoice & 90-Day Reminder
  const signAndCompleteJob = (jobId: string, signatureDataUrl: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return { success: false, invoiceId: '', reminderId: '' };

    const service = services.find(s => s.id === job.serviceId);
    const servicePrice = service?.price || 75000;
    const partsTotal = job.spareparts.reduce((acc, p) => acc + (p.quantity * p.unitPrice), 0);
    const totalAmount = servicePrice + partsTotal;

    const completedTimestamp = new Date().toLocaleString('id-ID', { hour12: false });
    const today = new Date().toISOString().split('T')[0];

    // 1. Update Job status
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'SELESAI',
          statusLabelAwam: 'Pekerjaan selesai dengan bukti lengkap & ditandatangani',
          customerSignature: signatureDataUrl,
          completedAt: completedTimestamp
        };
      }
      return j;
    }));

    // 2. Generate Same-Day Invoice (FR-13)
    const newInvoiceId = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceItems = [
      { name: service?.name || 'Servis AC', qty: 1, price: servicePrice },
      ...job.spareparts.map(p => ({
        name: p.name,
        qty: p.quantity,
        price: p.unitPrice
      }))
    ];

    const newInvoice: Invoice = {
      id: newInvoiceId,
      jobId,
      tenantId: tenant.id,
      customerId: job.customerId,
      amount: totalAmount,
      items: invoiceItems,
      status: 'BELUM_BAYAR',
      createdAt: today
    };
    setInvoices(prev => [newInvoice, ...prev]);

    // 3. Auto-Schedule 90-Day Recurrence Reminder (FR-15 - Pembeda Produk)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (service?.recurrenceDays || 90));
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const customer = customers.find(c => c.id === job.customerId);
    const unit = acUnits.find(u => u.id === job.unitId);
    const reminderMsg = `Halo Kak ${customer?.name || 'Pelanggan'}, sudah saatnya servis berkala (90 hari) untuk AC ${unit?.brand || 'AC'} di ${unit?.locationIndoor || 'lokasi Anda'}. Tim Berkah Cool Mandiri siap menjaga AC tetap dingin bersih & hemat listrik. Balas pesan ini untuk memilih jam teknisi kami!`;

    const newReminderId = `rem-${Date.now().toString().slice(-6)}`;
    const newReminder: Reminder = {
      id: newReminderId,
      tenantId: tenant.id,
      jobId,
      customerId: job.customerId,
      unitId: job.unitId,
      dueDate: dueDateStr,
      status: 'TERJADWAL',
      messageText: reminderMsg,
      createdAt: today
    };
    setReminders(prev => [newReminder, ...prev]);

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'COMPLETE_JOB',
      `Job ${jobId}`,
      `Job diselesaikan dengan TTD digital. Otomatis membuat Invoice ${newInvoiceId} (Rp${totalAmount.toLocaleString('id-ID')}) dan Pengingat Servis 90 Hari (${dueDateStr})`
    );

    return { success: true, invoiceId: newInvoiceId, reminderId: newReminderId };
  };

  // FR-13: Mark Invoice Paid
  const markInvoicePaid = (invoiceId: string, paymentMethod: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI') => {
    const paidTime = new Date().toLocaleString('id-ID', { hour12: false });
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'LUNAS',
          markedPaidAt: paidTime,
          markedPaidBy: `${currentUser.name} (${currentUser.role})`,
          paymentMethod
        };
      }
      return inv;
    }));

    addAuditLog(
      currentUser.name,
      currentUser.role,
      'MARK_PAID',
      `Invoice ${invoiceId}`,
      `Ditandai Lunas via ${paymentMethod}`
    );
  };

  // Add Customer
  const addCustomer = (data: Omit<Customer, 'id' | 'tenantId' | 'createdAt'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now().toString().slice(-5)}`,
      tenantId: tenant.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [newCust, ...prev]);
    addAuditLog(currentUser.name, currentUser.role, 'ADD_CUSTOMER', `Customer ${newCust.name}`, `Pelanggan baru ditambahkan (${newCust.whatsappNumber})`);
    return newCust;
  };

  // Add AC Unit with QR
  const addACUnit = (data: Omit<ACUnit, 'id' | 'qrCode'>) => {
    const count = acUnits.length + 1;
    const newUnit: ACUnit = {
      ...data,
      id: `unit-${Date.now().toString().slice(-5)}`,
      qrCode: `PRO-YK-${String(count).padStart(3, '0')}`
    };
    setAcUnits(prev => [newUnit, ...prev]);
    addAuditLog(currentUser.name, currentUser.role, 'ADD_AC_UNIT', `Unit ${newUnit.brand}`, `Unit AC baru ditambahkan dengan QR stiker ${newUnit.qrCode}`);
    return newUnit;
  };

  // Send WhatsApp Reminder
  const sendWhatsAppReminderNow = (reminderId: string) => {
    // Limit check
    const sentCount = reminders.filter(r => r.status === 'TERKIRIM').length;
    if (tenant.plan === 'Basic' && sentCount >= tenant.limits.whatsappPerMonth) {
      alert(`Kuota Pengingat WhatsApp Paket Basic (${tenant.limits.whatsappPerMonth}/bln) telah tercapai. Harap upgrade ke Pro untuk 1.000 pesan/bln.`);
      return false;
    }

    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        return {
          ...r,
          status: 'TERKIRIM',
          sentAt: new Date().toLocaleString('id-ID', { hour12: false })
        };
      }
      return r;
    }));

    addAuditLog(currentUser.name, currentUser.role, 'SEND_WHATSAPP_REMINDER', `Reminder ${reminderId}`, 'Pesan pengingat WhatsApp servis berkala berhasil dikirim');
    return true;
  };

  const optOutReminder = (reminderId: string) => {
    setReminders(prev => prev.map(r => {
      if (r.id === reminderId) {
        return {
          ...r,
          status: 'OPT_OUT'
        };
      }
      return r;
    }));
    addAuditLog(currentUser.name, currentUser.role, 'OPT_OUT_REMINDER', `Reminder ${reminderId}`, 'Pelanggan memilih opt-out pengingat');
  };

  // Review
  const submitCustomerReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleString('id-ID', { hour12: false })
    };
    setReviews(prev => [newRev, ...prev]);
    addAuditLog('Customer', 'CLIENT', 'SUBMIT_REVIEW', `Review Job ${reviewData.jobId}`, `Ulasan bintang ${reviewData.rating} diterima`);
  };

  // Upgrade Plan
  const updateTenantPlan = (plan: 'Basic' | 'Pro') => {
    setTenant(prev => ({
      ...prev,
      plan,
      limits: plan === 'Pro' ? {
        technicians: 5,
        admins: 2,
        customers: 500,
        acUnits: 2000,
        jobsPerMonth: 1000,
        whatsappPerMonth: 1000
      } : {
        technicians: 2,
        admins: 1,
        customers: 50,
        acUnits: 100,
        jobsPerMonth: 100,
        whatsappPerMonth: 50
      }
    }));
    addAuditLog(currentUser.name, currentUser.role, 'UPGRADE_PLAN', `Tenant ${tenant.name}`, `Paket diubah menjadi ${plan}`);
  };

  // FR-18: Export CSV
  const exportCSV = (type: 'customers' | 'jobs' | 'invoices') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'customers') {
      csvContent += "ID,Nama,WhatsApp,Alamat,Catatan,Dibuat\n";
      customers.forEach(c => {
        csvContent += `"${c.id}","${c.name}","${c.whatsappNumber}","${c.address}","${c.notes || ''}","${c.createdAt}"\n`;
      });
    } else if (type === 'jobs') {
      csvContent += "ID,Customer,Layanan,Tanggal,Jam,Teknisi,Status,FreonPSI,SuhuC\n";
      jobs.forEach(j => {
        const c = customers.find(x => x.id === j.customerId)?.name || '';
        const s = services.find(x => x.id === j.serviceId)?.name || '';
        const t = users.find(x => x.id === j.technicianId)?.name || 'Belum ditugaskan';
        csvContent += `"${j.id}","${c}","${s}","${j.scheduledDate}","${j.startTime}-${j.endTime}","${t}","${j.status}","${j.freonPressurePSI || ''}","${j.outputTempCelsius || ''}"\n`;
      });
    } else if (type === 'invoices') {
      csvContent += "ID,Job ID,Customer,Total,Status,Metode Bayar,Tanggal Lunas\n";
      invoices.forEach(inv => {
        const c = customers.find(x => x.id === inv.customerId)?.name || '';
        csvContent += `"${inv.id}","${inv.jobId}","${c}","${inv.amount}","${inv.status}","${inv.paymentMethod || ''}","${inv.markedPaidAt || ''}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `proclima_${type}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog(currentUser.name, currentUser.role, 'EXPORT_CSV', type, `Mengekspor file CSV data ${type}`);
  };

  return (
    <AppContext.Provider
      value={{
        tenant,
        updateTenantPlan,
        currentUser,
        setCurrentUser,
        currentRoleView,
        setCurrentRoleView,
        users,
        isOnline,
        toggleSimulatedOffline,
        pendingOfflineSyncCount,
        syncOfflineQueue,
        customers,
        acUnits,
        services,
        jobs,
        invoices,
        reminders,
        auditLogs,
        reviews,
        activeJobId,
        setActiveJobId,
        activeJob,
        activeScreen,
        setActiveScreen,
        createBooking,
        assignTechnician,
        updateJobStatus,
        saveServiceReport,
        addSparepartsToJob,
        signAndCompleteJob,
        markInvoicePaid,
        addCustomer,
        addACUnit,
        sendWhatsAppReminderNow,
        optOutReminder,
        submitCustomerReview,
        exportCSV
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
