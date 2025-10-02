  /**
 * Minimal token-only Web App for Sheets
 * Set Script Properties: SHEET_ID, STATIC_TOKEN
 * Deploy as Web App: Execute as Me, Anyone with the link
 */

function _props() {
  const p = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: p.getProperty('SHEET_ID') || '',
    STATIC_TOKEN: p.getProperty('STATIC_TOKEN') || ''
  };
}

function _sheet(name) {
  const { SHEET_ID } = _props();
  if (!SHEET_ID) throw new Error('Missing SHEET_ID');
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow([
      'id','created_at','source','tenant_id','inbox_id',
      'account_id','conversation_id','submitted_values_json','notes'
    ]);
  }
  return s;
}

function _json(raw) { try { return JSON.parse(raw); } catch (_) { return null; } }

function doPost(e) {
  try {
    const { STATIC_TOKEN } = _props();
    const token = (e.parameter.token || '').toString();
    if (!STATIC_TOKEN || token !== STATIC_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok:false, error:'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const body = _json(e?.postData?.contents || '{}') || {};
    const s = _sheet('Leads');
    const id = Utilities.getUuid();

    s.appendRow([
      id,
      new Date().toISOString(),
      body.source || '',
      body.tenant_id || '',
      body.inbox_id || '',
      body.account_id || '',
      body.conversation_id || '',
      JSON.stringify(body.submitted_values || []),
      ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok:true, id }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok:false, error:String(err && err.message || err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
