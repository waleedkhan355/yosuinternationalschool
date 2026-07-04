import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/context/SchoolContext";
import { Plus, Trash2, Edit2, Check, X, MinusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Result, SubjectMark } from "@/types";

const AVAILABLE_CLASSES = [
  "1st Class",
  "2nd Class",
  "3rd Class",
  "4th Class",
  "5th Class",
  "6th Class",
  "7th Class",
  "8th Class",
  "9th Class",
  "10th Class"
];

const AVAILABLE_TERMS = [
  "First Term",
  "2nd Term",
  "Annual Final Term"
];

const DEFAULT_SUBJECTS = ["Maths", "English", "Islamiyat", "Urdu", "Sciences"];
const defaultMarks: SubjectMark[] = DEFAULT_SUBJECTS.map((sub) => ({
  subjectName: sub,
  scored: 0,
  total: 100,
}));

const emptyMark: SubjectMark = { subjectName: "", scored: 0, total: 100 };
const emptyForm: Omit<Result, "id"> = {
  rollNumber: "",
  studentName: "",
  gradeClass: AVAILABLE_CLASSES[0],
  examTerm: AVAILABLE_TERMS[0],
  marks: defaultMarks,
  status: "Pass",
  remarks: "",
};

function MarksEditor({ marks, onChange }: { marks: SubjectMark[]; onChange: (m: SubjectMark[]) => void }) {
  const update = (i: number, field: keyof SubjectMark, value: string | number) => {
    const updated = marks.map((m, idx) => idx === i ? { ...m, [field]: field === "subjectName" ? value : Number(value) } : m);
    onChange(updated);
  };
  const add = () => onChange([...marks, { subjectName: "", scored: 0, total: 100 }]);
  const remove = (i: number) => onChange(marks.filter((_, idx) => idx !== i));
  const loadDefaults = () => onChange(DEFAULT_SUBJECTS.map((sub) => ({ subjectName: sub, scored: 0, total: 100 })));

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {marks.map((m, i) => (
          <div key={i} className="grid grid-cols-[1.5fr_1fr_1fr_40px] gap-2 items-center">
            <input
              type="text"
              value={m.subjectName}
              onChange={(e) => update(i, "subjectName", e.target.value)}
              placeholder="Subject name"
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
            />
            <input
              type="number"
              value={m.scored}
              min={0}
              max={m.total}
              onChange={(e) => update(i, "scored", e.target.value)}
              placeholder="Scored"
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
            />
            <input
              type="number"
              value={m.total}
              min={1}
              onChange={(e) => update(i, "total", e.target.value)}
              placeholder="Total"
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-center"
            />
            <button type="button" onClick={() => remove(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center">
              <MinusCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1.5fr_1fr_1fr_40px] gap-2 text-xs text-muted-foreground px-1 font-semibold uppercase">
        <span>Subject Name</span><span className="text-center font-bold text-primary">Obtained Marks</span><span className="text-center">Total Marks</span><span />
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 text-sm text-primary font-medium hover:underline bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Subject
        </button>
        <button
          type="button"
          onClick={loadDefaults}
          className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium hover:underline hover:text-foreground bg-muted px-2.5 py-1.5 rounded-lg border border-border transition-all"
        >
          Reset to Default Subjects
        </button>
      </div>
    </div>
  );
}

function ResultForm({
  data,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  loading,
}: {
  data: Omit<Result, "id">;
  onChange: (d: Omit<Result, "id">) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  submitLabel: string;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Roll Number *</label>
          <input
            type="text"
            value={data.rollNumber}
            onChange={(e) => onChange({ ...data, rollNumber: e.target.value })}
            placeholder="e.g. 2024-001"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Student Name *</label>
          <input
            type="text"
            value={data.studentName}
            onChange={(e) => onChange({ ...data, studentName: e.target.value })}
            placeholder="Full name"
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Class/Grade *</label>
          <select
            value={data.gradeClass}
            onChange={(e) => onChange({ ...data, gradeClass: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/                     50 focus:border-primary transition-colors"
          >
            {AVAILABLE_CLASSES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Exam Term *</label>
          <select
            value={data.examTerm}
            onChange={(e) => onChange({ ...data, examTerm: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/                     50 focus:border-primary transition-colors"
          >
            {AVAILABLE_TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Subject Marks</label>
        <MarksEditor marks={data.marks} onChange={(m) => onChange({ ...data, marks: m })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Result Status</label>
          <select
            value={data.status}
            onChange={(e) => onChange({ ...data, status: e.target.value as Result["status"] })}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          >
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1.5">Teacher's Remarks</label>
          <input
            type="text"
            value={data.remarks}
            onChange={(e) => onChange({ ...data, remarks: e.target.value })}
            placeholder="Optional comment..."
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          <Check className="w-4 h-4" />
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-6 py-3 bg-muted text-muted-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function AdminResults() {
  const { results, addResult, updateResult, deleteResult } = useSchool();
  const [form, setForm] = useState<Omit<Result, "id">>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<Result, "id">>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.rollNumber.trim() || !form.studentName.trim() || !form.gradeClass.trim() || !form.examTerm.trim()) {
      toast.error("Roll number, name, class, and term are required."); return;
    }
    if (form.marks.some((m) => !m.subjectName.trim())) {
      toast.error("All subject names must be filled in."); return;
    }
    setLoading(true);
    try {
      await addResult(form);
      toast.success(`Result added for ${form.studentName}!`);
      setForm(emptyForm);
    } catch {
      toast.error("Failed to add result.");
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      await updateResult(editingId, editForm);
      toast.success("Result updated successfully!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update result.");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete result for ${name}?`)) return;
    try {
      await deleteResult(id);
      toast.success("Result deleted.");
    } catch {
      toast.error("Failed to delete result.");
    }
  };

  const filtered = results.filter((r) =>
    r.studentName.toLowerCase().includes(search.toLowerCase()) ||
    r.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Student Result Registry</h2>
        <p className="text-muted-foreground text-sm">Add, edit, or remove student exam results. All changes sync in real-time.</p>
      </div>

      {editingId ? (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" /> Edit Result
          </h3>
          <ResultForm
            data={editForm}
            onChange={setEditForm}
            onSubmit={handleUpdate}
            onCancel={() => setEditingId(null)}
            submitLabel="Save Changes"
            loading={loading}
          />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Add New Result
          </h3>
          <ResultForm data={form} onChange={setForm} onSubmit={handleAdd} submitLabel="Add Result" loading={loading} />
        </div>
      )}

      {/* Results list */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-4">
          <h3 className="font-semibold text-foreground">All Results ({results.length})</h3>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or roll no..."
            className="px-4 py-2 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
            data-testid="input-result-search"
          />
        </div>
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">{results.length === 0 ? "No results added yet." : "No matching results found."}</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-4"
                  data-testid={`admin-result-${r.id}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${r.status === "Pass" ? "bg-green-100" : "bg-red-100"}`}>
                    <span className={`text-xs font-bold ${r.status === "Pass" ? "text-green-700" : "text-red-700"}`}>
                      {r.status === "Pass" ? "P" : "F"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{r.studentName}</p>
                    <p className="text-muted-foreground text-xs">{r.rollNumber} · {r.gradeClass} · {r.examTerm}</p>
                    <p className="text-muted-foreground text-xs">{r.marks.length} subject{r.marks.length !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(r.id);
                        setEditForm({ rollNumber: r.rollNumber, studentName: r.studentName, gradeClass: r.gradeClass, examTerm: r.examTerm, marks: r.marks, status: r.status, remarks: r.remarks });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.studentName)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
