/*
 * PAGE: Home — Landing page de conversion panneaux solaires
 * DESIGN: Alpine Luminance — Playfair Display + Plus Jakarta Sans
 * PALETTE: Blanc glacier / Bleu nuit alpin / Ambre solaire
 * BRAND: NexusHouse
 * GOAL: Maximiser les prises de rendez-vous
 */

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import ChatWidget from "@/components/ChatWidget";
import { trpc } from "@/lib/trpc";
import {
  Sun, Shield, TrendingUp, CheckCircle2, Star,
  ArrowRight, ChevronDown, MapPin, Clock, Award, Zap,
  Home as HomeIcon, Users, ChevronRight, X, Zap as ZapIcon
} from "lucide-react";

// ─── Hero Image ───────────────────────────────────────────────────────────────
const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663640702227/bc8Ni9wNthQgn6nbyC5J8a/hero-solar-alpine-4VFES88DkMxLcLwF9Pg6ba.webp";
const TEAM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663640702227/bc8Ni9wNthQgn6nbyC5J8a/solar-installation-team-ne5DtJsyVjijirWSCExYS4.webp";
const HOME_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663640702227/bc8Ni9wNthQgn6nbyC5J8a/swiss-home-solar-NP4HYh48gUCqo8theZCFyo.webp";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("fr-CH")}{suffix}
    </span>
  );
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────────
function RevealSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Multi-step Form ──────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Votre bien" },
  { id: 2, label: "Votre projet" },
  { id: 3, label: "Vos coordonnées" },
];

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    canton: "", type: "", surface: "", budget: "", delai: "",
    nom: "", tel: "", email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));
  const submitLeadMutation = trpc.leads.submit.useMutation();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitLeadMutation.mutateAsync({
        canton: form.canton,
        type: form.type,
        surface: parseInt(form.surface),
        budget: form.budget,
        delai: form.delai,
        nom: form.nom,
        tel: form.tel,
        email: form.email,
      });
      sessionStorage.setItem("lastLeadData", JSON.stringify(form));
      setLocation("/merci");
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-6"
      >
        <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-amber" />
        </div>
        <h3 className="font-display text-3xl font-bold text-white mb-2">
          Merci !
        </h3>
        <p className="text-amber font-semibold text-lg mb-6">
          Votre demande d'estimation a été reçue
        </p>
        <div className="bg-white/5 border border-amber/30 rounded-lg p-6 mb-6 text-left space-y-3">
          <p className="text-white/80 leading-relaxed">
            Nos experts NexusHouse vont analyser votre situation et vous recontacteront <strong className="text-amber">sous 24h (jours ouvrables)</strong> pour discuter de votre projet solaire.
          </p>
          <p className="text-white/60 text-sm">
            📧 Vous recevrez un email de confirmation à l'adresse fournie.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 bg-amber text-navy font-bold px-6 py-3 rounded-lg hover:bg-amber/90 transition-colors btn-shine"
        >
          <Sun className="w-4 h-4" />
          Nouvelle demande
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8 px-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step > s.id ? "bg-amber text-navy" :
                step === s.id ? "bg-amber text-navy ring-4 ring-amber/30" :
                "bg-white/10 text-white/40"
              }`}>
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-xs mt-1 font-medium transition-colors ${step >= s.id ? "text-amber" : "text-white/30"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 mb-5 rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full bg-amber transition-all duration-500"
                  style={{ width: step > s.id ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Canton</label>
                <select
                  value={form.canton}
                  onChange={e => update("canton", e.target.value)}
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:bg-white/15 appearance-none"
                >
                  <option value="" className="bg-[#0F1F3D] text-white">Choisir votre canton...</option>
                  {["Vaud", "Genève", "Valais", "Fribourg", "Neuchâtel", "Jura"].map(c => (
                    <option key={c} value={c} className="bg-[#0F1F3D] text-white">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Type de bien</label>
                <select
                  value={form.type}
                  onChange={e => update("type", e.target.value)}
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:bg-white/15 appearance-none"
                >
                  <option value="" className="bg-[#0F1F3D] text-white">Sélectionner...</option>
                  {["Maison individuelle", "Villa", "Chalet", "PPE"].map(t => (
                    <option key={t} value={t} className="bg-[#0F1F3D] text-white">{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Surface du toit (m²)</label>
                <input
                  type="number"
                  value={form.surface}
                  onChange={e => update("surface", e.target.value)}
                  placeholder="Ex: 60"
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  console.log('Step 1 - Vérification:', { canton: form.canton, type: form.type, surface: form.surface });
                  if (form.canton && form.type && form.surface) {
                    console.log('Passage à l\'étape 2');
                    setStep(2);
                  } else {
                    console.log('Champs manquants');
                  }
                }}
                className="w-full bg-amber text-navy font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-amber/90 transition-all btn-shine mt-2"
              >
                Continuer <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Budget estimé</label>
                <select
                  value={form.budget}
                  onChange={e => update("budget", e.target.value)}
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:bg-white/15 appearance-none"
                >
                  <option value="" className="bg-[#0F1F3D] text-white">Sélectionner...</option>
                  <option value="lt20k" className="bg-[#0F1F3D] text-white">Moins de 20 000 CHF</option>
                  <option value="20-40k" className="bg-[#0F1F3D] text-white">20 000 – 40 000 CHF</option>
                  <option value="gt40k" className="bg-[#0F1F3D] text-white">Plus de 40 000 CHF</option>
                </select>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Horizon du projet</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Au plus vite", "3-6 mois", "6-12 mois"].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update("delai", d)}
                      className={`py-3 rounded-lg text-sm font-medium border transition-all ${
                        form.delai === d
                          ? "bg-amber text-navy border-amber"
                          : "bg-white/10 text-white/70 border-white/20 hover:bg-white/15"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 text-white font-medium py-3.5 rounded-lg hover:bg-white/15 transition-all"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={() => { if (form.budget && form.delai) setStep(3); }}
                  className="flex-1 bg-amber text-navy font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-amber/90 transition-all btn-shine"
                >
                  Continuer <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Prénom et nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={e => update("nom", e.target.value)}
                  placeholder="Jean Dupont"
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  value={form.tel}
                  onChange={e => update("tel", e.target.value)}
                  placeholder="+41 79 000 00 00"
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="jean@exemple.ch"
                  required
                  className="solar-input w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3"
                />
              </div>
              <p className="text-white/40 text-xs">
                Données utilisées uniquement pour votre estimation. Conformité LPD Suisse.
              </p>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white/10 text-white font-medium py-3.5 rounded-lg hover:bg-white/15 transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber text-navy font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-amber/90 disabled:opacity-50 transition-all btn-shine pulse-amber"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4" />
                      Obtenir mon estimation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, location, text, detail, stars = 5 }: {
  name: string; location: string; text: string; detail: string; stars?: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800 text-sm">{name}</p>
          <p className="text-slate-400 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{detail}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Canton Subsidy Bar ───────────────────────────────────────────────────────
function SubsidyBar({ canton, percent }: { canton: string; percent: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-medium text-white text-sm">{canton}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────
function StickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="pointer-events-auto flex items-center gap-3 bg-[#0F1F3D] text-white px-6 py-4 rounded-2xl shadow-2xl border border-amber/30 hover:border-amber/60 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-amber flex items-center justify-center pulse-amber">
              <Sun className="w-5 h-5 text-navy" />
            </div>
            <div>
              <p className="text-xs text-white/60 font-medium">Demander une estimation</p>
              <p className="font-bold text-amber">Gratuit et sans engagement</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber/60 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-glacier font-body overflow-x-hidden">
      <ChatWidget />
      <StickyCTA />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0F1F3D]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
              <Sun className="w-5 h-5 text-navy" />
            </div>
            <span className="font-display font-bold text-white text-lg">Nexus<span className="text-amber">House</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#avantages" className="hover:text-amber transition-colors">Avantages</a>
            <a href="#subventions" className="hover:text-amber transition-colors">Subventions</a>
            <a href="#temoignages" className="hover:text-amber transition-colors">Témoignages</a>
          </div>
          <button
            onClick={scrollToForm}
            className="bg-amber text-navy font-bold text-sm px-4 py-2 rounded-lg hover:bg-amber/90 transition-all btn-shine"
          >
            Estimation gratuite
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Maison suisse avec panneaux solaires"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1F3D]/90 via-[#0F1F3D]/70 to-[#0F1F3D]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F3D]/60 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-amber/20 border border-amber/40 text-amber text-sm font-semibold px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-4 h-4" />
              Subventions disponibles — Places limitées
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Réduisez votre facture
              <span className="block text-amber italic">jusqu'à 70%</span>
              avec le solaire
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/80 text-lg leading-relaxed mb-8 max-w-lg"
            >
              Les propriétaires de Suisse romande bénéficient de subventions cantonales et de déductions fiscales jusqu'en 2029. Obtenez votre estimation gratuite en 2 minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <button
                onClick={scrollToForm}
                className="flex items-center justify-center gap-2 bg-amber text-navy font-bold text-lg px-8 py-4 rounded-xl hover:bg-amber/90 transition-all btn-shine shadow-lg shadow-amber/30"
              >
                <Sun className="w-5 h-5" />
                Vérifier mon éligibilité
              </button>
              <a
                href="#formulaire"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                <ArrowRight className="w-5 h-5" />
                En savoir plus
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: Shield, text: "Installateurs certifiés" },
                { icon: Award, text: "Certifiés et reconnus" },
                { icon: Clock, text: "Réponse sous 24h" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-white/70 text-sm">
                  <Icon className="w-4 h-4 text-amber" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            id="formulaire"
            className="bg-[#0F1F3D]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <div className="text-center mb-6">
              <h2 className="font-display text-2xl font-bold text-white mb-1">
                Estimation gratuite
              </h2>
              <p className="text-white/60 text-sm">2 minutes · Sans engagement · 100% gratuit</p>
            </div>
            <MultiStepForm />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-amber py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: 107, suffix: "", label: "Estimations demandées" },
              { value: 24, suffix: "h", label: "Réponse (jours ouvrables)" },
              { value: 1.8, suffix: " GW", label: "Puissance installée 2024" },
              { value: 11, suffix: "%", label: "Couverture électrique CH" },
            ].map(({ value, suffix, label }) => (
              <div key={label}>
                <div className="font-display text-3xl sm:text-4xl font-bold text-navy">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-navy/70 text-sm font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section id="avantages" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-16">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Pourquoi passer au solaire</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mt-3 mb-4">
              Un investissement qui<br />
              <span className="italic text-amber">rapporte dès la 1ère année</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              Avec les aides de l'État et la déduction fiscale, votre installation solaire devient l'un des placements les plus rentables de Suisse romande.
            </p>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ZapIcon,
                title: "Subventions cantonales",
                desc: "Les cantons romands financent une partie significative de votre installation. Chaque canton a son programme d'aide.",
                highlight: "Jusqu'à 30% du coût",
              },
              {
                icon: TrendingUp,
                title: "Déductions fiscales 2029",
                desc: "Votre investissement est déductible de l'impôt fédéral direct. Réduisez considérablement le coût net de votre projet.",
                highlight: "Valable jusqu'en 2029",
              },
              {
                icon: Sun,
                title: "Économies immédiates",
                desc: "Réduisez votre facture d'électricité dès le premier jour. Les économies s'accumulent année après année.",
                highlight: "Amortissement en 6-7 ans",
              },
              {
                icon: HomeIcon,
                title: "Valorisation immobilière",
                desc: "Un bien équipé de panneaux solaires se vend en moyenne plus cher. C'est un atout lors d'une revente.",
                highlight: "Plus-value immobilière",
              },
              {
                icon: Shield,
                title: "Indépendance énergétique",
                desc: "Protégez-vous des hausses de prix de l'électricité. Produisez votre propre énergie et revendez le surplus.",
                highlight: "Autonomie énergétique",
              },
              {
                icon: Award,
                title: "Installateurs certifiés",
                desc: "Nos partenaires sont certifiés et reconnus. Installation professionnelle et service après-vente de qualité.",
                highlight: "Réseau de 40+ installateurs",
              },
            ].map(({ icon: Icon, title, desc, highlight }, i) => (
              <RevealSection key={title} delay={i * 0.08}>
                <div className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-4 group-hover:bg-amber/20 transition-colors">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-lg mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3">{desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {highlight}
                  </span>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-16">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Processus simple</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mt-3">
              De la demande à l'installation
            </h2>
          </RevealSection>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {[
              { step: "01", title: "Estimation en ligne", desc: "Remplissez le formulaire en 2 minutes. Gratuit et sans engagement.", icon: Sun },
              { step: "02", title: "Appel conseil", desc: "Un expert vous rappelle sous 24h (jours ouvrables) pour analyser votre situation.", icon: Clock },
              { step: "03", title: "Devis personnalisé", desc: "Recevez une offre détaillée avec calcul des subventions et ROI.", icon: TrendingUp },
              { step: "04", title: "Installation", desc: "Nos équipes certifiées installent votre système. Mise en service rapide.", icon: Zap },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <RevealSection key={step} delay={i * 0.12}>
                <div className="relative text-center">
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-amber-300 to-amber-100 z-0" />
                  )}
                  <div className="relative z-10 w-16 h-16 rounded-2xl bg-[#0F1F3D] flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="w-7 h-7 text-amber" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber text-navy text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-slate-800 text-lg mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBVENTIONS ── */}
      <section id="subventions" className="py-24 bg-[#0F1F3D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-amber blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-400 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <RevealSection>
                <span className="text-amber font-semibold text-sm uppercase tracking-widest">Subventions cantonales 2026</span>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mt-3 mb-6">
                  Votre canton finance<br />
                  <span className="italic text-amber">votre transition</span>
                </h2>
                <p className="text-white/70 leading-relaxed mb-8">
                  Chaque canton romand dispose de son propre programme de soutien. Les fonds sont attribués selon les critères cantonaux. Vérifiez votre éligibilité rapidement.
                </p>
              </RevealSection>

              <RevealSection delay={0.1} className="space-y-5">
                <SubsidyBar canton="Vaud" percent={78} />
                <SubsidyBar canton="Genève" percent={65} />
                <SubsidyBar canton="Valais" percent={70} />
                <SubsidyBar canton="Fribourg" percent={55} />
                <SubsidyBar canton="Neuchâtel" percent={60} />
                <SubsidyBar canton="Jura" percent={50} />
              </RevealSection>
            </div>

            <RevealSection delay={0.2}>
              <div className="relative">
                <img
                  src={HOME_IMG}
                  alt="Maison suisse avec panneaux solaires"
                  className="rounded-2xl shadow-2xl w-full object-cover h-80 lg:h-[500px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-amber rounded-2xl p-5 shadow-xl float-badge">
                  <p className="font-display text-3xl font-bold text-navy">2.8M</p>
                  <p className="text-navy/80 text-sm font-medium">CHF de subventions</p>
                  <p className="text-navy/60 text-xs">obtenues en 2025</p>
                </div>
                <div className="absolute -top-4 -right-4 glass-card rounded-xl p-4 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-semibold">ROI moyen</p>
                      <p className="text-amber font-bold text-sm">6–7 ans</p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section id="temoignages" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-16">
            <span className="text-amber font-semibold text-sm uppercase tracking-widest">Ce que disent nos clients</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-800 mt-3 mb-4">
              Ils ont fait le bon choix
            </h2>
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-slate-500 text-sm ml-2">4.9/5 · Avis vérifiés</span>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RevealSection delay={0}>
              <TestimonialCard
                name="Marc-Antoine R."
                location="Montreux, VD"
                text="Excellente expérience du début à la fin. L'équipe a géré toutes les démarches administratives. Je suis très satisfait du résultat."
                detail="Projet réalisé en 2024"
              />
            </RevealSection>
            <RevealSection delay={0.1}>
              <TestimonialCard
                name="Sophie & Pierre M."
                location="Sierre, VS"
                text="L'équipe a répondu à toutes nos questions. Installation propre et rapide. Nous recommandons vivement NexusHouse."
                detail="Très satisfaits"
              />
            </RevealSection>
            <RevealSection delay={0.2}>
              <TestimonialCard
                name="Jean-François B."
                location="Carouge, GE"
                text="Très professionnel du premier contact à la mise en service. Le processus était clair et transparent. Merci !"
                detail="Projet clés en main"
              />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ── PHOTO + CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={TEAM_IMG}
            alt="Équipe d'installation solaire"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#0F1F3D]/80" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
              Prêt à passer au solaire ?<br />
              <span className="italic text-amber">Demandez votre estimation.</span>
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Découvrez en 2 minutes le potentiel solaire de votre bien et les subventions disponibles dans votre canton.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="flex items-center justify-center gap-2 bg-amber text-navy font-bold text-lg px-10 py-5 rounded-xl hover:bg-amber/90 transition-all btn-shine shadow-2xl shadow-amber/40"
              >
                <Sun className="w-5 h-5" />
                Obtenir mon estimation gratuite
              </button>
              <a
                href="#formulaire"
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white font-semibold text-lg px-10 py-5 rounded-xl hover:bg-white/20 transition-all border border-white/30"
              >
                <ArrowRight className="w-5 h-5" />
                Voir le formulaire
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-slate-800">Questions fréquentes</h2>
          </RevealSection>
          <div className="space-y-4">
            {[
              {
                q: "Quelles subventions puis-je obtenir en Suisse romande ?",
                a: "Selon votre canton, vous pouvez obtenir une aide financière pour votre installation. S'y ajoutent les déductions fiscales sur l'impôt fédéral direct, valables jusqu'en 2029. Le montant exact dépend de votre canton, de la puissance installée et de votre situation.",
              },
              {
                q: "Combien de temps dure le processus ?",
                a: "L'estimation en ligne prend 2 minutes. Après soumission, un expert vous contacte sous 24h (jours ouvrables) pour analyser votre situation. Les démarches administratives (permis, raccordement réseau) prennent généralement 4 à 8 semaines, que nos équipes gèrent pour vous.",
              },
              {
                q: "Mon toit est-il adapté aux panneaux solaires ?",
                a: "La plupart des toits en Suisse romande sont adaptés. L'orientation sud ou sud-ouest est idéale, mais des installations est-ouest fonctionnent très bien. Notre expert évalue gratuitement votre potentiel solaire lors de l'appel conseil.",
              },
              {
                q: "Que se passe-t-il si je produis plus que je ne consomme ?",
                a: "Le surplus est injecté dans le réseau électrique et vous êtes rémunéré par votre distributeur. En Suisse, ce mécanisme s'appelle la rétribution à prix coûtant (RPC) ou la rétribution de l'injection (RI). Nos conseillers vous expliquent les tarifs en vigueur dans votre région.",
              },
            ].map(({ q, a }, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <FAQItem question={q} answer={a} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F1F3D] py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center">
                  <Sun className="w-5 h-5 text-navy" />
                </div>
                <span className="font-display font-bold text-white text-lg">Nexus<span className="text-amber">House</span></span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Votre partenaire de confiance pour l'installation de panneaux solaires en Suisse romande.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Cantons couverts</h4>
              <div className="grid grid-cols-2 gap-1">
                {["Vaud", "Genève", "Valais", "Fribourg", "Neuchâtel", "Jura"].map(c => (
                  <span key={c} className="text-white/50 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber/60" /> {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contactez-nous</h4>
              <p className="text-white/70 text-sm leading-relaxed">
                Demandez une estimation gratuite en ligne ou contactez directement notre équipe pour plus d'informations.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              © 2026 NexusHouse — Estimation gratuite & partenaires certifiés
            </p>
            <p className="text-white/40 text-xs">
              Conforme LPD Suisse — Données utilisées uniquement pour estimation et mise en relation installateur
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-amber-500 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-5 text-slate-500 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
