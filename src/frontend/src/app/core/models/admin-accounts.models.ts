import { PagedResponse, TabCountDto } from './common.models';

export interface AdminAccountListItemDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AdminAccountListResponse {
  counts: TabCountDto[];
  tableData: PagedResponse<AdminAccountListItemDto>;
}

export interface CreateAdminAccountCommand {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
}
