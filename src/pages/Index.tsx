import { useEffect, useRef, useState } from "react";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/9be69030-d2de-4171-ab99-791421bb9bb4/files/8bb620dc-a06a-43cc-ac96-d16d4b342ab9.jpg";

function PearlNecklace({ count = 7 }: { count?: number }) {
  return (
    <div className="pearl-necklace my-4">
      <div className="pearl-necklace-line" />
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={i === Math.floor(count / 2) ? "pearl-lg" : "pearl-ball"}
        />
      ))}
      <div className="pearl-necklace-line" />
    </div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 justify-center my-8">
      <div className="line-organic" />
      <span className="pearl-ball" />
      <div className="line-organic" />
    </div>
  );
}

function CountdownTimer() {
  const target = new Date("2026-08-30T15:00:00");

  const calc = () => {
    const now = new Date();
    const diff = Math.max(0, target.getTime() - now.getTime());
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calc);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { value: timeLeft.days, label: "дней" },
    { value: timeLeft.hours, label: "часов" },
    { value: timeLeft.minutes, label: "минут" },
    { value: timeLeft.seconds, label: "секунд" },
  ];

  return (
    <div className="flex gap-4 md:gap-10 justify-center flex-wrap">
      {units.map(({ value, label }) => (
        <div key={label} className="text-center">
          <div
            className="font-display text-5xl md:text-6xl font-light"
            style={{ color: "var(--earth)", minWidth: "64px", display: "block" }}
          >
            {String(value).padStart(2, "0")}
          </div>
          <div
            className="font-body text-xs tracking-widest uppercase mt-1"
            style={{ color: "var(--bark)", opacity: 0.6, letterSpacing: "0.18em" }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

function RSVPForm() {
  const [form, setForm] = useState({ name: "", guests: "1", message: "", attending: "yes" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://functions.poehali.dev/949dd8c5-5198-4213-8fc0-be9eed5cc820", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <PearlNecklace count={5} />
        <p className="font-display text-2xl italic mt-4" style={{ color: "var(--earth)" }}>
          Спасибо, мы вас ждём!
        </p>
        <p className="font-body text-sm mt-2" style={{ color: "var(--bark)", opacity: 0.8 }}>
          Ваш ответ получен. До встречи 30 августа!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
      <div>
        <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: "var(--bark)", opacity: 0.8 }}>
          Ваше имя
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Имя и фамилия"
          className="w-full px-4 py-3 font-body text-sm outline-none transition-all"
          style={{
            background: "rgba(240,235,224,0.7)",
            border: "1px solid var(--sand)",
            borderBottom: "2px solid var(--gold-soft)",
            color: "var(--earth)",
          }}
        />
      </div>

      <div>
        <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: "var(--bark)", opacity: 0.8 }}>
          Вы придёте?
        </label>
        <div className="flex gap-4">
          {[
            { value: "yes", label: "Буду!" },
            { value: "no", label: "Не смогу" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, attending: opt.value })}
              className="flex-1 py-3 font-body text-sm tracking-wide transition-all duration-300"
              style={{
                background: form.attending === opt.value ? "var(--earth)" : "transparent",
                color: form.attending === opt.value ? "var(--cream)" : "var(--earth)",
                border: "1px solid var(--earth)",
                opacity: form.attending === opt.value ? 1 : 0.55,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {form.attending === "yes" && (
        <div>
          <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: "var(--bark)", opacity: 0.8 }}>
            Количество гостей
          </label>
          <select
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: e.target.value })}
            className="w-full px-4 py-3 font-body text-sm outline-none"
            style={{
              background: "rgba(240,235,224,0.7)",
              border: "1px solid var(--sand)",
              borderBottom: "2px solid var(--gold-soft)",
              color: "var(--earth)",
            }}
          >
            {["1", "2", "3", "4"].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block font-body text-xs tracking-widest uppercase mb-2" style={{ color: "var(--bark)", opacity: 0.8 }}>
          Пожелание (необязательно)
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Ваши слова для нас..."
          rows={3}
          className="w-full px-4 py-3 font-body text-sm outline-none resize-none"
          style={{
            background: "rgba(240,235,224,0.7)",
            border: "1px solid var(--sand)",
            borderBottom: "2px solid var(--gold-soft)",
            color: "var(--earth)",
          }}
        />
      </div>

      {status === "error" && (
        <p className="text-xs font-body" style={{ color: "#b91c1c" }}>Что-то пошло не так. Попробуйте ещё раз.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 font-body text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-90 disabled:opacity-50"
        style={{
          background: "var(--earth)",
          color: "var(--cream)",
          letterSpacing: "0.2em",
        }}
      >
        {status === "loading" ? "Отправляем..." : "Отправить ответ"}
      </button>
    </form>
  );
}

export default function Index() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    const sections = document.querySelectorAll(".reveal");
    sections.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-6 md:gap-12 py-4 px-6"
        style={{
          background: "rgba(245,240,232,0.88)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(196,169,106,0.18)",
        }}
      >
        {[
          { label: "Когда", id: "when" },
          { label: "Где", id: "where" },
          { label: "Ответить", id: "rsvp" },
          { label: "Контакты", id: "contacts" },
        ].map(({ label, id }) => (
          <button key={id} onClick={() => scrollTo(id)} className="nav-link">
            {label}
          </button>
        ))}
      </nav>

      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ paddingTop: "60px" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center animate-fade-in"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(245,240,232,0.65) 0%, rgba(245,240,232,0.35) 45%, rgba(61,46,34,0.3) 100%)",
          }}
        />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

          <div className="animate-fade-up flex justify-center mb-2">
            <PearlNecklace count={9} />
          </div>

          <div className="animate-fade-up-delay-1">
            <div
              className="font-display text-3xl md:text-4xl font-light italic mb-0"
              style={{ color: "var(--bark)", lineHeight: 1.2, opacity: 0.85 }}
            >
              <span className="strike-through">Свадьба</span>
            </div>
            <div
              className="font-display font-semibold mt-2"
              style={{
                color: "var(--earth)",
                letterSpacing: "-0.01em",
                lineHeight: 1.0,
                fontSize: "clamp(3rem, 9vw, 6rem)",
                textShadow: "0 2px 30px rgba(245,240,232,0.5)",
              }}
            >
              Вечер<br />для друзей
            </div>
          </div>

          <div className="animate-fade-up-delay-2">
            <PearlNecklace count={5} />
          </div>

          <p
            className="animate-fade-up-delay-3 font-body text-base md:text-lg"
            style={{ color: "var(--bark)", letterSpacing: "0.08em" }}
          >
            30 августа 2026 · 15:00
          </p>
          <p
            className="animate-fade-up-delay-3 font-body text-sm mt-1"
            style={{ color: "var(--bark)", opacity: 0.7 }}
          >
            «Суши весла», г. Киров, ул. Береговая, д. 5
          </p>


        </div>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2" style={{ opacity: 0.45 }}>
          <span className="pearl-ball" />
          <div style={{ width: "1px", height: "36px", background: "var(--gold-soft)" }} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28 px-6 overflow-hidden">
        <div className="max-w-2xl mx-auto reveal">

          <div className="flex justify-center mb-10">
            <PearlNecklace count={7} />
          </div>

          <p
            className="font-display text-center italic mb-12"
            style={{ color: "var(--gold-soft)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase" }}
          >
            о вечере
          </p>

          <div className="space-y-6 text-center">
            <p
              className="font-display font-light italic"
              style={{ color: "var(--earth)", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", lineHeight: 1.55 }}
            >
              Мы решили оставить формальности в прошлом и просто собрать самых близких друзей на природе, под открытым небом.
            </p>

            <div className="flex items-center gap-4 justify-center">
              <div className="line-organic" />
              <span className="pearl-lg" />
              <div className="line-organic" />
            </div>

            <p
              className="font-display font-light italic"
              style={{ color: "var(--earth)", fontSize: "clamp(1.4rem, 3.5vw, 2rem)", lineHeight: 1.55 }}
            >
              Это будет день про любовь, честность, жемчужные блики заката и танцы до ночи.
            </p>

            <div className="flex items-center gap-4 justify-center">
              <div className="line-organic" />
              <span className="pearl-lg" />
              <div className="line-organic" />
            </div>

            <p
              className="font-display font-semibold"
              style={{ color: "var(--bark)", fontSize: "clamp(1.5rem, 4vw, 2.2rem)", lineHeight: 1.4, letterSpacing: "-0.01em" }}
            >
              Никаких формальностей —<br />
              только вы, мы и берег реки.
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <PearlNecklace count={5} />
          </div>
        </div>
      </section>

      {/* WHEN */}
      <section id="when" className="py-28 px-6" style={{ background: "rgba(221,208,184,0.14)" }}>
        <div className="max-w-2xl mx-auto text-center reveal">
          <p className="font-body text-xs uppercase mb-4" style={{ color: "var(--gold-soft)", letterSpacing: "0.25em" }}>
            Когда
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic mb-3" style={{ color: "var(--earth)" }}>
            30 августа 2026
          </h2>
          <p className="font-body text-lg mb-1" style={{ color: "var(--bark)" }}>
            Начало в <strong>15:00</strong>
          </p>
          <SectionDivider />
          <CountdownTimer />
        </div>
      </section>

      {/* WHERE */}
      <section id="where" className="py-28 px-6" style={{ background: "rgba(221,208,184,0.22)" }}>
        <div className="max-w-2xl mx-auto text-center reveal">
          <p className="font-body text-xs uppercase mb-4" style={{ color: "var(--gold-soft)", letterSpacing: "0.25em" }}>
            Где
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic mb-6" style={{ color: "var(--earth)" }}>
            «Суши весла»
          </h2>

          <PearlNecklace count={5} />

          <p className="font-body text-base mt-6" style={{ color: "var(--bark)" }}>
            г. Киров, ул. Береговая, д. 5
          </p>

          <div
            className="mt-10 relative overflow-hidden"
            style={{ height: "300px", border: "1px solid var(--sand)" }}
          >
            <iframe
              title="Карта"
              src="https://yandex.ru/map-widget/v1/?text=%D0%9A%D0%B8%D1%80%D0%BE%D0%B2%2C+%D1%83%D0%BB.+%D0%91%D0%B5%D1%80%D0%B5%D0%B3%D0%BE%D0%B2%D0%B0%D1%8F%2C+5&z=16&l=map"
              width="100%"
              height="100%"
              style={{ border: "none", filter: "sepia(25%) saturate(0.85)" }}
              allowFullScreen
            />
          </div>

          <a
            href="https://yandex.ru/maps/?text=Киров%2C+ул.+Береговая%2C+5"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-6 font-body text-xs uppercase px-8 py-3 transition-all duration-300 hover:opacity-75"
            style={{
              border: "1px solid var(--earth)",
              color: "var(--earth)",
              letterSpacing: "0.2em",
            }}
          >
            Открыть маршрут
          </a>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-28 px-6">
        <div className="max-w-2xl mx-auto reveal">
          <div className="text-center mb-12">
            <p className="font-body text-xs uppercase mb-4" style={{ color: "var(--gold-soft)", letterSpacing: "0.25em" }}>
              Ответить
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light italic mb-4" style={{ color: "var(--earth)" }}>
              Будете с нами?
            </h2>
            <PearlNecklace count={7} />
            <p className="font-body text-sm mt-4" style={{ color: "var(--bark)", opacity: 0.65 }}>
              Просим ответить до <strong style={{ opacity: 1, color: "var(--bark)" }}>1 июня 2026</strong>
            </p>
          </div>
          <RSVPForm />
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-28 px-6" style={{ background: "rgba(221,208,184,0.22)" }}>
        <div className="max-w-xl mx-auto text-center reveal">
          <p className="font-body text-xs uppercase mb-4" style={{ color: "var(--gold-soft)", letterSpacing: "0.25em" }}>
            Контакты
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic mb-6" style={{ color: "var(--earth)" }}>
            Есть вопросы?
          </h2>

          <PearlNecklace count={5} />

          <div className="mt-8 space-y-4">
            <p className="font-body text-sm" style={{ color: "var(--bark)", opacity: 0.65 }}>
              Пишите нам напрямую
            </p>
            <a
              href="https://t.me/konevaksu"
              target="_blank"
              rel="noreferrer"
              className="font-display text-2xl italic block transition-opacity hover:opacity-65"
              style={{ color: "var(--earth)" }}
            >
              @konevaksu
            </a>
            <p className="font-body text-xs uppercase tracking-widest" style={{ color: "var(--bark)", opacity: 0.45, letterSpacing: "0.18em" }}>
              Telegram
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 text-center" style={{ background: "var(--earth)" }}>
        <PearlNecklace count={9} />
        <p className="font-display text-2xl italic mt-4" style={{ color: "var(--cream)", opacity: 0.85 }}>
          До встречи 30 августа
        </p>
        <p
          className="font-body text-xs mt-3 uppercase tracking-widest"
          style={{ color: "var(--sand)", opacity: 0.45, letterSpacing: "0.2em" }}
        >
          «Суши весла» · г. Киров · 15:00
        </p>
      </footer>
    </div>
  );
}