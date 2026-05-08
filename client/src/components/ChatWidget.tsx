/*
 * COMPONENT: ChatWidget — Widget de chat flottant intelligent
 * DESIGN: Alpine Luminance — Bleu nuit alpin / Ambre solaire
 * FONCTION: Répondre aux questions fréquentes en temps réel
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader, Phone, ArrowRight } from "lucide-react";

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const FAQ_DATABASE = [
  {
    keywords: ["subvention", "aide", "financement", "argent"],
    answer: "En Suisse romande, vous pouvez obtenir entre 20% et 30% du coût d'installation en subventions directes selon votre canton. S'y ajoutent les déductions fiscales sur l'impôt fédéral direct, valables jusqu'en 2029. Le montant exact dépend de votre canton, de la puissance installée et de votre situation fiscale.",
    followUp: "Quel est votre canton ? Vaud, Genève, Valais, Fribourg, Neuchâtel ou Jura ?"
  },
  {
    keywords: ["installation", "combien de temps", "durée", "jours"],
    answer: "Une installation résidentielle standard (6 à 15 kW) prend généralement 1 à 2 jours. Les démarches administratives (permis, raccordement réseau) prennent 4 à 8 semaines supplémentaires, que nos équipes gèrent entièrement pour vous.",
    followUp: "Vous avez d'autres questions sur le processus ?"
  },
  {
    keywords: ["toit", "adapté", "orientation", "surface"],
    answer: "La plupart des toits en Suisse romande sont adaptés. L'orientation sud ou sud-ouest est idéale, mais des installations est-ouest fonctionnent très bien. Notre expert évalue gratuitement votre potentiel solaire lors de l'appel conseil.",
    followUp: "Vous pouvez commencer l'estimation en ligne en 2 minutes."
  },
  {
    keywords: ["surplus", "production", "consommation", "vendre"],
    answer: "Le surplus est injecté dans le réseau électrique et vous êtes rémunéré par votre distributeur. En Suisse, ce mécanisme s'appelle la rétribution à prix coûtant (RPC) ou la rétribution de l'injection (RI). Nos conseillers vous expliquent les tarifs en vigueur dans votre région.",
    followUp: "Intéressé par une estimation gratuite ?"
  },
  {
    keywords: ["prix", "coût", "combien", "budget", "investissement"],
    answer: "Le coût varie selon votre situation, mais une installation de 10 kW coûte généralement entre 25'000 et 35'000 CHF avant subventions. Après les aides de l'État et les déductions fiscales, le coût net peut être réduit de 40 à 50%.",
    followUp: "Nous pouvons vous faire une estimation personnalisée."
  },
  {
    keywords: ["garantie", "maintenance", "entretien", "durée"],
    answer: "Nos panneaux sont garantis 25 ans. La garantie installation est de 10 ans. L'entretien est minimal — un nettoyage annuel suffit généralement. Nous proposons des contrats de maintenance optionnels.",
    followUp: "Vous avez d'autres questions ?"
  },
  {
    keywords: ["roi", "retour", "amortissement", "rentabilité", "économies"],
    answer: "Une installation de 10 kW produit en moyenne 1'500 CHF d'économies annuelles sur votre facture d'électricité. Avec les subventions et la fiscalité, l'amortissement se fait généralement en 5 à 7 ans.",
    followUp: "Vous voulez connaître votre ROI personnel ?"
  },
  {
    keywords: ["batterie", "stockage", "énergie", "nuit"],
    answer: "Les batteries de stockage permettent d'utiliser votre énergie solaire la nuit. Elles augmentent votre indépendance énergétique de 60 à 80%. Le coût supplémentaire est généralement amorti en 8 à 10 ans grâce aux économies d'électricité.",
    followUp: "Intéressé par une batterie de stockage ?"
  },
  {
    keywords: ["appel", "contact", "téléphone", "conseiller", "expert"],
    answer: "Vous pouvez nous appeler gratuitement au +41 800 000 000 (lun–ven 8h–18h) ou remplir le formulaire en ligne pour qu'un expert vous rappelle sous 24h.",
    followUp: "Voulez-vous que nous vous rappelions ?"
  },
  {
    keywords: ["estimation", "gratuit", "sans engagement", "formulaire"],
    answer: "Notre estimation en ligne est 100% gratuite et sans engagement. Elle prend 2 minutes et vous donne déjà une première idée de votre potentiel solaire et des subventions disponibles.",
    followUp: "Prêt à commencer l'estimation ?"
  }
];

// ─── Simple intent matching ───────────────────────────────────────────────────
function findBestMatch(userMessage: string): (typeof FAQ_DATABASE)[0] | null {
  const lowerMsg = userMessage.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const faq of FAQ_DATABASE) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (lowerMsg.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ text, isUser, isLoading }: { text: string; isUser: boolean; isLoading?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-amber text-navy font-medium rounded-br-none"
            : "bg-white/10 text-white rounded-bl-none"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Réflexion en cours...</span>
          </div>
        ) : (
          text
        )}
      </div>
    </motion.div>
  );
}

// ─── Chat Widget Component ────────────────────────────────────────────────────
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean; isLoading?: boolean }>>([
    {
      text: "Bonjour 👋 Je suis l'assistant SolairesRomandie. Avez-vous des questions sur les panneaux solaires, les subventions ou notre processus ?",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = input.trim();
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find best match in FAQ
    const match = findBestMatch(userMsg);

    if (match) {
      setMessages(prev => [
        ...prev,
        { text: match.answer, isUser: false },
        { text: match.followUp, isUser: false },
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          text: "Je n'ai pas trouvé de réponse exacte à votre question. Nos conseillers peuvent vous aider au +41 800 000 000 ou via le formulaire en ligne.",
          isUser: false,
        },
      ]);
    }

    setIsTyping(false);
  };

  const handleQuickReply = (question: string) => {
    setMessages(prev => [...prev, { text: question, isUser: true }]);
    setIsTyping(true);

    setTimeout(() => {
      const match = findBestMatch(question);
      if (match) {
        setMessages(prev => [
          ...prev,
          { text: match.answer, isUser: false },
          { text: match.followUp, isUser: false },
        ]);
      }
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Chat bubble button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#0F1F3D] border-2 border-amber text-amber shadow-2xl hover:shadow-amber/50 hover:scale-110 transition-all flex items-center justify-center group"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-amber/20 group-hover:bg-amber/30 transition-colors"
            />
            <MessageCircle className="w-6 h-6 relative z-10" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber rounded-full text-navy text-xs font-bold flex items-center justify-center">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-32px)] bg-[#0F1F3D] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0F1F3D] to-[#1a2d4d] border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-white text-lg">Assistant Solaire</h3>
                <p className="text-white/50 text-xs">Réponses instantanées 24/7</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-96 bg-[#0F1F3D]/50">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  text={msg.text}
                  isUser={msg.isUser}
                  isLoading={msg.isLoading}
                />
              ))}
              {isTyping && (
                <MessageBubble
                  text=""
                  isUser={false}
                  isLoading={true}
                />
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies (show on first message) */}
            {messages.length === 1 && !isTyping && (
              <div className="border-t border-white/10 px-4 py-3 bg-white/5 space-y-2">
                <p className="text-white/60 text-xs font-medium">Questions populaires :</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Quelles subventions ?",
                    "Combien ça coûte ?",
                    "Durée installation ?",
                    "Mon toit adapté ?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickReply(q)}
                      className="text-xs bg-white/10 hover:bg-amber/20 text-white/80 hover:text-amber px-3 py-2 rounded-lg transition-all border border-white/10 hover:border-amber/30"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="border-t border-white/10 px-4 py-3 bg-white/5 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Votre question..."
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/15 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-amber text-navy p-2 rounded-lg hover:bg-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Footer CTA */}
            <div className="border-t border-white/10 px-4 py-3 bg-gradient-to-r from-amber/10 to-transparent flex items-center justify-between">
              <span className="text-white/70 text-xs">Besoin d'aide personnalisée ?</span>
              <a
                href="tel:+41800000000"
                className="flex items-center gap-1 text-amber hover:text-amber/80 text-xs font-bold transition-colors"
              >
                <Phone className="w-3 h-3" />
                Appeler
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
