'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import { supabase } from '@/lib/supabase';

type SheetRow = Record<string, string | number | boolean | null>;

export default function ImportExcelPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<SheetRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<SheetRow[]>([]);
  const [targetTable, setTargetTable] = useState('expenses');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage('Parsing Excel file...');
    setPreview([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as SheetRow[];

        setParsedData(data);
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
          setPreview(data.slice(0, 5));
        }
        setMessage(`✅ Found ${data.length} rows in sheet "${wsname}". Review below and click Import.`);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setMessage('❌ Error parsing file. Please make sure it is a valid .xlsx file.');
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    setLoading(true);
    setMessage('Importing to Supabase...');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMessage('❌ Not logged in.'); setLoading(false); return; }

    const { error } = await supabase.from(targetTable).insert(parsedData as object[]);

    if (error) {
      setMessage(`❌ Import failed: ${error.message}`);
    } else {
      setMessage(`🎉 Successfully imported ${parsedData.length} records into "${targetTable}"!`);
      setPreview([]);
      setParsedData([]);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Import Data from Onsite Teams</h1>

      <Card glass>
        <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          Export your data from the old Onsite Teams app as Excel (.xlsx), then upload it here. We will parse and import it directly into your new database.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontWeight: 600, fontSize: '0.875rem' }}>Import into Table</label>
            <select className="input-field" style={{ maxWidth: '300px' }} value={targetTable} onChange={e => setTargetTable(e.target.value)}>
              <option value="expenses">Expenses (Petty Cash)</option>
              <option value="materials">Materials (Inventory)</option>
              <option value="dpr">Daily Progress Reports</option>
              <option value="projects">Projects</option>
            </select>
          </div>

          <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '12px', textAlign: 'center', backgroundColor: 'rgba(79,70,229,0.03)' }}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ display: 'none' }} id="excel-upload" />
            <label htmlFor="excel-upload" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Click to select your Excel file</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Supports .xlsx and .xls files</p>
            </label>
          </div>

          {message && (
            <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'var(--background)', fontWeight: 500 }}>
              {message}
            </div>
          )}

          {preview.length > 0 && (
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Preview (first 5 rows)</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--background)', borderBottom: '2px solid var(--border)' }}>
                      {headers.map(h => <th key={h} style={{ padding: '0.5rem 0.75rem', textAlign: 'left' }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        {headers.map(h => <td key={h} style={{ padding: '0.5rem 0.75rem' }}>{String(row[h] ?? '')}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <Button variant="primary" onClick={handleImport} disabled={loading}>
                  {loading ? 'Importing...' : `Import ${parsedData.length} rows into "${targetTable}"`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
