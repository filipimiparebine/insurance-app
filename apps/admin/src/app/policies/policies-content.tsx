"use client";

import { useState, useMemo } from "react";
import { Button, Badge, Input, Label, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blaj/ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Filter, X } from "lucide-react";
import { mockPolicies, userNames, policyTypeLabels, policyStatusLabels } from "@/lib/mock-data";
import type { AdminPolicy } from "@/lib/types";

const INSURERS: Record<string,string> = { ALLIANZ:"Allianz-Țiriac",GROUPAMA:"Groupama",OMNIASIG:"Omniasig",EUROINS:"Euroins",SIGNALIDUNA:"Signal Iduna",CITY:"City Insurance",NN:"NN Asigurări",GENERALI:"Generali" };

export function PoliciesContent() {
  const [statusFilter,setStatusFilter]=useState("all");
  const [typeFilter,setTypeFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [policies,setPolicies]=useState(mockPolicies);
  const [dialogOpen,setDialogOpen]=useState(false);
  const [editing,setEditing]=useState<AdminPolicy|null>(null);
  const [deleteId,setDeleteId]=useState<string|null>(null);

  const filtered = useMemo(() => policies.filter(p => {
    if(statusFilter!=="all"&&p.status!==statusFilter)return false;
    if(typeFilter!=="all"&&p.policyType!==typeFilter)return false;
    if(search){const q=search.toLowerCase();return p.policyNumber.toLowerCase().includes(q)||p.insurerName.toLowerCase().includes(q)||(userNames[p.userId]||"").toLowerCase().includes(q);}
    return true;
  }),[policies,statusFilter,typeFilter,search]);

  const total = useMemo(()=>filtered.reduce((s,p)=>s+p.totalAmount,0),[filtered]);
  const fmt=(n:number)=>new Intl.NumberFormat("ro-RO",{style:"currency",currency:"RON",maximumFractionDigits:0}).format(n);
  const sb=(s:string):"success"|"warning"|"danger"|"default"=>{switch(s){case"active":return"success";case"pending":case"pending_cancellation":return"warning";case"cancelled":return"danger";default:return"default";}};

  const handleDelete=(id:string)=>{setPolicies(prev=>prev.filter(p=>p.id!==id));setDeleteId(null);};
  const handleSave=(policy:AdminPolicy)=>{if(editing)setPolicies(prev=>prev.map(p=>p.id===policy.id?policy:p));else setPolicies(prev=>[{...policy,id:`pol-${Date.now()}`},...prev]);setDialogOpen(false);setEditing(null);};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-display-sm text-text-primary">Polițe</h1><p className="mt-1 text-sm text-text-secondary">{filtered.length} polițe — Total prime: {fmt(total)}</p></div>
        <Button onClick={()=>{setEditing(null);setDialogOpen(true);}}><Plus className="h-4 w-4" />Poliță nouă</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
          <input type="text" placeholder="Caută după număr, asigurător, client..." value={search} onChange={e=>setSearch(e.target.value)} className="h-10 w-full rounded-md border border-border-subtle bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-electric focus:outline-none focus:shadow-focus" />
          {search&&<button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"><X className="h-4 w-4" /></button>}
        </div>
        <Filter className="h-4 w-4 text-text-tertiary" />
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{[{value:"all",label:"Toate statusurile"},...Object.entries(policyStatusLabels).map(([k,v])=>({value:k,label:v}))].map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}><SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger><SelectContent>{[{value:"all",label:"Toate tipurile"},...Object.entries(policyTypeLabels).map(([k,v])=>({value:k,label:v}))].map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
      </div>

      <Table>
        <TableHeader><TableRow><TableHead>Număr poliță</TableHead><TableHead>Tip</TableHead><TableHead>Asigurător</TableHead><TableHead>Client</TableHead><TableHead>Status</TableHead><TableHead>Primă netă</TableHead><TableHead>Total</TableHead><TableHead>Perioadă</TableHead><TableHead className="w-20" /></TableRow></TableHeader>
        <TableBody>
          {filtered.map(p=>(
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.policyNumber}</TableCell>
              <TableCell>{policyTypeLabels[p.policyType]||p.policyType}</TableCell>
              <TableCell>{p.insurerName}</TableCell>
              <TableCell>{userNames[p.userId]||"—"}</TableCell>
              <TableCell><Badge variant={sb(p.status)}>{policyStatusLabels[p.status]||p.status}</Badge></TableCell>
              <TableCell className="tabular-nums">{fmt(p.premiumNet)}</TableCell>
              <TableCell className="tabular-nums">{fmt(p.totalAmount)}</TableCell>
              <TableCell className="text-text-secondary">{p.startDate} — {p.endDate}</TableCell>
              <TableCell><div className="flex items-center gap-1"><button onClick={()=>{setEditing(p);setDialogOpen(true);}} className="rounded p-1.5 text-text-tertiary hover:bg-hover-overlay hover:text-text-primary"><Pencil className="h-4 w-4" /></button><button onClick={()=>setDeleteId(p.id)} className="rounded p-1.5 text-text-tertiary hover:bg-danger-soft hover:text-danger"><Trash2 className="h-4 w-4" /></button></div></TableCell>
            </TableRow>
          ))}
          {filtered.length===0&&<TableRow><TableCell colSpan={9} className="py-16 text-center"><p className="text-text-secondary">Nicio poliță găsită</p></TableCell></TableRow>}
        </TableBody>
      </Table>

      <Dialog open={!!deleteId} onOpenChange={()=>setDeleteId(null)}>
        <DialogContent><DialogHeader><DialogTitle>Confirmă ștergerea</DialogTitle><DialogDescription>Ești sigur că vrei să ștergi această poliță?</DialogDescription></DialogHeader><DialogFooter><Button variant="secondary" onClick={()=>setDeleteId(null)}>Anulează</Button><Button variant="destructive" onClick={()=>deleteId&&handleDelete(deleteId)}>Șterge</Button></DialogFooter></DialogContent>
      </Dialog>

      <PolicyFormDialog open={dialogOpen} onOpenChange={setDialogOpen} policy={editing} onSave={handleSave} />
    </div>
  );
}

function PolicyFormDialog({open,onOpenChange,policy,onSave}:{open:boolean;onOpenChange:(o:boolean)=>void;policy:AdminPolicy|null;onSave:(p:AdminPolicy)=>void}){
  const [form,setForm]=useState<Partial<AdminPolicy>>(policy||{policyType:"rca",policyNumber:"",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"pending",startDate:new Date().toISOString().slice(0,10),endDate:"",premiumNet:0,totalAmount:0,currency:"RON",userId:""});
  const u=(f:keyof AdminPolicy,v:string|number)=>setForm(p=>({...p,[f]:v}));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={e=>{e.preventDefault();onSave(form as AdminPolicy);}}>
          <DialogHeader><DialogTitle>{policy?"Editează polița":"Poliță nouă"}</DialogTitle><DialogDescription>{policy?"Modifică detaliile poliței":"Completează informațiile pentru noua poliță"}</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="pn">Număr poliță</Label><Input id="pn" value={form.policyNumber||""} onChange={e=>u("policyNumber",e.target.value)} placeholder="ex: RCA-2025-0001" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Tip poliță</Label><Select value={form.policyType} onValueChange={v=>u("policyType",v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(policyTypeLabels).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label>Status</Label><Select value={form.status} onValueChange={v=>u("status",v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(policyStatusLabels).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid gap-2"><Label>Asigurător</Label><Select value={form.insurerCode} onValueChange={c=>{u("insurerCode",c);u("insurerName",INSURERS[c]||c);}}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(INSURERS).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label htmlFor="sd">Data început</Label><Input id="sd" type="date" value={form.startDate||""} onChange={e=>u("startDate",e.target.value)} /></div>
              <div className="grid gap-2"><Label htmlFor="ed">Data sfârșit</Label><Input id="ed" type="date" value={form.endDate||""} onChange={e=>u("endDate",e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label htmlFor="n2">Primă netă (RON)</Label><Input id="n2" type="number" value={form.premiumNet||""} onChange={e=>u("premiumNet",parseFloat(e.target.value)||0)} /></div>
              <div className="grid gap-2"><Label htmlFor="ta">Total (RON)</Label><Input id="ta" type="number" value={form.totalAmount||""} onChange={e=>u("totalAmount",parseFloat(e.target.value)||0)} /></div>
            </div>
          </div>
          <DialogFooter><Button type="button" variant="secondary" onClick={()=>onOpenChange(false)}>Anulează</Button><Button type="submit">{policy?"Salvează":"Creează polița"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
