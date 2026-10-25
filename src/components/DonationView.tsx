import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  FileText,
  Heart,
  QrCode,
  ShieldCheck,
  Smartphone,
  Tv,
} from 'lucide-react';
import { DonationProgram, DonationRecord } from '../types';
import { DONATION_PROGRAMS } from '../data/donationPrograms';

export const DonationView: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<DonationProgram>(DONATION_PROGRAMS[0]);
  const [customAmount, setCustomAmount] = useState<string>('50000');
  const [donorName, setDonorName] = useState<string>('');
  const [donorContact, setDonorContact] = useState<string>('');
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Success transaction modal
  const [completedTransaction, setCompletedTransaction] = useState<DonationRecord | null>(null);

  // Local history
  const [history, setHistory] = useState<DonationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_donation_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_donation_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000];

  const handleCopyAccount = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(accNumber);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const handleSimulateDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(customAmount, 10) || 50000;
    if (amountNum < 10000) {
      alert('Nominal infaq minimal Rp 10.000');
      return;
    }

    const currentBank = selectedProgram.bankAccounts[selectedBankIndex] || selectedProgram.bankAccounts[0];
    const refCode = `INFAQ-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newRecord: DonationRecord = {
      id: `don-${Date.now()}`,
      programTitle: selectedProgram.title,
      donorName: donorName.trim() || 'Hamba Allah',
      donorPhoneOrEmail: donorContact.trim() || '-',
      amount: amountNum,
      paymentMethod: `Transfer ${currentBank.bankName}`,
      status: 'Tercatat Sukses',
      timestamp: Date.now(),
      referenceCode: refCode,
    };

    setHistory((prev) => [newRecord, ...prev]);
    setCompletedTransaction(newRecord);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          <span>Infaq, Sedekah & Wakaf Transparan</span>
        </div>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">
          Donasi & Dukungan Umat
        </h1>
        <p className="mt-1 text-xs text-emerald-200">
          Penyaluran amanah langsung kepada yayasan terverifikasi dengan laporan realisasi berkala
        </p>
      </div>

      {/* Program Selector Tabs */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Pilih Program Kebaikan:
        </label>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {DONATION_PROGRAMS.map((prog) => {
            const isSelected = selectedProgram.id === prog.id;
            const progress = Math.min(100, Math.round((prog.collectedAmount / prog.targetAmount) * 100));

            return (
              <div
                key={prog.id}
                onClick={() => setSelectedProgram(prog)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                }`}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {prog.category}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {progress}%
                  </span>
                </div>

                <h3 className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {prog.title}
                </h3>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Terkumpul: {formatRupiah(prog.collectedAmount)}</span>
                  <span>{prog.donorsCount} Donatur</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Program Detail & Allocation */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-400">Lembaga Penyelenggara:</span>
            <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {selectedProgram.organizer}
            </p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
              {selectedProgram.legalNotice}
            </p>
          </div>
          <Building2 className="h-5 w-5 text-slate-400" />
        </div>

        <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {selectedProgram.description}
        </p>

        {/* Allocation breakdown */}
        <div className="mt-4 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/60">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Transparansi Alokasi Penyaluran Dana:
          </p>
          <div className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {selectedProgram.usageAllocation.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="font-mono font-semibold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Accounts Details */}
        <div className="mt-5">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Rekening Resmi Penyaluran (Pilih Bank):
          </h4>
          <div className="mt-2 space-y-2">
            {selectedProgram.bankAccounts.map((bank, idx) => {
              const isCopied = copiedBank === bank.accountNumber;
              const isSelected = selectedBankIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedBankIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-colors ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/30 dark:border-emerald-500 dark:bg-emerald-950/20'
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {bank.bankName}
                    </p>
                    <p className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {bank.accountNumber}
                    </p>
                    <p className="text-[11px] text-slate-500">a.n. {bank.accountHolder}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyAccount(bank.accountNumber);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-700 hover:bg-white dark:border-slate-700 dark:text-slate-300"
                    title="Salin Nomor Rekening"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donation Form */}
        <form onSubmit={handleSimulateDonation} className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Pilih Nominal Infaq / Sedekah:
          </label>

          {/* Quick chips */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presetAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCustomAmount(amt.toString())}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  customAmount === amt.toString()
                    ? 'bg-emerald-700 text-white dark:bg-emerald-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {formatRupiah(amt)}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <label className="text-[11px] text-slate-500">Nominal Kustom (Rp):</label>
            <input
              type="number"
              min="10000"
              step="5000"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <div>
              <label className="text-[11px] text-slate-500">Nama Donatur (Opsional):</label>
              <input
                type="text"
                placeholder="Hamba Allah"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500">No. WhatsApp / Email (Opsional):</label>
              <input
                type="text"
                placeholder="Untuk pengiriman laporan penyaluran"
                value={donorContact}
                onChange={(e) => setDonorContact(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            Aman & Transparan: Aplikasi tidak pernah meminta PIN, password m-banking, ataupun data kartu Anda.
          </p>

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-emerald-700 py-3 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Konfirmasi Transfer Infaq Sekarang
          </button>
        </form>
      </div>

      {/* App Support Section (Dukungan Aplikasi & Iklan) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <Tv className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Dukungan Operasional Aplikasi & Kebijakan Iklan
          </h3>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          Aplikasi Muslim ini disediakan secara gratis untuk seluruh umat tanpa biaya langganan. Untuk menopang biaya server API Al-Qur'an dan pemeliharaan aplikasi, kami menyediakan 2 opsi dukungan:
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Direct Support */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              1. Infaq Pengembangan Langsung
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Menyalurkan donasi sukarela langsung ke yayasan pengelola program di atas.
            </p>
          </div>

          {/* Ad Support */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              2. Dukungan Iklan Halal Non-Intrusif
            </h4>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Iklan hanya akan ditampilkan di ruang yang tidak mengganggu kekhusyukan ibadah dan membaca Al-Qur'an.
            </p>
          </div>
        </div>

        {/* Development Placeholder for Official AdMob / Web Ad Container */}
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800/20">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            [Slot Iklan Resmi: Google AdMob / Web Monetization Placeholder]
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Status: Mode Pratinjau Pengembangan (Tidak memuat iklan pihak ketiga tanpa persetujuan dan tidak menghasilkan klaim pendapatan palsu).
          </p>
        </div>
      </section>

      {/* Donation History Records */}
      {history.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Riwayat Infaq Anda ({history.length})
            </h3>
            <span className="text-[11px] text-slate-400">Tersimpan di perangkat lokal</span>
          </div>

          <div className="mt-3 space-y-2">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {record.programTitle}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Ref: {record.referenceCode} · {new Date(record.timestamp).toLocaleDateString('id-ID')}
                  </p>
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                    {record.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatRupiah(record.amount)}
                  </span>
                  <p className="text-[10px] text-slate-400">{record.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Transaction Success Modal Receipt */}
      {completedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mx-auto dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <h3 className="mt-3 text-center text-base font-bold text-slate-900 dark:text-white">
              Pencatatan Infaq Berhasil
            </h3>
            <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
              Jazakumullah Khairan Katsiran atas kebaikan dan niat ikhlas Anda
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs space-y-2 dark:bg-slate-800/70">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode Bukti Ref:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{completedTransaction.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Program:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[200px]">{completedTransaction.programTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nominal:</span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{formatRupiah(completedTransaction.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Metode:</span>
                <span className="text-slate-800 dark:text-slate-200">{completedTransaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Atas Nama:</span>
                <span className="text-slate-800 dark:text-slate-200">{completedTransaction.donorName}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedTransaction(null)}
              className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              Tutup & Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
