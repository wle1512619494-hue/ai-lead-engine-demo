export default {
  async formSubmitted(event) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.warn('Telegram alert skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing.');
      return;
    }

    const data = event?.data || {};
    const name = data.name || 'Unknown';
    const email = data.email || 'Unknown';
    const company = data.company || 'Unknown';
    const website = data.website || 'Not provided';
    const crm = data.crm || 'Not provided';
    const leadSource = data['lead-source'] || 'Not provided';
    const workflow = data.workflow || 'Not provided';

    const message = [
      '🚨 New LeadStack Ops pilot lead',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company}`,
      `Website: ${website}`,
      `CRM: ${crm}`,
      `Lead source: ${leadSource}`,
      '',
      'Requested workflow:',
      workflow,
      '',
      'Source: demo.leadstackops.com'
    ].join('\n');

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_web_page_preview: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram sendMessage failed (${response.status}): ${errorText}`);
    }
  }
};
