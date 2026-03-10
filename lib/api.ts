// ── Backend types ─────────────────────────────────────────────────────────────

export type UserRole = "ministry" | "donor" | "school_admin" | "parent" | "auditor";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string | null;
  avatar: string | null;
  school_id: string | null;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface School {
  id: string; name: string; county: string; constituency: string;
  students: number; teachers: number; allocated: number; disbursed: number;
  utilization: number; status: "active" | "flagged" | "pending";
  programs: string[]; created_at: string;
}
export interface SchoolList { items: School[]; total: number; }

export interface Fund {
  id: string; source: string; source_type: "government" | "ngo" | "private";
  program: string; amount: number; fund_date: string;
  status: "disbursed" | "pending" | "flagged";
  school_id: string | null; donor_id: string | null;
  school_name: string | null; created_at: string;
}
export interface FundList {
  items: Fund[]; total: number;
  total_amount: number; disbursed_amount: number; pending_amount: number;
}

export interface Transaction {
  id: string; tx_hash: string; block_number: number;
  tx_type: "allocation" | "disbursement" | "receipt" | "flagged";
  amount: number; purpose: string; tx_date: string;
  status: "confirmed" | "pending" | "failed";
  integrity_check: "verified" | "mismatch" | "pending";
  gas_used: number | null; school_id: string | null;
  school_name: string | null; document_id: string | null; created_at: string;
}
export interface TransactionList { items: Transaction[]; total: number; }

export interface Document {
  id: string; name: string;
  doc_type: "invoice" | "receipt" | "allocation" | "grant" | "audit";
  on_chain_hash: string; ipfs_cid: string; file_size: string | null;
  uploader_name: string; uploader_role: string; upload_date: string;
  integrity_check: "verified" | "mismatch" | "pending";
  school_id: string | null; school_name: string | null; created_at: string;
}
export interface DocumentList {
  items: Document[]; total: number;
  verified: number; mismatched: number; pending_count: number;
}

export interface DashboardStats {
  total_allocated: number; total_disbursed: number; total_schools: number;
  flagged_transactions: number; pending_documents: number; active_programs: number;
}

// ── Token storage ─────────────────────────────────────────────────────────────

const ACCESS_KEY  = "hk_access_token";
const REFRESH_KEY = "hk_refresh_token";

export const tokenStore = {
  getAccess:  () => (typeof window !== "undefined" ? sessionStorage.getItem(ACCESS_KEY)  : null),
  getRefresh: () => (typeof window !== "undefined" ? sessionStorage.getItem(REFRESH_KEY) : null),
  set: (t: TokenResponse) => { sessionStorage.setItem(ACCESS_KEY, t.access_token); sessionStorage.setItem(REFRESH_KEY, t.refresh_token); },
  clear: () => { sessionStorage.removeItem(ACCESS_KEY); sessionStorage.removeItem(REFRESH_KEY); },
};

// ── Core fetch ────────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const token = tokenStore.getAccess();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401 && retry) {
    const ok = await tryRefresh();
    if (ok) return apiFetch<T>(path, options, false);
    tokenStore.clear();
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("Session expired");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refresh_token = tokenStore.getRefresh();
  if (!refresh_token) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) return false;
    tokenStore.set(await res.json());
    return true;
  } catch { return false; }
}

// ── API modules ───────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (data: { email: string; password: string; full_name: string; role: UserRole; organization?: string }) =>
    apiFetch<TokenResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  me: () => apiFetch<AuthUser>("/auth/me"),
};

export const schoolsApi = {
  list: (p?: { search?: string; county?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (p?.search) q.set("search", p.search);
    if (p?.county) q.set("county", p.county);
    if (p?.status) q.set("status", p.status);
    return apiFetch<SchoolList>(`/schools${q.size ? `?${q}` : ""}`);
  },
  get: (id: string) => apiFetch<School>(`/schools/${id}`),
};

export const fundsApi = {
  list: (p?: { school_id?: string; status?: string; source_type?: string }) => {
    const q = new URLSearchParams();
    if (p?.school_id)   q.set("school_id",   p.school_id);
    if (p?.status)      q.set("status",       p.status);
    if (p?.source_type) q.set("source_type",  p.source_type);
    return apiFetch<FundList>(`/funds${q.size ? `?${q}` : ""}`);
  },
};

export const transactionsApi = {
  list: (p?: { school_id?: string; tx_type?: string; integrity?: string }) => {
    const q = new URLSearchParams();
    if (p?.school_id) q.set("school_id", p.school_id);
    if (p?.tx_type)   q.set("tx_type",   p.tx_type);
    if (p?.integrity) q.set("integrity",  p.integrity);
    return apiFetch<TransactionList>(`/transactions${q.size ? `?${q}` : ""}`);
  },
  flagged: () => apiFetch<Transaction[]>("/transactions/flagged"),
};

export const documentsApi = {
  list: (p?: { school_id?: string; doc_type?: string; integrity?: string }) => {
    const q = new URLSearchParams();
    if (p?.school_id) q.set("school_id", p.school_id);
    if (p?.doc_type)  q.set("doc_type",  p.doc_type);
    if (p?.integrity) q.set("integrity",  p.integrity);
    return apiFetch<DocumentList>(`/documents${q.size ? `?${q}` : ""}`);
  },
  verify: (id: string) => apiFetch<Document>(`/documents/${id}/verify`, { method: "PATCH" }),
};

export const dashboardApi = {
  stats: () => apiFetch<DashboardStats>("/dashboard/stats"),
};
