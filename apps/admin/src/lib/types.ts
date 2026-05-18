export interface AdminPolicy {
  id: string;
  userId: string;
  policyType: string;
  policyNumber: string;
  insurerCode: string;
  insurerName: string;
  status: string;
  startDate: string;
  endDate: string;
  premiumNet: number;
  totalAmount: number;
  currency: string;
}

export interface AdminVehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  vin: string;
  registrationStatus: string;
}

export interface AdminPerson {
  id: string;
  type: "individual" | "company";
  firstName: string;
  lastName: string;
  cnpMasked: string;
  phone: string;
  email: string;
  addressCity: string;
  addressCounty: string;
}

export interface AdminPolicyDetail extends AdminPolicy {
  userEmail: string;
  userName: string;
  userPhone: string;
  cancellationReason: string | null;
  pdfUrl: string | null;
  vehicle: AdminVehicle | null;
  owner: AdminPerson | null;
}
