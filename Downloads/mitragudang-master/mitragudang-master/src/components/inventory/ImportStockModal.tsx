import React, { useState } from "react";
import Button from "../ui/Button";
import Alert from "../ui/Alert";
import { X, Upload, FileSpreadsheet, Check } from "lucide-react";
import * as XLSX from "xlsx";
import { itemService } from "../../services/itemService";

interface ImportStockModalProps {
  onClose: () => void;
  onImported: (log: Array<any>) => void; // import log entries
}

const ImportStockModal: React.FC<ImportStockModalProps> = ({ onClose, onImported }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = async (f: File) => {
    setError(null);
    setPreview([]);
    try {
      const data = await f.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);
      if (json.length === 0) {
        setError("Empty file");
        return;
      }
      setPreview(json.slice(0, 5) as any[]);
    } catch (e) {
      console.error(e);
      setError("Failed to parse file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.name.endsWith('.xlsx') && !f.name.endsWith('.xls') && !f.name.endsWith('.csv')) {
        setError('Please provide .xlsx, .xls or .csv');
        return;
      }
      setFile(f);
      handleFile(f);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws);

      const updates: any[] = [];
      const log: any[] = [];

      for (const row of json) {
        // expect column 'id' or 'name' and 'finalQuantity' or 'quantity'
        const finalQ = row.finalQuantity ?? row.final_quantity ?? row.quantity ?? row.final ?? null;
        if (finalQ == null) {
          // skip rows without final quantity
          continue;
        }

        const quantity = Number(finalQ);
        if (isNaN(quantity)) continue;

        // Prepare update object
        if (row.id) {
          updates.push({ id: String(row.id), quantity });
        } else if (row.name) {
          updates.push({ name: String(row.name).trim(), quantity });
        }
      }

      if (updates.length > 0) {
        const result = await itemService.bulkUpdateStock(updates);

        if (result && result.success) {
          setSuccess(true);
          // Add successful updates to log
          result.results.forEach((r: any) => {
            log.push({
              id: r.id,
              name: r.name,
              initial: r.oldQuantity,
              final: r.newQuantity,
              delta: r.newQuantity - r.oldQuantity,
              status: 'updated'
            });
          });

          // Add failed updates to log
          result.errors.forEach((e: any) => {
            log.push({
              id: e.item.id || '',
              name: e.item.name || '',
              initial: '',
              final: e.item.quantity,
              status: `error: ${e.error}`
            });
          });

          onImported(log);
          setTimeout(() => { onClose(); }, 1200);

        } else {
          setError('Import failed');
        }
      } else {
        setError('No valid data found to import');
      }

    } catch (e) {
      console.error(e);
      setError('Import failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
              Import Stock Changes (Excel/CSV)
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none"><X className="h-5 w-5" /></button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Import Complete</h3>
            </div>
          ) : (
            <>
              {error && <Alert variant="error" title="Error">{error}</Alert>}

              <div className="mb-6">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">Columns expected: id or name, and finalQuantity (or quantity)</p>
                  </div>
                  <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />
                </label>
                {file && <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-medium">{file.name}</span></p>}
              </div>

              {preview.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Preview (first rows)</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50"><tr>{Object.keys(preview[0]).map(k => <th key={k} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{k}</th>)}</tr></thead>
                      <tbody className="bg-white divide-y divide-gray-200">{preview.map((r, idx) => (<tr key={idx}>{Object.values(r).map((v, i) => (<td key={i} className="px-3 py-2 text-sm text-gray-500">{String(v)}</td>))}</tr>))}</tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={handleImport} isLoading={processing} disabled={!file}>Import Stock</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportStockModal;
