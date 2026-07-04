import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/context/SchoolContext";
import { Plus, Trash2, Edit2, Check, X, Image, Video } from "lucide-react";
import toast from "react-hot-toast";
import { SchoolEvent } from "@/types";

const emptyForm: Omit<SchoolEvent, "id"> = {
  title: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  location: "",
  mediaType: "image",
  mediaUrl: "",
  thumbnail: "",
};

const FormFields = ({ data, onChange }: { data: Omit<SchoolEvent, "id">; onChange: (d: Omit<SchoolEvent, "id">) => void }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Event Title *</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="e.g. Science Fair 2024"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Date</label>
        <input
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">Description</label>
      <textarea
        value={data.description}
        onChange={(e) => onChange({ ...data, description: e.target.value })}
        rows={2}
        placeholder="Brief description of the event..."
        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
      />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Location</label>
        <input
          type="text"
          value={data.location}
          onChange={(e) => onChange({ ...data, location: e.target.value })}
          placeholder="e.g. School Auditorium"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Media Type</label>
        <div className="flex gap-3">
          {(["image", "video"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ ...data, mediaType: type })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                data.mediaType === type
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {type === "image" ? <Image className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {data.mediaType === "video" ? "Video URL (YouTube/Vimeo) *" : "Image URL *"}
      </label>
      <input
        type="url"
        value={data.mediaUrl}
        onChange={(e) => onChange({ ...data, mediaUrl: e.target.value })}
        placeholder={data.mediaType === "video" ? "https://youtube.com/watch?v=..." : "https://example.com/photo.jpg"}
        className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
      />
    </div>
    {data.mediaType === "video" && (
      <div>
        <label className="block text-sm font-semibold text-foreground mb-1.5">Thumbnail URL (optional)</label>
        <input
          type="url"
          value={data.thumbnail}
          onChange={(e) => onChange({ ...data, thumbnail: e.target.value })}
          placeholder="https://example.com/thumbnail.jpg"
          className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
        />
      </div>
    )}
  </div>
);

export default function AdminEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useSchool();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.mediaUrl.trim()) {
      toast.error("Title and media URL are required.");
      return;
    }
    setLoading(true);
    try {
      await addEvent(form);
      toast.success("Event added successfully!");
      setForm(emptyForm);
    } catch {
      toast.error("Failed to add event.");
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      await updateEvent(id, editForm);
      toast.success("Event updated!");
      setEditingId(null);
    } catch {
      toast.error("Failed to update event.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event permanently?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted.");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Events & Media Panel</h2>
        <p className="text-muted-foreground text-sm">Add school events with photo or video media to the public gallery.</p>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Add New Event
        </h3>
        <FormFields data={form} onChange={setForm} />
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
          data-testid="button-add-event"
        >
          <Plus className="w-4 h-4" />
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>

      {/* Events list */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">All Events ({events.length})</h3>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">No events added yet.</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {events.map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-xl p-4"
                  data-testid={`admin-event-${ev.id}`}
                >
                  {editingId === ev.id ? (
                    <div className="space-y-4">
                      <FormFields data={editForm} onChange={setEditForm} />
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdate(ev.id)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                          <Check className="w-4 h-4" /> Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={ev.thumbnail || ev.mediaUrl}
                          alt={ev.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&q=70"; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm truncate">{ev.title}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{ev.date} · {ev.location || "No location"}</p>
                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          ev.mediaType === "video" ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"
                        }`}>
                          {ev.mediaType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => { setEditingId(ev.id); setEditForm({ title: ev.title, description: ev.description, date: ev.date, location: ev.location, mediaType: ev.mediaType, mediaUrl: ev.mediaUrl, thumbnail: ev.thumbnail }); }}
                          className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ev.id)}
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
