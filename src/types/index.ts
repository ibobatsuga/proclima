export type Role = 'OWNER' | 'ADMIN' | 'TECHNICIAN';

export type UserRoleView = 'TECHNICIAN' | 'ADMIN' | 'CLIENT';

export type JobStatus = 
  | 'MENUNGGU_PENUGASAN'
  | 'DITERIMA' 
  | 'BERANGKAT' 
  | 'DIKERJAKAN' 
  | 'SELESAI' 
  | 'DIBATALKAN';

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  address: string;
  plan: 'Basic' | 'Pro';
  limits: {
    technicians: number;
    admins: number;
    customers: number;
    acUnits: number;
    jobsPerMonth: number;
    whatsappPerMonth: number;
  };
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'EXPIRED';
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface ACUnit {
  id: string;
  customerId: string;
  brand: string; // Daikin, Panasonic, Sharp, Gree, LG, etc.
  pk: string; // 0.5 PK, 1 PK, 1.5 PK, 2 PK
  type: string; // Split Wall, Cassette, Standing
  locationIndoor: string; // e.g. "Kamar Utama Lt. 2", "Ruang Tamu"
  locationOutdoor?: string; // e.g. "Balkon Belakang"
  qrCode: string; // Unique string for sticker e.g. PRO-AC-0921
  installedYear?: number;
  lastCleanedAt?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  whatsappNumber: string;
  address: string;
  notes?: string;
  createdAt: string;
}

export interface ServiceCatalog {
  id: string;
  name: string;
  category: 'Cuci' | 'Freon' | 'Pasang' | 'Perbaikan' | 'Sparepart';
  price: number;
  estimatedMinutes: number;
  recurrenceDays: number; // default: 90 days
  description: string;
}

export interface SparepartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  approvedByCustomer?: boolean;
}

export interface Job {
  id: string;
  tenantId: string;
  customerId: string;
  unitId: string;
  serviceId: string;
  technicianId?: string;
  scheduledDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: JobStatus;
  statusLabelAwam: string;
  source: 'ADMIN' | 'LINK_PUBLIK';
  notes?: string;
  complaint?: string; // e.g. "AC Tidak Dingin, Menetes Air"
  
  // Execution details
  checkInTime?: string;
  checkInLocation?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  freonPressurePSI?: number; // e.g. 140 PSI
  outputTempCelsius?: number; // e.g. 16.5 °C
  checklist: {
    cleanFilterIndoor: boolean;
    cleanEvaporator: boolean;
    cleanDrainPipe: boolean;
    cleanOutdoorCondenser: boolean;
    electricalCheck: boolean;
  };
  spareparts: SparepartItem[];
  technicianNotes?: string;
  customerSignature?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  jobId: string;
  tenantId: string;
  customerId: string;
  amount: number;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
  status: 'BELUM_BAYAR' | 'LUNAS';
  markedPaidAt?: string;
  markedPaidBy?: string;
  paymentMethod?: 'QRIS' | 'TRANSFER_BANK' | 'TUNAI';
  createdAt: string;
}

export interface Reminder {
  id: string;
  tenantId: string;
  jobId: string;
  customerId: string;
  unitId: string;
  dueDate: string; // YYYY-MM-DD (typically job complete + 90 days)
  status: 'TERJADWAL' | 'TERKIRIM' | 'GAGAL' | 'OPT_OUT';
  sentAt?: string;
  failureReason?: string;
  messageText: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actor: string;
  role: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface Review {
  id: string;
  jobId: string;
  customerId: string;
  rating: number; // 1 - 5
  aspects: {
    punctuality: boolean;
    cleanliness: boolean;
    coolingResult: boolean;
    technicianAttitude: boolean;
  };
  comment: string;
  createdAt: string;
}
