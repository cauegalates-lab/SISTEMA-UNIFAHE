/* Área de Times comerciais: renderização dos cards, cálculo visual da meta e controle de exibição.
   Este arquivo fica conectado ao index.html pelo script src no ponto original do sistema. */
(function(){
    function escTimes(v){
        return String(v == null ? '' : v)
            .replace(/&/g,'&amp;')
            .replace(/</g,'&lt;')
            .replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;')
            .replace(/'/g,'&#39;');
    }
    function usuarioEhAdmTimes(){
        var u = window.usuarioLogado || {};
        var perfil = String(u.perfil || '').toLowerCase();
        var id = String(u.id || u.usuario || '').toUpperCase();
        return perfil === 'gestor' || perfil === 'adm' || id === 'ADM';
    }
    function ordemTimesConsolidada(){
        if(typeof ordemTimesFinal === 'function') return ordemTimesFinal();
        if(typeof listaTimesModelo === 'function') return listaTimesModelo();
        if(typeof DEFAULT_TIMES !== 'undefined' && Array.isArray(DEFAULT_TIMES)) return DEFAULT_TIMES.slice();
        return ['ALFAS','EVOLUTION','INVICTUS','VIP','TEAM WINX','GOAT','PREDADORES'];
    }
    function logoUnifaheConsolidada(){
        if(typeof logoUnifaheFinal === 'function') return logoUnifaheFinal();
        if(typeof LOGO_UNIFAHE_TIMES !== 'undefined' && LOGO_UNIFAHE_TIMES) return LOGO_UNIFAHE_TIMES;
        return 'https://unifahe.edu.br/wp-content/uploads/2025/08/logo-unifahe.png';
    }
    function linhaMembroTimes(nome, capitao, valor, mostrarValor){
        const valorHtml = mostrarValor
            ? '<b>' + (typeof formatarMoeda === 'function' ? formatarMoeda(valor) : valor) + '</b>'
            : '<b class="membro-valor-restrito" title="Resultado individual restrito para usuários de outros times">Restrito</b>';
        return '<div class="gamer-member-row ' + (mostrarValor ? '' : 'sem-valor') + '"><span>' +
            (capitao ? '<span class="gamer-captain">👑</span>' : '') + escTimes(nome) + '</span>' +
            valorHtml +
            '</div>';
    }
    async function carregarTimesAcessoConsolidado(){
        let vendasDados = [];
        try{
            vendasDados = Array.isArray(vendasCache) && vendasCache.length
                ? vendasCache
                : (await db.collection('vendas').get()).docs.map(function(doc){ return { id: doc.id, ...doc.data() }; });
        }catch(e){ console.warn('Não foi possível carregar vendas dos times.', e); }

        const inicio = (typeof campanhaTimesConfig !== 'undefined' && campanhaTimesConfig && campanhaTimesConfig.inicio) || document.getElementById('timeStartDate')?.value || '';
        const fim = (typeof campanhaTimesConfig !== 'undefined' && campanhaTimesConfig && campanhaTimesConfig.fim) || document.getElementById('timeEndDate')?.value || '';
        if(typeof vendaDentroPeriodo === 'function') vendasDados = vendasDados.filter(function(v){ return vendaDentroPeriodo(v, inicio, fim); });

        const vendasMap = {};
        let totalGeral = 0;
        vendasDados.forEach(function(v){
            if(!v || !v.vendedor) return;
            const val = typeof valorFaturado === 'function' ? valorFaturado(v) : ((Number(v.taxa) || 0) + (Number(v.valor) || 0));
            vendasMap[v.vendedor] = (vendasMap[v.vendedor] || 0) + val;
            totalGeral += val;
        });

        const meta = Number((typeof campanhaTimesConfig !== 'undefined' && campanhaTimesConfig && campanhaTimesConfig.meta) || 0);
        const acessoAdm = usuarioEhAdmTimes();
        const nomeUsuario = String((window.usuarioLogado && window.usuarioLogado.nome) || '').trim();
        const todosTimes = ordemTimesConsolidada();
        const timesVisiveis = todosTimes;

        const timesView = document.getElementById('timesView');
        if(!timesView) return;

        timesView.innerHTML = `
            <div class="times-arena times-layout-modelo">
                <div class="times-arena-top">
                    <div class="times-arena-title">
                        <span>Central de Times UNIFAHE</span>
                        <h2>Times comerciais</h2>
                        <p>Acompanhe todos os times pela meta definida, percentual atingido e total faturado no período.</p>
                    </div>
                    <div class="times-arena-stats">
                        <div class="times-stat-pill"><small>Período</small><strong id="timesPeriodoResumo">--</strong></div>
                        <div class="times-stat-pill"><small>Meta</small><strong id="timeWeekMeta">R$ 0,00</strong></div>
                        <div class="times-stat-pill"><small>${acessoAdm ? 'Total Geral' : 'Total dos Times'}</small><strong id="totalGeralValor">R$ 0,00</strong></div>
                        ${acessoAdm ? '<button class="times-config-btn-top" type="button" onclick="abrirModalCampanhaTimes()">Meta e período</button>' : ''}
                    </div>
                </div>
                <div class="times-grid gamer-times-grid" id="timesGridContainer"></div>
            </div>`;

        const cont = document.getElementById('timesGridContainer');
        if(!cont) return;
        cont.innerHTML = '';

        let totalVisivel = 0;

        if(!timesVisiveis.length){
            cont.innerHTML = '<div class="time-card gamer-time-card gamer-time-empty"><div class="gamer-time-head"><div class="gamer-time-info"><h3>Nenhum time configurado</h3><small>Cadastre os times para visualizar os resultados.</small><i class="gamer-time-mini-line" aria-hidden="true"></i></div></div><div class="gamer-time-body"><div class="gamer-time-total"><span>Total do time</span><strong>R$ 0,00</strong></div></div></div>';
        }

        timesVisiveis.forEach(function(nome){
            if(typeof timesConfig !== 'undefined' && !timesConfig[nome]) timesConfig[nome] = { logo: (nome === 'VIP' ? 'vip.jpeg' : (typeof logoTime === 'function' ? logoTime(nome) : '')), membros: [], capitao: '' };
            const conf = (typeof timesConfig !== 'undefined' && timesConfig[nome]) ? timesConfig[nome] : { membros: [], capitao: '' };
            let membros = (conf.membros || []).slice(0, 4);
            if(conf.capitao && membros.includes(conf.capitao)) membros = [conf.capitao, ...membros.filter(function(m){ return m !== conf.capitao; })];

            let somaTime = 0;
            membros.forEach(function(m){ somaTime += (vendasMap[m] || 0); });
            totalVisivel += somaTime;

            const metaTime = Number(conf.meta || conf.metaTime || conf.metaDefinida || meta) || 0;
            const progresso = metaTime ? Math.min(100, (somaTime / metaTime) * 100) : 0;
            const metaFormatada = typeof formatarMoeda === 'function' ? formatarMoeda(metaTime) : metaTime;
            const logo = typeof logoTime === 'function' ? logoTime(nome, conf) : (conf.logo || '');
            const card = document.createElement('div');
            card.className = 'time-card gamer-time-card';
            card.innerHTML = `
                <div class="gamer-time-head">
                    <div class="gamer-time-logo-wrap">
                        <img class="gamer-time-logo" src="${escTimes(logo)}" onerror="this.onerror=null;this.src=LOGO_PADRAO_TIME">
                        <div class="gamer-time-progress gamer-time-progress-logo" aria-label="Progresso da meta"><span style="width:${progresso}%"></span></div>
                    </div>
                    <div class="gamer-time-info">
                        <h3>${escTimes(nome)}</h3>
                        <small>Meta ${escTimes(metaFormatada)} • ${Math.round(progresso)}% da meta</small>
                        <i class="gamer-time-mini-line" aria-hidden="true"></i>
                    </div>
                </div>
                <div class="gamer-time-body">
                    <div class="gamer-time-total"><span>Total do time</span><strong>${typeof formatarMoeda === 'function' ? formatarMoeda(somaTime) : somaTime}</strong></div>
                </div>`;
            cont.appendChild(card);
        });

        const marca = document.createElement('div');
        marca.className = 'unifahe-brand-card';
        marca.innerHTML = `<div class="unifahe-brand-inner"><img src="${escTimes(logoUnifaheConsolidada())}" alt="UNIFAHE"><span>Sistema Comercial</span></div>`;
        cont.appendChild(marca);

        if(typeof atualizarTexto === 'function'){
            atualizarTexto('totalGeralValor', typeof formatarMoeda === 'function' ? formatarMoeda(acessoAdm ? totalGeral : totalVisivel) : (acessoAdm ? totalGeral : totalVisivel));
            atualizarTexto('timeWeekMeta', typeof formatarMoeda === 'function' ? formatarMoeda(meta) : meta);
            atualizarTexto('timesPeriodoResumo', `${inicio && typeof formatarData === 'function' ? formatarData(inicio) : (inicio || 'Início')} até ${fim && typeof formatarData === 'function' ? formatarData(fim) : (fim || 'Fim')}`);
        }
    }

    window.carregarTimes = carregarTimesAcessoConsolidado;
    try{ carregarTimes = carregarTimesAcessoConsolidado; }catch(e){}

    const navAnteriorTimes = window.navegarPara;
    if(typeof navAnteriorTimes === 'function' && !navAnteriorTimes.__timesAcessoConsolidado){
        window.navegarPara = function(secao){
            const r = navAnteriorTimes.apply(this, arguments);
            if(String(secao || '').toUpperCase() === 'TIMES') setTimeout(carregarTimesAcessoConsolidado, 80);
            return r;
        };
        window.navegarPara.__timesAcessoConsolidado = true;
        try{ navegarPara = window.navegarPara; }catch(e){}
    }

    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){
            const tv = document.getElementById('timesView');
            if(tv && tv.style.display !== 'none') carregarTimesAcessoConsolidado();
        });
    }else{
        const tv = document.getElementById('timesView');
        if(tv && tv.style.display !== 'none') setTimeout(carregarTimesAcessoConsolidado, 80);
    }
})();
