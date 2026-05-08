import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createLead } from "../db";
import { notifyOwner } from "../_core/notification";

export const leadsRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        canton: z.string().min(1),
        type: z.string().min(1),
        surface: z.number().min(1),
        budget: z.string().min(1),
        delai: z.string().min(1),
        nom: z.string().min(1),
        tel: z.string().min(1),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Save lead to database
        await createLead({
          canton: input.canton,
          type: input.type,
          surface: input.surface,
          budget: input.budget,
          delai: input.delai,
          nom: input.nom,
          tel: input.tel,
          email: input.email,
        });

        // Notify owner via Forge notification system
        await notifyOwner({
          title: `📞 Nouveau lead solaire — ${input.nom}`,
          content: `
Nouveau prospect pour NexusHouse:

👤 **Nom:** ${input.nom}
📱 **Téléphone:** ${input.tel}
📧 **Email:** ${input.email}

🏠 **Bien:** ${input.type} (${input.canton})
📐 **Surface toit:** ${input.surface} m²
💰 **Budget:** ${input.budget}
⏰ **Horizon:** ${input.delai}

À contacter sous 24h (jours ouvrables).

---
**Lien direct pour contacter:** mailto:${input.email}
          `.trim(),
        });

        // Also send to contact@fluxclients.ch
        await notifyOwner({
          title: `📧 Confirmation lead — ${input.nom}`,
          content: `
Le lead de ${input.nom} a été reçu et enregistré.

Détails:
- Email: ${input.email}
- Téléphone: ${input.tel}
- Canton: ${input.canton}
- Type: ${input.type}
- Surface: ${input.surface} m²
- Budget: ${input.budget}
- Délai: ${input.delai}

Veuillez contacter le prospect sous 24h (jours ouvrables).
          `.trim(),
        });

        return { success: true, message: "Lead créé avec succès" };
      } catch (error) {
        console.error("[Leads] Error submitting lead:", error);
        throw error;
      }
    }),
});
