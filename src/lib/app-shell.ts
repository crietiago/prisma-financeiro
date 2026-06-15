export function injectAuthenticatedControls(html: string) {
  const controls = `
<form action="/api/logout" method="post" style="position:fixed;right:16px;bottom:16px;z-index:9999;margin:0">
  <button type="submit" aria-label="Sair do Prisma Financeiro" style="border:0;border-radius:999px;padding:11px 15px;background:#fff;color:#2D2B6B;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 14px 34px rgba(5,1,23,.22);cursor:pointer">Sair</button>
</form>`;

  return html.replace("</body>", `${controls}</body>`);
}
