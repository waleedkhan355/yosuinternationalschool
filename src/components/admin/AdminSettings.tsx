import { useState, useEffect } from "react";
import { useSchool } from "@/context/SchoolContext";
import { Save, School, Phone, Mail, MapPin, BookOpen, Users, Monitor, Library } from "lucide-react";
import toast from "react-hot-toast";
import { SchoolSettings } from "@/types";

export default function AdminSettings() {
  const { settings, updateSettings } = useSchool();
  const [form, setForm] = useState<SchoolSettings>(settings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.heroTitle.trim() || !form.phone.trim()) {
      toast.error("School name and phone are required.");
      return;
    }
    setLoading(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-bold text-foreground mb-1">About & Info Settings</h2>
        <p className="text-muted-foreground text-sm">Update the school's public-facing information, contact details, and homepage content.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <School className="w-5 h-5 text-primary" /> Homepage Hero
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">School Name / Hero Title</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
                className={inputClass}
                data-testid="input-hero-title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Hero Subtitle / Slogan</label>
              <input
                type="text"
                value={form.heroSubtitle}
                onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
                className={inputClass}
                data-testid="input-hero-subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Curriculum Statement</label>
              <textarea
                value={form.curriculumStatement}
                onChange={(e) => setForm({ ...form, curriculumStatement: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                data-testid="input-curriculum"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" /> Contact Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92 XXX XXXXXXX"
                  className={inputClass}
                  data-testid="input-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="info@school.edu.pk"
                  className={inputClass}
                  data-testid="input-email"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Address
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className={`${inputClass} resize-none`}
                data-testid="input-address"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> School Stats (Homepage Counter)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: "totalStudents" as keyof SchoolSettings, label: "Total Students", icon: Users },
              { key: "totalTeachers" as keyof SchoolSettings, label: "Qualified Teachers", icon: Users },
              { key: "computerLabs" as keyof SchoolSettings, label: "Computer Labs", icon: Monitor },
              { key: "libraryBooks" as keyof SchoolSettings, label: "Library Books", icon: Library },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Icon className="w-3 h-3" /> {label}
                </label>
                <input
                  type="number"
                  min={0}
                  value={form[key] as number}
                  onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                  className={inputClass}
                  data-testid={`input-${key}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60"
          data-testid="button-save-settings"
        >
          <Save className="w-5 h-5" />
          {loading ? "Saving..." : "Save All Settings"}
        </button>
      </form>
    </div>
  );
}
