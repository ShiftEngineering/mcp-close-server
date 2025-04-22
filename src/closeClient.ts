import fetch, { RequestInit } from 'node-fetch';

export class CloseClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.close.com/api/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const auth = Buffer.from(`${this.apiKey}:`).toString('base64');

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
        ...options.headers,
      },
    } as RequestInit);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Close.com API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  // Lead API
  async searchLeads(query: string, limit: number = 10): Promise<any> {
    const params = new URLSearchParams({
      query,
      _limit: limit.toString(),
    });
    return this.request<any>(`/lead/?${params}`);
  }

  async getLeadById(leadId: string): Promise<any> {
    return this.request<any>(`/lead/${leadId}/`);
  }

  // Contact API
  async searchContacts(query: string, limit: number = 10): Promise<any> {
    const params = new URLSearchParams({
      query,
      _limit: limit.toString(),
    });
    return this.request<any>(`/contact/?${params}`);
  }

  async getContactById(contactId: string): Promise<any> {
    return this.request<any>(`/contact/${contactId}/`);
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.request<any>('/me/');
      return true;
    } catch (error) {
      console.error('Failed to connect to Close.com API:', error);
      return false;
    }
  }

  // Email Activity API
  async searchEmails(params: {
    lead_id?: string;
    user_id?: string;
    date_created__gt?: string;
    date_created__lt?: string;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params.lead_id) searchParams.append('lead_id', params.lead_id);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.date_created__gt) searchParams.append('date_created__gt', params.date_created__gt);
    if (params.date_created__lt) searchParams.append('date_created__lt', params.date_created__lt);
    if (params.limit) searchParams.append('_limit', params.limit.toString());

    return this.request<any>(`/activity/email/?${searchParams}`);
  }

  async getEmailById(emailId: string): Promise<any> {
    return this.request<any>(`/activity/email/${emailId}/`);
  }

  async createEmail(data: {
    lead_id: string;
    status: 'inbox' | 'draft' | 'scheduled' | 'outbox' | 'sent';
    subject: string;
    body_text?: string;
    body_html?: string;
    template_id?: string;
    date_scheduled?: string;
    send_in?: number;
    followup_date?: string;
    sender?: string;
    attachments?: Array<{
      url: string;
      filename: string;
      content_type: string;
      size: number;
    }>;
  }): Promise<any> {
    return this.request<any>('/activity/email/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmail(emailId: string, data: Partial<{
    status: 'inbox' | 'draft' | 'scheduled' | 'outbox' | 'sent';
    subject: string;
    body_text: string;
    body_html: string;
    date_scheduled: string;
    followup_date: string;
  }>): Promise<any> {
    return this.request<any>(`/activity/email/${emailId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmail(emailId: string): Promise<void> {
    await this.request<void>(`/activity/email/${emailId}/`, {
      method: 'DELETE',
    });
  }
}
