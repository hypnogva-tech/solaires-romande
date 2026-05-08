/*
 * PAGE: Thank You — Page de remerciement après soumission du formulaire
 * DESIGN: Alpine Luminance — Playfair Display + Plus Jakarta Sans
 * BRAND: NexusHouse
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sun, ArrowRight, Clock, Mail, Phone } from "lucide-react";
import { useLocation } from "wouter";

export default function ThankYou() {
  const [, setLocation] = useLocation();
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    // Récupérer les données du lead depuis sessionStorage
    const data = sessionStorage.getItem("lastLeadData");
    if (data) {
      setLeadData(JSON.parse(data));
      sessionStorage.removeItem("lastLeadData");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-navy/95 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl"
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-amber to-amber/60 flex items-center justify-center shadow-2xl"
          >
            <CheckCircle2 className="w-12 h-12 text-navy" />
          </motion.div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-5xl font-bold text-white mb-3">
            Merci !
          </h1>
          <p className="text-amber font-semibold text-xl mb-2">
            Votre demande d'estimation a été reçue
          </p>
          <p className="text-white/60 text-lg">
            Nous analysons votre situation et vous recontacterons très bientôt
          </p>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/5 border border-amber/30 rounded-2xl p-8 mb-10 space-y-6 backdrop-blur-sm"
        >
          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Sous 24h (jours ouvrables)</p>
                <p className="text-white/60 text-sm">
                  Nos experts NexusHouse vous contactent pour discuter de votre projet solaire
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Mail className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Email de confirmation</p>
                <p className="text-white/60 text-sm">
                  {leadData?.email ? `Envoyé à ${leadData.email}` : "Vous recevrez un email de confirmation"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Phone className="w-5 h-5 text-amber" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1">Appel conseil</p>
                <p className="text-white/60 text-sm">
                  Préparation d'une estimation personnalisée basée sur vos besoins
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lead Summary (if available) */}
        {leadData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-6 mb-10 backdrop-blur-sm"
          >
            <p className="text-white/60 text-sm font-medium mb-4">RÉSUMÉ DE VOTRE DEMANDE</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Canton</p>
                <p className="text-white font-medium">{leadData.canton}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Type de bien</p>
                <p className="text-white font-medium">{leadData.type}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Surface du toit</p>
                <p className="text-white font-medium">{leadData.surface} m²</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Horizon</p>
                <p className="text-white font-medium">{leadData.delai}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => setLocation("/")}
            className="w-full bg-gradient-to-r from-amber to-amber/80 text-navy font-bold py-4 rounded-lg hover:from-amber/90 hover:to-amber/70 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
          >
            <Sun className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Retour à l'accueil
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setLocation("/#estimation")}
            className="w-full bg-white/10 text-white font-medium py-3 rounded-lg hover:bg-white/15 transition-all border border-white/20"
          >
            Nouvelle demande
          </button>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10 flex items-center justify-center gap-6 text-white/60 text-sm"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber" />
            <span>Installateurs certifiés</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber" />
            <span>Experts depuis 2015</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber" />
            <span>Service de qualité</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
