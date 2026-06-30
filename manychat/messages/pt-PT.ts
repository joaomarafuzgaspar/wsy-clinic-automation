/**
 * Portuguese message templates for Manychat flows.
 * Copy into Manychat during clinic onboarding — customise clinic name and phone.
 *
 * Placeholders: {clinic_name}, {clinic_phone}, {patient_name}, {review_link}
 */

export const CLINIC_PLACEHOLDERS = {
  clinic_name: "PLACEHOLDER_Clinic_Name",
  clinic_phone: "+351PLACEHOLDER",
  review_link: "https://search.google.com/local/writereview?placeid=PLACEHOLDER_GOOGLE_PLACE_ID",
} as const;

export const messages = {
  instantLeadReply: {
    whatsapp: `Olá! 👋 Obrigado por contactar a {clinic_name}.

Recebemos a sua mensagem e responderemos em breve. Se preferir, pode ligar para {clinic_phone}.

Até já!`,
    instagram: `Olá! Obrigado pela sua mensagem à {clinic_name}. Responderemos o mais rápido possível. 📩`,
    email: `Olá,

Obrigado por contactar a {clinic_name}. Recebemos a sua mensagem e entraremos em contacto consigo em breve.

Com os melhores cumprimentos,
Equipa {clinic_name}
{clinic_phone}`,
    websiteLeadEmailOnly: `Olá {patient_name},

Obrigado pelo seu interesse na {clinic_name}. Recebemos o seu pedido pelo nosso website.

Um membro da nossa equipa entrará em contacto consigo em breve. Se tiver alguma questão urgente, ligue para {clinic_phone}.

Com os melhores cumprimentos,
Equipa {clinic_name}`,
  },

  quoteFollowUp: {
    day1: `Olá {patient_name}! 👋

Enviamos-lhe um orçamento há algum tempo. Tem alguma dúvida que possamos esclarecer?

Estamos disponíveis em {clinic_phone}.`,
    day3: `Olá {patient_name},

Queríamos saber se teve oportunidade de analisar o orçamento que enviámos. Podemos ajudar com alguma questão?

A equipa {clinic_name}`,
    day7: `Olá {patient_name},

Este é o nosso último contacto sobre o orçamento. Se ainda tiver interesse, estamos à disposição.

Caso contrário, não hesite em contactar-nos no futuro.

Equipa {clinic_name} — {clinic_phone}`,
  },

  appointmentReminders: {
    h48: `Olá {patient_name}! Lembramos que tem consulta marcada na {clinic_name} daqui a 2 dias.

Responda SIM para confirmar ou NÃO se precisar de remarcar.`,
    h24: `Olá {patient_name}! A sua consulta na {clinic_name} é amanhã.

Responda SIM para confirmar presença.`,
    h2: `Olá {patient_name}! A sua consulta na {clinic_name} é daqui a 2 horas.

Estamos à sua espera! 📍`,
  },

  reactivation: `Olá {patient_name}! Faz tempo que não nos vemos na {clinic_name}. 😊

Gostaríamos de saber como está e se precisa de algum acompanhamento dentário.

Marque a sua consulta ligando para {clinic_phone}.`,

  reviewRequest: `Olá {patient_name}! Obrigado pela sua visita à {clinic_name}. 🙏

A sua opinião é muito importante para nós. Pode deixar uma avaliação no Google?

{review_link}

Obrigado!`,
} as const;

export type MessageKey = keyof typeof messages;
