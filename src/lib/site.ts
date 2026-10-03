const n = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "");
export const whatsappUrl = n ? `https://wa.me/${n}` : null;
