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

export function formatOpportunity(opportunity: any): string {
  return `
Opportunity:
ID: ${opportunity.id}
Status: ${opportunity.status_label} (${opportunity.status_type})
Value: ${opportunity.value/100 || 0} ${opportunity.value_period || 'one_time'}
Confidence: ${opportunity.confidence || 0}%
Lead: ${opportunity.lead?.display_name || 'No lead'}
Created: ${opportunity.date_created}
Updated: ${opportunity.date_updated}
${opportunity.date_won ? `Won: ${opportunity.date_won}` : ''}
${opportunity.note ? `Note: ${opportunity.note}` : ''}
${opportunity.custom ? `Custom Fields:\n${Object.entries(opportunity.custom)
  .map(([key, value]) => `  ${key}: ${value}`)
  .join('\n')}` : ''}
`;
}

export function formatOpportunitySearchResults(results: any): string {
  if (!results.data || results.data.length === 0) {
    return 'No opportunities found.';
  }

  let formattedResults = '';

  // Add aggregate values if they exist
  if (results.total_results !== undefined) {
    formattedResults += `Total Opportunities: ${results.total_results}\n`;
  }
  if (results.count_by_value_period) {
    formattedResults += 'Opportunities by Value Period:\n';
    Object.entries(results.count_by_value_period).forEach(([period, count]) => {
      formattedResults += `  ${period}: ${count}\n`;
    });
  }
  if (results.total_value_one_time) {
    formattedResults += `Total One-Time Value: ${results.total_value_one_time}\n`;
  }
  if (results.total_value_monthly) {
    formattedResults += `Total Monthly Value: ${results.total_value_monthly}\n`;
  }
  if (results.total_value_annual) {
    formattedResults += `Total Annual Value: ${results.total_value_annual}\n`;
  }
  if (results.total_value_annualized) {
    formattedResults += `Total Annualized Value: ${results.total_value_annualized}\n`;
  }

  formattedResults += '\nOpportunities:\n';
  formattedResults += results.data.map((opportunity: any) => formatOpportunity(opportunity)).join('\n---\n');

  return formattedResults;
}

export function formatCall(call: any): string {
  return `
Call Activity:
ID: ${call.id}
Status: ${call.status}
Direction: ${call.direction}
Method: ${call.call_method}
Duration: ${call.duration || 0} seconds
Disposition: ${call.disposition}
Cost: ${call.cost ? `$${(call.cost/100).toFixed(2)}` : 'N/A'}
Date: ${call.date_created}
${call.recording_url ? `Recording URL: ${call.recording_url}` : ''}
${call.recording_transcript ? `Recording Transcript: ${call.recording_transcript.summary_text}` : ''}
${call.voicemail_transcript ? `Voicemail Transcript: ${call.voicemail_transcript.summary_text}` : ''}
${call.note_html || call.note ? `Notes: ${call.note_html || call.note}` : ''}
`;
}

export function formatCallSearchResults(results: any): string {
  if (!results.data || results.data.length === 0) {
    return 'No call activities found.';
  }

  let formattedResults = '';

  // Add aggregate values if they exist
  if (results.total_results !== undefined) {
    formattedResults += `Total Calls: ${results.total_results}\n`;
  }
  if (results.total_duration) {
    formattedResults += `Total Duration: ${results.total_duration} seconds\n`;
  }
  if (results.total_cost) {
    formattedResults += `Total Cost: $${(results.total_cost/100).toFixed(2)}\n`;
  }

  formattedResults += '\nCalls:\n';
  formattedResults += results.data.map((call: any) => formatCall(call)).join('\n---\n');

  return formattedResults;
}

export function formatUser(user: any): string {
  return `
User:
ID: ${user.id}
Name: ${user.name}
Email: ${user.email}
Role: ${user.role}
Organization: ${user.organization_id}
Created: ${user.date_created}
Updated: ${user.date_updated}
${user.phone ? `Phone: ${user.phone}` : ''}
${user.image ? `Image URL: ${user.image}` : ''}
${user.custom ? `Custom Fields:\n${Object.entries(user.custom)
  .map(([key, value]) => `  ${key}: ${value}`)
  .join('\n')}` : ''}
`;
}

export function formatUserSearchResults(results: any): string {
  if (!results.data || results.data.length === 0) {
    return 'No users found.';
  }

  let formattedResults = '';

  // Add total count if available
  if (results.total_results !== undefined) {
    formattedResults += `Total Users: ${results.total_results}\n`;
  }

  formattedResults += '\nUsers:\n';
  formattedResults += results.data.map((user: any) => formatUser(user)).join('\n---\n');

  return formattedResults;
}

export function formatUserAvailability(availability: any): string {
  if (!availability.data || availability.data.length === 0) {
    return 'No user availability data found.';
  }

  let formattedResults = '';

  formattedResults += '\nUser Availability:\n';
  formattedResults += availability.data.map((user: any) => `
User: ${user.name} (${user.email})
Status: ${user.status}
${user.active_calls?.length ? `Active Calls: ${user.active_calls.length}` : 'No active calls'}
${user.last_seen ? `Last Seen: ${user.last_seen}` : ''}
${user.organization_id ? `Organization: ${user.organization_id}` : ''}
`).join('\n---\n');

  return formattedResults;
}
