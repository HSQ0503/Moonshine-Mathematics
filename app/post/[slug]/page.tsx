import Link from "next/link";
import { notFound } from "next/navigation";
import { Masthead, Footer } from "@/components/Chrome";
import { K, ThmBlock, FNote, Footnotes } from "@/components/Math";
import { Sidenote } from "@/components/Sidenote";
import { formatDate } from "@/lib/data";
import { getPostBySlug, getPublishedPosts } from "@/lib/db";

type Params = { slug: string };

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  const isFlagship = post.slug === "spectral-theorem-self-adjoint";
  const all = await getPublishedPosts();
  const related = all
    .filter(p => p.id !== post.id && p.tag !== "Notebook")
    .slice(0, 5);

  return (
    <div className="shell">
      <Masthead page="post" reading />
      <div className="article-wrap">
        <aside className="toc">
          <div className="label">Contents</div>
          <ul>
            <li><a href="#sec-1">§ 1. The shape of the question</a></li>
            <li><a href="#sec-2">§ 2. Self-adjoint, in pictures</a></li>
            <li><a href="#sec-3">§ 3. The statement</a></li>
            <li><a href="#sec-4">§ 4. The proof, slowly</a></li>
            <li><a href="#sec-5">§ 5. What I still don&apos;t see</a></li>
          </ul>
          <div style={{ marginTop: 24, fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink-faint)", letterSpacing: "0.05em" }}>
            REV. 03 · {formatDate(post.date).toUpperCase()}
          </div>
        </aside>

        <article className="article">
          <header>
            <div className="eyebrow">Entry № {post.number} · {post.tag} · ms. received {formatDate(post.date)}</div>
            <h1>{post.title}</h1>
            <p className="subtitle">{post.subtitle}</p>
            <div className="abstract">
              <span className="label">Abstract</span>
              <p>{post.excerpt}</p>
            </div>
            <div className="byline">
              <span>J. Calder</span>
              <span className="dot" />
              <span>Independent</span>
              <span className="dot" />
              <span>{formatDate(post.date)}</span>
              <span className="dot" />
              <span>{post.readingTime} min{isFlagship ? " · ≈ 2 200 words" : ""}</span>
            </div>
            <div className="cite-as">
              <span className="label">Cite as</span>
              Moonshine Mathematics, Vol. I, No. {post.number} (2026). moonshine.math/p/{post.slug}
            </div>
          </header>

          {isFlagship ? <FlagshipBody /> : <ShortBody excerpt={post.excerpt} />}
        </article>

        <aside className="aside">
          <div className="label">Related</div>
          <ul>
            {related.map(p => (
              <li key={p.id}>
                <Link href={`/post/${p.slug}`} style={{ borderBottom: "none" }}>
                  <span className="t">{p.title}</span>
                  <span className="d">№ {p.number} · {p.tag.toUpperCase()}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 28, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, color: "var(--ink-mute)", lineHeight: 1.5, paddingTop: 14, borderTop: "1px solid var(--rule)" }}>
            &ldquo;The art of doing mathematics consists in finding that special case which contains all the germs of generality.&rdquo;
            <div style={{ marginTop: 8, fontStyle: "normal", fontSize: 11, fontFamily: "var(--sans)", letterSpacing: "0.15em", textTransform: "uppercase" }}>— Hilbert</div>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

function FlagshipBody() {
  return (
    <>
      <h2 id="sec-1"><span className="num">§ 1</span>The shape of the question</h2>
      <p className="lead">
        I have spent four nights with the spectral theorem, and I think I
        finally see it. It says something almost embarrassingly simple — and
        yet the proof, which I write out below, took me three notebook pages
        to convince myself of. The statement, in the form I now carry around
        with me, is this: <em>every self-adjoint operator on a
        finite-dimensional inner product space is, in some orthonormal basis,
        simply a list of stretches.</em>
      </p>

      <p>
        That last clause is doing a great deal of work. &ldquo;A list of stretches&rdquo;
        means a diagonal matrix; &ldquo;in some orthonormal basis&rdquo; means the
        stretches are along mutually perpendicular axes. So the theorem says,
        more compactly, that a self-adjoint operator <K tex="T" /> is — up to
        a choice of perpendicular coordinates — nothing more than a tuple of
        real numbers <K tex="(\lambda_1, \dots, \lambda_n)" />, each one
        telling you by how much <K tex="T" /> stretches one of the axes.
        <FNote n={1} />
      </p>

      <ThmBlock kind="definition" n="2.1" name="self-adjoint">
        <p style={{ margin: 0 }}>
          Let <K tex="V" /> be a finite-dimensional inner product space over <K tex="\mathbb{R}" /> (or <K tex="\mathbb{C}" />). An operator <K tex="T: V \to V" /> is called <em>self-adjoint</em> if{" "}
          <K display tex="\langle Tv, w \rangle = \langle v, Tw \rangle \quad \text{for all } v, w \in V." />
          Equivalently, <K tex="T = T^*" />.
        </p>
      </ThmBlock>

      <h2 id="sec-2"><span className="num">§ 2</span>Self-adjoint, in pictures</h2>
      <p>
        Before the theorem, the word <em>self-adjoint</em> felt to me like a
        bookkeeping condition. Two inner products are equal. Fine. So what?
        What I missed was that this condition is precisely what forces an
        operator to behave the way physical stretches behave: it has only real
        eigenvalues, and eigenvectors for distinct eigenvalues are
        automatically perpendicular.<Sidenote n="*">
          I had to draw this out myself before I trusted it. If <K tex="Tv = \lambda v" /> and <K tex="Tw = \mu w" />, then{" "}
          <K tex="\lambda \langle v, w \rangle = \langle Tv, w\rangle = \langle v, Tw\rangle = \mu \langle v, w\rangle" />, so either <K tex="\lambda = \mu" /> or <K tex="\langle v, w\rangle = 0" />.
        </Sidenote>
      </p>

      <p>
        The first claim — eigenvalues are real — fails for general operators
        over <K tex="\mathbb{R}" /> (rotations have no real eigenvalues at
        all), but the self-adjoint condition rules this out. The second claim
        — orthogonality of eigenspaces — is the geometric content. It is what
        makes the theorem feel inevitable once you accept it.
      </p>

      <blockquote>
        A self-adjoint operator is one whose action you can describe
        without ever mentioning the basis you started in.
      </blockquote>

      <h2 id="sec-3"><span className="num">§ 3</span>The statement</h2>

      <ThmBlock kind="theorem" n="3.1" name="Real Spectral Theorem">
        <p style={{ margin: 0 }}>
          Let <K tex="V" /> be a finite-dimensional real inner product space and let <K tex="T \in \mathcal{L}(V)" /> be self-adjoint. Then <K tex="V" /> has an orthonormal basis consisting of eigenvectors of <K tex="T" />.
        </p>
      </ThmBlock>

      <p>
        Three things to notice. First, no claim is made about
        <em> which</em> eigenvalues appear — only that the basis exists.
        Second, the basis is orthonormal: not merely independent, not merely
        a basis of eigenvectors, but a <em>perpendicular</em> one. Third, the
        theorem is over <K tex="\mathbb{R}" />; the complex case is easier
        and slightly more general.
      </p>

      <h2 id="sec-4"><span className="num">§ 4</span>The proof, slowly</h2>

      <p>
        I am going to do this by induction on <K tex="\dim V" />. The base
        case is silly: a one-dimensional space is already its own
        eigenline. The step is where the work happens.<FNote n={2} />
      </p>

      <ThmBlock kind="lemma" n="4.1">
        <p style={{ margin: 0 }}>
          Every self-adjoint operator on a finite-dimensional real inner product space has at least one (real) eigenvalue.
        </p>
      </ThmBlock>

      <ThmBlock kind="proof">
        <p style={{ margin: 0 }}>
          Extend <K tex="T" /> to the complexification <K tex="V_{\mathbb{C}}" />. There the operator has an eigenvalue, by the fundamental theorem of algebra. The self-adjoint condition forces this eigenvalue to be real, by the calculation in the margin of § 2. Therefore <K tex="T" /> already has a real eigenvalue on <K tex="V" />.
        </p>
      </ThmBlock>

      <p>
        Call this eigenvalue <K tex="\lambda_1" /> and let <K tex="u_1" /> be a corresponding unit eigenvector. Let <K tex="U = \mathrm{span}(u_1)^\perp" />.
        I claim that <K tex="T" /> sends <K tex="U" /> into itself. This is the load-bearing step of the entire argument; once you see it, the induction practically does the rest.
      </p>

      <p>
        Suppose <K tex="w \in U" />, i.e. <K tex="\langle w, u_1 \rangle = 0" />.
        Then{" "}
        <K display tex="\langle Tw, u_1 \rangle = \langle w, Tu_1 \rangle = \langle w, \lambda_1 u_1 \rangle = \lambda_1 \langle w, u_1\rangle = 0." />
        So <K tex="Tw \in U" /> as well. This is the place where self-adjointness earns its keep: I moved <K tex="T" /> from one side of the inner product to the other, free of charge.
      </p>

      <p>
        The restricted operator <K tex="T|_U" /> is a self-adjoint operator on a space of strictly smaller dimension. By induction it has an orthonormal eigenbasis <K tex="u_2, \dots, u_n" />. Together with <K tex="u_1" />, these give the orthonormal eigenbasis of <K tex="V" /> the theorem promised. <span style={{ fontStyle: "normal" }}>∎</span>
      </p>

      <h2 id="sec-5"><span className="num">§ 5</span>What I still don&apos;t see</h2>
      <p>
        I do not yet have a feeling for the complex spectral theorem. I can
        prove it — the proof is the same, only the lemma in § 4 is replaced
        by the easier observation that a normal operator on a complex space
        has an eigenvalue. But &ldquo;normal&rdquo; is, for me, still just a condition.
        I do not know what a normal-but-not-self-adjoint operator <em>looks
        like</em>, in the way I now know what a self-adjoint one looks like.
        That is the project for next week.
      </p>
      <p>
        I also want to come back to the SVD. The spectral theorem is, in some
        sense, the SVD for self-adjoint operators. I would like to understand
        the general SVD as the spectral theorem applied twice, to <K tex="T^*T" /> and to <K tex="TT^*" />. But this is a thread for another night.
      </p>

      <Footnotes
        items={[
          [1, <>This is, I am told, more or less the content of Halmos&apos;s <em>Finite-Dimensional Vector Spaces</em>, ch. 8. I have not yet looked. I want to write the proof out from Axler first, then go and see what Halmos does.</>],
          [2, <>Strang gives the proof via the characteristic polynomial; Axler refuses to use it on principle. I find Axler&apos;s version harder on first reading and far more illuminating on the second.</>],
        ]}
      />
    </>
  );
}

function ShortBody({ excerpt }: { excerpt: string }) {
  return (
    <>
      <p style={{ fontSize: 20, fontStyle: "italic", color: "var(--ink-mute)", marginBottom: 32 }}>
        {excerpt}
      </p>
      <h2><span className="num">§ 1</span>Opening</h2>
      <p>
        This entry is part of an ongoing journal — see <Link href="/archive">the archive</Link>{" "}
        for the full sequence. The body is rendered in full in the editor; for the
        purposes of this preview I am letting the excerpt stand in for the piece.
      </p>
      <ThmBlock kind="definition" n="1.1">
        <p style={{ margin: 0 }}>
          A small placeholder, to show what definitions look like in this template.
          For the real thing, open the editor and load this slug.
        </p>
      </ThmBlock>
      <p>
        I will not pretend to have written all thirteen entries in their final form
        yet. The system supports them; the words will follow.
      </p>
    </>
  );
}
