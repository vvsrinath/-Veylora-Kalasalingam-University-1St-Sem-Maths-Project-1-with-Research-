import React from 'react';
import { MailIcon, GithubIcon, LinkedinIcon } from 'lucide-react';
import { FadeIn } from '../ui/FadeIn';

const CONTACT_LINKS = [
{ icon: MailIcon, label: 'vvsrinath0@gmail.com', href: 'mailto:vvsrinath0@gmail.com' },
{ icon: GithubIcon, label: 'github.com/vvsrinath', href: 'https://github.com/vvsrinath' },
{ icon: LinkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com/in/srinath-v-a26b372b7' }];


const BIO = [
"Veylora is developed by Srinath Vatchavari Venkateshan, a student and technology enthusiast interested in automobile engineering, mathematics, software development, data analysis, and optimization.",
"The developer\u2019s goal is to combine mathematical concepts with practical automobile applications \u2014 using differentiation and optimization techniques to understand fuel consumption and identify efficient driving speeds.",
"Future improvements include personalized vehicle modelling, environmental and road-condition analysis, driving-behaviour analysis, data visualization, and offline-first web application development.",
"Through Veylora, the developer aims to transform a classroom mathematical concept into a practical research-oriented software project that connects calculus, automobile engineering, and modern technology."];


export function DeveloperSection() {
  return (
    <section id="developer" className="bg-navy py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 rounded-3xl border border-white/10 bg-navydark/60 p-8 md:grid-cols-[280px_1fr] md:gap-12 md:p-12">
          <FadeIn>
            <div className="mx-auto w-full max-w-[280px]">
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <img
                  src="/developer.png"
                  alt="Srinath Vatchavari Venkateshan, creator and developer of Veylora"
                  width={280}
                  height={280}
                  loading="lazy"
                  className="aspect-square w-full object-cover" />
                
              </div>
              <div className="mt-4 text-center">
                <p className="text-base font-semibold text-soft">Srinath Vatchavari Venkateshan</p>
                <p className="text-sm text-accent">Creator &amp; Developer</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-muted">
              About the developer
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-soft md:text-4xl">
              Meet the developer
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-relaxed text-muted md:text-base">
              {BIO.map((paragraph) =>
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {CONTACT_LINKS.map((link) =>
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-soft transition-colors duration-150 hover:border-accent/40 hover:text-accent">
                
                  <link.icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  {link.label}
                </a>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>);

}
