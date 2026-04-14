import React from 'react';
import { CalendarDays, Clock3, MapPin, Building2, Phone, Mail, UserRound } from 'lucide-react';

const weeklySchedule = [
  {
    day: 'Friday',
    time: 'Before Juma Prayer',
    venue: 'Masjid Quba',
    location: 'Qader Bagh, Talani Taka, Hyd',
    note: 'Darse Quran programme place',
  },
  {
    day: 'Friday',
    time: 'After Isha Prayer',
    venue: 'Masjid E Hafsa',
    location: 'IAS Colony, Tolichowki, Hyd',
    note: 'Darse Quran programme place',
  },
  {
    day: 'Saturday',
    time: 'After Maghrib Prayer',
    venue: 'Masjid E Riyan',
    location: 'Ashbagar Colony, Kamaneddy',
    note: 'Darse Quran programme place',
  },
  {
    day: 'Sunday',
    time: '11 AM to 12 Noon',
    venue: 'Masjid E Alamgiri Darse Hadees',
    location: 'Shamshad Nagar, Hyd',
    note: 'Weekly session',
  },
  {
    day: 'Sunday',
    time: 'After Zohr Prayer',
    venue: 'Masjid Sajida Begum Prayer',
    location: '',
    note: 'Weekly session',
  },
  {
    day: 'Wednesday',
    time: 'After Zohr Prayer',
    venue: 'Masjid-E-Alamgiri',
    location: 'Ladies Special Session, Shamshad Nagar, Hyd',
    note: 'Weekly session',
  },
];

const dayOrder = ['Friday', 'Saturday', 'Sunday', 'Wednesday'];

export function WeeklySchedulePage() {
  const groupedSchedule = dayOrder.map((day) => ({
    day,
    sessions: weeklySchedule.filter((session) => session.day === day),
  }));

  return (
    <div className="pb-24 md:pb-8">
      <div className="grid gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-200/60 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(135deg,#f6fffb_0%,#ffffff_62%)] p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-sm text-emerald-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
              <CalendarDays className="h-4 w-4" />
              Weekly Live Schedule
            </span>
            <span className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5">
              Mufti Saab Sessions
            </span>
          </div>

          <div className="mt-5">
            <h1 className="text-3xl tracking-tight text-foreground md:text-4xl">Mufti Saab Weekly Programme</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Speaker / Spokesperson Details for Shaikhul Hadith Wal Tafseer Maulana Muhammad Aasim Khan Qasmi, with the
              weekly programme, center details, and Dar-ul-Kitab contact information.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                  <UserRound className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Speaker / Spokesperson Details</p>
                  <h2 className="text-lg text-foreground">Shaikhul Hadith Wal Tafseer Maulana Muhammad Aasim Khan Qasmi</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                (Khateeb Masjid e Quba, Qader Bagh)
              </p>
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
                  <Clock3 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Personal Meeting</p>
                  <h2 className="text-lg text-foreground">Held after Maghrib Prayer at Dar-ul-Kitab</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Time: 5 to 8 PM
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl tracking-tight text-foreground">Weekly Sessions</h2>
              <p className="text-sm text-muted-foreground">Strictly updated from the schedule details you provided</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {groupedSchedule.map(({ day, sessions }) => (
              <div key={day}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{day}</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-3">
                  {sessions.map((session) => (
                    <article
                      key={`${session.day}-${session.time}-${session.venue}`}
                      className="rounded-3xl border border-border bg-background/70 p-4 transition-colors hover:border-primary/25"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-primary">{session.note}</p>
                          <h3 className="mt-1 text-xl tracking-tight text-foreground">{session.venue}</h3>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          {session.day}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <div className="flex items-start gap-2">
                          <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{session.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                          <span>{session.location || 'Location not provided in the schedule text'}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl tracking-tight text-foreground">Dar-ul-Kitab (Book Center)</h3>
                <p className="text-sm text-muted-foreground">Main contact and personal meeting point</p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>8-3-840/3, N.B.T Nagar Colony, Gate No. 3, Opp. IPS School, Tolichowki, Hyderabad - 500008</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>5 to 8 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98855 82670</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>amirquasmi@gmail.com</span>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl tracking-tight text-foreground">Main Center / Contact</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              <span className="block text-base font-medium text-foreground">Jamia Safiya Arabi Al Banaat</span>
              Near Masjid e Hussaini Pillar No. 235,
              <br />
              Opp. FSI Building, Near Iraq School,
              <br />
              Rajender Nagar, P.T.I Dist., Hyderabad, T.S.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
