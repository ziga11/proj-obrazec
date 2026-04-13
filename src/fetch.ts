import type { Account, Project, ProjectPreview } from "./types";
// http://localhost:8080/api /
/* proj-obrazec-backend-production.up.railway.app/api */

const BASE_URL = 'proj-obrazec-backend-production.up.railway.app/api';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}, retries = 5): Promise<T> {
        const url = `${BASE_URL}${endpoint}`;

        try {
                const response = await fetch(url, {
                        ...options,
                        credentials: 'include',
                        headers: {
                                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                                ...options.headers,
                        },
                });

                if (response.status === 401) {
                        window.location.href = '/pages/login.html';
                        throw new Error(`Not authenticated ${await response.text()}`);
                }
                else if (response.status === 403) {
                        window.location.href = '/pages/list.html';
                        alert("Unauthorized");
                        throw new Error(`Not authorized ${await response.text()}`);
                }

                if (!response.ok) {
                        if ([502, 503, 504].includes(response.status) && retries > 0) {
                                console.log(`Server is waking up... retrying (${retries} attempts left)`);
                                await new Promise(resolve => setTimeout(resolve, 5000));
                                return apiRequest(endpoint, options, retries - 1);
                        }
                        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
                }

                return await response.json();
        } catch (error) {
                if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, 5000));
                        return apiRequest(endpoint, options, retries - 1);
                }
                throw error;
        }
}

export const ProjectService = {
        async list(): Promise<Array<ProjectPreview>> {
                return apiRequest<ProjectPreview[]>('/project-list');
        },

        async getOrCreateAcc(jwtToken: string): Promise<Account> {
                return await apiRequest<Account>('/auth/google-login', {
                        method: 'POST',
                        body: JSON.stringify({ token: jwtToken }),
                });
        },

        async upsert(project: Project, files: FormData): Promise<number> {
                files.append('project', JSON.stringify(project));

                const data = await apiRequest<{ projectId: number }>('/upsert-project', {
                        method: 'POST',
                        body: files,
                });
                return data.projectId;
        },

        async fetch(id: number): Promise<Project> {
                return apiRequest<Project>(`/fetch-project/${id}`);
        },

        async delete(id: number): Promise<any> {
                return apiRequest<any>(`/delete-project/${id}`, {
                        method: 'POST',
                });
        },

        async fetchBlob(filePath: string): Promise<Blob> {
                const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
                const url = `${BASE_URL}${cleanPath}`;

                const response = await fetch(url);

                if (!response.ok) {
                        throw new Error(`Failed to fetch file: ${response.status}`);
                }

                return await response.blob();
        },

        async addedAccountsToProject(projectId: number): Promise<Array<Account>> {
                return await apiRequest<Array<Account>>(`/project-accounts/${projectId}`);
        },

        async addUserToProject(projectId: number, email: string, permissionId: number): Promise<void> {
                await apiRequest<{ projectId: number }>('/add-account-to-project', {
                        method: 'POST',
                        body: JSON.stringify({ "project_id": projectId, "email": email, "permission_id": permissionId }),
                }, 0);
        },

        async removeUserFromProject(projectId: number, accountId: number): Promise<void> {
                await apiRequest<{ projectId: number }>('/remove-account-from-project', {
                        method: 'POST',
                        body: JSON.stringify({ "project_id": projectId, "account_id": accountId }),
                });
        },

        async downloadFile(filePath: string) {
                const blob = await this.fetchBlob(filePath);
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = filePath.split('/').pop() || 'download';

                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(url);
        },

        async isLoggedIn(): Promise<Account> {
                return await apiRequest<Account>('/me', { method: 'GET', });
        },
};

