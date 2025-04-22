// Format Lead data into a readable text format
export function formatLead(lead: any): string {
  try {
    const contacts = lead.contacts?.map((contact: any) => {
      return {
        name: contact.name || 'No name',
        title: contact.title || 'No title',
        emails: contact.emails?.map((email: any) => email.email || 'No email').join(', ') || 'No emails',
        phones: contact.phones?.map((phone: any) => `${phone.phone} (${phone.type})`).join(', ') || 'No phones'
      };
    }) || [];

    const formattedLead = `
Lead ID: ${lead.id}
Company Name: ${lead.display_name || 'No company name'}
Status: ${lead.status_label || 'No status'}
URL: ${lead.url || 'No URL'}
Description: ${lead.description || 'No description'}
Created: ${new Date(lead.date_created).toLocaleString() || 'Unknown'}
Updated: ${new Date(lead.date_updated).toLocaleString() || 'Unknown'}

Contacts:
${contacts.map((c: any) => `- ${c.name} (${c.title})
  Emails: ${c.emails}
  Phones: ${c.phones}`).join('\n\n') || 'No contacts'}

Addresses:
${lead.addresses?.map((address: any) => `- ${address.address_1 || ''} ${address.address_2 || ''}, ${address.city || ''}, ${address.state || ''} ${address.zipcode || ''}, ${address.country || ''}`).join('\n') || 'No addresses'}

Custom Fields:
${Object.entries(lead.custom || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n') || 'No custom fields'}
`;

    return formattedLead;
  } catch (error) {
    console.error('Error formatting lead:', error);
    return JSON.stringify(lead, null, 2);
  }
}

// Format Contact data into a readable text format
export function formatContact(contact: any): string {
  try {
    const formattedContact = `
Contact ID: ${contact.id}
Name: ${contact.name || 'No name'}
Title: ${contact.title || 'No title'}
Created: ${new Date(contact.date_created).toLocaleString() || 'Unknown'}
Updated: ${new Date(contact.date_updated).toLocaleString() || 'Unknown'}

Emails:
${contact.emails?.map((email: any) => `- ${email.email} (${email.type})`).join('\n') || 'No emails'}

Phones:
${contact.phones?.map((phone: any) => `- ${phone.phone} (${phone.type})`).join('\n') || 'No phones'}

Related Leads:
${contact.leads?.map((lead: any) => `- ${lead.display_name || 'Unknown lead'}`).join('\n') || 'No related leads'}

Custom Fields:
${Object.entries(contact.custom || {}).map(([key, value]) => `- ${key}: ${value}`).join('\n') || 'No custom fields'}
`;

    return formattedContact;
  } catch (error) {
    console.error('Error formatting contact:', error);
    return JSON.stringify(contact, null, 2);
  }
}

// Format search results for leads
export function formatLeadSearchResults(results: any): string {
  try {
    const total = results.total_results || 0;
    const formattedResults = `
Found ${total} lead(s)

${results.data?.map((lead: any, index: number) => `
${index + 1}. ${lead.display_name || 'No name'} (ID: ${lead.id})
   Status: ${lead.status_label || 'No status'}
   Contacts: ${lead.contacts?.length || 0}
   Created: ${new Date(lead.date_created).toLocaleString() || 'Unknown'}
`).join('') || 'No leads found'}
`;

    return formattedResults;
  } catch (error) {
    console.error('Error formatting lead search results:', error);
    return JSON.stringify(results, null, 2);
  }
}

// Format search results for contacts
export function formatContactSearchResults(results: any): string {
  try {
    const total = results.total_results || 0;
    const formattedResults = `
Found ${total} contact(s)

${results.data?.map((contact: any, index: number) => `
${index + 1}. ${contact.name || 'No name'} (ID: ${contact.id})
   Title: ${contact.title || 'No title'}
   Emails: ${contact.emails?.map((e: any) => e.email).join(', ') || 'None'}
   Related to: ${contact.lead_names?.join(', ') || 'No leads'}
`).join('') || 'No contacts found'}
`;

    return formattedResults;
  } catch (error) {
    console.error('Error formatting contact search results:', error);
    return JSON.stringify(results, null, 2);
  }
}

export function formatEmail(email: any): string {
  return `
Email Activity:
ID: ${email.id}
Subject: ${email.subject}
Status: ${email.status}
From: ${email.sender || email.user?.email}
To: ${email.contacts?.map((c: any) => c.email).join(', ')}
Date: ${email.date_created}
Body: ${email.body_text || email.body_html || 'No body content'}
${email.attachments?.length ? `Attachments: ${email.attachments.map((a: any) => a.filename).join(', ')}` : ''}
${email.followup_date ? `Follow-up Date: ${email.followup_date}` : ''}
`;
}

export function formatEmailSearchResults(results: any): string {
  if (!results.data || results.data.length === 0) {
    return 'No email activities found.';
  }

  return results.data.map((email: any) => formatEmail(email)).join('\n---\n');
}

export function formatTask(task: any): string {
  return `
Task:
ID: ${task.id}
Type: ${task._type}
Status: ${task.is_complete ? 'Completed' : 'Incomplete'}
Date: ${task.date}
Assigned To: ${task.assigned_to?.name || 'Unassigned'}
Text: ${task.text}
Lead: ${task.lead?.display_name || 'No lead'}
${task.object_type ? `Related Object: ${task.object_type} (${task.object_id})` : ''}
${task.emails ? `Related Emails: ${task.emails.join(', ')}` : ''}
${task.phone ? `Phone: ${task.phone}` : ''}
${task.local_phone ? `Local Phone: ${task.local_phone}` : ''}
${task.voicemail_duration ? `Voicemail Duration: ${task.voicemail_duration}s` : ''}
${task.voicemail_url ? `Voicemail URL: ${task.voicemail_url}` : ''}
${task.attachments?.length ? `Attachments: ${task.attachments.map((a: any) => a.filename).join(', ')}` : ''}
`;
}

export function formatTaskSearchResults(results: any): string {
  if (!results.data || results.data.length === 0) {
    return 'No tasks found.';
  }

  return results.data.map((task: any) => formatTask(task)).join('\n---\n');
}
