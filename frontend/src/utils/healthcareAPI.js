// Healthcare API Integration Service
// Connects frontend to Birth Health Network backend API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class HealthcareAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('accessToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('accessToken', token);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    // Get current token
    getToken() {
        return this.token || localStorage.getItem('accessToken');
    }

    // Make authenticated API request
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const currentToken = this.getToken();
        if (currentToken) {
            headers['Authorization'] = `Bearer ${currentToken}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                credentials: 'include' // Include cookies for refresh tokens
            });

            // Handle token refresh
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    headers['Authorization'] = `Bearer ${this.getToken()}`;
                    const retryResponse = await fetch(url, {
                        ...options,
                        headers,
                        credentials: 'include'
                    });

                    if (!retryResponse.ok) {
                        throw new Error(`API Error: ${retryResponse.status}`);
                    }
                    return await retryResponse.json();
                } else {
                    // Redirect to login if refresh failed
                    this.logout();
                    window.location.href = '/login';
                    return;
                }
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Authentication Methods
    async register(userData) {
        try {
            const response = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            if (response.success && response.data.accessToken) {
                this.setToken(response.data.accessToken);
            }

            return response;
        } catch (error) {
            throw new Error(`Registration failed: ${error.message}`);
        }
    }

    async login(email, password, rememberMe = false) {
        try {
            const response = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password, rememberMe })
            });

            if (response.success && response.data.accessToken) {
                this.setToken(response.data.accessToken);
            }

            return response;
        } catch (error) {
            throw new Error(`Login failed: ${error.message}`);
        }
    }

    async refreshToken() {
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data.accessToken) {
                    this.setToken(data.data.accessToken);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    async logout() {
        try {
            await this.makeRequest('/auth/logout', {
                method: 'POST'
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            this.setToken(null);
        }
    }

    async getCurrentUser() {
        try {
            return await this.makeRequest('/auth/me');
        } catch (error) {
            throw new Error(`Failed to get current user: ${error.message}`);
        }
    }

    async changePassword(currentPassword, newPassword) {
        try {
            return await this.makeRequest('/auth/change-password', {
                method: 'PUT',
                body: JSON.stringify({ currentPassword, newPassword })
            });
        } catch (error) {
            throw new Error(`Password change failed: ${error.message}`);
        }
    }

    // Dashboard Methods
    async getDashboardData() {
        try {
            return await this.makeRequest('/dashboard');
        } catch (error) {
            throw new Error(`Failed to load dashboard: ${error.message}`);
        }
    }

    async getPatientsList(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.offset) queryParams.append('offset', options.offset);
            if (options.search) queryParams.append('search', options.search);

            const endpoint = `/dashboard/patients${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            return await this.makeRequest(endpoint);
        } catch (error) {
            throw new Error(`Failed to load patients: ${error.message}`);
        }
    }

    async getQuickStats() {
        try {
            return await this.makeRequest('/dashboard/quick-stats');
        } catch (error) {
            throw new Error(`Failed to load statistics: ${error.message}`);
        }
    }

    // Health Records Methods
    async createHealthRecord(recordData) {
        try {
            return await this.makeRequest('/health-records', {
                method: 'POST',
                body: JSON.stringify(recordData)
            });
        } catch (error) {
            throw new Error(`Failed to create health record: ${error.message}`);
        }
    }

    async getHealthRecords(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.patientId) queryParams.append('patientId', options.patientId);
            if (options.recordType) queryParams.append('recordType', options.recordType);
            if (options.urgencyLevel) queryParams.append('urgencyLevel', options.urgencyLevel);
            if (options.startDate) queryParams.append('startDate', options.startDate);
            if (options.endDate) queryParams.append('endDate', options.endDate);
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.offset) queryParams.append('offset', options.offset);

            const endpoint = `/health-records${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            return await this.makeRequest(endpoint);
        } catch (error) {
            throw new Error(`Failed to load health records: ${error.message}`);
        }
    }

    async searchHealthRecordsByBHN(bhnId) {
        try {
            return await this.makeRequest(`/health-records/search?bhnId=${encodeURIComponent(bhnId)}`);
        } catch (error) {
            throw new Error(`Failed to search health records: ${error.message}`);
        }
    }

    async updateHealthRecord(recordId, updateData) {
        try {
            return await this.makeRequest(`/health-records/${recordId}`, {
                method: 'PUT',
                body: JSON.stringify(updateData)
            });
        } catch (error) {
            throw new Error(`Failed to update health record: ${error.message}`);
        }
    }

    async getVitalSignsTrends(patientId, days = 30) {
        try {
            const queryParams = new URLSearchParams({
                patientId,
                days: days.toString()
            });

            return await this.makeRequest(`/health-records/trends?${queryParams.toString()}`);
        } catch (error) {
            throw new Error(`Failed to load vital signs trends: ${error.message}`);
        }
    }

    async getRecordTypes() {
        try {
            return await this.makeRequest('/health-records/types');
        } catch (error) {
            throw new Error(`Failed to load record types: ${error.message}`);
        }
    }

    async getUrgencyLevels() {
        try {
            return await this.makeRequest('/health-records/urgency-levels');
        } catch (error) {
            throw new Error(`Failed to load urgency levels: ${error.message}`);
        }
    }

    // Research Integration Methods
    async searchPubMed(query, options = {}) {
        try {
            const queryParams = new URLSearchParams({ query });
            if (options.limit) queryParams.append('limit', options.limit);
            if (options.sort) queryParams.append('sort', options.sort);

            return await this.makeRequest(`/research/pubmed?${queryParams.toString()}`);
        } catch (error) {
            throw new Error(`PubMed search failed: ${error.message}`);
        }
    }

    async searchClinicalTrials(condition, options = {}) {
        try {
            const queryParams = new URLSearchParams({ query: condition });
            if (options.limit) queryParams.append('limit', options.limit);

            return await this.makeRequest(`/research/clinical-trials?${queryParams.toString()}`);
        } catch (error) {
            throw new Error(`Clinical trials search failed: ${error.message}`);
        }
    }

    async getDiagnosticCriteria(condition) {
        try {
            return await this.makeRequest(`/research/diagnostic-criteria/${encodeURIComponent(condition)}`);
        } catch (error) {
            throw new Error(`Failed to get diagnostic criteria: ${error.message}`);
        }
    }

    async getTreatmentGuidelines(condition, patientContext = {}) {
        try {
            const queryParams = patientContext ? `?patientContext=${encodeURIComponent(JSON.stringify(patientContext))}` : '';
            return await this.makeRequest(`/research/treatment-guidelines/${encodeURIComponent(condition)}${queryParams}`);
        } catch (error) {
            throw new Error(`Failed to get treatment guidelines: ${error.message}`);
        }
    }

    async checkDrugInteractions(medications) {
        try {
            return await this.makeRequest('/research/drug-interactions', {
                method: 'POST',
                body: JSON.stringify({ medications })
            });
        } catch (error) {
            throw new Error(`Drug interaction check failed: ${error.message}`);
        }
    }

    async getICD10Codes(condition) {
        try {
            return await this.makeRequest(`/research/icd10/${encodeURIComponent(condition)}`);
        } catch (error) {
            throw new Error(`Failed to get ICD-10 codes: ${error.message}`);
        }
    }

    async getMedicalCalculators(condition, patientData = {}) {
        try {
            const queryParams = patientData ? `?patientData=${encodeURIComponent(JSON.stringify(patientData))}` : '';
            return await this.makeRequest(`/research/calculators/${encodeURIComponent(condition)}${queryParams}`);
        } catch (error) {
            throw new Error(`Failed to get medical calculators: ${error.message}`);
        }
    }

    async comprehensiveResearch(query, options = {}) {
        try {
            return await this.makeRequest('/research/comprehensive', {
                method: 'POST',
                body: JSON.stringify({
                    query,
                    patientContext: options.patientContext,
                    medications: options.medications
                })
            });
        } catch (error) {
            throw new Error(`Comprehensive research failed: ${error.message}`);
        }
    }

    async getResearchDatabases() {
        try {
            return await this.makeRequest('/research/databases');
        } catch (error) {
            throw new Error(`Failed to get research databases: ${error.message}`);
        }
    }

    async getSearchSuggestions(query) {
        try {
            return await this.makeRequest(`/research/search-suggestions?q=${encodeURIComponent(query)}`);
        } catch (error) {
            throw new Error(`Failed to get search suggestions: ${error.message}`);
        }
    }

    // Utility Methods
    isAuthenticated() {
        return !!this.getToken();
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Create and export singleton instance
export const healthcareAPI = new HealthcareAPI();

// Export class for testing
export { HealthcareAPI };

// Default export
export default healthcareAPI;