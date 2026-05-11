const SCRIPT = `(function(){try{var t=localStorage.getItem("mm-theme");if(t!=="dark"&&t!=="light")t="light";document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
