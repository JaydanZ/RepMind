import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Bookmark, Flame, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SampleWeek } from '@/components/landing/SampleWeek'
import { SAMPLE_PROFILE } from '@/data/landingData'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

const TRACKING_FEATURES = [
  {
    icon: <Bookmark />,
    title: 'Save every program',
    body: 'Keep the programs you generate in one place instead of screenshots.'
  },
  {
    icon: <Power />,
    title: 'Set your active program',
    body: 'Pick the one you are running so your next workout is always ready.'
  },
  {
    icon: <Flame />,
    title: 'Keep a streak going',
    body: 'Log your sessions and watch your workout streak build week over week.'
  }
]

function GenerateButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="group h-12 gap-2.5 rounded-md bg-app-colors-300 px-6 text-base font-semibold text-app-colors-500 shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] transition-[transform,background-color] duration-150 ease-out-strong hover:bg-[#a6f062] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-app-colors-300 focus-visible:ring-offset-2 focus-visible:ring-offset-app-colors-500 [&_svg]:size-[1.125rem]"
    >
      Generate a Program
      <ArrowRight
        aria-hidden
        className="transition-transform duration-200 ease-out-strong [@media(hover:hover)]:group-hover:translate-x-0.5"
      />
    </Button>
  )
}

function RouteComponent() {
  const navigate = useNavigate()

  const handleCTAClick = () => {
    navigate({ to: '/aiProgramFactory' })
  }

  return (
    <main className="landing mx-auto w-full max-w-7xl px-4 pb-36 pt-12 sm:px-8 min-[800px]:pb-0 min-[800px]:pt-32 lg:px-12">
      <section className="pb-10 pt-4 md:pb-14">
        <h1 className="max-w-[24ch] font-display text-[2.5rem] font-bold leading-[0.98] tracking-[-0.02em] text-neutral-50 sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
          <span className="block text-balance">Your next training week,</span>
          <span className="block whitespace-nowrap text-app-colors-300">
            built in a minute.
          </span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-neutral-400">
          Answer four quick questions. Get a full week of training with sets,
          reps and a coaching tip for every exercise.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <GenerateButton onClick={handleCTAClick} />
          <a
            href="#how-it-works"
            className="text-sm font-medium text-neutral-300 underline decoration-neutral-600 underline-offset-[6px] transition-colors duration-150 hover:text-neutral-50 hover:decoration-app-colors-300"
          >
            How it works
          </a>
        </div>
      </section>

      <SampleWeek />

      <section
        id="how-it-works"
        aria-labelledby="how-title"
        className="scroll-mt-32 pt-28 md:pt-36"
      >
        <h2
          id="how-title"
          className="max-w-[22ch] text-balance font-display text-4xl font-bold leading-[1.02] tracking-[-0.015em] text-neutral-50 md:text-5xl"
        >
          Four answers. <span className="md:block">One week of training.</span>
        </h2>
        <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-neutral-400">
          These are the answers behind the sample week above. RepMind turns
          yours into a program in under a minute.
        </p>

        <ol className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_PROFILE.map((step) => (
            <li key={step.question} className="relative pt-6">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-neutral-800"
              />
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-10 bg-app-colors-300"
              />
              <p className="text-sm text-neutral-400">{step.question}</p>
              <p className="mt-2 font-display text-2xl font-semibold text-neutral-50">
                {step.answer}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-labelledby="track-title"
        className="grid gap-12 pt-28 md:pt-36 lg:grid-cols-12 lg:gap-8"
      >
        <div className="lg:col-span-5">
          <h2
            id="track-title"
            className="max-w-[17ch] text-balance font-display text-4xl font-bold leading-[1.02] tracking-[-0.015em] text-neutral-50 md:text-5xl"
          >
            Keep the program. <span className="md:block">Show up for it.</span>
          </h2>
          <p className="mt-5 max-w-[42ch] text-lg leading-relaxed text-neutral-400">
            A free account turns a one-off program into a routine you can
            follow.
          </p>
          <Link
            to="/registerUser"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-app-colors-300 underline decoration-app-colors-300/40 underline-offset-[6px] transition-colors duration-150 hover:decoration-app-colors-300"
          >
            Create an account
          </Link>
        </div>

        <ul className="divide-y divide-neutral-800 border-y border-neutral-800 lg:col-span-6 lg:col-start-7">
          {TRACKING_FEATURES.map((feature) => (
            <li key={feature.title} className="flex gap-5 py-6">
              <span className="mt-0.5 text-app-colors-300 [&_svg]:size-5">
                {feature.icon}
              </span>
              <div>
                <h3 className="text-lg font-medium text-neutral-50">
                  {feature.title}
                </h3>
                <p className="mt-1 leading-relaxed text-neutral-400">
                  {feature.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="close-title"
        className="mt-28 border-t border-neutral-800 pb-16 pt-20 md:mt-36 md:pb-24 md:pt-28"
      >
        <h2
          id="close-title"
          className="max-w-[18ch] text-balance font-display text-4xl font-bold leading-[1.02] tracking-[-0.015em] text-neutral-50 md:text-6xl"
        >
          Your first session is a minute away.
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <GenerateButton onClick={handleCTAClick} />
          <p className="text-sm text-neutral-400">
            Free to try. No account needed.
          </p>
        </div>
      </section>

      <footer className="flex flex-col gap-2 border-t border-neutral-800 py-8 text-sm text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-medium text-app-colors-300">RepMind</span>
        <span>Reps and workouts, guided by AI intelligence.</span>
      </footer>
    </main>
  )
}
