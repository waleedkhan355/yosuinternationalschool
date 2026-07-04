import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchool } from "@/context/SchoolContext";
import { Search, Printer, Trophy, TrendingUp, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { Result } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import toast from "react-hot-toast";

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

function PercentBar({ scored, total }: { scored: number; total: number }) {
  const pct = total > 0 ? Math.round((scored / total) * 100) : 0;
  const color = pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : pct >= 40 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-xs font-semibold w-10 text-right text-muted-foreground">{pct}%</span>
    </div>
  );
}

function ResultCard({ result }: { result: Result }) {
  const isMobile = useIsMobile();
  const totalScored = result.marks.reduce((s, m) => s + m.scored, 0);
  const totalPossible = result.marks.reduce((s, m) => s + m.total, 0);
  const overallPct = totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 8 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: isMobile ? -5 : -10 }}
      transition={{ duration: 0.35 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
      data-testid="result-card"
    >
      {/* Header */}
      <div className="bg-[hsl(152_55%_14%)] text-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-1">{result.studentName}</h2>
            <p className="text-green-200 text-sm">Roll No: <span className="font-semibold text-[hsl(43_90%_52%)]">{result.rollNumber}</span></p>
            <p className="text-green-200 text-sm">Class: {result.gradeClass} · {result.examTerm}</p>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              result.status === "Pass" ? "bg-green-500" : "bg-red-500"
            }`}>
              {result.status === "Pass"
                ? <CheckCircle2 className="w-9 h-9 text-white" />
                : <XCircle className="w-9 h-9 text-white" />
              }
            </div>
            <p className="text-white font-bold text-sm mt-1">{result.status}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-[hsl(43_90%_52%)]">{overallPct}%</p>
            <p className="text-green-200 text-xs">Overall</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalScored}</p>
            <p className="text-green-200 text-xs">Marks Earned</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{totalPossible}</p>
            <p className="text-green-200 text-xs">Total Marks</p>
          </div>
        </div>
      </div>

      {/* Subject table */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-serif font-semibold text-foreground">Subject-wise Performance</h3>
        </div>
        <div className="space-y-3">
          {result.marks.map((m, i) => {
            const pct = m.total > 0 ? Math.round((m.scored / m.total) * 100) : 0;
            return (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-[2fr_3fr_1fr] gap-3 items-center">
                <p className="text-sm font-medium text-foreground truncate">{m.subjectName}</p>
                <PercentBar scored={m.scored} total={m.total} />
                <p className="text-sm text-muted-foreground text-right whitespace-nowrap">{m.scored}/{m.total}</p>
              </div>
            );
          })}
        </div>

        {result.remarks && (
          <div className="mt-5 p-4 bg-muted rounded-xl">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Teacher's Remarks</p>
            <p className="text-foreground text-sm italic">"{result.remarks}"</p>
          </div>
        )}

        <button
          onClick={() => window.print()}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 border-2 border-primary text-primary rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          data-testid="button-print"
        >
          <Printer className="w-4 h-4" />
          Print Transcript
        </button>
      </div>
    </motion.div>
  );
}

export default function Results() {
  const { results } = useSchool();
  const [rollNumber, setRollNumber] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [examTerm, setExamTerm] = useState("");
  const [searched, setSearched] = useState(false);
  const [found, setFound] = useState<Result | null>(null);
  const [showClasses, setShowClasses] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      toast.error("Please enter your Roll Number.");
      return;
    }
    if (!gradeClass) {
      toast.error("Please select your class first.");
      setShowClasses(true);
      return;
    }
    if (!examTerm) {
      toast.error("Please select an exam term.");
      setShowTerms(true);
      return;
    }

    const match = results.find((r) =>
      r.rollNumber.toLowerCase() === rollNumber.toLowerCase().trim() &&
      r.gradeClass.toLowerCase() === gradeClass.toLowerCase() &&
      r.examTerm.toLowerCase() === examTerm.toLowerCase()
    );
    setFound(match ?? null);
    setSearched(true);
  };

  return (
    <div className="py-16 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: isMobile ? -5 : -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: isMobile ? 0.35 : 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(152_25%_90%)] mb-5">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">Result Checker</h1>
          <div className="gold-divider max-w-[100px] mx-auto" />
          <p className="text-muted-foreground mt-4 font-medium px-2">Select your Class and Exam Term, then enter your Roll Number to instantly search your marks report.</p>
        </motion.div>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: isMobile ? 8 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.05 : 0.1, duration: 0.4 }}
          onSubmit={handleSearch}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8"
        >
          <div className="space-y-4">
            {/* Class Tap Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 flex justify-between items-center">
                <span>Select Class *</span>
                {gradeClass && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    Class Selected
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowClasses(!showClasses);
                  setShowTerms(false);
                }}
                className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between bg-background transition-all hover:bg-neutral-50/50 ${
                  gradeClass ? "border-primary ring-1 ring-primary/20" : "border-input"
                }`}
              >
                <span className={gradeClass ? "text-foreground font-semibold text-base" : "text-muted-foreground text-sm"}>
                  {gradeClass || "Tap to choose Class (1st to 10th)..."}
                </span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  {showClasses ? "Close" : "Tap to Select"}
                </span>
              </button>

              <AnimatePresence>
                {showClasses && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-2 bg-muted/60 rounded-xl border border-border p-3 grid grid-cols-2 sm:grid-cols-5 gap-2"
                  >
                    {AVAILABLE_CLASSES.map((cls) => {
                      const isSel = gradeClass === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => {
                            setGradeClass(cls);
                            setShowClasses(false);
                            setSearched(false);
                          }}
                          className={`py-2 px-1 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isSel
                              ? "bg-primary text-primary-foreground scale-102"
                              : "bg-background text-foreground hover:bg-muted border border-border"
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Term Tap Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5 flex justify-between items-center">
                <span>Select Exam Term *</span>
                {examTerm && (
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                    Term Selected
                  </span>
                )}
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowTerms(!showTerms);
                  setShowClasses(false);
                }}
                className={`w-full px-4 py-3 rounded-xl border text-left flex items-center justify-between bg-background transition-all hover:bg-neutral-50/50 ${
                  examTerm ? "border-primary ring-1 ring-primary/20" : "border-input"
                }`}
              >
                <span className={examTerm ? "text-foreground font-semibold text-base" : "text-muted-foreground text-sm"}>
                  {examTerm || "Tap to choose Term..."}
                </span>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                  {showTerms ? "Close" : "Tap to Select"}
                </span>
              </button>

              <AnimatePresence>
                {showTerms && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-2 bg-muted/60 rounded-xl border border-border p-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2"
                  >
                    {AVAILABLE_TERMS.map((term) => {
                      const isSel = examTerm === term;
                      return (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setExamTerm(term);
                            setShowTerms(false);
                            setSearched(false);
                          }}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm ${
                            isSel
                              ? "bg-primary text-primary-foreground scale-102 font-bold animate-pulse"
                              : "bg-background text-foreground hover:bg-muted border border-border"
                          }`}
                        >
                          {term}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Roll Number Input */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Roll Number *</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => { setRollNumber(e.target.value); setSearched(false); }}
                placeholder="e.g. 2024-001"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors h-12 text-base font-semibold"
                data-testid="input-roll-number"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md text-base"
              data-testid="button-search"
            >
              <Search className="w-5 h-5" />
              Search Result
            </button>
          </div>
        </motion.form>

        {/* Result */}
        <AnimatePresence mode="wait">
          {searched && !found && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: isMobile ? 5 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-card border border-border rounded-2xl shadow-sm px-4"
            >
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-40" />
              <p className="font-serif text-lg text-foreground mb-1 font-bold">No result found</p>
              <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">There is no matching record for Class <strong className="text-foreground">{gradeClass}</strong>, Term <strong className="text-foreground">{examTerm}</strong> and Roll Number <strong className="text-foreground">{rollNumber}</strong>. Please verify the roll number or try entering again.</p>
            </motion.div>
          )}
          {searched && found && <ResultCard key={found.id} result={found} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
