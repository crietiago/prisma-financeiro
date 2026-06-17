export function injectAuthenticatedControls(html: string) {
  const authBridge = `<script>window.PRISMA_SERVER_AUTHENTICATED=true;</script>`;
  const controls = `
<form action="/api/logout" method="post" style="position:fixed;right:16px;bottom:16px;z-index:9999;margin:0">
  <button type="submit" aria-label="Sair do Prisma Financeiro" style="border:0;border-radius:999px;padding:11px 15px;background:#fff;color:#2D2B6B;font:800 13px Nunito,system-ui,sans-serif;box-shadow:0 14px 34px rgba(5,1,23,.22);cursor:pointer">Sair</button>
</form>
<script>
(function(){
  var KEY = 'prisma_v15_mobile_marketing_corrigido_state';
  var saveTimer = null;
  var originalSetItem = localStorage.setItem.bind(localStorage);

  function pushCloudState(){
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function(){
      var raw = localStorage.getItem(KEY);
      if(!raw) return;
      try {
        fetch('/api/cloud-state', {
          method: 'PUT',
          credentials: 'include',
          headers: {'content-type':'application/json'},
          body: JSON.stringify({data: JSON.parse(raw)})
        }).catch(function(){});
      } catch(e){}
    }, 900);
  }

  function pullCloudState(){
    fetch('/api/cloud-state', {credentials:'include'})
      .then(function(r){ return r.ok ? r.json() : null; })
      .then(function(payload){
        if(!payload || !payload.data) return;
        if(!localStorage.getItem(KEY)){
          originalSetItem(KEY, JSON.stringify(payload.data));
          location.reload();
        }
      })
      .catch(function(){});
  }

  localStorage.setItem = function(key, value){
    var result = originalSetItem(key, value);
    if(key === KEY) pushCloudState();
    return result;
  };

  pullCloudState();
  window.addEventListener('beforeunload', pushCloudState);
})();
</script>`;

  return html.replace("</head>", `${authBridge}</head>`).replace("</body>", `${controls}</body>`);
}
