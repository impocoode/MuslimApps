import React, { useState, useEffect } from 'react';
import { Edit3, FileText, Plus, Trash2, X } from 'lucide-react';
import { IslamicNote } from '../types';

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<IslamicNote[]>(() => {
    try {
      const saved = localStorage.getItem('muslim_app_notes');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'note-sample-1',
              title: 'Tadabbur QS. Al-Insyirah: 5-6',
              category: 'Tadabbur' as const,
              content:
                'Pengulangan kata "bersama kesulitan ada kemudahan" sebanyak dua kali menandakan bahwa satu kesulitan tidak akan pernah mengalahkan dua kemudahan. Selalu berprasangka baik pada takdir Allah.',
              createdAt: Date.now() - 86400000,
              updatedAt: Date.now() - 86400000,
            },
          ];
    } catch {
      return [];
    }
  });

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<'Tadabbur' | 'Kutipan Hadis' | 'Target & Doa' | 'Kajian'>('Tadabbur');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('muslim_app_notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const handleOpenNewNote = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Tadabbur');
    setContent('');
    setIsEditorOpen(true);
  };

  const handleEditNote = (note: IslamicNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Hapus catatan ini?')) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? { ...n, title: title.trim(), category, content: content.trim(), updatedAt: Date.now() }
            : n
        )
      );
    } else {
      const newNote: IslamicNote = {
        id: `note-${Date.now()}`,
        title: title.trim(),
        category,
        content: content.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 p-5 text-white dark:border-emerald-700/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Catatan & Jurnal Muslim
            </h1>
            <p className="mt-1 text-xs text-emerald-200">
              Dokumentasi pribadi tadabbur ayat, faedah hadis, ringkasan kajian, dan doa
            </p>
          </div>
          <button
            onClick={handleOpenNewNote}
            className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300"
          >
            <Plus className="h-4 w-4" />
            <span>Tulis Catatan</span>
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingId ? 'Edit Catatan' : 'Tulis Catatan Baru'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Judul Catatan:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Faedah Niat Ikhlas..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Kategori:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Tadabbur">Tadabbur Al-Qur'an</option>
                  <option value="Kutipan Hadis">Kutipan Hadis</option>
                  <option value="Target & Doa">Target & Doa Pribadi</option>
                  <option value="Kajian">Ringkasan Kajian Ilmiah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Isi Catatan:
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan hikmah, ayat, atau catatan ibadah Anda di sini..."
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-800">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
              Belum ada catatan tersimpan
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Klik "Tulis Catatan" untuk mulai mendokumentasikan tadabbur atau ilmu Anda.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {note.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {note.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Edit Catatan"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {note.content}
              </p>

              <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                <span>Dibuat: {new Date(note.createdAt).toLocaleDateString('id-ID')}</span>
                <span>Tersimpan di perangkat lokal</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
