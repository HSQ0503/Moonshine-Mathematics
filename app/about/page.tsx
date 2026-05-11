import { Masthead, Footer } from "@/components/Chrome";

export default function AboutPage() {
  return (
    <div className="shell">
      <Masthead page="about" />
      <article className="about-page">
        <h1>About this journal</h1>
        <p>
          Moonshine Mathematics is a record of one person learning mathematics
          alone, in the small hours, mostly from books. I write here for the
          same reason a sailor keeps a log: to remember the route, to
          notice the weather, and so that — if I am ever lost — I can
          find my way back to where the trouble began.
        </p>
        <p className="pull">
          The name is a small private joke. Mathematicians use the word
          <em> moonshine</em> for results so unlikely they look like nonsense —
          the Monstrous Moonshine conjecture, between the Monster group and
          the j-function, is the famous example. I work mostly on linear
          algebra; I have nothing to add to that conjecture. But I like the
          word. It feels honest about the hour.
        </p>
        <p>
          The current course of study is linear algebra. My principal text is
          Axler&apos;s <em>Linear Algebra Done Right</em>, with Strang as a counterweight
          when I want intuition more than rigor, and Halmos when I want neither but
          the cool relief of an older voice. I expect this volume of the journal
          to close around the spectral theorem and the singular value
          decomposition. After that — perhaps analysis, perhaps something stranger.
        </p>
        <p>
          Posts here are not lessons. They are notebooks. They will sometimes be
          wrong. When they are wrong, I will try to mark it.
        </p>
        <dl>
          <dt>Name</dt>           <dd>J. Calder</dd>
          <dt>Begun</dt>          <dd>on the new moon, November 2025</dd>
          <dt>Currently reading</dt><dd>Axler, <em>Linear Algebra Done Right</em>, 4th ed., ch. 7</dd>
          <dt>Pace</dt>           <dd>roughly one entry per lunar cycle</dd>
          <dt>Hours kept</dt>     <dd>22:00 — 03:00, irregular</dd>
          <dt>Correspondence</dt> <dd>j.calder@moonshine.math</dd>
        </dl>
        <p>
          If something here is wrong, please tell me. Slowly is the only way
          I know to learn, and being corrected is a part of going slowly.
        </p>
      </article>
      <Footer />
    </div>
  );
}
