export interface LeadService {
  id: string;
  serviceType: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  mobile: string;
  postcode: string;
  services: LeadService[];
  createdAt: string;
  updatedAt: string;
}

export interface GetLeadsData {
  leads: Lead[];
}

