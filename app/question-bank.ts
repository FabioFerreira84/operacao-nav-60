export type Subject = "Inglês" | "RLM" | "Português" | "Ética" | "Informática";

export type Question = {
  id: string;
  subject: Subject;
  skill: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  context?: string;
  stem: string;
  options: string[];
  correct: number;
  explanation: string;
};

export type MockExam = {
  id: string;
  level: number;
  title: string;
  label: string;
  questions: Question[];
};

const difficultyLabels = ["Fundação", "Consolidação", "Aplicação", "Pressão", "Prova-alvo"];

function item(
  id: string,
  subject: Subject,
  skill: string,
  difficulty: number,
  stem: string,
  correctText: string,
  distractors: string[],
  explanation: string,
  context?: string,
): Question {
  const raw = [correctText, ...distractors.slice(0, 4)];
  const shift = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;
  const options = [...raw.slice(shift), ...raw.slice(0, shift)];
  return {
    id,
    subject,
    skill,
    difficulty: difficulty as Question["difficulty"],
    context,
    stem,
    options,
    correct: options.indexOf(correctText),
    explanation,
  };
}

function englishQuestions(level: number): Question[] {
  const companies = ["Aster", "BlueHarbor", "Ceres", "DeltaGate", "Estrela"];
  const goods = ["medical sensors", "solar panels", "water pumps", "server components", "safety equipment"];
  const ports = ["Santos", "Rotterdam", "Singapore", "Hamburg", "Cartagena"];
  const delays = [2, 3, 4, 5, 6].map((n) => n + level);
  const quantities = [120, 180, 240, 300, 360].map((n) => n + level * 20);

  const passages = [
    {
      skill: "Ideia central e scanning",
      term: "shipment",
      meaning: "remessa",
      text: `${companies[level - 1]} confirmed that a shipment of ${quantities[0]} ${goods[0]} will leave the port of ${ports[0]} on Friday. The buyer must send the signed invoice before noon; otherwise, loading will be postponed by ${delays[0]} days.`,
      main: "Confirmar um embarque e estabelecer uma condição documental.",
      detail: "A fatura assinada deve ser enviada antes do meio-dia.",
      inference: "O atraso do documento pode alterar a data de carregamento.",
    },
    {
      skill: "Inferência em logística",
      term: "warehouse",
      meaning: "armazém",
      text: `Due to limited warehouse space, ${companies[(level + 1) % 5]} will receive only ${quantities[1]} units this week. The remaining goods will be stored near ${ports[1]} until the importer confirms that customs clearance has been completed.`,
      main: "Explicar uma entrega parcial condicionada à liberação aduaneira.",
      detail: `A empresa receberá ${quantities[1]} unidades nesta semana.`,
      inference: "Parte da mercadoria permanecerá armazenada temporariamente.",
    },
    {
      skill: "Correspondência comercial",
      term: "supplier",
      meaning: "fornecedor",
      text: `Dear supplier, we noticed that the purchase order lists ${quantities[2]} units, whereas your confirmation mentions ${quantities[2] - 20}. Please review the figures and issue a corrected document by Wednesday so that production is not interrupted.`,
      main: "Solicitar a correção de uma divergência no pedido.",
      detail: `Há uma diferença de 20 unidades entre os documentos.`,
      inference: "A falta de correção pode afetar a produção.",
    },
    {
      skill: "Conectores e causa",
      term: "therefore",
      meaning: "portanto",
      text: `The freight rate increased after the carrier changed the route to ${ports[3]}. Therefore, the exporter proposed consolidating two smaller orders into one container. This measure may reduce the cost per unit, although delivery will take ${delays[3]} additional days.`,
      main: "Apresentar uma medida para reduzir custo unitário de transporte.",
      detail: "A consolidação pode aumentar o prazo de entrega.",
      inference: "A proposta troca velocidade por economia.",
    },
    {
      skill: "Voz passiva e contexto",
      term: "bill of lading",
      meaning: "conhecimento de embarque",
      text: `The bill of lading was issued after the cargo had been inspected. However, the consignee's address was entered incorrectly. A revised copy must be provided before the goods can be released at ${ports[4]}.`,
      main: "Relatar um erro documental que impede a liberação da carga.",
      detail: "O endereço do consignatário foi registrado incorretamente.",
      inference: "A carga ainda não pode ser liberada.",
    },
  ];

  return passages.flatMap((passage, index) => {
    const prefix = `S${level}-EN-${index + 1}`;
    const otherMain = [
      "Descrever regras de segurança de um aeroporto.",
      "Anunciar a contratação de novos empregados.",
      "Comparar modelos de aeronaves comerciais.",
      "Apresentar resultados de uma pesquisa acadêmica.",
    ];
    return [
      item(prefix + "A", "Inglês", passage.skill, level, "The main purpose of the text is to:", passage.main, otherMain, `O texto se organiza em torno de: ${passage.main.toLowerCase()}`, passage.text),
      item(prefix + "B", "Inglês", "Busca de informação específica", level, "According to the text, which statement is correct?", passage.detail, ["A carga já foi integralmente liberada.", "O comprador cancelou definitivamente o pedido.", "O transporte ocorrerá sem documentos.", "A empresa rejeitou todas as mercadorias."], `A informação aparece de forma explícita: ${passage.detail}`, passage.text),
      item(prefix + "C", "Inglês", "Vocabulário em contexto", level, `In the text, “${passage.term}” is closest in meaning to:`, passage.meaning, ["seguro", "tripulação", "pista", "salário"], `No contexto de comércio exterior, “${passage.term}” significa ${passage.meaning}.`, passage.text),
      item(prefix + "D", "Inglês", "Inferência", level, "It can be inferred from the text that:", passage.inference, ["Nenhum documento será necessário.", "O processo foi cancelado sem possibilidade de retomada.", "O texto trata de transporte de passageiros.", "A empresa desconhece a existência da carga."], `A inferência compatível com as relações de causa e consequência é: ${passage.inference}`, passage.text),
    ];
  });
}

function rlmQuestions(level: number): Question[] {
  const q: Question[] = [];
  const id = (n: number) => `S${level}-RL-${String(n).padStart(2, "0")}`;
  const base = 200 + level * 40;
  const pct = 5 * (level + 1);
  const percentAnswer = (base * pct) / 100;
  q.push(item(id(1), "RLM", "Porcentagem", level, `Um lote tem ${base} itens. ${pct}% foram retidos. Quantos itens foram retidos?`, String(percentAnswer), [String(percentAnswer + 12), String(percentAnswer - 8), String(base - percentAnswer), String(pct)], `${pct}% de ${base} = ${base} × ${pct / 100} = ${percentAnswer}.`));

  const a = level + 2;
  const b = level + 3;
  const total = (a + b) * 10;
  q.push(item(id(2), "RLM", "Razão e proporção", level, `Dois setores dividem ${total} tarefas na razão ${a}:${b}. Quantas ficam com o primeiro setor?`, String(a * 10), [String(b * 10), String(total / 2), String(a + b), String(total - a)], `A razão possui ${a + b} partes; cada parte vale 10. O primeiro setor recebe ${a * 10}.`));

  const universe = 60 + 5 * level;
  const setA = 30 + 2 * level;
  const setB = 25 + 2 * level;
  const both = 10 + level;
  const neither = universe - (setA + setB - both);
  q.push(item(id(3), "RLM", "Conjuntos", level, `Entre ${universe} candidatos, ${setA} estudam Inglês, ${setB} estudam RLM e ${both} estudam ambos. Quantos não estudam nenhuma dessas disciplinas?`, String(neither), [String(setA + setB), String(both), String(universe - both), String(setA + setB - both)], `Pela inclusão-exclusão, a união é ${setA} + ${setB} - ${both}; o restante é ${neither}.`));

  const universalObjects = ["relatórios foram revisados", "pedidos foram aprovados", "candidatos chegaram cedo", "arquivos foram assinados", "setores cumpriram a meta"];
  const universal = universalObjects[level - 1];
  const universalNegations = ["Pelo menos um relatório não foi revisado.", "Pelo menos um pedido não foi aprovado.", "Pelo menos um candidato não chegou cedo.", "Pelo menos um arquivo não foi assinado.", "Pelo menos um setor não cumpriu a meta."];
  q.push(item(id(4), "RLM", "Negação lógica", level, `A negação de “Todos os ${universal}” é:`, universalNegations[level - 1], [`Nenhum dos ${universal}.`, `Todos os casos falharam.`, `Alguns dos ${universal}.`, `Talvez todos os ${universal}.`], "A negação de uma afirmação universal exige ao menos um contraexemplo."));
  const implicationPairs = [
    ["documento está correto", "carga é liberada"],
    ["alarme toca", "equipe é avisada"],
    ["prazo termina", "sistema bloqueia o envio"],
    ["senha é válida", "acesso é autorizado"],
    ["prova é concluída", "cartão é entregue"],
  ];
  const [premise, conclusion] = implicationPairs[level - 1];
  q.push(item(id(5), "RLM", "Equivalência lógica", level, `A proposição “Se ${premise}, então ${conclusion}” é equivalente a:`, `${premise.replace("está", "não está").replace("toca", "não toca").replace("termina", "não termina").replace("é válida", "não é válida").replace("é concluída", "não é concluída")} ou ${conclusion}.`, [`${premise} e ${conclusion}.`, `Se ${conclusion}, então ${premise}.`, `${premise} e não ${conclusion}.`, `${conclusion} se, e somente se, ${premise}.`], "A equivalência de p implica q é: não p ou q."));

  const first = level + 2;
  const diff = level + 2;
  const eighth = first + 7 * diff;
  q.push(item(id(6), "RLM", "Sequências", level, `Na sequência ${first}, ${first + diff}, ${first + 2 * diff}, ... qual é o 8º termo?`, String(eighth), [String(eighth - diff), String(eighth + diff), String(eighth - 2 * diff), String(eighth + 2 * diff)], `É uma PA: a8 = ${first} + 7 × ${diff} = ${eighth}.`));

  const success = 2 + level;
  const totalBalls = 10 + 2 * level;
  q.push(item(id(7), "RLM", "Probabilidade", level, `Uma caixa contém ${totalBalls} fichas, das quais ${success} são verdes. A probabilidade de retirar uma ficha verde é:`, `${success}/${totalBalls}`, [`${totalBalls - success}/${totalBalls}`, `${success}/${totalBalls - success}`, `1/${totalBalls}`, `${success - 1}/${totalBalls}`], `Casos favoráveis sobre casos possíveis: ${success}/${totalBalls}.`));

  const n = 5 + level;
  const pairs = (n * (n - 1)) / 2;
  q.push(item(id(8), "RLM", "Análise combinatória", level, `Uma equipe escolherá 2 representantes entre ${n} pessoas. Quantas duplas distintas podem ser formadas?`, String(pairs), [String(n * 2), String(n * (n - 1)), String(n + 2), String((n - 1) * 2)], `A ordem não importa: C(${n},2) = ${n}×${n - 1}/2 = ${pairs}.`));

  const width = 6 + level;
  const height = 4 + level;
  q.push(item(id(9), "RLM", "Geometria básica", level, `Uma sala retangular mede ${width} m por ${height} m. Sua área é:`, `${width * height} metros quadrados`, [`${2 * (width + height)} metros quadrados`, `${width + height} metros quadrados`, `${width * height * 2} metros quadrados`, `${width - height} metros quadrados`], `Área da figura = base vezes altura = ${width * height} metros quadrados.`));

  const values = [10, 12, 14, 16, 18].map((v) => v + 2 * level);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  q.push(item(id(10), "RLM", "Análise de dados", level, `Os tempos registrados foram ${values.join(", ")} minutos. A média foi:`, `${average} minutos`, [`${average - 2} minutos`, `${average + 2} minutos`, `${values[4]} minutos`, `${values[0]} minutos`], `Somando os cinco valores e dividindo por 5, obtém-se ${average}.`));

  const x1 = -level;
  const x2 = level + 4;
  const distance = x2 - x1;
  q.push(item(id(11), "RLM", "Plano cartesiano", level, `Os pontos A(${x1}, 3) e B(${x2}, 3) estão na mesma horizontal. O comprimento AB é:`, String(distance), [String(distance - 1), String(distance + 1), String(distance + 3), String(distance * 2)], `Na mesma horizontal, o comprimento é |${x2} - (${x1})| = ${distance}.`));

  const speed = 60 + level * 10;
  const hours = 2 + level;
  q.push(item(id(12), "RLM", "Medidas e proporcionalidade", level, `Um veículo mantém ${speed} km/h por ${hours} horas. O percurso total é:`, `${speed * hours} km`, [`${speed + hours} km`, `${speed / hours} km`, `${speed * (hours - 1)} km`, `${speed * hours + 10} km`], `Percurso = velocidade vezes tempo = ${speed * hours} km.`));

  const capital = 1000 + level * 200;
  const rate = level + 2;
  const interest = (capital * rate * 3) / 100;
  q.push(item(id(13), "RLM", "Juros simples", level, `Um capital de R$ ${capital} rende juros simples de ${rate}% ao mês por 3 meses. O juro é:`, `R$ ${interest}`, [`R$ ${capital + interest}`, `R$ ${capital * rate / 100}`, `R$ ${interest + rate}`, `R$ ${capital * 3}`], `J = C × i × t = ${capital} × ${rate / 100} × 3 = ${interest}.`));

  const trios = [["Ana", "Bruno", "Caio"], ["Davi", "Eva", "Fábio"], ["Gabi", "Heitor", "Iara"], ["João", "Katia", "Leo"], ["Mara", "Nilo", "Olga"]];
  const [firstPerson, secondPerson, thirdPerson] = trios[level - 1];
  q.push(item(id(14), "RLM", "Ordenação lógica", level, `${firstPerson} chegou antes de ${secondPerson}, e ${secondPerson} chegou antes de ${thirdPerson}. Qual afirmação é necessariamente verdadeira?`, `${firstPerson} chegou antes de ${thirdPerson}.`, [`${thirdPerson} chegou antes de ${firstPerson}.`, `${secondPerson} chegou depois de ${thirdPerson}.`, `${firstPerson} e ${thirdPerson} chegaram juntos.`, `Não é possível comparar ${firstPerson} e ${thirdPerson}.`], `A relação é transitiva: ${firstPerson} < ${secondPerson} < ${thirdPerson}.`));
  const quantified = [
    ["documento incompleto", "aceito", "documento X"],
    ["arquivo corrompido", "processado", "arquivo Y"],
    ["candidato ausente", "classificado", "candidato Z"],
    ["pedido sem assinatura", "liberado", "pedido W"],
    ["equipamento defeituoso", "certificado", "equipamento K"],
  ];
  const [restricted, action, object] = quantified[level - 1];
  q.push(item(id(15), "RLM", "Quantificadores", level, `Se nenhum ${restricted} é ${action} e o ${object} foi ${action}, então:`, `O ${object} não está na condição “${restricted}”.`, [`O ${object} está na condição “${restricted}”.`, `Tudo que não é ${restricted} será ${action}.`, `Nada foi ${action}.`, `Não se pode concluir nada sobre o ${object}.`], `Um objeto ${action} não pertence ao conjunto dos casos “${restricted}”.`));
  return q;
}

function portugueseQuestions(level: number): Question[] {
  const markers = ["contudo", "portanto", "além disso", "embora", "por conseguinte"];
  const themes = [
    "A pressa pode reduzir o tempo de leitura, mas aumenta o risco de interpretar mal o enunciado.",
    "Uma rotina consistente produz menos sensação de novidade e mais estabilidade na recuperação da informação.",
    "Revisar erros exige desconforto, pois obriga o estudante a confrontar a própria estratégia.",
    "O acesso à informação fortalece o controle social quando os dados são compreensíveis e verificáveis.",
    "Tecnologia útil não elimina o julgamento humano; ela amplia a capacidade de comparar evidências.",
  ];
  const texts = themes.map((theme, i) => `${theme} ${markers[(i + level - 1) % markers.length].replace(/^./, (c) => c.toUpperCase())}, decisões melhores dependem de atenção ao contexto.`);

  return texts.flatMap((text, index) => {
    const prefix = `S${level}-PT-${index + 1}`;
    const central = [
      "Velocidade sem compreensão pode prejudicar o desempenho.",
      "Consistência favorece a recuperação estável do conteúdo.",
      "A revisão de erros exige confronto com falhas de estratégia.",
      "Informação compreensível favorece o controle social.",
      "Tecnologia e julgamento humano podem atuar de forma complementar.",
    ][index];
    const grammarStems = [
      ["No trecho, a conjunção “mas” estabelece relação de:", "oposição", ["causa", "conclusão", "condição", "finalidade"], "“Mas” é uma conjunção adversativa."],
      ["A expressão “mais estabilidade” exerce, no contexto, função de:", "complementar a comparação estabelecida", ["indicar dúvida", "marcar vocativo", "introduzir condição", "substituir o sujeito"], "A estrutura correlaciona “menos” e “mais” para comparar efeitos."],
      ['O pronome "ela", em "ela amplia", retoma:', "tecnologia útil", ["julgamento humano", "capacidade", "evidências", "informação"], "A relação gramatical e a proximidade identificam o referente feminino singular."],
      ['Em "quando os dados são compreensíveis", a oração exprime:', "valor temporal", ["oposição", "finalidade", "consequência", "comparação"], 'A conjunção "quando" introduz valor temporal.'],
      ["O ponto e vírgula em “humano; ela” poderia ser substituído, sem erro, por:", "ponto final, com ajuste de maiúscula já presente", ["vírgula apenas", "dois-pontos obrigatoriamente", "nenhum sinal", "parêntese sem fechamento"], "As duas orações independentes admitem separação por ponto."],
    ];
    const grammar = grammarStems[(index + level - 1) % grammarStems.length];
    return [
      item(prefix + "A", "Português", "Interpretação", level, "A ideia central do texto é:", central, ["A pressa sempre melhora decisões.", "O contexto deve ser ignorado.", "Todo erro decorre apenas de falta de conteúdo.", "A tecnologia torna a revisão desnecessária."], `A alternativa sintetiza a tese sem extrapolar: ${central}`, text),
      item(prefix + "B", "Português", "Morfossintaxe e coesão", level, grammar[0] as string, grammar[1] as string, grammar[2] as string[], grammar[3] as string, text),
    ];
  });
}

function ethicsQuestions(level: number): Question[] {
  const names = ["Lia", "Marcos", "Ravi", "Sofia", "Tomás"];
  const scenarios = [
    { concept: "Impessoalidade", text: `${names[level - 1]} pretende inserir sua fotografia em campanha institucional para destacar uma entrega da empresa pública.`, action: "Retirar a promoção pessoal e manter caráter educativo, informativo ou de orientação social.", reason: "Publicidade oficial não deve servir à promoção pessoal." },
    { concept: "Transparência", text: `${names[(level + 1) % 5]} recebe pedido de acesso a dados institucionais não protegidos por sigilo legal.`, action: "Viabilizar o acesso pelos canais adequados e justificar eventual restrição.", reason: "A publicidade é regra; restrições exigem fundamento." },
    { concept: "Conflito de interesses", text: `${names[(level + 2) % 5]} participa da escolha de fornecedor pertencente a familiar próximo e omite a relação.`, action: "Comunicar o conflito e afastar-se da decisão conforme as regras aplicáveis.", reason: "A prevenção exige identificação e comunicação do conflito." },
    { concept: "Accountability", text: `${names[(level + 3) % 5]} gerencia recursos, mas se recusa a explicar decisões e resultados aos órgãos de controle.`, action: "Prestar contas de forma verificável e assumir responsabilidade pelas decisões.", reason: "Accountability envolve explicação, prestação de contas e responsabilização." },
    { concept: "Proteção de dados", text: `${names[(level + 4) % 5]} quer compartilhar uma planilha com dados pessoais em grupo aberto apenas por conveniência.`, action: "Restringir o acesso, avaliar necessidade e usar canal seguro.", reason: "O tratamento deve respeitar finalidade, necessidade e segurança." },
  ];
  const concepts = ["Legalidade", "Impessoalidade", "Moralidade", "Transparência", "Conflito de interesses", "Accountability", "Eficiência", "Proteção de dados"];
  return scenarios.flatMap((scenario, index) => {
    const prefix = `S${level}-ET-${index + 1}`;
    return [
      item(prefix + "A", "Ética", "Identificação de princípio", level, "O problema central do caso relaciona-se a:", scenario.concept, concepts.filter((c) => c !== scenario.concept).slice(0, 4), scenario.reason, scenario.text),
      item(prefix + "B", "Ética", "Aplicação prática", level, "A conduta mais compatível com integridade é:", scenario.action, ["Ignorar a situação porque não houve dano comprovado.", "Ocultar o fato para preservar a imagem institucional.", "Decidir apenas com base em conveniência pessoal.", "Transferir informalmente a responsabilidade sem registro."], scenario.reason, scenario.text),
    ];
  });
}

function computingQuestions(level: number): Question[] {
  const levels = [
    [
      ["Segurança digital", "Uma mensagem solicita senha e código MFA por link urgente. A conduta mais segura é:", "Não clicar, verificar o remetente por canal oficial e reportar a tentativa.", ["Enviar apenas o código MFA.", "Desativar o antivírus.", "Responder com a senha antiga.", "Encaminhar o link a colegas sem alerta."], "Phishing explora urgência e coleta de credenciais; MFA nunca deve ser compartilhado."],
      ["Microsoft 365", "No Microsoft 365, a coautoria permite:", "Que pessoas autorizadas editem o mesmo documento, inclusive em tempo real.", ["Que qualquer pessoa acesse arquivos privados.", "Que o arquivo dispense controle de versão.", "Que o Word substitua o sistema operacional.", "Que a internet seja desnecessária em toda situação."], "Coautoria é colaboração controlada por permissões."],
      ["Hardware", "Qual componente armazena temporariamente dados em uso e perde seu conteúdo ao desligar?", "Memória RAM.", ["SSD.", "HD.", "Pendrive.", "Scanner."], "A RAM é memória volátil usada durante a execução."],
      ["Inteligência artificial", "Sobre IA generativa no trabalho, é correto afirmar que:", "A saída deve ser verificada, pois o sistema pode produzir conteúdo incorreto.", ["Toda saída é verdadeira.", "IA e automação são conceitos idênticos.", "Dados sensíveis podem ser inseridos sem avaliação.", "O uso elimina responsabilidade humana."], "Sistemas generativos podem errar; a responsabilidade de verificar permanece humana."],
      ["Arquivos e nuvem", "Sincronizar uma pasta com OneDrive significa, em regra:", "Manter cópias coordenadas entre o dispositivo e a nuvem conforme as configurações.", ["Transformar todo arquivo em público.", "Eliminar a necessidade de autenticação.", "Impedir edição colaborativa.", "Apagar automaticamente a cópia local em todos os casos."], "Sincronização coordena versões; compartilhamento depende de configuração."],
    ],
    [
      ["Segurança digital", "Qual prática reduz o impacto do vazamento de uma senha?", "Ativar autenticação multifator e usar senhas únicas.", ["Reutilizar a senha.", "Salvar a senha em mensagem aberta.", "Desativar atualizações.", "Compartilhar o código de recuperação."], "MFA adiciona um fator e senhas únicas limitam o reaproveitamento do vazamento."],
      ["Excel", "Em uma planilha, a fórmula =SOMA(A1:A5) faz o quê?", "Soma os valores do intervalo de A1 até A5.", ["Conta apenas células vazias.", "Ordena as linhas.", "Cria um gráfico.", "Apaga o intervalo."], "SOMA agrega valores numéricos do intervalo informado."],
      ["Armazenamento", "Em comparação com um HD baseado em discos, um SSD não possui:", "Partes móveis para leitura magnética.", ["Memória de armazenamento.", "Capacidade em bytes.", "Interface de conexão.", "Sistema de arquivos."], "SSDs usam memória eletrônica, sem discos e cabeças móveis."],
      ["Internet", "Um mecanismo de busca e um navegador são, respectivamente:", "Serviço de pesquisa e programa para acessar páginas.", ["Dois sistemas operacionais.", "Dois antivírus.", "Editor de texto e planilha.", "Hardware e firmware."], "O navegador acessa a web; o buscador indexa e localiza conteúdo."],
      ["Outlook", "Uma regra de e-mail pode ser usada para:", "Mover automaticamente mensagens que atendam a critérios definidos.", ["Eliminar toda autenticação.", "Editar planilhas sem aplicativo.", "Aumentar a memória RAM.", "Converter qualquer anexo em público."], "Regras automatizam ações sobre mensagens conforme condições."],
    ],
    [
      ["Segurança digital", "Ao receber anexo inesperado de remetente conhecido, o melhor procedimento é:", "Confirmar por outro canal antes de abrir e analisar sinais de fraude.", ["Abrir porque o nome é conhecido.", "Desativar a proteção.", "Executar como administrador.", "Enviar a senha ao remetente."], "Contas conhecidas podem ser comprometidas; validação independente reduz risco."],
      ["Word 365", "O histórico de versões é útil porque permite:", "Consultar ou restaurar estados anteriores do documento.", ["Acessar sem permissão.", "Substituir backups em qualquer cenário.", "Impedir toda edição ao mesmo tempo.", "Aumentar o processador."], "O recurso registra versões associadas ao arquivo colaborativo."],
      ["Windows", "Enviar um arquivo para a Lixeira normalmente significa que:", "Ele pode ser restaurado até a exclusão definitiva ou esvaziamento.", ["Foi criptografado.", "Foi enviado à nuvem.", "Virou atalho.", "Nunca poderá ser recuperado."], "A Lixeira oferece recuperação antes da remoção definitiva."],
      ["Inteligência artificial", "Qual situação representa automação sem necessariamente usar aprendizado de máquina?", "Uma regra fixa que renomeia arquivos por data.", ["Um modelo que gera texto.", "Um classificador treinado.", "Um sistema que aprende padrões.", "Um recomendador baseado em dados."], "Automação pode executar regras determinísticas sem aprendizagem."],
      ["PowerPoint", "Ao inserir uma imagem em uma apresentação, manter a proporção evita:", "Deformação visual da imagem.", ["Criação de slides.", "Uso de texto.", "Salvamento do arquivo.", "Aplicação de tema."], "Preservar a razão entre largura e altura evita achatamento ou alongamento."],
    ],
    [
      ["Segurança digital", "Uma página usa HTTPS. Isso permite concluir que:", "A conexão é criptografada, mas o conteúdo ainda deve ser avaliado.", ["O site é necessariamente legítimo.", "Não há risco de phishing.", "A senha pode ser compartilhada.", "O antivírus é inútil."], "HTTPS protege o transporte; não certifica a honestidade do conteúdo."],
      ["SharePoint", "Uma biblioteca do SharePoint é mais adequadamente descrita como:", "Espaço organizado para armazenar e colaborar em arquivos com permissões.", ["Memória física do computador.", "Sistema operacional.", "Antivírus local.", "Cabo de rede."], "Bibliotecas estruturam documentos, metadados, versões e acesso."],
      ["Hardware", "A memória cache do processador busca:", "Reduzir o tempo de acesso a dados e instruções frequentes.", ["Substituir todo armazenamento.", "Exibir imagens.", "Imprimir documentos.", "Conectar o teclado."], "Cache mantém dados próximos à CPU para acesso rápido."],
      ["Excel", "Se A1 contém 10 e B1 contém 20, =MÉDIA(A1:B1) retorna:", "15.", ["30.", "10.", "20.", "200."], "A média aritmética de 10 e 20 é 15."],
      ["Teams", "Compartilhar um arquivo em equipe não significa automaticamente que:", "Qualquer pessoa externa ganhou acesso irrestrito.", ["Membros autorizados podem colaborar.", "Permissões continuam relevantes.", "O arquivo pode ter histórico.", "O link pode ser controlado."], "O acesso depende das permissões e do tipo de compartilhamento."],
    ],
    [
      ["Segurança digital", "Uma organização exige MFA, atualização e menor privilégio. O princípio comum é:", "Reduzir superfície de ataque e limitar impacto de incidentes.", ["Eliminar a necessidade de usuários.", "Garantir risco zero.", "Publicar credenciais.", "Impedir auditoria."], "Camadas preventivas reduzem probabilidade e impacto, sem prometer risco zero."],
      ["Microsoft 365", "Na edição colaborativa, um conflito de versões é melhor reduzido por:", "Usar o arquivo compartilhado e observar presença e histórico de alterações.", ["Criar muitas cópias locais sem padrão.", "Remover permissões de todos.", "Enviar senhas por e-mail.", "Desativar salvamento."], "Uma fonte compartilhada com versionamento reduz cópias divergentes."],
      ["Inteligência artificial", "Antes de usar IA com dados corporativos, deve-se:", "Verificar política, finalidade, sensibilidade e controles da ferramenta.", ["Inserir todos os dados para melhorar a resposta.", "Assumir confidencialidade automática.", "Ignorar termos de uso.", "Eliminar revisão humana."], "Uso responsável começa pela avaliação do dado e do ambiente autorizado."],
      ["Sistema operacional", "A principal função de um sistema operacional é:", "Gerenciar recursos de hardware e oferecer serviços aos aplicativos.", ["Substituir todos os aplicativos.", "Ser apenas um navegador.", "Servir somente para imprimir.", "Eliminar arquivos automaticamente."], "O sistema operacional coordena CPU, memória, dispositivos, arquivos e processos."],
      ["Nuvem", "Um arquivo sincronizado foi alterado incorretamente. Qual recurso pode ajudar na recuperação?", "Histórico de versões, quando habilitado.", ["Aumento de brilho.", "Troca do teclado.", "Modo avião.", "Formatação imediata do disco."], "Versionamento permite recuperar um estado anterior sem depender da cópia atual."],
    ],
  ];
  const items = levels[level - 1];
  return items.map((entry, index) => item(`S${level}-IN-${index + 1}`, "Informática", entry[0] as string, level, `${entry[1]} (nível ${level})`, entry[2] as string, entry[3] as string[], entry[4] as string));
}

export const mockExams: MockExam[] = Array.from({ length: 5 }, (_, index) => {
  const level = index + 1;
  const questions = [
    ...englishQuestions(level),
    ...rlmQuestions(level),
    ...portugueseQuestions(level),
    ...ethicsQuestions(level),
    ...computingQuestions(level),
  ];
  return {
    id: `simulado-${level}`,
    level,
    title: `Simulado ${level}`,
    label: difficultyLabels[index],
    questions,
  };
});

export const bankStats = {
  exams: mockExams.length,
  questions: mockExams.reduce((sum, exam) => sum + exam.questions.length, 0),
  bySubject: mockExams.flatMap((exam) => exam.questions).reduce<Record<string, number>>((acc, question) => {
    acc[question.subject] = (acc[question.subject] ?? 0) + 1;
    return acc;
  }, {}),
};
