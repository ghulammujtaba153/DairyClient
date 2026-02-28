/**
 * Labour API Service
 */

const BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleRes = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API Request failed');
  return data.data;
};

export interface LabourProfile {
  id: number;
  name: string;
  role: string;
  daily_wage: number;
  phone: string;
  joining_date: string;
  status: 'active' | 'inactive' | 'left';
  days_worked: number;
  total_earned: number;
  total_advances: number;
  balance: number;
}

export interface AttendanceRecord {
  id: number;
  labour_id: number;
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  check_in?: string;
  check_out?: string;
  notes?: string;
}

export interface LabourTransaction {
  id: number;
  labour_id: number;
  labour_name?: string;
  date: string;
  type: 'advance' | 'salary_payment' | 'bonus';
  amount: number;
  payment_method: string;
  reference_id?: string;
  notes?: string;
}

export interface LabourStats {
  totalLabour: number;
  attendanceData: {
    date: string;
    present: number;
    absent: number;
  }[];
  monthlyExpenseData: {
    month: string;
    amount: number;
  }[];
}

export async function getLabour(): Promise<LabourProfile[]> {
  const res = await fetch(`${BASE}/api/labour`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function getLabourStats(): Promise<LabourStats> {
  const res = await fetch(`${BASE}/api/labour/stats`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function createLabour(data: Partial<LabourProfile>): Promise<LabourProfile> {
  const res = await fetch(`${BASE}/api/labour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function markAttendance(data: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
  const res = await fetch(`${BASE}/api/labour/attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function deleteAttendance(id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/labour/attendance/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function recordAdvance(data: Partial<LabourTransaction>): Promise<LabourTransaction> {
  const res = await fetch(`${BASE}/api/labour/advance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleRes(res);
}

export async function getRecentTransactions(): Promise<LabourTransaction[]> {
  const res = await fetch(`${BASE}/api/labour/transactions`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function getLabourById(id: string): Promise<LabourProfile> {
  const res = await fetch(`${BASE}/api/labour/${id}`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}

export async function getLabourHistory(id: string): Promise<{ attendance: AttendanceRecord[], transactions: LabourTransaction[] }> {
  const res = await fetch(`${BASE}/api/labour/${id}/history`, {
    headers: authHeaders(),
  });
  return handleRes(res);
}
