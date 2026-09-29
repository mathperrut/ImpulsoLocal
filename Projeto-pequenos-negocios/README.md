# ImpulsoLocal · Marketing para Pequenos Negócios

Projeto do QPRO · Script II (1ª AVD) · Sistemas de Informação · UniFOA 2026

Site de uma agência fictícia de marketing digital para pequenos negócios locais
(restaurantes, salões, academias, clínicas, lojas e oficinas).

**Site no ar:** https://mathperrut.github.io/ImpulsoLocal/Projeto-pequenos-negocios/
**Slides da apresentação:** [`slides/Apresentacao_QPRO_ScriptII.pptx`](slides/Apresentacao_QPRO_ScriptII.pptx)

## Estrutura

```
index.html        Home
servicos.html     Página 1: Serviços
planos.html       Página 2: Planos (mensal/anual, "ver todos os recursos")
contato.html      Formulário (máscaras + validação em JavaScript)
css/style.css     Todo o estilo do site (layouts em Flexbox)
js/main.js        Comum a todas as páginas: menu hambúrguer, ano do rodapé
js/planos.js      Alternador mensal/anual e lista de recursos
js/formulario.js  Máscaras, validação, envio, correção e dados salvos
slides/           Apresentação da banca
```

## Entregáveis por disciplina

| Disciplina | O que foi feito |
|---|---|
| **APWII** · Responsividade com Flexbox | Todos os grids usam `display:flex` + `flex-wrap` + `flex: 1 1 <base>`. Menu vira hambúrguer em telas até 860px; ajustes extras até 600px. |
| **LPWII** · Versionamento e formulário | Repositório no GitHub. Formulário com máscara de WhatsApp e CNPJ, validação de nome, WhatsApp, e-mail, CNPJ (dígitos verificadores), segmento e meta. |
| **IHM** · Critérios ergonômicos | Sugestões da análise aplicadas (tabela abaixo). |

## Melhorias aplicadas a partir da análise ergonômica (IHM)

| Critério | Antes | Agora |
|---|---|---|
| 1.1 Presteza | Obrigatórios sem indicação | Asterisco + legenda "* campo obrigatório"; opcionais marcados |
| 1.5 Legibilidade | Texto branco sobre laranja (2,9:1) | Texto azul sobre laranja (6:1); fonte-base 18px do `corpo.css` incorporada |
| 6. Consistência | "Serviços" alinhado à esquerda; `.section-tag` sem uso | Todas as seções centralizadas; código morto removido |
| Signo · Ícone | Emojis (mudam por aparelho) | Ícones SVG (Lucide, licença ISC) |
| 2.3 Densidade | 19 itens nos planos | Só os diferenciais + "Ver todos os recursos" |
| 3.2 Controle do usuário | Sem voltar após envio | "Cancelar envio", "Corrigir meus dados", "Enviar outro pedido" |
| 4.1 Flexibilidade | Um só caminho | Botão flutuante de WhatsApp + alternador mensal/anual |
| 4.2 Experiência | Nada para quem volta | Dados do último pedido preenchidos (localStorage); plano chega pré-selecionado |
| 7. Significado | "Starter", "Meta Ads" | Porte do plano ("1 canal", "2 canais"); "Instagram e Facebook" |
| 8. Compatibilidade | Navegação sumia no celular | Menu hambúrguer acessível (Esc fecha, `aria-expanded`) |
| 5.2 Qualidade das mensagens | `alert()` do navegador | Mensagem vermelha abaixo do campo, com `aria-live` |
| 5.3 Correção dos erros | Só antes do envio | Foco no 1º erro, erro some ao corrigir, reabrir formulário preenchido |

## Como rodar

Abra o `index.html` no navegador. Não precisa instalar nada.

## Equipe

Alisson Porto · Bernardo Cordeiro · Isabela Lopes · João Victor Dias Ribeiro · Matheus Perrut · Miguel do Nascimento
