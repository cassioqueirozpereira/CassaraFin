import { OFXTransaction } from '@/types';

export function parseOFX(ofxContent: string): OFXTransaction[] {
  const transactions: OFXTransaction[] = [];

  // Match all <STMTTRN> blocks (supports XML and SGML unclosed tags)
  const stmttrnRegex = /<STMTTRN>([\s\S]*?)(?:<\/STMTTRN>|(?=<STMTTRN>|<\/BANKTRANLIST>))/gi;
  let match: RegExpExecArray | null;

  while ((match = stmttrnRegex.exec(ofxContent)) !== null) {
    const block = match[1];

    const trntype = extractOFXValue(block, 'TRNTYPE');
    const dtposted = extractOFXValue(block, 'DTPOSTED');
    const trnamt = extractOFXValue(block, 'TRNAMT');
    const fitid = extractOFXValue(block, 'FITID');
    const memo = extractOFXValue(block, 'MEMO') || extractOFXValue(block, 'NAME') || 'Movimentação Bancária';

    if (dtposted && trnamt) {
      const amount = parseFloat(trnamt.replace(',', '.'));
      const date = parseOFXDate(dtposted);

      transactions.push({
        id: `ofx-${fitid || Math.random().toString(36).substring(2, 9)}`,
        fitid: fitid || `fit-${Date.now()}-${Math.random()}`,
        date,
        amount: Math.abs(amount),
        type: amount >= 0 || trntype === 'CREDIT' ? 'CREDIT' : 'DEBIT',
        memo: memo.trim(),
      });
    }
  }

  return transactions;
}

function extractOFXValue(block: string, tag: string): string {
  // Matches <TAG>value or <TAG>value</TAG>
  const regex = new RegExp(`<${tag}>\\s*([^<\\r\\n]+)`, 'i');
  const match = block.match(regex);
  return match ? match[1].trim() : '';
}

function parseOFXDate(ofxDateStr: string): string {
  // OFX Date format: YYYYMMDDHHMMSS or YYYYMMDD
  const clean = ofxDateStr.replace(/\D/g, '');
  if (clean.length >= 8) {
    const yyyy = clean.substring(0, 4);
    const mm = clean.substring(4, 6);
    const dd = clean.substring(6, 8);
    return `${yyyy}-${mm}-${dd}`;
  }
  return new Date().toISOString().split('T')[0];
}
