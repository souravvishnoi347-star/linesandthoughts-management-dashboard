'use client';

import React, { useState } from 'react';
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
    <div className="p-container-padding space-y-6 flex-1 overflow-x-hidden">
      <div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-1">Import Data</h2>
        <p className="text-on-surface-variant font-body-md">Import historical data from Onsite Teams software.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <p className="text-on-surface-variant font-body-md">
            Export your data from the old Onsite Teams app as an Excel file (<span className="font-semibold">.xlsx</span>), then upload it here. We will parse and securely import it directly into your new database.
          </p>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface">Target Destination</label>
            <div className="relative max-w-sm">
              <select className="w-full appearance-none bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md rounded-lg px-4 py-3 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors cursor-pointer" value={targetTable} onChange={e => setTargetTable(e.target.value)}>
                <option value="expenses">Expenses (Petty Cash)</option>
                <option value="materials">Materials (Inventory)</option>
                <option value="dpr">Daily Progress Reports</option>
                <option value="projects">Projects / Sites</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">expand_more</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-outline-variant/50 hover:border-secondary/70 bg-surface-container-low/50 rounded-2xl p-10 text-center transition-colors cursor-pointer relative group">
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="excel-upload" />
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">upload_file</span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-on-surface text-lg">Click or drag Excel file to upload</p>
                <p className="text-on-surface-variant font-label-sm mt-1">Supports .xlsx and .xls formats</p>
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg font-label-md text-label-md flex items-center gap-3 ${message.includes('❌') ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
              <span className="material-symbols-outlined">{message.includes('❌') ? 'error' : 'check_circle'}</span>
              {message}
            </div>
          )}

          {preview.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="font-headline-md text-headline-md text-on-surface">Data Preview</h3>
              <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-bright text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                      {headers.map(h => <th key={h} className="py-3 px-5 font-medium">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="text-body-md font-body-md">
                    {preview.map((row, i) => (
                      <tr key={i} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                        {headers.map(h => <td key={h} className="py-3 px-5 text-on-surface">{String(row[h] ?? '-')}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-on-surface-variant font-label-sm italic">Showing first {preview.length} of {parsedData.length} rows.</p>
              
              <div className="mt-2 flex justify-end">
                <button 
                  onClick={handleImport} 
                  disabled={loading}
                  className="px-6 py-3 bg-secondary text-on-secondary font-label-md text-label-md rounded-lg hover:bg-secondary-fixed-dim transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[20px]">{loading ? 'sync' : 'database'}</span>
                  {loading ? 'Importing...' : `Import ${parsedData.length} Rows`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
