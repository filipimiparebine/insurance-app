"use client";

import { useState } from "react";
import { Search, Eye, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@blaj/ui";
import { Input } from "@blaj/ui";
import { Badge } from "@blaj/ui";
import { PiiDecryptModal } from "@/components/pii-decrypt-modal";
interface AdminUser {
  id: string;
  emailMasked: string;
  phoneMasked: string;
  name: string;
  cnpMasked: string;
  createdAt: string;
  policyCount: number;
  vehicleCount: number;
  personCount: number;
}

const MOCK_USERS: AdminUser[] = [
  { id: "usr-001", emailMasked: "i********u@example.ro", phoneMasked: "+40722****56", name: "Ion Popescu", cnpMasked: "****8017", createdAt: "2025-11-15", policyCount: 2, vehicleCount: 1, personCount: 1 },
  { id: "usr-002", emailMasked: "m********u@gmail.com", phoneMasked: "+40733****22", name: "Maria Ionescu", cnpMasked: "****9234", createdAt: "2025-12-01", policyCount: 1, vehicleCount: 2, personCount: 1 },
  { id: "usr-003", emailMasked: "v********u@yahoo.com", phoneMasked: "+40744****44", name: "Vasile Georgescu", cnpMasked: "****5601", createdAt: "2026-01-05", policyCount: 3, vehicleCount: 3, personCount: 2 },
  { id: "usr-004", emailMasked: "e********u@proton.me", phoneMasked: "+40755****77", name: "Elena Dumitrescu", cnpMasked: "****3409", createdAt: "2025-10-20", policyCount: 1, vehicleCount: 1, personCount: 1 },
  { id: "usr-005", emailMasked: "a****n@outlook.com", phoneMasked: "+40766****22", name: "Andrei Stan", cnpMasked: "****7890", createdAt: "2026-02-14", policyCount: 0, vehicleCount: 1, personCount: 1 },
  { id: "usr-006", emailMasked: "c********l@company.ro", phoneMasked: "+40788****56", name: "Cristina Pavel", cnpMasked: "****2056", createdAt: "2025-09-10", policyCount: 4, vehicleCount: 4, personCount: 3 },
];

const PAGE_SIZE = 5;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [page, setPage] = useState(1);
  const [decrypt, setDecrypt] = useState<{ userId: string; label: string; field: string; masked: string } | null>(null);

  const filtered = searchTerm
    ? MOCK_USERS.filter((u) => `${u.name} ${u.emailMasked} ${u.cnpMasked} ${u.phoneMasked}`.toLowerCase().includes(searchTerm.toLowerCase()))
    : MOCK_USERS;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selectedUser) {
    return (
      <div className="space-y-6">
        <button onClick={() => setSelectedUser(null)} className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
          <ChevronLeft className="h-4 w-4" /> Back to Users
        </button>
        <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
              <span className="text-white font-display text-xl font-semibold">{selectedUser.name[0]}</span>
            </div>
            <div>
              <h3 className="text-xl font-display font-semibold">{selectedUser.name}</h3>
              <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                <button className="hover:text-electric underline decoration-dotted" onClick={() => setDecrypt({ userId: selectedUser.id, label: "Email", field: "email", masked: selectedUser.emailMasked })}>{selectedUser.emailMasked}</button>
                <span>/</span>
                <button className="hover:text-electric underline decoration-dotted" onClick={() => setDecrypt({ userId: selectedUser.id, label: "Phone", field: "phone", masked: selectedUser.phoneMasked })}>{selectedUser.phoneMasked}</button>
              </div>
            </div>
            <div className="ml-auto flex gap-2"><Badge variant="outline">ro</Badge><Badge variant="default">{selectedUser.createdAt}</Badge></div>
          </div>
          <div className="p-6 space-y-6">
            <section>
              <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">PII Fields</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PiiField label="CNP" value={selectedUser.cnpMasked} onReveal={() => setDecrypt({ userId: selectedUser.id, label: "CNP", field: "cnp", masked: selectedUser.cnpMasked })} />
                <PiiField label="Email" value={selectedUser.emailMasked} onReveal={() => setDecrypt({ userId: selectedUser.id, label: "Email", field: "email", masked: selectedUser.emailMasked })} />
                <PiiField label="Phone" value={selectedUser.phoneMasked} onReveal={() => setDecrypt({ userId: selectedUser.id, label: "Phone", field: "phone", masked: selectedUser.phoneMasked })} />
              </div>
            </section>
            <section>
              <h4 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3">Summary</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-neutral-50 rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold">{selectedUser.policyCount}</p><p className="text-xs text-text-secondary mt-1">Policies</p></div>
                <div className="bg-neutral-50 rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold">{selectedUser.vehicleCount}</p><p className="text-xs text-text-secondary mt-1">Vehicles</p></div>
                <div className="bg-neutral-50 rounded-lg p-4 text-center"><p className="text-2xl font-display font-semibold">{selectedUser.personCount}</p><p className="text-xs text-text-secondary mt-1">Persons</p></div>
              </div>
            </section>
          </div>
        </div>
        {decrypt && <PiiDecryptModal open onOpenChange={() => setDecrypt(null)} userId={decrypt.userId} fieldLabel={decrypt.label} fieldName={decrypt.field} maskedValue={decrypt.masked} />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-display font-semibold text-text-primary">Users</h3>
        <p className="text-sm text-text-secondary mt-1">{filtered.length} users registered</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
        <Input placeholder="Search by CNP, email, name, or phone..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="pl-10" />
      </div>
      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">CNP</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Policies</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase">Vehicles</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {paginated.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/50 cursor-pointer" onClick={() => setSelectedUser(u)}>
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.emailMasked}</td>
                  <td className="px-4 py-3 font-mono text-sm text-text-secondary">{u.cnpMasked}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{u.phoneMasked}</td>
                  <td className="px-4 py-3 text-sm">{u.policyCount}</td>
                  <td className="px-4 py-3 text-sm">{u.vehicleCount}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}><Eye className="h-4 w-4" /></Button></td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-text-secondary text-sm">No users found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /> Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next <ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
      {decrypt && <PiiDecryptModal open onOpenChange={() => setDecrypt(null)} userId={decrypt.userId} fieldLabel={decrypt.label} fieldName={decrypt.field} maskedValue={decrypt.masked} />}
    </div>
  );
}

function PiiField({ label, value, onReveal }: { label: string; value: string; onReveal: () => void }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-lg border border-neutral-200">
      <div className="flex items-center gap-3"><Shield className="h-4 w-4 text-text-tertiary" /><div><p className="text-xs text-text-secondary">{label}</p><p className="text-sm font-mono">{value}</p></div></div>
      <Button variant="ghost" size="sm" onClick={onReveal}><Eye className="h-4 w-4" /></Button>
    </div>
  );
}
