import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/context/SchoolContext";
import { Plus, Trash2, Edit2, Check, X, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { Notification } from "@/types";

const emptyForm = { message: "", level: "info" as Notification["level"], active: true };

export default function AdminNotices() {
  const { notifications, addNotification, updateNotification, deleteNotification } = useSchool();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) { toast.error("Notice message cannot be empty."); return; }
    setLoading(true);
    try {
      await addNotification(form);
      toast.success("Notice published successfully!");
      setForm(emptyForm);
    } catch {
      toast.error("Failed to publish notice.");
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.message.trim()) { toast.error("Notice message cannot be empty."); return; }
    try {
      await updateNotification(id, editForm);
      toast.success("Notice updated!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update notice.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this notice permanently?")) return;
    try {
      await deleteNotification(id);
      toast.success("Notice deleted.");
    } catch {
      toast.error("Failed to delete notice.");
    }
  };

  const toggleActive = async (n: Notification) => {
    try {
      await updateNotification(n.id, { active: !n.active });
      toast.success(n.active ? "Notice deactivated." : "Notice activated!");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const levelColors: Record<Notification["level"], string> = {
    info: "bg-blue-100 text-blue-700",
    urgent: "bg-red-100 text-red-700",
    holiday: "bg-green-100 text-green-700",
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Notice Desk</h2>
        <p className="text-muted-foreground text-sm">Publish, edit, or deactivate school announcements in real-time.</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Publish New Notice
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Notice Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={3}
              placeholder="Enter the announcement text..."
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              data-testid="input-notice-message"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value as Notification["level"] })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                data-testid="select-notice-level"
              >
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="holiday">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Status</label>
              <select
                value={form.active ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, active: e.target.value === "active" })}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="active">Active (Visible)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            data-testid="button-publish-notice"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Publishing..." : "Publish Notice"}
          </button>
        </div>
      </form>

      {/* Notices list */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">All Notices ({notifications.length})</h3>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No notices published yet.</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notifications.map((n) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-xl p-4"
                  data-testid={`admin-notice-${n.id}`}
                >
                  {editingId === n.id ? (
                    <div className="space-y-3">
                      <textarea
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                      <div className="flex gap-2">
                        <select
                          value={editForm.level}
                          onChange={(e) => setEditForm({ ...editForm, level: e.target.value as Notification["level"] })}
                          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none"
                        >
                          <option value="info">Info</option>
                          <option value="urgent">Urgent</option>
                          <option value="holiday">Holiday</option>
                        </select>
                        <button onClick={() => handleUpdate(n.id)} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-muted hover:bg-muted/80">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${levelColors[n.level]}`}>
                            {n.level}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${n.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                            {n.active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(n.timestamp).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <p className="text-foreground text-sm leading-relaxed">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(n)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title={n.active ? "Deactivate" : "Activate"}
                        >
                          {n.active
                            ? <ToggleRight className="w-5 h-5 text-green-500" />
                            : <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                          }
                        </button>
                        <button
                          onClick={() => { setEditingId(n.id); setEditForm({ message: n.message, level: n.level, active: n.active }); }}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
