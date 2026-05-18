"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button, Badge, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blaj/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, X, DollarSign, Clock, AlertTriangle, Undo2 } from "lucide-react";
import { mockPayments, paymentStatusLabels, paymentMethodLabels } from "@/lib/mock-data";

export function PaymentsContent() {
  const [statusFilter,setStatusFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [payments,setPayments]=useState(mockPayments);
  const [refundId,setRefundId]=useState<string|null>(null);

  const filtered=useMemo(()=>payments.filter(p=>{
    if(statusFilter!=="all"&&p.status!==statusFilter)return false;
    if(search){const q=search.toLowerCase();return p.policyNumber.toLowerCase().includes(q)||p.userName.toLowerCase().includes(q)||p.stripePaymentId.toLowerCase().includes(q);}
    return true;
  }),[payments,statusFilter,search]);

  const sums=useMemo(()=>({
    total:payments.filter(p=>p.status==="succeeded").reduce((s,p)=>s+p.amount,0),
    pending:payments.filter(p=>p.status==="pending").reduce((s,p)=>s+p.amount,0),
    failed:payments.filter(p=>p.status==="failed").reduce((s,p)=>s+p.amount,0),
    refunded:payments.filter(p=>p.status==="refunded").reduce((s,p)=>s+p.amount,0),
  }),[payments]);

  const fmt=(n:number)=>new Intl.NumberFormat("ro-RO",{style:"currency",currency:"RON",maximumFractionDigits:2}).format(n);
  const fmtDate=(iso:string)=>new Date(iso).toLocaleDateString("ro-RO",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const sb=(s:string):"success"|"warning"|"danger"|"brand"|"default"=>{switch(s){case"succeeded":return"success";case"pending":return"warning";case"failed":return"danger";case"refunded":return"brand";default:return"default";}};

  const handleRefund=(id:string)=>{setPayments(prev=>prev.map(p=>p.id===id?{...p,status:"refunded" as const,updatedAt:new Date().toISOString()}:p));setRefundId(null);};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-display-sm text-text-primary">Plăți</h1><p className="mt-1 text-sm text-text-secondary">{filtered.length} plăți — Total încasat: {fmt(sums.total)}</p></div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[{l:"Total încasat",v:fmt(sums.total),i:DollarSign,cl:"text-success",bg:"bg-success-soft"},{l:"În așteptare",v:fmt(sums.pending),i:Clock,cl:"text-warning",bg:"bg-warning-soft"},{l:"Eșuate",v:fmt(sums.failed),i:AlertTriangle,cl:"text-danger",bg:"bg-danger-soft"},{l:"Rambursate",v:fmt(sums.refunded),i:Undo2,cl:"text-electric",bg:"bg-electric-soft"}].map(c=>(
          <div key={c.l} className="rounded-xl border border-border-subtle bg-surface p-4"><div className="mb-2 flex items-center gap-3"><div className={cn("rounded-lg p-2",c.bg)}><c.i className={cn("h-4 w-4",c.cl)} /></div><p className="text-sm text-text-secondary">{c.l}</p></div><p className="text-lg font-semibold tabular-nums text-text-primary">{c.v}</p></div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input type="text" placeholder="Caută după număr poliță, client, plată Stripe..." value={search} onChange={e=>setSearch(e.target.value)} className="h-10 w-full rounded-md border border-border-subtle bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus" />
          {search&&<button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"><X className="h-4 w-4" /></button>}
        </div>
        <Filter className="h-4 w-4 text-text-tertiary" />
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{[{value:"all",label:"Toate statusurile"},...Object.entries(paymentStatusLabels).map(([k,v])=>({value:k,label:v}))].map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
      </div>

      <Table>
        <TableHeader><TableRow><TableHead>ID Plată Stripe</TableHead><TableHead>Poliță</TableHead><TableHead>Client</TableHead><TableHead>Sumă</TableHead><TableHead>Status</TableHead><TableHead>Metodă</TableHead><TableHead>Dată</TableHead><TableHead className="w-20" /></TableRow></TableHeader>
        <TableBody>
          {filtered.map(p=>(
            <TableRow key={p.id}>
              <TableCell className="font-mono text-xs text-text-secondary">{p.stripePaymentId.slice(0,16)}…</TableCell>
              <TableCell className="font-medium">{p.policyNumber}</TableCell>
              <TableCell>{p.userName}</TableCell>
              <TableCell className="tabular-nums">{fmt(p.amount)}</TableCell>
              <TableCell><Badge variant={sb(p.status)}>{paymentStatusLabels[p.status]||p.status}</Badge></TableCell>
              <TableCell className="text-text-secondary">{paymentMethodLabels[p.method]||p.method}</TableCell>
              <TableCell className="text-text-secondary">{fmtDate(p.createdAt)}</TableCell>
              <TableCell>{p.status==="succeeded"&&<button onClick={()=>setRefundId(p.id)} className="rounded p-1.5 text-text-tertiary hover:bg-danger-soft hover:text-danger" title="Rambursează"><Undo2 className="h-4 w-4" /></button>}</TableCell>
            </TableRow>
          ))}
          {filtered.length===0&&<TableRow><TableCell colSpan={8} className="py-16 text-center"><p className="text-text-secondary">Nicio plată găsită</p></TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={!!refundId} onOpenChange={()=>setRefundId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Confirmă rambursarea</DialogTitle><DialogDescription>Ești sigur că vrei să rambursezi această plată?</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary" onClick={()=>setRefundId(null)}>Anulează</Button><Button variant="destructive" onClick={()=>refundId&&handleRefund(refundId)}>Rambursează</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
