import { Resend } from "resend";
import { site } from "@/lib/site";

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Geçersiz istek." }, { status: 400 });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const company = String(data.company ?? "").trim();
  const website = String(data.website ?? "").trim();
  const message = String(data.message ?? "").trim();
  const service = String(data.service ?? "").trim();
  const honeypot = String(data.company_url ?? "").trim(); // bot tuzağı

  // Bot doldurmuşsa sessizce başarı dön (gerçek mail atma).
  if (honeypot) return Response.json({ ok: true });

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, error: "Lütfen ad, e-posta ve mesaj alanlarını doldurun." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json(
      { ok: false, error: "Geçerli bir e-posta adresi girin." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY tanımlı değil.");
    return Response.json(
      { ok: false, error: "Sunucu yapılandırması eksik." },
      { status: 500 },
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.CONTACT_FROM ?? "CAWELT İletişim <onboarding@resend.dev>";

  const lines = [
    `Ad Soyad: ${name}`,
    `E-posta: ${email}`,
    company && `Şirket: ${company}`,
    website && `Web sitesi: ${website}`,
    service && `Proje türü: ${service}`,
    "",
    "Mesaj:",
    message,
  ].filter(Boolean) as string[];

  try {
    const { error } = await resend.emails.send({
      from,
      to: site.email,
      replyTo: email,
      subject: `Yeni brif — ${name}${service ? ` · ${service}` : ""}`,
      text: lines.join("\n"),
    });

    if (error) {
      console.error("Resend hatası:", error);
      return Response.json(
        { ok: false, error: "Mail gönderilemedi. Lütfen tekrar deneyin." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("İletişim formu beklenmeyen hata:", err);
    return Response.json(
      { ok: false, error: "Beklenmeyen bir hata oluştu." },
      { status: 500 },
    );
  }
}
