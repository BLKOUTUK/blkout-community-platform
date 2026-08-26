/**
 * MovementSplit — the /movement page as a split stage.
 *
 * The whole page is one split: ALONE on the cool side, TOGETHER on the warm
 * side, with a gold seam between them. A single spring-smoothed `balance`
 * value (0 = all alone, 1 = all together) drives the seam, and the page's
 * eight acts move it. The close is the collapse: the seam runs to the edge,
 * the together side floods the frame, and the CTA lives in the winning column.
 *
 * Geometry lives in MovementSplit.css. This file writes one number
 * (`--ms-balance`) and lets CSS resolve clips, seams and columns from it, so
 * nothing here animates width, height, top or left.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import './MovementSplit.css';

/* ------------------------------------------------------------------ acts */

type ActDef = {
  id: string;
  /** scroll budget in viewport-heights */
  span: number;
  /** where the seam rests by the end of the act */
  rest: number;
  /** fraction of the act at which `rest` is reached (default: the end) */
  restAt?: number;
};

const ACTS: ActDef[] = [
  { id: 'hero', span: 1.8, rest: 0.5 },
  { id: 'question', span: 1.2, rest: 0.5 },
  { id: 'problem', span: 2.2, rest: 0.28 },
  { id: 'turn', span: 1.8, rest: 0.58 },
  { id: 'evidence', span: 2.4, rest: 0.66 },
  { id: 'breath', span: 0.6, rest: 0.66 },
  // the divider releases across the first half of the peak's pin
  { id: 'collapse', span: 3.2, rest: 1, restAt: 0.5 },
  { id: 'close', span: 1.4, rest: 1 },
];

/**
 * Map document progress onto the seam's rest positions. A pinned act's own
 * progress reaches 1 one viewport before its bottom edge, which is where its
 * rest value has to land.
 */
function balanceKeyframes(): { input: number[]; output: number[] } {
  const total = ACTS.reduce((sum, act) => sum + act.span, 0);
  const travel = total - 1;
  const input: number[] = [0];
  const output: number[] = [ACTS[0].rest];
  let cursor = 0;

  ACTS.forEach((act) => {
    const start = cursor;
    cursor += act.span;
    const end = Math.min(travel, Math.max(0, cursor - 1));
    const at = act.restAt === undefined ? end : start + (end - start) * act.restAt;
    const p = Math.min(1, at / travel);
    if (p > input[input.length - 1]) {
      input.push(p);
      output.push(act.rest);
    }
  });

  if (input[input.length - 1] < 1) {
    input.push(1);
    output.push(output[output.length - 1]);
  }
  return { input, output };
}

const BALANCE = balanceKeyframes();

const spanStyle = (n: number) => ({ ['--ms-span']: String(n) }) as React.CSSProperties;

/* ------------------------------------------------------------------- cues */

/**
 * `[from]`                       in, then hold
 * `[from, to]`                   in, plateau, out (ramps default to 30%)
 * `[from, to, rampIn]`           `rampIn: 0` greets: full at p = from
 * `[from, to, rampIn, rampOut]`  `rampOut: 0` holds through the end
 */
type CueWin = number[];

function cueSpec(win: CueWin, rise: number) {
  const EPS = 1e-4;
  const from = win[0];
  const to = win.length > 1 ? win[1] : undefined;
  const rampIn = win.length > 2 ? win[2] : 0.3;
  const rampOut = win.length > 3 ? win[3] : 0.3;

  const input: number[] = [from];
  const output: number[] = [rampIn === 0 ? 1 : 0];
  const push = (x: number, o: number) => {
    if (x > input[input.length - 1]) {
      input.push(x);
      output.push(o);
    }
  };

  let riseEnd: number;
  if (to === undefined) {
    riseEnd = from + Math.max(rampIn, EPS) * Math.max(1 - from, EPS);
    push(riseEnd, 1);
  } else {
    const width = Math.max(to - from, EPS);
    riseEnd = from + rampIn * width;
    push(riseEnd, 1);
    push(to - rampOut * width, 1);
    push(to, rampOut === 0 ? 1 : 0);
  }
  if (input.length < 2) {
    push(from + EPS, output[0]);
  }

  return {
    input,
    output,
    riseIn: [from, Math.max(riseEnd, from + EPS)],
    riseOut: [rampIn === 0 ? 0 : rise, 0],
  };
}

type CueProps = {
  p: MotionValue<number>;
  win: CueWin;
  reduced: boolean;
  className?: string;
  as?: 'div' | 'span';
  rise?: number;
  children: React.ReactNode;
};

const Cue: React.FC<CueProps> = ({ p, win, reduced, className, as = 'div', rise = 18, children }) => {
  const spec = cueSpec(win, rise);
  const opacity = useTransform(p, spec.input, spec.output);
  const y = useTransform(p, spec.riseIn, spec.riseOut);

  if (reduced) {
    return as === 'span' ? (
      <span className={className}>{children}</span>
    ) : (
      <div className={className}>{children}</div>
    );
  }
  return as === 'span' ? (
    <motion.span className={className} style={{ opacity, y }}>
      {children}
    </motion.span>
  ) : (
    <motion.div className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
};

/** One line of a heading, riding up from behind its own descender-safe mask. */
const KineticLine: React.FC<{
  p: MotionValue<number>;
  from: number;
  text: string;
  reduced: boolean;
}> = ({ p, from, text, reduced }) => {
  const y = useTransform(p, [from, from + 0.085], ['112%', '0%']);
  if (reduced) {
    return (
      <span className="ms-line">
        <span style={{ display: 'block' }}>{text}</span>
      </span>
    );
  }
  return (
    <span className="ms-line">
      <motion.span style={{ y, display: 'block' }}>{text}</motion.span>
    </span>
  );
};

const KineticHeading: React.FC<{
  p: MotionValue<number>;
  from: number;
  lines: string[];
  className?: string;
  reduced: boolean;
}> = ({ p, from, lines, className, reduced }) => (
  <h2 className={className}>
    {lines.map((line, i) => (
      <KineticLine key={line} p={p} from={from + i * 0.018} text={line} reduced={reduced} />
    ))}
  </h2>
);

/* ----------------------------------------------------------------- videos */

/** Muted companion clip: plays while it is on screen, pauses when it is not. */
const MutedLoopVideo: React.FC<{
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}> = ({ src, poster, width, height, label }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      aria-label={label}
      loop
      muted
      playsInline
      preload="metadata"
    />
  );
};

/* ------------------------------------------------------------- act 1 hero */

const ActHero: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section ref={ref} className="ms-act" data-ms-rest="0.5" style={spanStyle(1.8)}>
      <div className="ms-stage">
        <div className="ms-side ms-side--alone">
          <div className="ms-frame ms-frame--l50">
            <img
              className="ms-media ms-cool"
              src="/images/movement/alone-isolation.jpg"
              width={1072}
              height={1344}
              alt="A young Black man sits alone on a bench, arms folded and head down, while a crowd blurs past on either side of him."
            />
          </div>
          <div className="ms-scrim ms-scrim--column-left" />
          <div className="ms-col ms-col--alone ms-col--bottom">
            <Cue p={p} win={[0.3, 0.9]} reduced={reduced}>
              <p className="ms-body">even in spaces full of us, you can feel alone</p>
            </Cue>
          </div>
        </div>

        <div className="ms-side ms-side--together">
          <div className="ms-frame ms-frame--r50">
            <img
              className="ms-media"
              src="/images/movement/together-repair.jpg"
              width={1072}
              height={1344}
              alt="A packed room of Black men sitting and standing close together, talking and laughing."
            />
          </div>
          <div className="ms-scrim ms-scrim--column-right" />
          <div className="ms-col ms-col--together ms-col--bottom">
            <Cue p={p} win={[0.38, 0.94]} reduced={reduced}>
              <p className="ms-quiet">a plan by us, for us</p>
            </Cue>
          </div>
        </div>

        <h1 className="ms-h1">
          <span className="ms-h1__side ms-h1__side--alone">
            <Cue
              p={p}
              win={[0, 1, 0, 0.2]}
              reduced={reduced}
              as="span"
              className="ms-display ms-display--hero"
            >
              {'You are often the only one.'}
            </Cue>
          </span>{' '}
          <span className="ms-h1__side ms-h1__side--together">
            <Cue
              p={p}
              win={[0, 1, 0, 0.2]}
              reduced={reduced}
              as="span"
              className="ms-display ms-display--hero ms-gold"
            >
              {'You were never meant to be.'}
            </Cue>
          </span>
        </h1>
      </div>
    </section>
  );
};

/* --------------------------------------------------------- act 2 question */

const ANSWERS = ['0', '1–2', '3–5', 'Squad deep'];

const ActQuestion: React.FC<{
  answer: string | null;
  onAnswer: (value: string) => void;
}> = ({ answer, onAnswer }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const [passed, setPassed] = useState(false);

  useMotionValueEvent(p, 'change', (value) => {
    if (value > 0.6) setPassed(true);
  });

  const revealed = answer !== null || passed;

  return (
    <section ref={ref} className="ms-act ms-act--flow" data-ms-rest="0.5" style={spanStyle(1.2)}>
      <div className="ms-flow ms-flow--split">
        <div>
          <h2 className="ms-display ms-display--md">
            {'How many Black queer men could you call on in a crisis?'}
          </h2>
          <p className="ms-quiet">{"(Booty calls may be urgent, but they don't count.)"}</p>
          <fieldset className="ms-poll">
            <legend className="ms-sr">
              {'How many Black queer men could you call on in a crisis?'}
            </legend>
            {ANSWERS.map((option) => (
              <button
                key={option}
                type="button"
                className="ms-poll__btn"
                aria-pressed={answer === option}
                onClick={() => onAnswer(option)}
              >
                {option}
              </button>
            ))}
          </fieldset>
        </div>

        <div className={revealed ? 'ms-reveal is-on' : 'ms-reveal'}>
          <p className="ms-display ms-display--lg ms-gold">
            {'When we asked, most of us said: 1 or fewer.'}
          </p>
          <p className="ms-body">
            {"And that includes the GC: banter that's been on mute since 2019."}
          </p>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------- act 3 problem */

const ActProblem: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const appWipe = useTransform(p, [0.3, 0.47], ['inset(100% 0 0 0)', 'inset(0% 0 0 0)']);

  const appFigure = (
    <figure className="ms-figure">
      <img
        src="/images/movement/apps-distance.jpg"
        width={1072}
        height={1344}
        alt="A Black man alone on a sofa, frowning at a phone showing a grid of profile thumbnails."
      />
    </figure>
  );

  return (
    <section ref={ref} className="ms-act" data-ms-rest="0.28" style={spanStyle(2.2)}>
      <div className="ms-stage">
        <div className="ms-side ms-side--alone">
          <div className="ms-col ms-col--wide">
            <div className="ms-stack">
              <Cue p={p} win={[0, 0.22, 0, 0.3]} reduced={reduced}>
                <KineticHeading
                  p={p}
                  from={0}
                  reduced={reduced}
                  className="ms-display ms-display--xl"
                  lines={["That's not community.", "That's just proximity."]}
                />
              </Cue>

              <Cue p={p} win={[0.16, 0.36]} reduced={reduced}>
                <p className="ms-quiet">{'Funny fake names, borrowed pics, unclear motives.'}</p>
              </Cue>

              <Cue p={p} win={[0.3, 0.56]} reduced={reduced}>
                {reduced ? (
                  appFigure
                ) : (
                  <motion.div style={{ clipPath: appWipe }}>{appFigure}</motion.div>
                )}
                <h2 className="ms-display ms-display--lg">{'No face, no case, no intimacy.'}</h2>
                <p className="ms-quiet">
                  {'The apps reward sharing as little of yourself as possible: what you want, not what you need.'}
                </p>
              </Cue>

              <Cue p={p} win={[0.5, 0.76]} reduced={reduced}>
                <KineticHeading
                  p={p}
                  from={0.5}
                  reduced={reduced}
                  className="ms-display ms-display--lg"
                  lines={[
                    "Racism and patriarchy don't just harm our life chances.",
                    'They keep us from healing by cutting us off from each other.',
                  ]}
                />
              </Cue>

              <Cue p={p} win={[0.7, 1, 0.3, 0.12]} reduced={reduced}>
                <KineticHeading
                  p={p}
                  from={0.7}
                  reduced={reduced}
                  className="ms-display ms-display--lg"
                  lines={[
                    'We think we are brand new.',
                    'Black queer folk always existed. Thrived. Built community.',
                  ]}
                />
                <p className="ms-quiet">
                  {'An inconvenient truth, erased from our history to hold back our future.'}
                </p>
              </Cue>
            </div>
          </div>
        </div>

        <div className="ms-side ms-side--together">
          <div className="ms-frame ms-frame--r50">
            <img
              className="ms-media"
              src="/images/movement/together-repair.jpg"
              width={1072}
              height={1344}
              alt=""
            />
          </div>
          <p className="ms-sliver-label">still here</p>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------- act 4 turn */

const ActTurn: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // The warm side is ground here, not a reveal: present from the act's first
  // frame, lifting gently. No wipe, nothing travels sideways.
  const groundIn = useTransform(p, [0, 0.22], [0.4, 1]);

  const goldenHour = (
    <img
      className="ms-media"
      src="/images/movement/golden-hour.jpg"
      width={1072}
      height={1344}
      alt="Two Black men standing face to face in warm evening light, deep in conversation."
    />
  );

  const amen = reduced ? (
    <img
      src="/images/movement/rupaul-amen-still.jpg"
      width={462}
      height={462}
      alt="RuPaul, big blonde wig, looking straight down the camera and asking the room: can I get an amen up in here?"
    />
  ) : (
    <img
      src="/images/movement/rupaul-amen.gif"
      width={462}
      height={462}
      alt="RuPaul, big blonde wig, looking straight down the camera and asking the room: can I get an amen up in here?"
    />
  );

  return (
    <section ref={ref} className="ms-act" data-ms-rest="0.58" style={spanStyle(1.8)}>
      <div className="ms-stage">
        <div className="ms-side ms-side--alone">
          {/* What we've been told, and the culture co-signing it. Both stay put
              while the other side answers: the trail is the argument. */}
          <div className="ms-col ms-col--alone ms-col--turn-left">
            <Cue p={p} win={[0, 1, 0, 0.08]} reduced={reduced} className="ms-turn-told">
              <p className="ms-display ms-display--md">
                {"What we've been told: 'If you can't love yourself, how you gonna love somebody else?'"}
              </p>
            </Cue>
            <Cue p={p} win={[0.12, 1, 0.14, 0.09]} reduced={reduced} className="ms-turn-amen">
              <figure className="ms-amen">{amen}</figure>
            </Cue>
          </div>
        </div>

        <div className="ms-side ms-side--together">
          {reduced ? (
            <div className="ms-frame ms-frame--r58">{goldenHour}</div>
          ) : (
            <motion.div className="ms-frame ms-frame--r58" style={{ opacity: groundIn }}>
              {goldenHour}
            </motion.div>
          )}
          <div className="ms-scrim ms-scrim--column-right" />
          {/* The interruption assembles in place and accumulates: each line
              joins the ones above it, and they all release together at the
              act's end (only act 8 may hold). */}
          <div className="ms-col ms-col--together ms-col--turn-right">
            <Cue p={p} win={[0.3, 1, 0.14, 0.11]} reduced={reduced}>
              <p className="ms-quiet ms-gold" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)' }}>
                {"Hold on a minute, Ru. You've missed a step."}
              </p>
            </Cue>
            <Cue p={p} win={[0.48, 1, 0.19, 0.15]} reduced={reduced}>
              <h2 className="ms-display ms-display--lg">
                {'Loving ourselves is learned through community.'}
              </h2>
            </Cue>
            <Cue p={p} win={[0.66, 1, 0.29, 0.23]} reduced={reduced}>
              <h2 className="ms-display ms-display--xl ms-gold">
                {"We are each other's missing link."}
              </h2>
            </Cue>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------------------------------- act 5 evidence */

type PlateProps = {
  index: number;
  heading: string;
  body: string;
  linkLabel: string;
  linkHref: string;
  reduced: boolean;
  figure?: { src: string; alt: string; width: number; height: number };
};

const Plate: React.FC<PlateProps> = ({
  index,
  heading,
  body,
  linkLabel,
  linkHref,
  reduced,
  figure,
}) => {
  const inner = (
    <>
      {figure && (
        <figure className="ms-plate__figure">
          <img src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} />
        </figure>
      )}
      <div>
        <h2 className="ms-display ms-display--md">{heading}</h2>
        <p className="ms-body">{body}</p>
        <a className="ms-link" href={linkHref}>
          {linkLabel}
        </a>
      </div>
    </>
  );

  const className = figure ? 'ms-plate' : 'ms-plate ms-plate--type';

  if (reduced) return <div className={className}>{inner}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
    >
      {inner}
    </motion.div>
  );
};

const ActEvidence: React.FC<{ reduced: boolean }> = ({ reduced }) => (
  <section className="ms-act ms-act--flow" data-ms-rest="0.66" style={spanStyle(2.4)}>
    <div className="ms-side ms-side--alone" aria-hidden="true">
      <div className="ms-sticky-media">
        <img
          className="ms-media ms-cool"
          src="/images/movement/alone-isolation.jpg"
          width={1072}
          height={1344}
          alt=""
          style={{ opacity: 0.3 }}
        />
      </div>
    </div>

    <div className="ms-flow ms-flow--right">
      <div className="ms-plates">
        <Plate
          index={0}
          reduced={reduced}
          heading="Gatherings"
          body="Real rooms. Real conversations. No transaction required."
          linkLabel="See what's on"
          linkHref="https://events.blkoutuk.cloud"
          figure={{
            src: '/images/movement/gatherings.jpg',
            width: 957,
            height: 1200,
            alt: 'A crowded hall of people sitting and standing in conversation, one man leaning forward mid sentence.',
          }}
        />
        <Plate
          index={1}
          reduced={reduced}
          heading="Stories"
          body="Our archive. Our stories, told on our terms."
          linkLabel="Read the archive"
          linkHref="/stories"
          figure={{
            src: '/images/movement/stories.jpg',
            width: 957,
            height: 1200,
            alt: 'A Black man at a desk by lamplight, writing on a laptop beside an open notebook.',
          }}
        />
        <Plate
          index={2}
          reduced={reduced}
          heading="Ownership"
          body="A Community Benefit Society: one member, one vote. Asset-locked, it can never be sold out from under us."
          linkLabel="How it works"
          linkHref="/governance"
        />
      </div>

      <div className="ms-voices-block">
        <h2 className="ms-display ms-display--md">Voices we carry</h2>
        <div className="ms-voices">
          <figure className="ms-plate__figure">
            <video
              src="/videos/Lordescroll.mp4"
              poster="/images/movement/lorde-poster.jpg"
              width={928}
              height={1080}
              controls
              playsInline
              preload="metadata"
            />
            <figcaption className="ms-body">Audre Lorde. Press play for sound.</figcaption>
          </figure>
          <figure className="ms-plate__figure">
            <MutedLoopVideo
              src="/videos/baldwinscroll.mp4"
              poster="/images/movement/baldwin-poster.jpg"
              width={864}
              height={1080}
              label="James Baldwin, archive clip, no sound"
            />
            <figcaption className="ms-body">James Baldwin. Silent loop.</figcaption>
          </figure>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------- act 7 collapse */

const ActCollapse: React.FC<{ reduced: boolean }> = ({ reduced }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const roomOpacity = useTransform(p, [0, 0.1], [0, 1]);
  const roomScale = useTransform(p, [0, 1], [1.06, 1]);

  const room = (
    <picture>
      <source media="(max-width: 767px)" srcSet="/images/movement/gathering-portrait.jpg" />
      <img
        className="ms-media"
        src="/images/movement/gathering-wide.jpg"
        width={1920}
        height={1072}
        alt="A room full of Black men at tables, laughing and talking over coffee under warm light."
      />
    </picture>
  );

  return (
    <section ref={ref} className="ms-act" data-ms-rest="1" style={spanStyle(3.2)}>
      <div className="ms-stage">
        <div className="ms-side ms-side--together">
          {reduced ? (
            <div className="ms-frame ms-frame--full">{room}</div>
          ) : (
            <motion.div
              className="ms-frame ms-frame--full"
              style={{ opacity: roomOpacity, scale: roomScale }}
            >
              {room}
            </motion.div>
          )}
          <div className="ms-scrim ms-scrim--band" />
          {/* The copy belongs to the second half of the pin: the divider has
              released by then, so a full-width column cannot be clipped by a
              seam that is still travelling. */}
          <div className="ms-col ms-col--full ms-col--bottom">
            <div className="ms-stack ms-stack--bottom">
              <Cue p={p} win={[0.52, 0.8]} reduced={reduced}>
                <h2 className="ms-display ms-display--peak ms-gold">
                  {'Tenderness is a political act.'}
                </h2>
              </Cue>
              <Cue p={p} win={[0.74, 0.97]} reduced={reduced}>
                <h2 className="ms-display ms-display--peak">
                  {'Black queer joy is revolutionary.'}
                </h2>
              </Cue>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------- act 8 close */

const ActClose: React.FC<{ reduced: boolean; answer: string | null }> = ({ reduced, answer }) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  return (
    <section ref={ref} className="ms-act" data-ms-rest="1" style={spanStyle(1.4)}>
      <div className="ms-stage">
        <div className="ms-side ms-side--together">
          <div className="ms-frame ms-frame--full ms-close__room">
            <img
              className="ms-media"
              src="/images/movement/gathering-wide.jpg"
              width={1920}
              height={1072}
              alt=""
            />
          </div>
          <div className="ms-frame ms-frame--r50 ms-close__chair">
            <img
              className="ms-media"
              src="/images/movement/empty-chair.jpg"
              width={1289}
              height={1600}
              alt="An empty wooden chair drawn up in the foreground while the room behind carries on talking and laughing."
            />
          </div>
          <div className="ms-scrim ms-scrim--column-left" />

          <div className="ms-col ms-col--wide ms-close">
            <Cue p={p} win={[0.04, 1, 0.1, 0]} reduced={reduced}>
              <p className="ms-body">
                {answer ? `Earlier you said ${answer}.` : 'Most of us said 1 or fewer.'}
              </p>
              <p className="ms-quiet ms-gold" style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)' }}>
                {"Let's change that. There's a seat here with your name on it."}
              </p>
            </Cue>

            <Cue p={p} win={[0.16, 1, 0.1, 0]} reduced={reduced}>
              <h2 className="ms-display ms-display--lg">
                {'The damage is structural. The repair is relational.'}
              </h2>
              <p className="ms-body">{'This is the work. This is the joy.'}</p>
            </Cue>

            {/* One decision at three depths, in ascending commitment. */}
            <Cue p={p} win={[0.28, 1, 0.1, 0]} reduced={reduced}>
              <div className="ms-doors">
                <a className="ms-door" href="https://crm.blkoutuk.cloud/join">
                  <span className="ms-door__label">Sign up for the newsletter</span>
                  <span className="ms-door__sub">A monthly letter. Start here.</span>
                </a>
                <a
                  className="ms-door"
                  href="https://blkouthub.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ms-door__label">Join the BLKOUTHUB</span>
                  <span className="ms-door__sub">
                    {'The apps reduce you; their model is you, staying alone. We built the Hub to do the opposite: a space driven by building your networks.'}
                  </span>
                </a>
                <div className="ms-door ms-door--soon">
                  <span className="ms-door__label">
                    Become a member
                    <span className="ms-door__tag">Coming soon</span>
                  </span>
                  <span className="ms-door__sub">
                    {'Community-owned. One member, one vote.'}
                  </span>
                  <a className="ms-door__link" href="/governance">
                    How membership will work
                  </a>
                </div>
              </div>
            </Cue>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --------------------------------------------------------------- the page */

export default function MovementSplit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;
  const [answer, setAnswer] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start start', 'end end'] });
  const balanceRaw = useTransform(scrollYProgress, BALANCE.input, BALANCE.output);
  const balanceSpring = useSpring(balanceRaw, { stiffness: 60, damping: 20, restDelta: 0.0005 });
  const stepped = useMotionValue(ACTS[0].rest);
  const balance = reduced ? stepped : balanceSpring;

  // Full-bleed breakout measured against the document, not 100vw, so a page
  // with a vertical scrollbar never grows a horizontal one.
  useEffect(() => {
    const setWidth = () => {
      rootRef.current?.style.setProperty('--ms-vw', `${document.documentElement.clientWidth}px`);
    };
    setWidth();
    window.addEventListener('resize', setWidth);
    return () => window.removeEventListener('resize', setWidth);
  }, []);

  useEffect(() => {
    rootRef.current?.style.setProperty('--ms-balance', balance.get().toFixed(4));
  }, [balance]);

  useMotionValueEvent(balance, 'change', (value) => {
    rootRef.current?.style.setProperty('--ms-balance', value.toFixed(4));
  });

  // Under reduced motion the pins release into ordinary flow, so the seam
  // steps to whichever act is most in view rather than tracking scroll.
  useEffect(() => {
    if (!reduced) return;
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-ms-rest]'));
    if (!sections.length) return;

    const ratios = new WeakMap<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => ratios.set(entry.target, entry.intersectionRatio));
        let best: HTMLElement | null = null;
        let bestRatio = -1;
        for (const section of sections) {
          const ratio = ratios.get(section) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = section;
          }
        }
        const rest = best ? Number(best.dataset.msRest) : NaN;
        if (!Number.isNaN(rest)) stepped.set(rest);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85, 1] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [reduced, stepped]);

  const aloneLabelOpacity = useTransform(balance, [0.7, 0.9], [1, 0]);
  const togetherLabelScale = useTransform(balance, [0.7, 1], [1, 1.32]);
  const pulse = useTransform(balance, [0.4, 0.5, 0.6], [0, 1, 0]);
  const pulseScale = useTransform(pulse, [0, 1], [1, 1.8]);

  const aloneLabel = <span className="ms-label ms-label--alone">Alone</span>;
  const togetherLabel = <span className="ms-label ms-label--together">Together</span>;

  return (
    <div ref={rootRef} className="ms-root">
      {/* The persistent split: two hard grounds and the seam that carries the
          labels. Chrome, not content, so it stays out of the a11y tree. */}
      <div className="ms-bedwrap" aria-hidden="true">
        <div className="ms-bed">
          <div className="ms-panel ms-panel--alone">
            {reduced ? (
              <span className="ms-label ms-label--alone ms-label--stacked">Alone</span>
            ) : (
              <motion.span
                className="ms-label ms-label--alone ms-label--stacked"
                style={{ opacity: aloneLabelOpacity }}
              >
                Alone
              </motion.span>
            )}
          </div>
          <div className="ms-panel ms-panel--together">
            <span className="ms-label ms-label--together ms-label--stacked">Together</span>
          </div>
          <div className="ms-grain" />

          <div className="ms-seam">
            {!reduced && (
              <>
                <motion.div
                  className="ms-seam__glow ms-seam__glow--v"
                  style={{ opacity: pulse, scaleX: pulseScale }}
                />
                <motion.div
                  className="ms-seam__glow ms-seam__glow--h"
                  style={{ opacity: pulse, scaleY: pulseScale }}
                />
              </>
            )}
            <div className="ms-seam__line" />
            <div className="ms-seam__core" />
            <div className="ms-seam__labels">
              {reduced ? (
                aloneLabel
              ) : (
                <motion.span
                  className="ms-label ms-label--alone"
                  style={{ opacity: aloneLabelOpacity }}
                >
                  Alone
                </motion.span>
              )}
              {reduced ? (
                togetherLabel
              ) : (
                <motion.span
                  className="ms-label ms-label--together"
                  style={{ scale: togetherLabelScale }}
                >
                  Together
                </motion.span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ms-acts">
        <ActHero reduced={reduced} />
        <ActQuestion answer={answer} onAnswer={setAnswer} />
        <ActProblem reduced={reduced} />
        <ActTurn reduced={reduced} />
        <ActEvidence reduced={reduced} />

        {/* Act 6, THE BREATH: authored silence. Near-black, the gold seam
            alone. Declared in docs/movement-scroll/BRIEF.md so it is not read
            as dead scroll. */}
        <section
          className="ms-act ms-act--flow"
          data-ms-rest="0.66"
          data-ms-silence="authored"
          style={spanStyle(0.6)}
          aria-hidden="true"
        />

        <ActCollapse reduced={reduced} />
        <ActClose reduced={reduced} answer={answer} />
      </div>

      {/* POST-CREDIT: OOMF Interactive */}
      <section className="ms-post">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center px-4 max-w-6xl w-full ms-post__inner"
        >
          <p className="ms-eyebrow ms-post__kicker">One more thing</p>

          {/* The film carries the invitation. Click to play: 36 MB, so
              preload="none" fetches nothing until the visitor presses it, and
              sound arrives only on that press. No autoplay anywhere. */}
          <figure className="ms-film">
            <video
              src="/videos/Heroes2.mp4"
              poster="/images/poster-Heroes2.jpg"
              width={1920}
              height={1080}
              controls
              playsInline
              preload="none"
            />
            <figcaption className="ms-film__cap">
              {'Our heroes, our story. Press play for sound.'}
            </figcaption>
          </figure>

          <h2 className="ms-display ms-display--lg ms-post__headline">
            {"We're the heroes we've been waiting for."}
          </h2>
          <p className="ms-quiet ms-post__sub">{'Now put yourself in the story.'}</p>

          <div className="w-full max-w-3xl mx-auto mb-8">
            <div
              className="relative overflow-hidden border-2 border-liberation-gold-divine/30"
              style={{ paddingBottom: '125%' }}
            >
              <iframe
                src="https://oomf.blkoutuk.com/"
                className="absolute inset-0 w-full h-full"
                title="Create Your Hero Panel"
                allow="camera; microphone"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
            </div>
          </div>
          <a
            href="https://oomf.blkoutuk.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-400 hover:text-purple-300"
          >
            Having trouble? Open in new tab →
          </a>

          <p className="ms-disclaimer">
            {'Imagery: AI-generated (Wan 2.6, Gemini 3); real photos in select frames.'}
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-900/30 py-10 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-bold mb-4 uppercase">Platform</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <a href="https://events.blkoutuk.cloud" className="hover:text-white">
                    Events
                  </a>
                </li>
                <li>
                  <a href="/stories" className="hover:text-white">
                    Archive
                  </a>
                </li>
                <li>
                  <a href="/?chat=open" className="hover:text-white">
                    AIvor
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase">Community</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <a href="https://blkouthub.com" className="hover:text-white">
                    BLKOUTHUB
                  </a>
                </li>
                <li>
                  <a href="/governance" className="hover:text-white">
                    Governance
                  </a>
                </li>
                <li>
                  <a href="/platform" className="hover:text-white">
                    Platform
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase">Connect</h4>
              <ul className="space-y-2 text-purple-300 text-sm">
                <li>
                  <a href="https://instagram.com/blkoutuk" className="hover:text-white">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/blkoutuk" className="hover:text-white">
                    Twitter/X
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4 uppercase">BLKOUT UK</h4>
              <p className="text-purple-400 text-sm">Community-owned liberation platform</p>
              <p className="text-purple-600 text-xs mt-4">© 2026 BLKOUT UK Cooperative</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
