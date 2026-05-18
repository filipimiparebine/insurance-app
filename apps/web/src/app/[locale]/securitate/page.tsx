import { Shield, Lock, Eye, Server, FileCheck, Fingerprint } from "lucide-react";

export default function SecurityPage() {

  const items = [
    { icon: Lock, title: "Criptare AES-256", desc: "Toate datele personale sunt criptate end-to-end cu standard bancar AES-256. Nici măcar noi nu putem citi datele tale fără cheia ta." },
    { icon: Shield, title: "PCI DSS Level 1", desc: "Procesăm plățile prin Stripe, certificat PCI DSS Level 1 — același standard folosit de băncile mari." },
    { icon: Eye, title: "GDPR compliant", desc: "Respectăm Regulamentul General privind Protecția Datelor. Poți solicita ștergerea datelor oricând." },
    { icon: Server, title: "Infrastructură securizată", desc: "Datele sunt stocate pe servere în UE, cu acces restricționat și audit logs pentru orice operațiune." },
    { icon: FileCheck, title: "Autorizat ASF", desc: "blaj.io este operat de Laz Romania SRL, broker de asigurări autorizat și supravegheat de ASF." },
    { icon: Fingerprint, title: "Autentificare cu 2 factori", desc: "Contul tău este protejat cu 2FA prin Clerk. Poți activa autentificarea biometrică pe mobil." },
  ];

  return (
    <div className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 font-display sm:text-4xl">
          Securitate
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Datele tale sunt tratate cu același nivel de securitate ca o tranzacție bancară.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <item.icon className="mb-3 h-6 w-6 text-brand-accent" />
              <h3 className="font-semibold text-neutral-900 font-display">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
