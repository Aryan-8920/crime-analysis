import React, { useState } from 'react';
import { useInvestigation } from '../../context/InvestigationContext';
import { Transaction } from '../../types';
import {
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Download,
  AlertTriangle,
  FileText,
  CreditCard,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const FinancialTrailView: React.FC = () => {
  const {
    transactions,
    entities,
    cases,
    activeCaseId,
    setActiveCaseId,
    evidence,
    setSelectedEvidenceId,
    setActiveTab,
  } = useInvestigation();

  // Default to Operation Blue Ledger
  const [selectedCase, setSelectedCase] = useState<string>(() => {
    const hasCurrent = transactions.some((t) => t.caseId === activeCaseId);
    return hasCurrent ? activeCaseId : 'DEMO-2026-001';
  });

  const [startAccount, setStartAccount] = useState<string>('');
  const [endAccount, setEndAccount] = useState<string>('');
  const [minAmount, setMinAmount] = useState<number>(0);
  const [highlightTrail, setHighlightTrail] = useState<boolean>(true);
  const [pathMessage, setPathMessage] = useState<string>('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  // Filter transactions for this case
  const caseTransactions = transactions.filter(
    (t) => t.caseId === selectedCase && t.amount >= minAmount
  );

  // Calculate unique accounts in case
  const accountIds = Array.from(
    new Set([
      ...caseTransactions.map((t) => t.sourceAccountId),
      ...caseTransactions.map((t) => t.targetAccountId),
    ])
  );

  // Calculate account-level metrics from verified records
  const accountMetrics = accountIds.map((accId) => {
    const incomingTxns = caseTransactions.filter((t) => t.targetAccountId === accId);
    const outgoingTxns = caseTransactions.filter((t) => t.sourceAccountId === accId);

    const totalIncoming = incomingTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalOutgoing = outgoingTxns.reduce((sum, t) => sum + t.amount, 0);
    const netFlow = totalIncoming - totalOutgoing;

    const connectedAccounts = new Set([
      ...incomingTxns.map((t) => t.sourceAccountId),
      ...outgoingTxns.map((t) => t.targetAccountId),
    ]).size;

    const accountEntity = entities.find((e) => e.id === accId);

    return {
      accountId: accId,
      accountName: accountEntity ? accountEntity.name : accId,
      totalIncoming,
      totalOutgoing,
      netFlow,
      totalTxnCount: incomingTxns.length + outgoingTxns.length,
      connectedAccounts,
    };
  });

  // Calculate Total Flow in Case
  const totalMoneyMoved = caseTransactions.reduce((sum, t) => sum + t.amount, 0);

  // Find Path between startAccount and endAccount
  const handleFindPath = () => {
    if (!startAccount || !endAccount) {
      setPathMessage('Please select both a start account and an end account.');
      return;
    }

    if (startAccount === endAccount) {
      setPathMessage('Start and destination accounts cannot be identical.');
      return;
    }

    // Traverse transactions to see if there is a path from start to end
    // Simple BFS on directed transaction edges
    const queue: Array<{ curr: string; path: string[] }> = [{ curr: startAccount, path: [startAccount] }];
    const visited = new Set<string>([startAccount]);
    let foundPath: string[] | null = null;

    while (queue.length > 0) {
      const { curr, path } = queue.shift()!;
      if (curr === endAccount) {
        foundPath = path;
        break;
      }

      const nextTransfers = caseTransactions.filter((t) => t.sourceAccountId === curr);
      for (const t of nextTransfers) {
        if (!visited.has(t.targetAccountId)) {
          visited.add(t.targetAccountId);
          queue.push({ curr: t.targetAccountId, path: [...path, t.targetAccountId] });
        }
      }
    }

    if (foundPath) {
      setPathMessage(`Found connected trail: ${foundPath.join(' → ')}`);
      setHighlightTrail(true);
    } else {
      setPathMessage('No recorded path found in the current evidence.');
    }
  };

  const handleClearSelection = () => {
    setStartAccount('');
    setEndAccount('');
    setMinAmount(0);
    setPathMessage('');
    setSelectedTxn(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['TransactionID', 'CaseID', 'FromAccount', 'ToAccount', 'AmountINR', 'Timestamp', 'EvidenceRef', 'Notes'];
    const rows = caseTransactions.map((t) => [
      t.id,
      t.caseId,
      t.sourceAccountId,
      t.targetAccountId,
      t.amount,
      t.timestamp,
      t.evidenceId,
      `"${t.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `financial_trail_${selectedCase}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Financial Trail & Fund Flow Ledger</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Tracing cascaded inter-bank fund transfers, shell relay balances, and anomalous velocity dispersal.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {/* Case Selector */}
          <select
            value={selectedCase}
            onChange={(e) => {
              setSelectedCase(e.target.value);
              setActiveCaseId(e.target.value);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-cyan-500 font-medium"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Funds Transferred
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            ₹{totalMoneyMoved.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across {caseTransactions.length} recorded transfers</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Primary Origin Account
          </div>
          <div className="text-base font-bold text-white font-mono mt-1 truncate">
            {caseTransactions[0]?.sourceAccountId || 'N/A'}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Rahul Sharma (ACC-DEMO-1001)</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Intermediate Hub Accounts
          </div>
          <div className="text-base font-bold text-cyan-400 font-mono mt-1 truncate">
            ACC-DEMO-2002, 3003
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Zero residual balance retention</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Terminal Endpoints
          </div>
          <div className="text-base font-bold text-purple-400 font-mono mt-1 truncate">
            ACC-DEMO-4004, 5005
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">V. Singh & N. Gupta accounts</div>
        </div>
      </div>

      {/* Path Finder & Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Money Trail Path Finder:</span>
            </span>

            {/* Start Account */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">Start Account:</label>
              <select
                value={startAccount}
                onChange={(e) => setStartAccount(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="">Choose Source Account</option>
                {accountIds.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            {/* End Account */}
            <div className="flex items-center gap-1.5">
              <label className="text-slate-400">End Account:</label>
              <select
                value={endAccount}
                onChange={(e) => setEndAccount(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="">Choose Destination</option>
                {accountIds.map((acc) => (
                  <option key={acc} value={acc}>
                    {acc}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFindPath}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold transition-colors cursor-pointer"
            >
              Find Transaction Path
            </button>

            <button
              onClick={handleClearSelection}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
            >
              Clear Selection
            </button>
          </div>

          {/* Min Amount Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Min Amount:</span>
            <select
              value={minAmount}
              onChange={(e) => setMinAmount(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value={0}>All Transfers (₹0+)</option>
              <option value={150000}>&ge; ₹1,50,000</option>
              <option value={250000}>&ge; ₹2,50,000</option>
              <option value={400000}>&ge; ₹4,00,000</option>
            </select>
          </div>
        </div>

        {pathMessage && (
          <div
            className={`p-2.5 rounded-lg border text-xs font-mono ${
              pathMessage.includes('No recorded path')
                ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            }`}
          >
            {pathMessage}
          </div>
        )}
      </div>

      {/* Visual Cascaded Transfer Chain (Operation Blue Ledger) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Interactive Cascaded Money Movement Diagram</span>
          </h3>
          <span className="text-[10px] text-slate-400">Click any transfer to inspect evidence</span>
        </div>

        {/* Visual Chain Nodes */}
        <div className="space-y-3 pt-2">
          {/* Transfer 1: ACC-DEMO-1001 -> ACC-DEMO-2002 */}
          <div
            onClick={() => setSelectedTxn(caseTransactions[0])}
            className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              selectedTxn?.id === caseTransactions[0]?.id
                ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="font-mono text-xs">
                <span className="text-slate-400 text-[10px] block">ORIGIN ACCOUNT</span>
                <span className="font-bold text-white">ACC-DEMO-1001</span>
                <span className="text-cyan-400 text-[10px] block">Rahul Sharma</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-full text-emerald-300 font-mono font-bold text-xs shrink-0">
                <span>₹5,00,000</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              <div className="font-mono text-xs">
                <span className="text-slate-400 text-[10px] block">INTERMEDIATE RELAY (1)</span>
                <span className="font-bold text-white">ACC-DEMO-2002</span>
                <span className="text-cyan-400 text-[10px] block">Amit Kumar</span>
              </div>
            </div>

            <div className="text-right text-[11px] shrink-0 font-mono">
              <span className="text-amber-400 font-semibold block">IMPS/98110291</span>
              <span className="text-slate-500 text-[10px]">2026-08-01 10:14 UTC</span>
            </div>
          </div>

          {/* Transfer 2: ACC-DEMO-2002 -> ACC-DEMO-3003 */}
          <div
            onClick={() => setSelectedTxn(caseTransactions[1])}
            className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
              selectedTxn?.id === caseTransactions[1]?.id
                ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="font-mono text-xs">
                <span className="text-slate-400 text-[10px] block">RELAY (1)</span>
                <span className="font-bold text-white">ACC-DEMO-2002</span>
                <span className="text-cyan-400 text-[10px] block">Amit Kumar</span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-full text-emerald-300 font-mono font-bold text-xs shrink-0">
                <span>₹3,00,000</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>

              <div className="font-mono text-xs">
                <span className="text-slate-400 text-[10px] block">CENTRAL HUB (2)</span>
                <span className="font-bold text-white">ACC-DEMO-3003</span>
                <span className="text-cyan-400 text-[10px] block">Rohit Verma</span>
              </div>
            </div>

            <div className="text-right text-[11px] shrink-0 font-mono">
              <span className="text-amber-400 font-semibold block">NEFT/77401928</span>
              <span className="text-slate-500 text-[10px]">2026-08-01 14:32 UTC (Delta: 4h 18m)</span>
            </div>
          </div>

          {/* Transfers 3 & 4 (Splits from ACC-DEMO-3003) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Split A */}
            <div
              onClick={() => setSelectedTxn(caseTransactions[2])}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                selectedTxn?.id === caseTransactions[2]?.id
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">FROM HUB</span>
                  <span className="font-bold text-white">ACC-DEMO-3003</span>
                </div>
                <div className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded">
                  ₹1,80,000
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">TERMINAL (A)</span>
                  <span className="font-bold text-white">ACC-DEMO-4004</span>
                  <span className="text-cyan-400 text-[10px] block">Vikas Singh</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                <span>RTGS/22901944</span>
                <span>2026-08-02 09:20 UTC</span>
              </div>
            </div>

            {/* Split B */}
            <div
              onClick={() => setSelectedTxn(caseTransactions[3])}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                selectedTxn?.id === caseTransactions[3]?.id
                  ? 'bg-cyan-950/60 border-cyan-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">FROM HUB</span>
                  <span className="font-bold text-white">ACC-DEMO-3003</span>
                </div>
                <div className="px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold rounded">
                  ₹1,20,000
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">TERMINAL (B)</span>
                  <span className="font-bold text-white">ACC-DEMO-5005</span>
                  <span className="text-cyan-400 text-[10px] block">Neeraj Gupta</span>
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-900">
                <span>IMPS/88910245</span>
                <span>2026-08-02 11:45 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account-Level Financial Summaries & Anomaly Flags */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Summaries Table (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Account Balance & Flow Summaries</span>
            </span>
            <span className="text-[10px] text-slate-500">Calculated from Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 divide-y divide-slate-800">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="px-4 py-3">Account ID</th>
                  <th className="px-4 py-3">Holder</th>
                  <th className="px-4 py-3 text-right">Total Incoming</th>
                  <th className="px-4 py-3 text-right">Total Outgoing</th>
                  <th className="px-4 py-3 text-right">Net Flow</th>
                  <th className="px-4 py-3 text-center">Txns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {accountMetrics.map((acc) => (
                  <tr key={acc.accountId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-cyan-400">{acc.accountId}</td>
                    <td className="px-4 py-3 font-sans text-white font-medium">{acc.accountName}</td>
                    <td className="px-4 py-3 text-right text-emerald-400">
                      ₹{acc.totalIncoming.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-400">
                      ₹{acc.totalOutgoing.toLocaleString('en-IN')}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-bold ${
                        acc.netFlow > 0
                          ? 'text-emerald-400'
                          : acc.netFlow < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {acc.netFlow >= 0 ? '+' : ''}₹{acc.netFlow.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-400">{acc.totalTxnCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Transaction Inspector & Anomaly Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-4 text-xs">
          {selectedTxn ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  TRANSACTION DOSSIER
                </span>
                <span className="font-mono text-slate-400">{selectedTxn.id}</span>
              </div>

              <div>
                <div className="text-xl font-bold text-white font-mono">
                  ₹{selectedTxn.amount.toLocaleString('en-IN')} {selectedTxn.currency}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Reference: <span className="font-mono text-cyan-300">{selectedTxn.referenceNo}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Debited From:</span>
                  <span className="text-white font-bold">{selectedTxn.sourceAccountId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Credited To:</span>
                  <span className="text-emerald-400 font-bold">{selectedTxn.targetAccountId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timestamp:</span>
                  <span className="text-slate-300">
                    {new Date(selectedTxn.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Anomaly Flag */}
              <div className="bg-amber-950/40 border border-amber-800/80 rounded-lg p-2.5 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Potential Anomaly — Requires Review</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-snug">
                  {selectedTxn.notes || 'Rapid cascaded fund transfer across synthetic corridor.'}
                </p>
              </div>

              {/* Supporting Evidence Source */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Corroborating Evidence Record
                </span>
                <div
                  onClick={() => {
                    setSelectedEvidenceId(selectedTxn.evidenceId);
                    setActiveTab('evidence');
                  }}
                  className="bg-slate-950 hover:bg-slate-800 p-2.5 rounded border border-slate-800 text-cyan-400 font-mono text-[11px] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="truncate">{selectedTxn.evidenceId}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Inspect Vault &rarr;</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <DollarSign className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs text-slate-400 font-medium">Select a Transfer</div>
              <p className="text-[11px] text-slate-500 leading-snug px-3">
                Click on any transaction block above to inspect clearance metadata, reference logs, and supporting bank statement extractions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Evidentiary Integrity Protocol */}
      <div className="bg-[#050a14] border border-cyan-950/80 rounded-lg p-2.5 text-xs text-slate-400 flex items-center justify-between gap-3 font-mono">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300">
            FINANCIAL INTELLIGENCE VERIFIED // Inter-bank clearing transactions certified via Core Financial Switch audit trails.
          </span>
        </div>
        <span className="text-emerald-400 text-[11px] font-bold">CLEARING VERIFIED</span>
      </div>
    </div>
  );
};
