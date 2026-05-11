"use client";

import { useId, useState, type ReactNode } from "react";

export function Sidenote({ n, children }: { n: number | string; children: ReactNode }) {
  const id = useId();
  const [active, setActive] = useState(false);
  const on = () => setActive(true);
  const off = () => setActive(false);
  const markerCls = `sn-marker${active ? " sn-active" : ""}`;
  const noteCls = `sn-note${active ? " sn-active" : ""}`;
  return (
    <>
      <sup
        className={markerCls}
        data-sn={id}
        onMouseEnter={on}
        onMouseLeave={off}
        onFocus={on}
        onBlur={off}
        tabIndex={0}
        aria-describedby={`sn-note-${id}`}
      >
        [{n}]
      </sup>
      <span
        id={`sn-note-${id}`}
        className={noteCls}
        data-sn={id}
        onMouseEnter={on}
        onMouseLeave={off}
        role="note"
      >
        <span className="sn-num">{n}.</span>
        {children}
      </span>
    </>
  );
}
