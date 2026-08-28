var CONFIG_R2 = {
  ABA: "Vendas",
  LINHA_INICIAL: 2,

  // Painel R2 lê de B até M
  PRIMEIRA_COLUNA: 2,
  TOTAL_COLUNAS: 12,

  // Coluna M dentro do intervalo B:M
  INDICE_COLUNA_FILTRO: 11,

  // Coluna U: indicação. Ela é lida separadamente para não trazer N:T sem necessidade.
  COLUNA_INDICACAO: 21,

  // Valores aceitos na coluna M
  VALORES_FILTRO: [
    "R2 2026",
    "DIPLOMADO-R2",
    "MIGRAÇÃO R2",
    "REFINFAHE R2"
  ],


  // R2 não usa CacheService para não estourar o limite com muitas vendas.
  CACHE_SEGUNDOS: 0
};


var CONFIG_EQUIPES = {
  ABA: "Vendas",
  LINHA_INICIAL: 2,
  FUSO_HORARIO: "America/Sao_Paulo",

  // Data da venda separada nas colunas B, C e D.
  COLUNA_DIA: 2,          // B
  COLUNA_MES: 3,          // C
  COLUNA_ANO: 4,          // D

  // O painel identifica o vendedor na coluna E
  // e soma o faturamento correspondente da coluna T.
  COLUNA_VENDEDOR: 5,     // E
  COLUNA_VALOR_TOTAL: 20, // T

  // Segunda a sábado. Domingo não entra nem na semana nem no mês.
  IGNORAR_DOMINGO: true,
  CACHE_SEGUNDOS: 30
};


var CONFIG_CRESCIMENTO = {
  LINHA_INICIAL: 4,
  FUSO_HORARIO: "America/Sao_Paulo",
  CACHE_SEGUNDOS: 15,

  MESES: {
    6: {
      nome: "Junho",
      aba: "Junho",
      colunaData: 18,  // R
      colunaValor: 24  // X
    },

    7: {
      nome: "Julho",
      aba: "Julho",
      colunaData: 31,  // AE
      colunaValor: 37  // AK
    }
  }
};


var CONFIG_TIMES_META_MILHAO = {
  ABA: "Times",
  EQUIPES: {
    alfas: {
      nome: "ALFAS",
      intervalo: "N28:N32"
    },
    vip: {
      nome: "VIP",
      intervalo: "D23:D27"
    },
    evolution: {
      nome: "EVOLUTION",
      intervalo: "I28:I32"
    },
    goat: {
      nome: "GOAT",
      intervalo: "N23:N27"
    },
    winx: {
      nome: "WINX",
      intervalo: "D28:D32"
    },
    predadores: {
      nome: "PREDADORES",
      intervalo: "I23:I27"
    }
  }
};


var CONFIG_META_MILHAO = {
  ABA: "Agosto",
  CELULA_FATURADO: "AK35",

  // TOTAL DO MÊS ANTERIOR
  CELULA_MES_ANTERIOR: "AK34",

  // Período exibido no resumo e no histórico diário do painel.
  // Ao trocar o mês da meta, altere estes dois valores junto com ABA/CELULA_FATURADO.
  MES: 8,
  ANO: 2026,

  // Fonte usada para calcular quanto foi vendido em cada dia.
  // A data está em B/C/D e o valor total faturado está na coluna T.
  ABA_VENDAS: "Vendas",
  LINHA_INICIAL_VENDAS: 2,
  COLUNA_DIA: 2,
  COLUNA_MES: 3,
  COLUNA_ANO: 4,
  COLUNA_VALOR_TOTAL: 20,

  // Opcional: informe aqui o ID da planilha que contém a aba Agosto.
  // Quando vazio, o código usa a planilha à qual este Apps Script está vinculado.
  // Preencher este campo elimina qualquer risco de a implantação ler outra planilha.
  PLANILHA_ID: "",

  // Para o painel principal não usamos cache: é apenas uma célula e assim
  // o valor exibido sempre corresponde ao valor atual de Agosto!AK35.
  CACHE_SEGUNDOS: 0,
  FUSO_HORARIO: "America/Sao_Paulo"
};


/**
 * RANKING DOS LÍDERES
 *
 * Aba Vendas:
 * - coluna B: dia da venda
 * - coluna C: mês da venda
 * - coluna E: nome do líder
 * - coluna G: forma/situação da venda
 *   (QUITADO ou CARTÃO contam como Quitado; os demais contam só como venda)
 * - coluna K: valor da venda/faturamento
 * - coluna R: quantidade de cursos/matrículas
 */
var CONFIG_RANKING_LIDERES = {
  ABA: "Vendas",
  LINHA_INICIAL: 2,
  COLUNA_DIA: 2,        // B
  COLUNA_MES: 3,        // C
  COLUNA_NOME: 5,       // E
  COLUNA_QUITADO: 7,    // G
  COLUNA_VALOR: 11,     // K
  COLUNA_CURSOS: 18,    // R
  CACHE_SEGUNDOS: 60,
  FUSO_HORARIO: "America/Sao_Paulo"
};


var LIDERES_RANKING = [
  "Beatriz Cunha",
  "Gabriel Gorgonio",
  "Letícia Vieira",
  "Cauê Galates",
  "Alana Santos",
  "Giseli de Jesus",
  "Nathália"
];


/**
 * COFRE COMERCIAL
 *
 * Resultados diários de todos os vendedores.
 * - B: dia
 * - C: mês
 * - D: ano
 * - E: vendedor
 * - K: faturamento/valor da venda
 * - R: quantidade de matrículas/cursos
 *
 * Antes das 20h: exige senha.
 * A partir das 20h (America/Sao_Paulo): acesso público automático.
 */
var CONFIG_COFRE_COMERCIAL = {
  ABA: "Vendas",
  LINHA_INICIAL: 2,
  COLUNA_DIA: 2,       // B
  COLUNA_MES: 3,       // C
  COLUNA_ANO: 4,       // D
  COLUNA_NOME: 5,      // E
  COLUNA_VALOR: 11,    // K
  COLUNA_CURSOS: 18,   // R
  HORA_PUBLICA: 20,
  FUSO_HORARIO: "America/Sao_Paulo",
  CACHE_SEGUNDOS: 30,

  // Senha do cofre.
  SENHA: "UNIFAHE2026",

  // SHA-256 de: UNIFAHE2026
  SENHA_HASH: "a642a5b66afe849d5783f2a653b81bd460ab5fc0c2b414a5e8d5cd16d71e304b"
};

var VENDEDORES_COFRE_COMERCIAL = [
  "Alana Santos",
  "Ana Luiza",
  "Beatriz Cunha",
  "Bianca Domingues",
  "Bruna Moraes",
  "Cauê Galates",
  "Camilly Longhi",
  "Daniela Moura",
  "Fabiana Godoy",
  "Gabriel Gorgonio",
  "Gabrielle Andrade",
  "Giseli de Jesus",
  "Lara Baptista",
  "Letícia Goretti",
  "Leticia Pereira",
  "Letícia Vieira",
  "Lucas Eduardo",
  "Maria Laura",
  "Nathália",
  "Raíssa Fontoura",
  "Ana Kelly",
  "Rodolfo Henrique",
  "Kevin Cristovão",
  "Melissa Ferreira",
  "Vinicius Ribeiro",
  "Gabrielle Carvalho",
  "Paola Fernandes",
  "Jane menezes",
  "Estephany",
  "Chrystian",
  "Carliane"
];


/**
 * METAS SEMANAIS DAS EQUIPES
 *
 * Edite somente os valores abaixo quando quiser alterar as metas.
 * No botão MÊS, a meta mensal é a soma das cinco semanas.
 * Opcional: você pode adicionar `mes: 150000` em uma equipe para
 * substituir a soma automática por uma meta mensal fixa.
 */
var CONFIG_METAS_EQUIPES = {
   predadores: {
    semana1: 36900,
    semana2: 36900,
    semana3: 36900,
    semana4: 31900,
    semana5: 50000

  },

  invictus: {
    semana1: 32675,
    semana2: 32675,
    semana3: 32675,
    semana4: 26900,
    semana5: 50000
  },

  evolution: {
    semana1: 33450,
    semana2: 33450,
    semana3: 33450,
    semana4: 28450,
    semana5: 50000
  },

  vip: {
    semana1: 38450,
    semana2: 38450,
    semana3: 34225,
    semana4: 32675,
    semana5: 50000
  },

  winx: {
    semana1: 29225,
    semana2: 29225,
    semana3: 33450,
    semana4: 28450,
    semana5: 50000
  },

  alfas: {
    semana1: 36900,
    semana2: 36900,
    semana3: 36900,
    semana4: 31900,
    semana5: 50000
  },

  goat: {
    semana1: 32675,
    semana2: 32675,
    semana3: 32675,
    semana4: 28450,
    semana5: 50000
  }
};


/**
 * MEMBROS DAS EQUIPES
 *
 * O Apps Script usa esta configuração para calcular o realizado de cada baia.
 * Na primeira semana, usa `semana1`. Nas demais semanas e no mês, usa `padrao`.
 */
var CONFIG_MEMBROS_EQUIPES = {
  predadores: {
    padrao: [
      "Gabriel Gorgonio",
      "Maria Laura",
      "Raíssa Fontoura",
      "Rodolfo Henrique"
    ],
    semana1: [
      "Camilly Longhi",
      "Paola Fernandes",
      "Jane menezes"
    ]
  },

  invictus: {
    padrao: [
      "Letícia Vieira",
      "Vinicius Ribeiro",
      "Chrystian",
      "Melissa Ferreira"
    ],
    semana1: [
      "Letícia Goretti",
      "Ana Kelly",
      "Ana Luiza",
      "Leticia Pereira"
    ]
  },

  evolution: {
    padrao: [
      "Giseli de Jesus",
      "Ana Kelly",
      "Leticia Pereira",
      "Carliane",
    ],
    semana1: [
      "Cauê Galates",
      "Lara Baptista",
      "Daniela Moura",
      "Letícia Vieira"
    ]
  },

  vip: {
    padrao: [
      "Cauê Galates",
      "Daniela Moura",
      "Gabrielle Carvalho",
      "Kevin Cristovão"
    ],
    semana1: [
      "Maria Laura",
      "Gabriel Gorgonio",
      "Raíssa Fontoura",
      "Rodolfo Henrique"
    ]
  },

  winx: {
    padrao: [
      "Alana Santos",
      "Camilly Longhi",
      "Jane menezes",
      "Paola Fernandes"
    ],
    semana1: [
      "Vinicius Ribeiro",
      "Gabrielle Carvalho",
      "Melissa Ferreira",
      "Kevin Cristovão"
    ]
  },

  alfas: {
    padrao: [
      "Nathália",
      "Fabiana Godoy",
      "Bruna Moraes",
      "Gabrielle Andrade"
    ],
    semana1: [
      "Fabiana Godoy",
      "Bruna Moraes",
      "Nathália",
      "Gabrielle Andrade"
    ]
  },

  goat: {
    padrao: [
      "Beatriz Cunha",
      "Lara Baptista",
      "Lucas Eduardo",
      "Estephany"
    ],
    semana1: [
      "Beatriz Cunha",
      "Lucas Eduardo",
      "Alana Santos",
      "Eduardo Rogério"
    ]
  }
};



/**
 * Único doGet do projeto.
 *
 * Painel R2:
 * URL normal do Apps Script
 *
 * Painel das equipes:
 * ?rota=equipes&visao=semana&semana=1
 * ?rota=equipes&visao=mes
 *
 * Painel de crescimento:
 * ?rota=crescimento&mesBase=6&anoBase=2026&mesAtual=7&anoAtual=2026
 *
 * Painel da meta de 1 milhão:
 * ?rota=metaMilhao
 *
 * Ranking dos líderes:
 * ?rota=rankingLideres
 *
 * Cofre Comercial:
 * ?rota=cofreComercial
 */
function doGet(e) {
  e = e || {};
  e.parameter = e.parameter || {};

  var rota = normalizarTexto(
    e.parameter.rota || "r2"
  );

  if (rota === "EQUIPES") {
    return responderEquipes(e);
  }

  if (rota === "CRESCIMENTO") {
    return responderCrescimento(e);
  }

  if (rota === "METAMILHAO") {
    if (!validarTokenMetaMilhao_(e)) {
      return criarResposta(
        JSON.stringify({
          sucesso: false,
          painel: "metaMilhao",
          mensagem: "Não autorizado."
        }),
        validarCallbackRankingLideres(e.parameter.callback || "")
      );
    }
    return responderMetaMilhao(e);
  }

  if (rota === "RANKINGLIDERES") {
    return responderRankingLideres(e);
  }

  if (rota === "COFRECOMERCIAL") {
    return responderCofreComercial(e);
  }

  return responderR2(e);
}




/**
 * Protege a rota metaMilhao com um token salvo nas Propriedades do script.
 * Configure em: Apps Script > Configurações do projeto > Propriedades do script
 * Nome: META_API_TOKEN
 * Valor: o mesmo definido em META_APPS_SCRIPT_TOKEN na Vercel.
 */
function validarTokenMetaMilhao_(e) {
  e = e || {};
  e.parameter = e.parameter || {};

  var esperado = String(
    PropertiesService.getScriptProperties().getProperty("META_API_TOKEN") || ""
  ).trim();

  var recebido = String(e.parameter.token || "").trim();

  return esperado.length >= 24 && recebido === esperado;
}

/* =========================================================
   RANKING DOS LÍDERES
========================================================= */

function responderRankingLideres(e) {
  e = e || {};
  e.parameter = e.parameter || {};

  var callback = validarCallbackRankingLideres(
    e.parameter.callback || ""
  );

  try {
    return criarResposta(
      JSON.stringify(montarDadosRankingLideres()),
      callback
    );
  } catch (erro) {
    return criarResposta(
      JSON.stringify({
        ok: false,
        painel: "rankingLideres",
        error: erro.message,
        leaders: []
      }),
      callback
    );
  }
}


function montarDadosRankingLideres() {
  // DATA FIXA DO RANKING DOS LÍDERES: 11/08
  // Não depende mais da data atual.
  var diaHoje = 11;
  var mesHoje = 8;

  var cache = CacheService.getScriptCache();
  var cacheKey = [
    "ranking_lideres_11_08_v1",
    diaHoje,
    mesHoje
  ].join("_");
  var jsonCache = cache.get(cacheKey);

  if (jsonCache) {
    return JSON.parse(jsonCache);
  }

  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error(
      "O Apps Script não está vinculado à planilha."
    );
  }

  var aba = planilha.getSheetByName(CONFIG_RANKING_LIDERES.ABA);

  if (!aba) {
    throw new Error(
      'A aba "' + CONFIG_RANKING_LIDERES.ABA +
      '" não foi encontrada.'
    );
  }

  var totais = {};

  LIDERES_RANKING.forEach(function(nome) {
    totais[normalizarTexto(nome)] = {
      name: nome,
      quitados: 0,
      matriculas: 0,
      faturamento: 0
    };
  });

  var ultimaLinha = aba.getLastRow();

  if (ultimaLinha >= CONFIG_RANKING_LIDERES.LINHA_INICIAL) {
    var quantidadeLinhas =
      ultimaLinha - CONFIG_RANKING_LIDERES.LINHA_INICIAL + 1;

    var largura =
      CONFIG_RANKING_LIDERES.COLUNA_CURSOS -
      CONFIG_RANKING_LIDERES.COLUNA_DIA + 1;

    var linhas = aba.getRange(
      CONFIG_RANKING_LIDERES.LINHA_INICIAL,
      CONFIG_RANKING_LIDERES.COLUNA_DIA,
      quantidadeLinhas,
      largura
    ).getValues();

    var indiceMes =
      CONFIG_RANKING_LIDERES.COLUNA_MES -
      CONFIG_RANKING_LIDERES.COLUNA_DIA;

    var indiceNome =
      CONFIG_RANKING_LIDERES.COLUNA_NOME -
      CONFIG_RANKING_LIDERES.COLUNA_DIA;

    var indiceQuitado =
      CONFIG_RANKING_LIDERES.COLUNA_QUITADO -
      CONFIG_RANKING_LIDERES.COLUNA_DIA;

    var indiceValor =
      CONFIG_RANKING_LIDERES.COLUNA_VALOR -
      CONFIG_RANKING_LIDERES.COLUNA_DIA;

    var indiceCursos =
      CONFIG_RANKING_LIDERES.COLUNA_CURSOS -
      CONFIG_RANKING_LIDERES.COLUNA_DIA;

    linhas.forEach(function(linha) {
      var diaVenda = converterInteiroRankingLideres(linha[0]);
      var mesVenda = converterInteiroRankingLideres(linha[indiceMes]);

      if (diaVenda !== diaHoje || mesVenda !== mesHoje) {
        return;
      }

      var lider = totais[normalizarTexto(linha[indiceNome])];

      if (!lider) {
        return;
      }

      var tipoPagamento = normalizarTexto(linha[indiceQuitado]);
      var contaComoQuitado =
        tipoPagamento.indexOf("QUITADO") !== -1 ||
        tipoPagamento.indexOf("CARTAO") !== -1;

      if (contaComoQuitado) {
        lider.quitados++;
      }

      lider.matriculas += converterNumeroRankingLideres(
        linha[indiceCursos]
      );

      lider.faturamento = arredondarMoedaRankingLideres(
        lider.faturamento +
        converterNumeroRankingLideres(linha[indiceValor])
      );
    });
  }

  var resposta = {
    ok: true,
    painel: "rankingLideres",
    periodo: {
      dia: diaHoje,
      mes: mesHoje
    },
    updatedAt: new Date().toISOString(),
    leaders: LIDERES_RANKING.map(function(nome) {
      return totais[normalizarTexto(nome)];
    })
  };

  cache.put(
    cacheKey,
    JSON.stringify(resposta),
    CONFIG_RANKING_LIDERES.CACHE_SEGUNDOS
  );

  return resposta;
}


function converterInteiroRankingLideres(valor) {
  if (valor instanceof Date && !isNaN(valor.getTime())) {
    return valor.getDate();
  }

  var numero = parseInt(valor, 10);

  return isNaN(numero) ? 0 : numero;
}


function converterNumeroRankingLideres(valor) {
  if (typeof valor === "number") {
    return isNaN(valor) ? 0 : valor;
  }

  var texto = String(valor || "")
    .trim()
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  var numero = Number(texto);

  return isNaN(numero) ? 0 : numero;
}


function arredondarMoedaRankingLideres(valor) {
  return Math.round((Number(valor) || 0) * 100) / 100;
}


function validarCallbackRankingLideres(callback) {
  var nome = String(callback || "").trim();

  return /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(nome)
    ? nome
    : "";
}


/* =========================================================
   COFRE COMERCIAL
========================================================= */

function responderCofreComercial(e) {
  e = e || {};
  e.parameter = e.parameter || {};

  var callback = validarCallbackRankingLideres(
    e.parameter.callback || ""
  );

  var agora = new Date();
  var publico = false;
  var autorizado = false;

  try {
    var hora = Number(
      Utilities.formatDate(
        agora,
        CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
        "H"
      )
    );

    publico = hora >= CONFIG_COFRE_COMERCIAL.HORA_PUBLICA;

    var token = String(
      e.parameter.token || ""
    ).trim().toLowerCase();

    var senhaInformada = String(
      e.parameter.senha || ""
    ).trim();

    autorizado =
      publico ||
      senhaInformada === String(CONFIG_COFRE_COMERCIAL.SENHA) ||
      token === String(
        CONFIG_COFRE_COMERCIAL.SENHA_HASH
      ).toLowerCase();

    // Antes das 20h e sem senha válida, o cofre continua fechado.
    if (!autorizado) {
      return criarResposta(
        JSON.stringify({
          ok: true,
          painel: "cofreComercial",
          locked: true,
          liberado: false,
          publico: false,
          abreAs: CONFIG_COFRE_COMERCIAL.HORA_PUBLICA + ":00",
          timezone: CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
          updatedAt: agora.toISOString()
        }),
        callback
      );
    }

    // Senha correta OU horário após 20h:
    // o cofre abre independentemente de existirem resultados.
    var dados = montarDadosCofreComercial(agora) || {};

    if (!Array.isArray(dados.vendedores)) {
      dados.vendedores = [];
    }

    dados.ok = true;
    dados.painel = "cofreComercial";
    dados.publico = publico;
    dados.liberado = true;
    dados.locked = false;

    return criarResposta(
      JSON.stringify(dados),
      callback
    );

  } catch (erro) {
    // Se o usuário já foi autorizado, uma falha ao ler a planilha
    // NÃO mantém o cofre fechado. Ele abre com resultados zerados.
    if (autorizado) {
      var dia = Number(
        Utilities.formatDate(
          agora,
          CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
          "d"
        )
      );

      var mes = Number(
        Utilities.formatDate(
          agora,
          CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
          "M"
        )
      );

      var ano = Number(
        Utilities.formatDate(
          agora,
          CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
          "yyyy"
        )
      );

      return criarResposta(
        JSON.stringify({
          ok: true,
          painel: "cofreComercial",
          locked: false,
          liberado: true,
          publico: publico,
          periodo: {
            dia: dia,
            mes: mes,
            ano: ano
          },
          updatedAt: agora.toISOString(),
          vendedores: [],
          aviso: "Cofre liberado, mas nenhum resultado pôde ser carregado.",
          detalhe: erro.message
        }),
        callback
      );
    }

    return criarResposta(
      JSON.stringify({
        ok: false,
        painel: "cofreComercial",
        locked: true,
        liberado: false,
        publico: false,
        error: erro.message,
        vendedores: []
      }),
      callback
    );
  }
}

function montarDadosCofreComercial(agora) {
  agora = agora || new Date();

  var diaHoje = Number(
    Utilities.formatDate(
      agora,
      CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
      "d"
    )
  );

  var mesHoje = Number(
    Utilities.formatDate(
      agora,
      CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
      "M"
    )
  );

  var anoHoje = Number(
    Utilities.formatDate(
      agora,
      CONFIG_COFRE_COMERCIAL.FUSO_HORARIO,
      "yyyy"
    )
  );

  var cache = CacheService.getScriptCache();
  var cacheKey = [
    "cofre_comercial_v3",
    anoHoje,
    mesHoje,
    diaHoje
  ].join("_");

  var cacheJson = cache.get(cacheKey);
  if (cacheJson) {
    return JSON.parse(cacheJson);
  }

  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error("O Apps Script não está vinculado à planilha.");
  }

  var aba = planilha.getSheetByName(CONFIG_COFRE_COMERCIAL.ABA);

  if (!aba) {
    throw new Error(
      'A aba "' + CONFIG_COFRE_COMERCIAL.ABA + '" não foi encontrada.'
    );
  }

  var totais = {};

  VENDEDORES_COFRE_COMERCIAL.forEach(function(nome) {
    totais[normalizarTexto(nome)] = {
      name: nome,
      matriculas: 0,
      faturamento: 0
    };
  });

  var ultimaLinha = aba.getLastRow();

  if (ultimaLinha >= CONFIG_COFRE_COMERCIAL.LINHA_INICIAL) {
    var quantidadeLinhas =
      ultimaLinha - CONFIG_COFRE_COMERCIAL.LINHA_INICIAL + 1;

    // Lê B:R para obter data, vendedor, valor (K) e matrículas (R).
    var largura =
      CONFIG_COFRE_COMERCIAL.COLUNA_CURSOS -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA + 1;

    var intervalo = aba.getRange(
      CONFIG_COFRE_COMERCIAL.LINHA_INICIAL,
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA,
      quantidadeLinhas,
      largura
    );

    var linhas = intervalo.getValues();
    var linhasExibidas = intervalo.getDisplayValues();

    var indiceMes =
      CONFIG_COFRE_COMERCIAL.COLUNA_MES -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA;

    var indiceAno =
      CONFIG_COFRE_COMERCIAL.COLUNA_ANO -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA;

    var indiceNome =
      CONFIG_COFRE_COMERCIAL.COLUNA_NOME -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA;

    var indiceValor =
      CONFIG_COFRE_COMERCIAL.COLUNA_VALOR -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA;

    var indiceCursos =
      CONFIG_COFRE_COMERCIAL.COLUNA_CURSOS -
      CONFIG_COFRE_COMERCIAL.COLUNA_DIA;

    linhas.forEach(function(linha, i) {
      var exibida = linhasExibidas[i] || [];
      var diaVenda = converterInteiroRankingLideres(linha[0] || exibida[0]);
      var mesVenda = converterInteiroRankingLideres(
        linha[indiceMes] || exibida[indiceMes]
      );
      var anoVenda = converterInteiroRankingLideres(
        linha[indiceAno] || exibida[indiceAno]
      );

      if (
        diaVenda !== diaHoje ||
        mesVenda !== mesHoje ||
        anoVenda !== anoHoje
      ) {
        return;
      }

      var vendedor = totais[
        normalizarTexto(linha[indiceNome] || exibida[indiceNome])
      ];

      if (!vendedor) {
        return;
      }

      vendedor.matriculas += converterNumeroRankingLideres(
        linha[indiceCursos] || exibida[indiceCursos]
      );

      vendedor.faturamento = arredondarMoedaRankingLideres(
        vendedor.faturamento +
        converterValorCofreComercial(
          linha[indiceValor],
          exibida[indiceValor]
        )
      );
    });
  }

  var vendedores = VENDEDORES_COFRE_COMERCIAL.map(function(nome) {
    var item = totais[normalizarTexto(nome)];

    return {
      name: item.name,
      matriculas: item.matriculas,
      faturamento: arredondarMoedaRankingLideres(item.faturamento)
    };
  });

  var resposta = {
    ok: true,
    painel: "cofreComercial",
    periodo: {
      dia: diaHoje,
      mes: mesHoje,
      ano: anoHoje
    },
    updatedAt: agora.toISOString(),
    vendedores: vendedores
  };

  cache.put(
    cacheKey,
    JSON.stringify(resposta),
    CONFIG_COFRE_COMERCIAL.CACHE_SEGUNDOS
  );

  return resposta;
}


function converterValorCofreComercial(valorBruto, valorExibido) {
  if (
    typeof valorBruto === "number" &&
    isFinite(valorBruto)
  ) {
    return arredondarMoedaRankingLideres(valorBruto);
  }

  return arredondarMoedaRankingLideres(
    converterNumeroEquipes(valorExibido || valorBruto)
  );
}


/* =========================================================
   PAINEL META DE 1 MILHÃO
========================================================= */

function responderMetaMilhao(e) {
  var callback = validarCallbackRankingLideres(e.parameter.callback || "");
  var incluirHistorico = String(e.parameter.incluirHistorico || "1") !== "0";
  var json;

  try {
    // A meta lê somente uma célula. Não usamos CacheService aqui para evitar
    // que um valor anterior continue aparecendo depois de uma atualização.
    json = JSON.stringify(montarDadosMetaMilhao({
      incluirHistorico: incluirHistorico
    }));
  } catch (erro) {
    json = JSON.stringify({
      sucesso: false,
      painel: "metaMilhao",
      faturado: 0,
      mesAnterior: 0,
      mensagem: erro.message
    });
  }

  return criarResposta(json, callback);
}


function obterPlanilhaMetaMilhao() {
  var idConfigurado = String(CONFIG_META_MILHAO.PLANILHA_ID || "").trim();

  if (idConfigurado) {
    return SpreadsheetApp.openById(idConfigurado);
  }

  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error(
      "Não foi possível identificar a planilha da meta. " +
      "Preencha CONFIG_META_MILHAO.PLANILHA_ID com o ID da planilha correta."
    );
  }

  return planilha;
}


function montarDadosMetaMilhao(opcoes) {
  opcoes = opcoes || {};
  var incluirHistorico = opcoes.incluirHistorico !== false;
  var planilha = obterPlanilhaMetaMilhao();
  var aba = planilha.getSheetByName(CONFIG_META_MILHAO.ABA);

  if (!aba) {
    throw new Error(
      'A aba "' + CONFIG_META_MILHAO.ABA +
      '" não foi encontrada na planilha "' + planilha.getName() + '".'
    );
  }

  var intervalo = aba.getRange(CONFIG_META_MILHAO.CELULA_FATURADO);
  var valorBruto = intervalo.getValue();
  var valorExibido = intervalo.getDisplayValue();
  var faturado = converterNumeroEquipes(valorBruto);

  var intervaloMesAnterior = aba.getRange(CONFIG_META_MILHAO.CELULA_MES_ANTERIOR);
  var valorMesAnteriorBruto = intervaloMesAnterior.getValue();
  var valorMesAnteriorExibido = intervaloMesAnterior.getDisplayValue();
  var mesAnterior = converterNumeroEquipes(valorMesAnteriorBruto);

  // Mesmo fallback usado no faturamento atual para células formatadas como moeda/texto.
  if (!Number(mesAnterior) && String(valorMesAnteriorExibido || "").trim()) {
    mesAnterior = converterNumeroEquipes(valorMesAnteriorExibido);
  }

  // Fallback apenas para células cujo valor interno não seja numérico, mas
  // que estejam exibindo um número formatado como moeda/texto.
  if (!Number(faturado) && String(valorExibido || "").trim()) {
    faturado = converterNumeroEquipes(valorExibido);
  }

  var mesHistorico = converterInteiroEquipes(CONFIG_META_MILHAO.MES);
  var anoHistorico = converterInteiroEquipes(CONFIG_META_MILHAO.ANO);
  var historicoDiario = [];
  var erroHistorico = "";

  if (incluirHistorico) {
    try {
      historicoDiario = montarHistoricoDiarioMetaMilhao(
        planilha,
        mesHistorico,
        anoHistorico
      );
    } catch (erro) {
      // O faturamento principal continua funcionando mesmo se a aba de vendas
      // estiver temporariamente indisponível.
      erroHistorico = erro.message;

      // Mantém o último histórico válido em vez de apagar os dias da tela.
      historicoDiario = obterUltimoHistoricoMetaMilhao(
        mesHistorico,
        anoHistorico
      ) || [];
    }
  } else {
    // A chamada rápida atualiza o faturamento sem zerar o histórico já carregado.
    historicoDiario = obterUltimoHistoricoMetaMilhao(
      mesHistorico,
      anoHistorico
    ) || [];
  }

  var timesQuantidade = montarQuantidadesTimesMetaMilhao(planilha);

  return {
    sucesso: true,
    painel: "metaMilhao",
    faturado: faturado,
    mesAnterior: mesAnterior,
    origem: CONFIG_META_MILHAO.ABA + "!" + CONFIG_META_MILHAO.CELULA_FATURADO,
    origemMesAnterior: CONFIG_META_MILHAO.ABA + "!" + CONFIG_META_MILHAO.CELULA_MES_ANTERIOR,

    // Diagnóstico: permite conferir exatamente qual arquivo/célula a
    // implantação publicada está consultando.
    planilhaNome: planilha.getName(),
    planilhaId: planilha.getId(),
    valorBruto: valorBruto,
    valorExibido: valorExibido,
    formula: intervalo.getFormula() || "",
    valorMesAnteriorBruto: valorMesAnteriorBruto,
    valorMesAnteriorExibido: valorMesAnteriorExibido,
    formulaMesAnterior: intervaloMesAnterior.getFormula() || "",

    mes: mesHistorico,
    ano: anoHistorico,
    timesQuantidade: timesQuantidade,
    historicoDiario: historicoDiario,
    ultimosTresDias: historicoDiario.slice(-3),
    erroHistorico: erroHistorico,

    atualizadoEm: Utilities.formatDate(
      new Date(),
      CONFIG_META_MILHAO.FUSO_HORARIO,
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  };
}


function montarQuantidadesTimesMetaMilhao(planilha) {
  planilha = planilha || obterPlanilhaMetaMilhao();

  var abaTimes = planilha.getSheetByName(CONFIG_TIMES_META_MILHAO.ABA);
  if (!abaTimes) {
    throw new Error(
      'A aba "' + CONFIG_TIMES_META_MILHAO.ABA +
      '" não foi encontrada na planilha "' + planilha.getName() + '".'
    );
  }

  var resultado = {};
  var equipes = CONFIG_TIMES_META_MILHAO.EQUIPES || {};

  Object.keys(equipes).forEach(function(chave) {
    var equipe = equipes[chave] || {};
    var intervaloA1 = String(equipe.intervalo || "").trim();
    var total = 0;

    if (intervaloA1) {
      var valores = abaTimes.getRange(intervaloA1).getValues();
      for (var linha = 0; linha < valores.length; linha += 1) {
        for (var coluna = 0; coluna < valores[linha].length; coluna += 1) {
          var valor = valores[linha][coluna];
          var numero = typeof valor === 'number'
            ? valor
            : converterNumeroEquipes(valor);

          if (!isNaN(numero) && numero !== null && numero !== "") {
            total += Number(numero) || 0;
          }
        }
      }
    }

    resultado[chave] = {
      nome: String(equipe.nome || chave).toUpperCase(),
      intervalo: intervaloA1,
      quantidade: total
    };
  });

  return resultado;
}


/**
 * Soma o faturamento de cada dia do mês usando Vendas!B/C/D e Vendas!T.
 * No mês atual, retorna do dia 1 até hoje; em meses encerrados, retorna todos
 * os dias. Assim o resumo sempre inclui hoje e os dois dias anteriores, mesmo
 * quando algum deles ainda estiver com R$ 0.
 */
function obterUltimoHistoricoMetaMilhao(mes, ano) {
  try {
    var cache = CacheService.getScriptCache();
    var cacheKey = "metaMilhaoHistoricoUltimo:" + mes + ":" + ano;
    var cacheado = cache.get(cacheKey);

    if (!cacheado) {
      return null;
    }

    var historico = JSON.parse(cacheado);
    return Array.isArray(historico) ? historico : null;
  } catch (erro) {
    return null;
  }
}


function salvarUltimoHistoricoMetaMilhao(mes, ano, historico) {
  try {
    if (!Array.isArray(historico)) {
      return;
    }

    CacheService.getScriptCache().put(
      "metaMilhaoHistoricoUltimo:" + mes + ":" + ano,
      JSON.stringify(historico),
      21600
    );
  } catch (erro) {
    // O histórico principal continua funcionando mesmo se o cache auxiliar falhar.
  }
}


function montarHistoricoDiarioMetaMilhao(planilha, mes, ano) {
  if (mes < 1 || mes > 12 || ano < 2000) {
    throw new Error("Mês ou ano inválido no histórico diário da meta.");
  }

  var abaVendas = planilha.getSheetByName(CONFIG_META_MILHAO.ABA_VENDAS);

  if (!abaVendas) {
    throw new Error(
      'A aba "' + CONFIG_META_MILHAO.ABA_VENDAS +
      '" não foi encontrada para montar o histórico diário.'
    );
  }

  var cache = CacheService.getScriptCache();
  var cacheKey = "metaMilhaoHistorico:" + mes + ":" + ano;
  var cacheado = cache.get(cacheKey);

  if (cacheado) {
    try {
      return JSON.parse(cacheado);
    } catch (erroCache) {
      // Ignora cache inválido e recalcula a partir da planilha.
    }
  }

  var agora = new Date();
  var mesAtual = Number(
    Utilities.formatDate(agora, CONFIG_META_MILHAO.FUSO_HORARIO, "M")
  );
  var anoAtual = Number(
    Utilities.formatDate(agora, CONFIG_META_MILHAO.FUSO_HORARIO, "yyyy")
  );
  var ultimoDiaMes = new Date(ano, mes, 0).getDate();
  var diaLimite = ultimoDiaMes;

  if (mes === mesAtual && ano === anoAtual) {
    diaLimite = Number(
      Utilities.formatDate(agora, CONFIG_META_MILHAO.FUSO_HORARIO, "d")
    );
  }

  var totais = {};

  for (var dia = 1; dia <= diaLimite; dia++) {
    totais[dia] = 0;
  }

  var ultimaLinha = abaVendas.getLastRow();

  if (ultimaLinha >= CONFIG_META_MILHAO.LINHA_INICIAL_VENDAS) {
    var quantidadeLinhas =
      ultimaLinha - CONFIG_META_MILHAO.LINHA_INICIAL_VENDAS + 1;

    var intervaloDatas = abaVendas.getRange(
      CONFIG_META_MILHAO.LINHA_INICIAL_VENDAS,
      CONFIG_META_MILHAO.COLUNA_DIA,
      quantidadeLinhas,
      CONFIG_META_MILHAO.COLUNA_ANO - CONFIG_META_MILHAO.COLUNA_DIA + 1
    );
    var datas = intervaloDatas.getValues();
    var datasExibidas = intervaloDatas.getDisplayValues();

    var intervaloValores = abaVendas.getRange(
      CONFIG_META_MILHAO.LINHA_INICIAL_VENDAS,
      CONFIG_META_MILHAO.COLUNA_VALOR_TOTAL,
      quantidadeLinhas,
      1
    );
    var valores = intervaloValores.getValues();
    var valoresExibidos = intervaloValores.getDisplayValues();

    for (var i = 0; i < datas.length; i++) {
      var dataVenda = interpretarDataEquipes(
        datas[i][0],
        datas[i][1],
        datas[i][2],
        datasExibidas[i][0],
        datasExibidas[i][1],
        datasExibidas[i][2]
      );

      if (
        !dataVenda ||
        dataVenda.mes !== mes ||
        dataVenda.ano !== ano ||
        dataVenda.dia > diaLimite
      ) {
        continue;
      }

      totais[dataVenda.dia] = arredondarMoedaEquipes(
        (totais[dataVenda.dia] || 0) +
        interpretarValorEquipes(valores[i][0], valoresExibidos[i][0])
      );
    }
  }

  var historico = [];

  for (var numeroDia = 1; numeroDia <= diaLimite; numeroDia++) {
    historico.push({
      dia: numeroDia,
      mes: mes,
      ano: ano,
      valor: arredondarMoedaEquipes(totais[numeroDia] || 0)
    });
  }

  cache.put(cacheKey, JSON.stringify(historico), 45);

  // Guarda também uma cópia por até 6 horas para as chamadas rápidas.
  // Assim o painel não troca um histórico válido por [] enquanto atualiza o total.
  salvarUltimoHistoricoMetaMilhao(mes, ano, historico);

  return historico;
}


/* =========================================================
   PAINEL R2
========================================================= */

function responderR2(e) {
  e = e || {};
  e.parameter = e.parameter || {};
  var callback = e.parameter.callback || "";

  try {
    // IMPORTANTE: não salvar o JSON completo do R2 no CacheService.
    // O painel pode ter muitas vendas e ultrapassar o limite por chave do cache.
    // Se o cache estourar, a resposta não pode ser perdida.
    var resposta = montarDadosR2();
    return criarResposta(JSON.stringify(resposta), callback);
  } catch (erro) {
    return criarResposta(
      JSON.stringify({
        sucesso: false,
        painel: "r2",
        mensagem: erro.message,
        filtros: CONFIG_R2.VALORES_FILTRO,
        total: 0,
        dados: []
      }),
      callback
    );
  }
}


function montarDadosR2() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error("O Apps Script não está vinculado à planilha.");
  }

  var aba = planilha.getSheetByName(CONFIG_R2.ABA);

  if (!aba) {
    throw new Error(
      'A aba "' + CONFIG_R2.ABA + '" não foi encontrada.'
    );
  }

  var ultimaLinha = aba.getLastRow();

  if (ultimaLinha < CONFIG_R2.LINHA_INICIAL) {
    return {
      sucesso: true,
      painel: "r2",
      filtros: CONFIG_R2.VALORES_FILTRO,
      total: 0,
      dados: [],
      atualizadoEm: new Date().toISOString()
    };
  }

  var quantidadeLinhas =
    ultimaLinha - CONFIG_R2.LINHA_INICIAL + 1;

  var linhas = aba
    .getRange(
      CONFIG_R2.LINHA_INICIAL,
      CONFIG_R2.PRIMEIRA_COLUNA,
      quantidadeLinhas,
      CONFIG_R2.TOTAL_COLUNAS
    )
    .getDisplayValues();

  // Lê somente a coluna U (Indicação) em uma chamada separada.
  // Assim o painel continua leve e não precisa carregar as colunas N:T.
  var indicacoes = aba
    .getRange(
      CONFIG_R2.LINHA_INICIAL,
      CONFIG_R2.COLUNA_INDICACAO,
      quantidadeLinhas,
      1
    )
    .getDisplayValues();

  var filtros = CONFIG_R2.VALORES_FILTRO.map(function(valor) {
    return normalizarTexto(valor);
  });

  var dados = [];

  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];

    var valorFiltro = normalizarTexto(
      linha[CONFIG_R2.INDICE_COLUNA_FILTRO]
    );

    if (filtros.indexOf(valorFiltro) === -1) {
      continue;
    }

    dados.push({
      dia: linha[0],          // B
      mes: linha[1],          // C
      ano: linha[2],          // D
      vendedor: linha[3],     // E
      aluno: linha[4],        // F
      indicacao: indicacoes[i][0], // U
      tipoPgto: linha[5],     // G
      taxa: linha[6],         // H
      boleto: linha[7],       // I
      parcelas: linha[8],     // J
      cartao: linha[9],       // K
      pendenciaR2: linha[10], // L
      modalidade: linha[11]   // M
    });
  }

  return {
    sucesso: true,
    painel: "r2",
    filtros: CONFIG_R2.VALORES_FILTRO,
    total: dados.length,
    dados: dados,
    atualizadoEm: new Date().toISOString()
  };
}


/* =========================================================
   PAINEL DAS EQUIPES
========================================================= */

function responderEquipes(e) {
  e = e || {};
  e.parameter = e.parameter || {};

  var callback = e.parameter.callback || "";
  var hoje = new Date();

  // Evita diferença de data entre o servidor do Apps Script e o Brasil.
  var mesAtual = Number(
    Utilities.formatDate(
      hoje,
      CONFIG_EQUIPES.FUSO_HORARIO,
      "M"
    )
  );

  var anoAtual = Number(
    Utilities.formatDate(
      hoje,
      CONFIG_EQUIPES.FUSO_HORARIO,
      "yyyy"
    )
  );

  var mes = converterInteiroEquipes(e.parameter.mes) || mesAtual;
  var ano = converterInteiroEquipes(e.parameter.ano) || anoAtual;

  if (mes < 1 || mes > 12) {
    mes = mesAtual;
  }

  var semana = converterInteiroEquipes(e.parameter.semana) ||
    descobrirSemanaAtual(hoje);

  if (semana < 1 || semana > 5) {
    semana = 1;
  }

  var visao = normalizarTexto(
    e.parameter.visao || "semana"
  );

  if (visao !== "MES") {
    visao = "SEMANA";
  }

  var cache = CacheService.getScriptCache();

  var cacheKey = [
    "painel_equipes_v2",
    visao,
    ano,
    mes,
    semana
  ].join("_");

  var jsonCache = cache.get(cacheKey);
  var dadosResposta;

  try {
    if (jsonCache) {
      dadosResposta = JSON.parse(jsonCache);
    } else {
      dadosResposta = montarDadosEquipes(
        mes,
        ano,
        semana,
        visao
      );

      cache.put(
        cacheKey,
        JSON.stringify(dadosResposta),
        CONFIG_EQUIPES.CACHE_SEGUNDOS
      );
    }

    // Metas e composição das baias são lidas em toda requisição.
    // As vendas podem continuar em cache por alguns segundos.
    dadosResposta.metas = obterMetasEquipes(semana, visao);
    dadosResposta.membrosEquipes = obterMembrosTodasEquipes(
      semana,
      visao
    );
    dadosResposta.equipes = calcularTotaisEquipes(
      dadosResposta.vendedores,
      semana,
      visao
    );
    dadosResposta.totalEquipes = somarTotaisEquipes(
      dadosResposta.equipes
    );
  } catch (erro) {
    dadosResposta = {
      sucesso: false,
      painel: "equipes",
      visao: visao.toLowerCase(),
      mensagem: erro.message,
      vendedores: {},
      vendedoresLista: [],
      membrosEquipes: obterMembrosTodasEquipes(semana, visao),
      equipes: calcularTotaisEquipes({}, semana, visao),
      metas: obterMetasEquipes(semana, visao),
      totalEquipes: 0,
      totalGeral: 0
    };
  }

  return criarResposta(
    JSON.stringify(dadosResposta),
    callback
  );
}


function montarDadosEquipes(mes, ano, semana, visao) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error(
      "O Apps Script não está vinculado à planilha."
    );
  }

  var aba = planilha.getSheetByName(CONFIG_EQUIPES.ABA);

  if (!aba) {
    throw new Error(
      'A aba "' + CONFIG_EQUIPES.ABA + '" não foi encontrada.'
    );
  }

  mes = converterInteiroEquipes(mes);
  ano = converterInteiroEquipes(ano);
  semana = converterInteiroEquipes(semana);
  visao = normalizarTexto(visao || "SEMANA");

  if (mes < 1 || mes > 12 || ano < 2000) {
    throw new Error("Mês ou ano inválido no filtro do painel de times.");
  }

  if (visao !== "MES") {
    visao = "SEMANA";
  }

  var periodo = visao === "MES"
    ? obterPeriodoMes(mes, ano)
    : obterPeriodoSemana(semana, mes, ano);

  var metas = obterMetasEquipes(semana, visao);
  var ultimaLinha = aba.getLastRow();

  if (ultimaLinha < CONFIG_EQUIPES.LINHA_INICIAL) {
    return criarRetornoEquipesVazio(
      mes,
      ano,
      semana,
      visao,
      periodo,
      metas
    );
  }

  var quantidadeLinhas =
    ultimaLinha - CONFIG_EQUIPES.LINHA_INICIAL + 1;

  // Leitura de B:E: dia, mês, ano e vendedor.
  var intervaloPrincipal = aba.getRange(
    CONFIG_EQUIPES.LINHA_INICIAL,
    CONFIG_EQUIPES.COLUNA_DIA,
    quantidadeLinhas,
    CONFIG_EQUIPES.COLUNA_VENDEDOR -
      CONFIG_EQUIPES.COLUNA_DIA + 1
  );

  var dadosPrincipais = intervaloPrincipal.getValues();
  var dadosPrincipaisExibidos = intervaloPrincipal.getDisplayValues();

  // Leitura da coluna T, incluindo o valor bruto e o valor exibido.
  // O valor exibido serve como segurança quando a célula contém "R$".
  var intervaloValores = aba.getRange(
    CONFIG_EQUIPES.LINHA_INICIAL,
    CONFIG_EQUIPES.COLUNA_VALOR_TOTAL,
    quantidadeLinhas,
    1
  );

  var valoresTotais = intervaloValores.getValues();
  var valoresTotaisExibidos = intervaloValores.getDisplayValues();

  var totaisNormalizados = {};
  var nomesOriginais = {};
  var totalGeral = 0;
  var linhasConsideradas = 0;

  for (var i = 0; i < dadosPrincipais.length; i++) {
    var linha = dadosPrincipais[i];
    var linhaExibida = dadosPrincipaisExibidos[i];

    var dataVenda = interpretarDataEquipes(
      linha[0],       // B - dia ou data
      linha[1],       // C - mês
      linha[2],       // D - ano
      linhaExibida[0],
      linhaExibida[1],
      linhaExibida[2]
    );

    var vendedor = String(
      linha[3] || linhaExibida[3] || ""
    ).trim(); // E

    var valorTotalVenda = interpretarValorEquipes(
      valoresTotais[i][0],
      valoresTotaisExibidos[i][0]
    ); // T

    if (!dataVenda || !vendedor) {
      continue;
    }

    if (dataVenda.mes !== mes || dataVenda.ano !== ano) {
      continue;
    }

    if (!dataPertenceAoPeriodoEquipes(dataVenda, periodo)) {
      continue;
    }

    var chaveVendedor = normalizarTexto(vendedor);

    if (!chaveVendedor) {
      continue;
    }

    if (
      !Object.prototype.hasOwnProperty.call(
        totaisNormalizados,
        chaveVendedor
      )
    ) {
      totaisNormalizados[chaveVendedor] = 0;
      nomesOriginais[chaveVendedor] = vendedor;
    }

    totaisNormalizados[chaveVendedor] = arredondarMoedaEquipes(
      totaisNormalizados[chaveVendedor] + valorTotalVenda
    );

    totalGeral = arredondarMoedaEquipes(
      totalGeral + valorTotalVenda
    );

    linhasConsideradas++;
  }

  var vendedores = {};
  var vendedoresLista = [];

  Object.keys(totaisNormalizados).forEach(function(chave) {
    var nome = nomesOriginais[chave];
    var total = totaisNormalizados[chave];

    // Mantém as duas formas para o index localizar com ou sem acento.
    vendedores[nome] = total;
    vendedores[chave] = total;

    vendedoresLista.push({
      nome: nome,
      chave: chave,
      total: total
    });
  });

  vendedoresLista.sort(function(a, b) {
    return b.total - a.total;
  });

  var equipes = calcularTotaisEquipes(
    vendedores,
    semana,
    visao
  );

  var totalEquipes = somarTotaisEquipes(equipes);

  return {
    sucesso: true,
    painel: "equipes",
    visao: visao.toLowerCase(),
    semana: semana,
    periodo: periodo,
    mes: mes,
    ano: ano,
    origem: {
      aba: CONFIG_EQUIPES.ABA,
      data: "B/C/D",
      vendedor: "E",
      valor: "T"
    },
    linhasConsideradas: linhasConsideradas,
    vendedores: vendedores,
    vendedoresLista: vendedoresLista,
    membrosEquipes: obterMembrosTodasEquipes(semana, visao),
    equipes: equipes,
    metas: metas,
    totalEquipes: totalEquipes,
    totalGeral: totalGeral,
    atualizadoEm: Utilities.formatDate(
      new Date(),
      CONFIG_EQUIPES.FUSO_HORARIO,
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  };
}

function criarRetornoEquipesVazio(mes, ano, semana, visao, periodo, metas) {
  return {
    sucesso: true,
    painel: "equipes",
    visao: visao.toLowerCase(),
    semana: semana,
    periodo: periodo,
    mes: mes,
    ano: ano,
    vendedores: {},
    vendedoresLista: [],
    membrosEquipes: obterMembrosTodasEquipes(semana, visao),
    equipes: calcularTotaisEquipes({}, semana, visao),
    metas: metas || obterMetasEquipes(semana, visao),
    totalEquipes: 0,
    totalGeral: 0,
    atualizadoEm: new Date().toISOString()
  };
}


/* =========================================================
   TOTAIS DAS EQUIPES
========================================================= */

function obterMembrosEquipe(equipeId, semana, visao) {
  var configuracao = CONFIG_MEMBROS_EQUIPES[equipeId] || {};
  var usarSemana1 =
    normalizarTexto(visao) !== "MES" &&
    converterInteiroEquipes(semana) === 1;

  if (usarSemana1 && Array.isArray(configuracao.semana1)) {
    return configuracao.semana1;
  }

  return Array.isArray(configuracao.padrao)
    ? configuracao.padrao
    : [];
}


function obterMembrosTodasEquipes(semana, visao) {
  var membrosEquipes = {};

  Object.keys(CONFIG_MEMBROS_EQUIPES).forEach(function(equipeId) {
    membrosEquipes[equipeId] = obterMembrosEquipe(
      equipeId,
      semana,
      visao
    ).slice();
  });

  return membrosEquipes;
}


function calcularTotaisEquipes(vendedores, semana, visao) {
  var vendedoresNormalizados = {};
  var totaisEquipes = {};

  Object.keys(vendedores || {}).forEach(function(nome) {
    var chave = normalizarTexto(nome);
    var valor = converterNumeroEquipes(vendedores[nome]);

    if (!chave) {
      return;
    }

    vendedoresNormalizados[chave] = Math.max(
      converterNumeroEquipes(vendedoresNormalizados[chave]),
      valor
    );
  });

  Object.keys(CONFIG_MEMBROS_EQUIPES).forEach(function(equipeId) {
    var membros = obterMembrosEquipe(equipeId, semana, visao);
    var total = 0;

    membros.forEach(function(nome) {
      total += converterNumeroEquipes(
        vendedoresNormalizados[normalizarTexto(nome)]
      );
    });

    totaisEquipes[equipeId] = arredondarMoedaEquipes(total);
  });

  return totaisEquipes;
}


function somarTotaisEquipes(equipes) {
  var total = 0;

  Object.keys(equipes || {}).forEach(function(equipeId) {
    total += converterNumeroEquipes(equipes[equipeId]);
  });

  return arredondarMoedaEquipes(total);
}


/* =========================================================
   METAS DAS EQUIPES
========================================================= */

function obterMetasEquipes(semana, visao) {
  var metas = {};
  var chaveSemana = "semana" + semana;
  var modoMes = normalizarTexto(visao) === "MES";

  Object.keys(CONFIG_METAS_EQUIPES).forEach(function(equipeId) {
    var configuracao = CONFIG_METAS_EQUIPES[equipeId] || {};

    if (modoMes) {
      if (
        configuracao.mes !== undefined &&
        configuracao.mes !== null &&
        configuracao.mes !== ""
      ) {
        metas[equipeId] = converterNumeroEquipes(configuracao.mes);
        return;
      }

      metas[equipeId] =
        converterNumeroEquipes(configuracao.semana1) +
        converterNumeroEquipes(configuracao.semana2) +
        converterNumeroEquipes(configuracao.semana3) +
        converterNumeroEquipes(configuracao.semana4) +
        converterNumeroEquipes(configuracao.semana5);

      return;
    }

    metas[equipeId] = converterNumeroEquipes(
      configuracao[chaveSemana]
    );
  });

  return metas;
}


/* =========================================================
   PERÍODOS
========================================================= */

/**
 * Semanas comerciais configuradas para julho de 2026:
 * 1ª: 1 a 4
 * 2ª: 6 a 11
 * 3ª: 13 a 18
 * 4ª: 20 a 25
 * 5ª: 27 até o final do mês
 */
function obterPeriodoSemana(semana, mes, ano) {
  var ultimoDiaDoMes = new Date(
    ano,
    mes,
    0
  ).getDate();

  var periodos = {
    1: {
      tipo: "semana",
      inicio: 1,
      fim: Math.min(4, ultimoDiaDoMes),
      mes: mes,
      ano: ano
    },

    2: {
      tipo: "semana",
      inicio: 6,
      fim: Math.min(11, ultimoDiaDoMes),
      mes: mes,
      ano: ano
    },

    3: {
      tipo: "semana",
      inicio: 13,
      fim: Math.min(18, ultimoDiaDoMes),
      mes: mes,
      ano: ano
    },

    4: {
      tipo: "semana",
      inicio: 20,
      fim: Math.min(25, ultimoDiaDoMes),
      mes: mes,
      ano: ano
    },

    5: {
      tipo: "semana",
      inicio: 27,
      fim: ultimoDiaDoMes,
      mes: mes,
      ano: ano
    }
  };

  return periodos[semana] || periodos[1];
}


function obterPeriodoMes(mes, ano) {
  return {
    tipo: "mes",
    inicio: 1,
    fim: new Date(ano, mes, 0).getDate(),
    mes: mes,
    ano: ano,
    diasConsiderados: "segunda a sábado"
  };
}


/**
 * Retorna true para segunda, terça, quarta, quinta, sexta e sábado.
 * Domingo (getDay() === 0) não entra no total mensal.
 */
function diaUtilComercial(dia, mes, ano) {
  var ultimoDia = new Date(ano, mes, 0).getDate();

  if (dia < 1 || dia > ultimoDia) {
    return false;
  }

  var data = new Date(ano, mes - 1, dia);

  return data.getDay() !== 0;
}


/**
 * Aceita tanto B/C/D separados quanto uma data completa na coluna B.
 */
function interpretarDataEquipes(
  valorDia,
  valorMes,
  valorAno,
  diaExibido,
  mesExibido,
  anoExibido
) {
  if (
    valorDia instanceof Date &&
    !isNaN(valorDia.getTime())
  ) {
    return {
      dia: Number(
        Utilities.formatDate(
          valorDia,
          CONFIG_EQUIPES.FUSO_HORARIO,
          "d"
        )
      ),
      mes: Number(
        Utilities.formatDate(
          valorDia,
          CONFIG_EQUIPES.FUSO_HORARIO,
          "M"
        )
      ),
      ano: Number(
        Utilities.formatDate(
          valorDia,
          CONFIG_EQUIPES.FUSO_HORARIO,
          "yyyy"
        )
      )
    };
  }

  var dia = converterInteiroEquipes(valorDia || diaExibido);
  var mes = converterInteiroEquipes(valorMes || mesExibido);
  var ano = converterInteiroEquipes(valorAno || anoExibido);

  if (ano > 0 && ano < 100) {
    ano += 2000;
  }

  if (
    dia < 1 || dia > 31 ||
    mes < 1 || mes > 12 ||
    ano < 2000
  ) {
    // Segurança para o caso de B vir como texto no formato dd/mm/aaaa.
    var textoData = String(diaExibido || valorDia || "").trim();
    var partes = textoData.match(
      /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/
    );

    if (!partes) {
      return null;
    }

    dia = Number(partes[1]);
    mes = Number(partes[2]);
    ano = Number(partes[3]);

    if (ano < 100) {
      ano += 2000;
    }
  }

  var ultimoDia = new Date(ano, mes, 0).getDate();

  if (dia > ultimoDia) {
    return null;
  }

  return {
    dia: dia,
    mes: mes,
    ano: ano
  };
}


function interpretarValorEquipes(valorBruto, valorExibido) {
  if (
    typeof valorBruto === "number" &&
    isFinite(valorBruto)
  ) {
    return arredondarMoedaEquipes(valorBruto);
  }

  return arredondarMoedaEquipes(
    converterNumeroEquipes(valorExibido || valorBruto)
  );
}


function dataPertenceAoPeriodoEquipes(dataVenda, periodo) {
  if (!dataVenda || !periodo) {
    return false;
  }

  if (
    dataVenda.dia < periodo.inicio ||
    dataVenda.dia > periodo.fim
  ) {
    return false;
  }

  if (
    CONFIG_EQUIPES.IGNORAR_DOMINGO &&
    !diaUtilComercial(
      dataVenda.dia,
      dataVenda.mes,
      dataVenda.ano
    )
  ) {
    return false;
  }

  return true;
}


function arredondarMoedaEquipes(valor) {
  return Math.round((Number(valor) || 0) * 100) / 100;
}


function descobrirSemanaAtual(data) {
  var dia = Number(
    Utilities.formatDate(
      data,
      CONFIG_EQUIPES.FUSO_HORARIO,
      "d"
    )
  );

  if (dia <= 5) {
    return 1;
  }

  if (dia <= 12) {
    return 2;
  }

  if (dia <= 19) {
    return 3;
  }

  if (dia <= 26) {
    return 4;
  }

  return 5;
}



/* =========================================================
   PAINEL DE CRESCIMENTO — JUNHO X JULHO
========================================================= */

function responderCrescimento(e) {
  var callback = validarCallbackCrescimento(
    e.parameter.callback || ""
  );

  var agora = new Date();
  var anoPadrao = Number(
    Utilities.formatDate(
      agora,
      CONFIG_CRESCIMENTO.FUSO_HORARIO,
      "yyyy"
    )
  );

  var mesBase = converterInteiroCrescimento(
    e.parameter.mesBase,
    6
  );

  var anoBase = converterInteiroCrescimento(
    e.parameter.anoBase,
    anoPadrao
  );

  var mesAtual = converterInteiroCrescimento(
    e.parameter.mesAtual,
    7
  );

  var anoAtual = converterInteiroCrescimento(
    e.parameter.anoAtual,
    anoPadrao
  );

  var cache = CacheService.getScriptCache();
  var cacheKey = [
    "painel_crescimento",
    mesBase,
    anoBase,
    mesAtual,
    anoAtual
  ].join("_");

  var json = cache.get(cacheKey);

  try {
    validarMesCrescimento(mesBase);
    validarMesCrescimento(mesAtual);

    if (!json) {
      json = JSON.stringify(
        montarComparativoCrescimento(
          mesBase,
          anoBase,
          mesAtual,
          anoAtual
        )
      );

      cache.put(
        cacheKey,
        json,
        CONFIG_CRESCIMENTO.CACHE_SEGUNDOS
      );
    }
  } catch (erro) {
    json = JSON.stringify({
      sucesso: false,
      painel: "crescimento",
      mensagem: erro.message,
      base: {},
      atual: {},
      crescimentoTotal: {},
      dias: []
    });
  }

  return criarResposta(json, callback);
}


function montarComparativoCrescimento(
  mesBase,
  anoBase,
  mesAtual,
  anoAtual
) {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();

  if (!planilha) {
    throw new Error(
      "O Apps Script não está vinculado à planilha."
    );
  }

  var diaLimite = obterDiaLimiteCrescimento(
    mesAtual,
    anoAtual
  );

  var valoresBase = lerFaturamentoPorDiaCrescimento(
    planilha,
    mesBase,
    anoBase,
    diaLimite
  );

  var valoresAtuais = lerFaturamentoPorDiaCrescimento(
    planilha,
    mesAtual,
    anoAtual,
    diaLimite
  );

  var dias = [];
  var totalBase = 0;
  var totalAtual = 0;

  for (var dia = 1; dia <= diaLimite; dia++) {
    var base = arredondarMoedaCrescimento(
      valoresBase[dia] || 0
    );

    var atual = arredondarMoedaCrescimento(
      valoresAtuais[dia] || 0
    );

    var diferenca = arredondarMoedaCrescimento(
      atual - base
    );

    totalBase += base;
    totalAtual += atual;

    dias.push({
      dia: dia,
      base: base,
      atual: atual,
      diferenca: diferenca,
      crescimento: calcularPercentualCrescimento(
        base,
        atual
      )
    });
  }

  totalBase = arredondarMoedaCrescimento(totalBase);
  totalAtual = arredondarMoedaCrescimento(totalAtual);

  return {
    sucesso: true,
    painel: "crescimento",

    base: {
      mes: CONFIG_CRESCIMENTO.MESES[mesBase].nome,
      numeroMes: mesBase,
      ano: anoBase,
      total: totalBase
    },

    atual: {
      mes: CONFIG_CRESCIMENTO.MESES[mesAtual].nome,
      numeroMes: mesAtual,
      ano: anoAtual,
      total: totalAtual
    },

    crescimentoTotal: {
      diferenca: arredondarMoedaCrescimento(
        totalAtual - totalBase
      ),
      crescimento: calcularPercentualCrescimento(
        totalBase,
        totalAtual
      )
    },

    dias: dias,

    atualizadoEm: Utilities.formatDate(
      new Date(),
      CONFIG_CRESCIMENTO.FUSO_HORARIO,
      "yyyy-MM-dd'T'HH:mm:ss"
    )
  };
}


function lerFaturamentoPorDiaCrescimento(
  planilha,
  numeroMes,
  ano,
  diaLimite
) {
  var configuracao = CONFIG_CRESCIMENTO.MESES[numeroMes];
  var aba = planilha.getSheetByName(configuracao.aba);

  if (!aba) {
    throw new Error(
      'A aba "' + configuracao.aba + '" não foi encontrada.'
    );
  }

  var ultimaLinha = aba.getLastRow();
  var totais = {};

  if (ultimaLinha < CONFIG_CRESCIMENTO.LINHA_INICIAL) {
    return totais;
  }

  var quantidadeLinhas =
    ultimaLinha - CONFIG_CRESCIMENTO.LINHA_INICIAL + 1;

  var largura =
    configuracao.colunaValor - configuracao.colunaData + 1;

  var intervalo = aba.getRange(
    CONFIG_CRESCIMENTO.LINHA_INICIAL,
    configuracao.colunaData,
    quantidadeLinhas,
    largura
  );

  var valores = intervalo.getValues();
  var valoresExibidos = intervalo.getDisplayValues();
  var indiceValor =
    configuracao.colunaValor - configuracao.colunaData;

  for (var i = 0; i < valores.length; i++) {
    var data = interpretarDataCrescimento(
      valores[i][0],
      valoresExibidos[i][0],
      numeroMes,
      ano
    );

    if (!data) {
      continue;
    }

    if (data.mes !== numeroMes || data.ano !== ano) {
      continue;
    }

    if (data.dia < 1 || data.dia > diaLimite) {
      continue;
    }

    var valor = interpretarValorCrescimento(
      valores[i][indiceValor],
      valoresExibidos[i][indiceValor]
    );

    totais[data.dia] = arredondarMoedaCrescimento(
      (totais[data.dia] || 0) + valor
    );
  }

  return totais;
}


function interpretarDataCrescimento(
  valorBruto,
  valorExibido,
  mesPadrao,
  anoPadrao
) {
  if (
    valorBruto instanceof Date &&
    !isNaN(valorBruto.getTime())
  ) {
    return {
      dia: Number(
        Utilities.formatDate(
          valorBruto,
          CONFIG_CRESCIMENTO.FUSO_HORARIO,
          "d"
        )
      ),
      mes: Number(
        Utilities.formatDate(
          valorBruto,
          CONFIG_CRESCIMENTO.FUSO_HORARIO,
          "M"
        )
      ),
      ano: Number(
        Utilities.formatDate(
          valorBruto,
          CONFIG_CRESCIMENTO.FUSO_HORARIO,
          "yyyy"
        )
      )
    };
  }

  if (
    typeof valorBruto === "number" &&
    isFinite(valorBruto) &&
    valorBruto >= 1 &&
    valorBruto <= 31
  ) {
    return {
      dia: Math.floor(valorBruto),
      mes: mesPadrao,
      ano: anoPadrao
    };
  }

  var texto = String(
    valorExibido || valorBruto || ""
  ).trim();

  if (!texto) {
    return null;
  }

  var correspondencia = texto.match(
    /^(\d{1,2})[\/-](\d{1,2})(?:[\/-](\d{2,4}))?$/
  );

  if (correspondencia) {
    var ano = correspondencia[3]
      ? Number(correspondencia[3])
      : anoPadrao;

    if (ano < 100) {
      ano += 2000;
    }

    return {
      dia: Number(correspondencia[1]),
      mes: Number(correspondencia[2]),
      ano: ano
    };
  }

  correspondencia = texto.match(
    /^(\d{4})-(\d{1,2})-(\d{1,2})/
  );

  if (correspondencia) {
    return {
      dia: Number(correspondencia[3]),
      mes: Number(correspondencia[2]),
      ano: Number(correspondencia[1])
    };
  }

  if (/^\d{1,2}$/.test(texto)) {
    return {
      dia: Number(texto),
      mes: mesPadrao,
      ano: anoPadrao
    };
  }

  return null;
}


function interpretarValorCrescimento(
  valorBruto,
  valorExibido
) {
  if (
    typeof valorBruto === "number" &&
    isFinite(valorBruto)
  ) {
    return valorBruto;
  }

  return converterNumeroEquipes(
    valorExibido || valorBruto
  );
}


function obterDiaLimiteCrescimento(mes, ano) {
  var hoje = new Date();

  var anoHoje = Number(
    Utilities.formatDate(
      hoje,
      CONFIG_CRESCIMENTO.FUSO_HORARIO,
      "yyyy"
    )
  );

  var mesHoje = Number(
    Utilities.formatDate(
      hoje,
      CONFIG_CRESCIMENTO.FUSO_HORARIO,
      "M"
    )
  );

  var diaHoje = Number(
    Utilities.formatDate(
      hoje,
      CONFIG_CRESCIMENTO.FUSO_HORARIO,
      "d"
    )
  );

  var ultimoDiaDoMes = new Date(
    ano,
    mes,
    0
  ).getDate();

  if (ano === anoHoje && mes === mesHoje) {
    return Math.min(diaHoje, ultimoDiaDoMes);
  }

  if (
    ano > anoHoje ||
    (ano === anoHoje && mes > mesHoje)
  ) {
    return 0;
  }

  return ultimoDiaDoMes;
}


function calcularPercentualCrescimento(base, atual) {
  if (base === 0 && atual === 0) {
    return 0;
  }

  if (base === 0 && atual > 0) {
    return null;
  }

  return ((atual - base) / base) * 100;
}


function arredondarMoedaCrescimento(valor) {
  return Math.round((Number(valor) || 0) * 100) / 100;
}


function validarMesCrescimento(mes) {
  if (!CONFIG_CRESCIMENTO.MESES[mes]) {
    throw new Error(
      "O mês " + mes +
      " não está configurado. Use Junho ou Julho."
    );
  }
}


function converterInteiroCrescimento(valor, padrao) {
  var numero = Number(valor);

  return numero % 1 === 0
    ? numero
    : padrao;
}


function validarCallbackCrescimento(callback) {
  var nome = String(callback || "").trim();

  return /^[A-Za-z_$][0-9A-Za-z_$\.]*$/.test(nome)
    ? nome
    : "";
}


/* =========================================================
   FUNÇÕES AUXILIARES
========================================================= */

function converterInteiroEquipes(valor) {
  if (valor instanceof Date) {
    return valor.getDate();
  }

  var numero = parseInt(valor, 10);

  return isNaN(numero) ? 0 : numero;
}


function converterNumeroEquipes(valor) {
  if (typeof valor === "number") {
    return isNaN(valor) ? 0 : valor;
  }

  var texto = String(valor || "")
    .trim()
    .replace(/R\$/gi, "")
    .replace(/\s/g, "");

  if (
    texto.indexOf(".") !== -1 &&
    texto.indexOf(",") !== -1
  ) {
    texto = texto
      .replace(/\./g, "")
      .replace(",", ".");
  } else if (texto.indexOf(",") !== -1) {
    texto = texto.replace(",", ".");
  }

  var numero = Number(texto);

  return isNaN(numero) ? 0 : numero;
}


function normalizarTexto(valor) {
  return String(valor || "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function criarResposta(json, callback) {
  if (callback) {
    return ContentService
      .createTextOutput(
        callback + "(" + json + ")"
      )
      .setMimeType(
        ContentService.MimeType.JAVASCRIPT
      );
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(
      ContentService.MimeType.JSON
    );
}


/* =========================================================
   TESTES
========================================================= */

function testarMetaMilhao() {
  var resultado = montarDadosMetaMilhao();

  Logger.log(
    JSON.stringify(resultado, null, 2)
  );
}


function testarCrescimento() {
  var resultado = montarComparativoCrescimento(
    6,
    2026,
    7,
    2026
  );

  Logger.log(
    JSON.stringify(resultado, null, 2)
  );
}


function testarR2() {
  var resultado = montarDadosR2();

  Logger.log(
    JSON.stringify(resultado, null, 2)
  );
}


function testarEquipesSemana() {
  var hoje = new Date();

  var resultado = montarDadosEquipes(
    hoje.getMonth() + 1,
    hoje.getFullYear(),
    descobrirSemanaAtual(hoje),
    "SEMANA"
  );

  Logger.log(
    JSON.stringify(resultado, null, 2)
  );
}


function testarEquipesMes() {
  var hoje = new Date();

  var resultado = montarDadosEquipes(
    hoje.getMonth() + 1,
    hoje.getFullYear(),
    1,
    "MES"
  );

  Logger.log(
    JSON.stringify(resultado, null, 2)
  );
}



function testarCofreComercial() {
  var resultado = montarDadosCofreComercial(new Date());
  Logger.log(JSON.stringify(resultado, null, 2));
}