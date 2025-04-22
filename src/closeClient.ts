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

  // Tasks API
  async searchTasks(params: {
    id?: string;
    id__in?: string[];
    _type?: string;
    lead_id?: string;
    is_complete?: boolean;
    date__lt?: string;
    date__gt?: string;
    date__lte?: string;
    date__gte?: string;
    date_created__lt?: string;
    date_created__gt?: string;
    date_created__lte?: string;
    date_created__gte?: string;
    assigned_to?: string;
    view?: 'inbox' | 'future' | 'archive';
    _order_by?: string;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params.id) searchParams.append('id', params.id);
    if (params.id__in) searchParams.append('id__in', params.id__in.join(','));
    if (params._type) searchParams.append('_type', params._type);
    if (params.lead_id) searchParams.append('lead_id', params.lead_id);
    if (params.is_complete !== undefined) searchParams.append('is_complete', params.is_complete.toString());
    if (params.date__lt) searchParams.append('date__lt', params.date__lt);
    if (params.date__gt) searchParams.append('date__gt', params.date__gt);
    if (params.date__lte) searchParams.append('date__lte', params.date__lte);
    if (params.date__gte) searchParams.append('date__gte', params.date__gte);
    if (params.date_created__lt) searchParams.append('date_created__lt', params.date_created__lt);
    if (params.date_created__gt) searchParams.append('date_created__gt', params.date_created__gt);
    if (params.date_created__lte) searchParams.append('date_created__lte', params.date_created__lte);
    if (params.date_created__gte) searchParams.append('date_created__gte', params.date_created__gte);
    if (params.assigned_to) searchParams.append('assigned_to', params.assigned_to);
    if (params.view) searchParams.append('view', params.view);
    if (params._order_by) searchParams.append('_order_by', params._order_by);
    if (params.limit) searchParams.append('_limit', params.limit.toString());

    return this.request<any>(`/task/?${searchParams}`);
  }

  async createTask(data: {
    lead_id: string;
    text: string;
    date: string;
    assigned_to?: string;
  }): Promise<any> {
    return this.request<any>('/task/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTaskById(taskId: string): Promise<any> {
    return this.request<any>(`/task/${taskId}/`);
  }

  async updateTask(taskId: string, data: {
    assigned_to?: string;
    date?: string;
    is_complete?: boolean;
    text?: string;
  }): Promise<any> {
    return this.request<any>(`/task/${taskId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.request<void>(`/task/${taskId}/`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateTasks(params: {
    id?: string;
    id__in?: string[];
    _type?: string;
    lead_id?: string;
    is_complete?: boolean;
    date__lt?: string;
    date__gt?: string;
    date__lte?: string;
    date__gte?: string;
    date_created__lt?: string;
    date_created__gt?: string;
    date_created__lte?: string;
    date_created__gte?: string;
    assigned_to?: string;
    view?: 'inbox' | 'future' | 'archive';
    _order_by?: string;
  }, data: {
    assigned_to?: string;
    date?: string;
    is_complete?: boolean;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params.id) searchParams.append('id', params.id);
    if (params.id__in) searchParams.append('id__in', params.id__in.join(','));
    if (params._type) searchParams.append('_type', params._type);
    if (params.lead_id) searchParams.append('lead_id', params.lead_id);
    if (params.is_complete !== undefined) searchParams.append('is_complete', params.is_complete.toString());
    if (params.date__lt) searchParams.append('date__lt', params.date__lt);
    if (params.date__gt) searchParams.append('date__gt', params.date__gt);
    if (params.date__lte) searchParams.append('date__lte', params.date__lte);
    if (params.date__gte) searchParams.append('date__gte', params.date__gte);
    if (params.date_created__lt) searchParams.append('date_created__lt', params.date_created__lt);
    if (params.date_created__gt) searchParams.append('date_created__gt', params.date_created__gt);
    if (params.date_created__lte) searchParams.append('date_created__lte', params.date_created__lte);
    if (params.date_created__gte) searchParams.append('date_created__gte', params.date_created__gte);
    if (params.assigned_to) searchParams.append('assigned_to', params.assigned_to);
    if (params.view) searchParams.append('view', params.view);
    if (params._order_by) searchParams.append('_order_by', params._order_by);

    return this.request<any>(`/task/?${searchParams}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Opportunities API
  async searchOpportunities(params: {
    lead_id?: string;
    user_id?: string;
    status_id?: string;
    status_label?: string;
    status_type?: string;
    date_created__lt?: string;
    date_created__gt?: string;
    date_created__lte?: string;
    date_created__gte?: string;
    date_updated__lt?: string;
    date_updated__gt?: string;
    date_updated__lte?: string;
    date_updated__gte?: string;
    date_won__lt?: string;
    date_won__gt?: string;
    date_won__lte?: string;
    date_won__gte?: string;
    value_period?: 'one_time' | 'monthly' | 'annual';
    query?: string;
    _order_by?: string;
    _group_by?: string;
    _fields?: string[];
    lead_saved_search_id?: string;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params.lead_id) searchParams.append('lead_id', params.lead_id);
    if (params.user_id) searchParams.append('user_id', params.user_id);
    if (params.status_id) searchParams.append('status_id', params.status_id);
    if (params.status_label) searchParams.append('status_label', params.status_label);
    if (params.status_type) searchParams.append('status_type', params.status_type);
    if (params.date_created__lt) searchParams.append('date_created__lt', params.date_created__lt);
    if (params.date_created__gt) searchParams.append('date_created__gt', params.date_created__gt);
    if (params.date_created__lte) searchParams.append('date_created__lte', params.date_created__lte);
    if (params.date_created__gte) searchParams.append('date_created__gte', params.date_created__gte);
    if (params.date_updated__lt) searchParams.append('date_updated__lt', params.date_updated__lt);
    if (params.date_updated__gt) searchParams.append('date_updated__gt', params.date_updated__gt);
    if (params.date_updated__lte) searchParams.append('date_updated__lte', params.date_updated__lte);
    if (params.date_updated__gte) searchParams.append('date_updated__gte', params.date_updated__gte);
    if (params.date_won__lt) searchParams.append('date_won__lt', params.date_won__lt);
    if (params.date_won__gt) searchParams.append('date_won__gt', params.date_won__gt);
    if (params.date_won__lte) searchParams.append('date_won__lte', params.date_won__lte);
    if (params.date_won__gte) searchParams.append('date_won__gte', params.date_won__gte);
    if (params.value_period) searchParams.append('value_period', params.value_period);
    if (params.query) searchParams.append('query', params.query);
    if (params._order_by) searchParams.append('_order_by', params._order_by);
    if (params._group_by) searchParams.append('_group_by', params._group_by);
    if (params._fields) searchParams.append('_fields', params._fields.join(','));
    if (params.lead_saved_search_id) searchParams.append('lead_saved_search_id', params.lead_saved_search_id);
    if (params.limit) searchParams.append('_limit', params.limit.toString());

    return this.request<any>(`/opportunity/?${searchParams}`);
  }

  async createOpportunity(data: {
    lead_id?: string;
    status_id?: string;
    value?: number;
    value_period?: 'one_time' | 'monthly' | 'annual';
    confidence?: number;
    note?: string;
    custom?: Record<string, any>;
  }): Promise<any> {
    return this.request<any>('/opportunity/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOpportunityById(opportunityId: string): Promise<any> {
    return this.request<any>(`/opportunity/${opportunityId}/`);
  }

  async updateOpportunity(opportunityId: string, data: {
    status_id?: string;
    value?: number;
    value_period?: 'one_time' | 'monthly' | 'annual';
    confidence?: number;
    note?: string;
    custom?: Record<string, any>;
    date_won?: string;
  }): Promise<any> {
    return this.request<any>(`/opportunity/${opportunityId}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteOpportunity(opportunityId: string): Promise<void> {
    await this.request<void>(`/opportunity/${opportunityId}/`, {
      method: 'DELETE',
    });
  }
}
