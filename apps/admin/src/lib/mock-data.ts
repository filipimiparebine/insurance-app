import type { AdminPolicy, AdminPolicyDetail, AdminVehicle, AdminPerson } from "./types";

export interface AdminPayment {
  id: string; policyId: string; policyNumber: string; userId: string; userName: string;
  amount: number; currency: string; status: "pending"|"succeeded"|"failed"|"refunded";
  method: "card"|"apple_pay"|"google_pay"|"link"; stripePaymentId: string; createdAt: string; updatedAt: string;
}

const vehicles: Record<string, AdminVehicle> = {
  "usr-001": { id:"veh-001",plateNumber:"B-123-ABC",make:"BMW",model:"X5",yearOfManufacture:2022,vin:"WBA1234567890ABCD",registrationStatus:"active" },
  "usr-002": { id:"veh-002",plateNumber:"IF-45-DEF",make:"Audi",model:"A4",yearOfManufacture:2021,vin:"WAU9876543210EFGH",registrationStatus:"active" },
  "usr-003": { id:"veh-003",plateNumber:"B-789-GHI",make:"Dacia",model:"Logan",yearOfManufacture:2023,vin:"U5Y1234567890IJKL",registrationStatus:"active" },
  "usr-005": { id:"veh-005",plateNumber:"CT-12-JKL",make:"Toyota",model:"Corolla",yearOfManufacture:2020,vin:"JT1234567890MNOP",registrationStatus:"active" },
  "usr-006": { id:"veh-006",plateNumber:"B-456-MNO",make:"Mercedes",model:"C-Class",yearOfManufacture:2022,vin:"WDD1234567890QRST",registrationStatus:"active" },
  "usr-008": { id:"veh-008",plateNumber:"AG-78-PQR",make:"Ford",model:"Focus",yearOfManufacture:2021,vin:"WF01234567890UVWX",registrationStatus:"active" },
};

const persons: Record<string, AdminPerson> = {
  "usr-001": { id:"per-001",type:"individual",firstName:"Ion",lastName:"Popescu",cnpMasked:"***0101******",phone:"+40720123456",email:"ion.popescu@email.ro",addressCity:"București",addressCounty:"București" },
  "usr-002": { id:"per-002",type:"individual",firstName:"Maria",lastName:"Ionescu",cnpMasked:"***0202******",phone:"+40720765432",email:"maria.ionescu@email.ro",addressCity:"Iași",addressCounty:"Iași" },
  "usr-003": { id:"per-003",type:"individual",firstName:"Andrei",lastName:"Dumitrescu",cnpMasked:"***0303******",phone:"+40720111222",email:"andrei.dumitrescu@email.ro",addressCity:"Cluj-Napoca",addressCounty:"Cluj" },
  "usr-004": { id:"per-004",type:"individual",firstName:"Elena",lastName:"Georgescu",cnpMasked:"***0404******",phone:"+40720333444",email:"elena.georgescu@email.ro",addressCity:"Timișoara",addressCounty:"Timiș" },
  "usr-005": { id:"per-005",type:"individual",firstName:"George",lastName:"Vasilescu",cnpMasked:"***0505******",phone:"+40720555666",email:"george.vasilescu@email.ro",addressCity:"Brașov",addressCounty:"Brașov" },
  "usr-006": { id:"per-006",type:"individual",firstName:"Ana",lastName:"Mihăilescu",cnpMasked:"***0606******",phone:"+40720777888",email:"ana.mihailescu@email.ro",addressCity:"Constanța",addressCounty:"Constanța" },
  "usr-007": { id:"per-007",type:"individual",firstName:"Cristian",lastName:"Stancu",cnpMasked:"***0707******",phone:"+40720999000",email:"cristian.stancu@email.ro",addressCity:"București",addressCounty:"București" },
  "usr-008": { id:"per-008",type:"company",firstName:"Vasile",lastName:"Munteanu",cnpMasked:"***0808******",phone:"+40720222333",email:"vasile.munteanu@email.ro",addressCity:"Ploiești",addressCounty:"Prahova" },
};

export const mockPolicyDetails: AdminPolicyDetail[] = [
  { id:"pol-001",userId:"usr-001",policyType:"rca",policyNumber:"RCA-2025-0001",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"active",startDate:"2025-01-15",endDate:"2026-01-14",premiumNet:450,totalAmount:535.5,currency:"RON",userEmail:"ion.popescu@email.ro",userName:"Ion Popescu",userPhone:"+40720123456",cancellationReason:null,pdfUrl:"/policies/RCA-2025-0001.pdf",vehicle:vehicles["usr-001"],owner:persons["usr-001"] },
  { id:"pol-002",userId:"usr-002",policyType:"casco",policyNumber:"CAS-2025-0002",insurerCode:"GROUPAMA",insurerName:"Groupama",status:"active",startDate:"2025-02-01",endDate:"2026-01-31",premiumNet:2800,totalAmount:3332,currency:"RON",userEmail:"maria.ionescu@email.ro",userName:"Maria Ionescu",userPhone:"+40720765432",cancellationReason:null,pdfUrl:"/policies/CAS-2025-0002.pdf",vehicle:vehicles["usr-002"],owner:persons["usr-002"] },
  { id:"pol-003",userId:"usr-003",policyType:"rca",policyNumber:"RCA-2025-0003",insurerCode:"OMNIASIG",insurerName:"Omniasig",status:"pending",startDate:"2025-03-10",endDate:"2025-09-09",premiumNet:320,totalAmount:380.8,currency:"RON",userEmail:"andrei.dumitrescu@email.ro",userName:"Andrei Dumitrescu",userPhone:"+40720111222",cancellationReason:null,pdfUrl:null,vehicle:vehicles["usr-003"],owner:persons["usr-003"] },
  { id:"pol-004",userId:"usr-004",policyType:"home",policyNumber:"HOME-2025-0004",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"active",startDate:"2025-01-01",endDate:"2025-12-31",premiumNet:650,totalAmount:773.5,currency:"RON",userEmail:"elena.georgescu@email.ro",userName:"Elena Georgescu",userPhone:"+40720333444",cancellationReason:null,pdfUrl:"/policies/HOME-2025-0004.pdf",vehicle:null,owner:persons["usr-004"] },
  { id:"pol-005",userId:"usr-005",policyType:"travel",policyNumber:"TRV-2025-0005",insurerCode:"EUROINS",insurerName:"Euroins",status:"expired",startDate:"2025-01-20",endDate:"2025-02-03",premiumNet:85,totalAmount:101.15,currency:"RON",userEmail:"george.vasilescu@email.ro",userName:"George Vasilescu",userPhone:"+40720555666",cancellationReason:null,pdfUrl:"/policies/TRV-2025-0005.pdf",vehicle:vehicles["usr-005"],owner:persons["usr-005"] },
  { id:"pol-006",userId:"usr-001",policyType:"health",policyNumber:"HLTH-2025-0006",insurerCode:"SIGNALIDUNA",insurerName:"Signal Iduna",status:"active",startDate:"2025-03-01",endDate:"2026-02-28",premiumNet:1200,totalAmount:1428,currency:"RON",userEmail:"ion.popescu@email.ro",userName:"Ion Popescu",userPhone:"+40720123456",cancellationReason:null,pdfUrl:"/policies/HLTH-2025-0006.pdf",vehicle:null,owner:persons["usr-001"] },
  { id:"pol-007",userId:"usr-006",policyType:"rca",policyNumber:"RCA-2025-0007",insurerCode:"CITY",insurerName:"City Insurance",status:"pending_cancellation",startDate:"2025-02-15",endDate:"2026-02-14",premiumNet:510,totalAmount:606.9,currency:"RON",userEmail:"ana.mihailescu@email.ro",userName:"Ana Mihăilescu",userPhone:"+40720777888",cancellationReason:"Am vândut mașina",pdfUrl:"/policies/RCA-2025-0007.pdf",vehicle:vehicles["usr-006"],owner:persons["usr-006"] },
  { id:"pol-008",userId:"usr-007",policyType:"life",policyNumber:"LIFE-2025-0008",insurerCode:"NN",insurerName:"NN Asigurări",status:"active",startDate:"2025-01-01",endDate:"2030-12-31",premiumNet:2400,totalAmount:2856,currency:"RON",userEmail:"cristian.stancu@email.ro",userName:"Cristian Stancu",userPhone:"+40720999000",cancellationReason:null,pdfUrl:"/policies/LIFE-2025-0008.pdf",vehicle:null,owner:persons["usr-007"] },
  { id:"pol-009",userId:"usr-008",policyType:"rca",policyNumber:"RCA-2025-0009",insurerCode:"GENERALI",insurerName:"Generali",status:"cancelled",startDate:"2025-01-01",endDate:"2025-07-01",premiumNet:380,totalAmount:452.2,currency:"RON",userEmail:"vasile.munteanu@email.ro",userName:"Vasile Munteanu",userPhone:"+40720222333",cancellationReason:"Neplată primă",pdfUrl:"/policies/RCA-2025-0009.pdf",vehicle:vehicles["usr-008"],owner:persons["usr-008"] },
  { id:"pol-010",userId:"usr-002",policyType:"rca",policyNumber:"RCA-2025-0010",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"pending",startDate:"2025-04-01",endDate:"2026-03-31",premiumNet:490,totalAmount:583.1,currency:"RON",userEmail:"maria.ionescu@email.ro",userName:"Maria Ionescu",userPhone:"+40720765432",cancellationReason:null,pdfUrl:null,vehicle:vehicles["usr-002"],owner:persons["usr-002"] },
];

export const mockPolicies: AdminPolicy[] = [
  { id:"pol-001",userId:"usr-001",policyType:"rca",policyNumber:"RCA-2025-0001",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"active",startDate:"2025-01-15",endDate:"2026-01-14",premiumNet:450,totalAmount:535.5,currency:"RON" },
  { id:"pol-002",userId:"usr-002",policyType:"casco",policyNumber:"CAS-2025-0002",insurerCode:"GROUPAMA",insurerName:"Groupama",status:"active",startDate:"2025-02-01",endDate:"2026-01-31",premiumNet:2800,totalAmount:3332,currency:"RON" },
  { id:"pol-003",userId:"usr-003",policyType:"rca",policyNumber:"RCA-2025-0003",insurerCode:"OMNIASIG",insurerName:"Omniasig",status:"pending",startDate:"2025-03-10",endDate:"2025-09-09",premiumNet:320,totalAmount:380.8,currency:"RON" },
  { id:"pol-004",userId:"usr-004",policyType:"home",policyNumber:"HOME-2025-0004",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"active",startDate:"2025-01-01",endDate:"2025-12-31",premiumNet:650,totalAmount:773.5,currency:"RON" },
  { id:"pol-005",userId:"usr-005",policyType:"travel",policyNumber:"TRV-2025-0005",insurerCode:"EUROINS",insurerName:"Euroins",status:"expired",startDate:"2025-01-20",endDate:"2025-02-03",premiumNet:85,totalAmount:101.15,currency:"RON" },
  { id:"pol-006",userId:"usr-001",policyType:"health",policyNumber:"HLTH-2025-0006",insurerCode:"SIGNALIDUNA",insurerName:"Signal Iduna",status:"active",startDate:"2025-03-01",endDate:"2026-02-28",premiumNet:1200,totalAmount:1428,currency:"RON" },
  { id:"pol-007",userId:"usr-006",policyType:"rca",policyNumber:"RCA-2025-0007",insurerCode:"CITY",insurerName:"City Insurance",status:"pending_cancellation",startDate:"2025-02-15",endDate:"2026-02-14",premiumNet:510,totalAmount:606.9,currency:"RON" },
  { id:"pol-008",userId:"usr-007",policyType:"life",policyNumber:"LIFE-2025-0008",insurerCode:"NN",insurerName:"NN Asigurări",status:"active",startDate:"2025-01-01",endDate:"2030-12-31",premiumNet:2400,totalAmount:2856,currency:"RON" },
  { id:"pol-009",userId:"usr-008",policyType:"rca",policyNumber:"RCA-2025-0009",insurerCode:"GENERALI",insurerName:"Generali",status:"cancelled",startDate:"2025-01-01",endDate:"2025-07-01",premiumNet:380,totalAmount:452.2,currency:"RON" },
  { id:"pol-010",userId:"usr-002",policyType:"rca",policyNumber:"RCA-2025-0010",insurerCode:"ALLIANZ",insurerName:"Allianz-Țiriac",status:"pending",startDate:"2025-04-01",endDate:"2026-03-31",premiumNet:490,totalAmount:583.1,currency:"RON" },
];

export const mockPayments: AdminPayment[] = [
  { id:"pay-001",policyId:"pol-001",policyNumber:"RCA-2025-0001",userId:"usr-001",userName:"Ion Popescu",amount:535.5,currency:"RON",status:"succeeded",method:"card",stripePaymentId:"pi_3QaBcDeFgHiJkLmN",createdAt:"2025-01-14T10:30:00Z",updatedAt:"2025-01-14T10:30:00Z" },
  { id:"pay-002",policyId:"pol-002",policyNumber:"CAS-2025-0002",userId:"usr-002",userName:"Maria Ionescu",amount:3332,currency:"RON",status:"succeeded",method:"apple_pay",stripePaymentId:"pi_3RaBcDeFgHiJkLmN",createdAt:"2025-01-31T14:20:00Z",updatedAt:"2025-01-31T14:20:00Z" },
  { id:"pay-003",policyId:"pol-003",policyNumber:"RCA-2025-0003",userId:"usr-003",userName:"Andrei Dumitrescu",amount:380.8,currency:"RON",status:"pending",method:"card",stripePaymentId:"pi_3SaBcDeFgHiJkLmN",createdAt:"2025-03-08T09:15:00Z",updatedAt:"2025-03-08T09:15:00Z" },
  { id:"pay-004",policyId:"pol-004",policyNumber:"HOME-2025-0004",userId:"usr-004",userName:"Elena Georgescu",amount:773.5,currency:"RON",status:"succeeded",method:"google_pay",stripePaymentId:"pi_3TaBcDeFgHiJkLmN",createdAt:"2024-12-28T16:45:00Z",updatedAt:"2024-12-28T16:45:00Z" },
  { id:"pay-005",policyId:"pol-005",policyNumber:"TRV-2025-0005",userId:"usr-005",userName:"George Vasilescu",amount:101.15,currency:"RON",status:"succeeded",method:"link",stripePaymentId:"pi_3UaBcDeFgHiJkLmN",createdAt:"2025-01-19T11:00:00Z",updatedAt:"2025-01-19T11:00:00Z" },
  { id:"pay-006",policyId:"pol-006",policyNumber:"HLTH-2025-0006",userId:"usr-001",userName:"Ion Popescu",amount:1428,currency:"RON",status:"succeeded",method:"card",stripePaymentId:"pi_3VaBcDeFgHiJkLmN",createdAt:"2025-02-28T08:30:00Z",updatedAt:"2025-02-28T08:30:00Z" },
  { id:"pay-007",policyId:"pol-007",policyNumber:"RCA-2025-0007",userId:"usr-006",userName:"Ana Mihăilescu",amount:606.9,currency:"RON",status:"refunded",method:"card",stripePaymentId:"pi_3WaBcDeFgHiJkLmN",createdAt:"2025-02-10T12:00:00Z",updatedAt:"2025-03-01T15:30:00Z" },
  { id:"pay-008",policyId:"pol-008",policyNumber:"LIFE-2025-0008",userId:"usr-007",userName:"Cristian Stancu",amount:2856,currency:"RON",status:"succeeded",method:"card",stripePaymentId:"pi_3XaBcDeFgHiJkLmN",createdAt:"2025-01-01T00:05:00Z",updatedAt:"2025-01-01T00:05:00Z" },
  { id:"pay-009",policyId:"pol-009",policyNumber:"RCA-2025-0009",userId:"usr-008",userName:"Vasile Munteanu",amount:452.2,currency:"RON",status:"succeeded",method:"card",stripePaymentId:"pi_3YaBcDeFgHiJkLmN",createdAt:"2024-12-30T10:00:00Z",updatedAt:"2024-12-30T10:00:00Z" },
  { id:"pay-010",policyId:"pol-002",policyNumber:"CAS-2025-0002",userId:"usr-002",userName:"Maria Ionescu",amount:1666,currency:"RON",status:"failed",method:"card",stripePaymentId:"pi_3ZaBcDeFgHiJkLmN",createdAt:"2025-03-15T09:30:00Z",updatedAt:"2025-03-15T09:30:00Z" },
];

export const userNames: Record<string,string> = { "usr-001":"Ion Popescu","usr-002":"Maria Ionescu","usr-003":"Andrei Dumitrescu","usr-004":"Elena Georgescu","usr-005":"George Vasilescu","usr-006":"Ana Mihăilescu","usr-007":"Cristian Stancu","usr-008":"Vasile Munteanu" };
export const policyTypeLabels: Record<string,string> = { rca:"RCA",casco:"Casco",home:"Locuință",health:"Sănătate",travel:"Călătorie",life:"Viață" };
export const policyStatusLabels: Record<string,string> = { active:"Activă",cancelled:"Anulată",expired:"Expirată",pending:"În așteptare",pending_cancellation:"Anulare în curs" };
export const paymentStatusLabels: Record<string,string> = { pending:"În așteptare",succeeded:"Plătită",failed:"Eșuată",refunded:"Rambursată" };
export const paymentMethodLabels: Record<string,string> = { card:"Card",apple_pay:"Apple Pay",google_pay:"Google Pay",link:"Link" };
