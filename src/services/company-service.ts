
import { apiFetch } from './api';
import { apiHeaders } from './api-header';
import { authHeader } from './auth-header';

export interface Company {
	id: number;
	name: string;
	code: string;
	phone: string;
	email?: string;
	address?: string;
	created?: string;
	lastEdited?: string;
}

export interface CompanyListResponse {
	companies: Company[];
}

export interface UpdateCompanyResponse {
	success: boolean;
	company: Company;
}

class CompanyService {
	async getCompanies(): Promise<Company[]> {
		const requestOptions: RequestInit = {
			method: 'GET',
			headers: {
				...authHeader(),
				...apiHeaders()
			}
		};
		const result: CompanyListResponse = await apiFetch('/companies', requestOptions);
		return result.companies || [];
	}

	async updateCompany(companyId: number, payload: Partial<Company>): Promise<Company> {
		const requestOptions: RequestInit = {
			method: 'PUT',
			headers: {
				...authHeader(),
				...apiHeaders(),
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload)
		};
		const result: UpdateCompanyResponse = await apiFetch(`/companies/${companyId}`, requestOptions);
		return result.company;
	}
}

export const companyService = new CompanyService();
