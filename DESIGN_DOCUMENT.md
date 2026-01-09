# Design Document - Conversor de Moedas

## 1. Visão Geral do Projeto

O **Conversor de Moedas** é uma aplicação web que permite aos usuários converter valores entre diferentes moedas (Dólar, Euro e Bitcoin) para Real Brasileiro (BRL), utilizando cotações em tempo real através de uma API externa.

### Objetivo
Fornecer uma ferramenta simples e intuitiva para conversão de moedas com dados atualizados em tempo real.

---

## 2. Análise do Estado Atual

### 2.1 Estrutura Técnica Atual

**Arquivos Principais:**
- `index.html` - Estrutura HTML principal
- `src/script.js` - Lógica de conversão e integração com API
- `src/style.css` - Estilização da interface

**API Utilizada:**
- AwesomeAPI (`https://economia.awesomeapi.com.br/`)

### 2.2 Problemas Identificados no Design Atual

#### Problemas de UX/UI:
1. **Layout não responsivo** - Não se adapta bem a diferentes tamanhos de tela
2. **Hierarquia visual confusa** - Elementos competem por atenção
3. **Campos de resultado desabilitados** - Cor vermelha (#BF3124) não indica claramente que são campos somente leitura
4. **Ícones mal formatados** - Uso de códigos HTML em vez de ícones apropriados do FontAwesome
5. **Falta de feedback visual** - Sem indicação de carregamento ou erros
6. **Contraste inadequado** - Textos brancos sobre background de imagem podem ter baixa legibilidade
7. **Informação de cotação atual mal posicionada** - Aparece em um bloco "burlywood" sem estilo adequado

#### Problemas de Código:
1. **HTML duplicado** - Tags `<html>` e `<body>` duplicadas (linhas 1-2 e 13-19 em index.html)
2. **Estrutura HTML incorreta** - Tags `<p>` e `<h2>` mal aninhadas (linhas 31-38 em index.html)
3. **JavaScript com variáveis globais** - Falta de organização e encapsulamento (src/script.js)
4. **Tratamento de erros limitado** - Apenas console.error sem feedback ao usuário
5. **Validação de input inadequada** - Não valida números negativos ou valores muito grandes
6. **Código CSS repetitivo** - Classes com estilos duplicados

#### Problemas de Acessibilidade:
1. **Sem labels apropriados** - Inputs sem associação com labels
2. **Falta de atributos ARIA** - Dificulta uso por leitores de tela
3. **Contraste de cores** - Pode não atender padrões WCAG
4. **Falta de teclado shortcuts** - Navegação limitada

---

## 3. Proposta de Melhoria de Design

### 3.1 Melhorias de Interface (UI)

#### 3.1.1 Layout Responsivo
**Implementação:**
- Usar CSS Grid ou Flexbox para layout adaptável
- Breakpoints para mobile (< 768px), tablet (768px-1024px) e desktop (> 1024px)
- Cards empilhados verticalmente em mobile

**Exemplo de estrutura:**
```css
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
  .entrada, .resultado-dolar, .resultado-euro, .resultado-btc {
    width: 90%;
  }
}

/* Nota: As classes duplicadas (.resultado-dolar, .resultado-euro, .resultado-btc)
   devem ser consolidadas em uma única classe .resultado para reduzir repetição */
```

#### 3.1.2 Sistema de Cores Melhorado
**Paleta de cores proposta:**
- **Primária:** #2563EB (Azul moderno)
- **Secundária:** #10B981 (Verde para sucesso)
- **Acento:** #F59E0B (Amarelo/dourado para destaque)
- **Erro:** #EF4444 (Vermelho para erros)
- **Background:** Gradiente escuro (#1F2937 → #111827)
- **Texto:** #F9FAFB (Branco suave)
- **Cards:** rgba(255, 255, 255, 0.1) com backdrop-filter: blur(10px)

**Justificativa:**
- Melhor contraste e legibilidade
- Design moderno com efeito glassmorphism
- Cores que comunicam estados (sucesso, erro, neutro)

#### 3.1.3 Tipografia
**Fontes propostas:**
- **Títulos:** 'Inter' ou 'Poppins' (mais modernas e legíveis)
- **Corpo:** 'Roboto' ou 'Open Sans'
- **Valores numéricos:** 'Roboto Mono' (mantém monospace)

**Hierarquia:**
- H1: 2.5rem (bold)
- H2: 1.5rem (semibold)
- Body: 1rem
- Labels: 0.875rem (uppercase, semibold)

#### 3.1.4 Cards de Conversão
**Design proposto:**
```
┌─────────────────────────────────┐
│ 💵 DÓLAR (USD)                  │
│ Cotação: R$ 5,42                │
│ ┌─────────────────────────────┐ │
│ │ R$ 542,00                   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Características:**
- Background semi-transparente com blur
- Ícone da moeda em destaque
- Cotação atual visível
- Resultado em destaque
- Borda com gradient sutil
- Hover effect com elevação (box-shadow)

#### 3.1.5 Campo de Entrada Melhorado
```
┌─────────────────────────────────┐
│ Digite o valor a converter      │
│ ┌─────────────────────────────┐ │
│ │ 100,00                      │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Melhorias:**
- Label claro acima do input
- Placeholder mais descritivo
- Border colorida ao focar
- Formatação automática (separadores de milhar)
- Ícone de moeda (R$)

### 3.2 Melhorias de Experiência (UX)

#### 3.2.1 Conversão em Tempo Real
- Converter automaticamente enquanto o usuário digita (com debounce de 300ms)
- Eliminar necessidade do botão "Converter"
- Feedback visual instantâneo

#### 3.2.2 Estados de Loading
- Skeleton loading para cotações
- Spinner durante fetch da API
- Mensagem "Atualizando cotações..."

#### 3.2.3 Tratamento de Erros
- Mensagem amigável se API falhar
- Opção de retentar manualmente
- Toast notifications para erros

#### 3.2.4 Informações Adicionais
- Timestamp da última atualização
- Botão para atualizar cotações manualmente
- Indicador de variação (↑↓) da cotação
- Conversão bidirecional opcional

#### 3.2.5 Funcionalidades Extras
- Histórico de conversões (localStorage)
- Favoritar moedas
- Modo escuro/claro (toggle)
- Compartilhar resultado

### 3.3 Melhorias de Código

#### 3.3.1 Estrutura JavaScript Modular
```javascript
// Módulo de API
const CurrencyAPI = {
  fetchRates: async () => { ... },
  getRateByCode: (code) => { ... }
}

// Módulo de Conversão
const CurrencyConverter = {
  convert: (amount, rate) => { ... },
  formatCurrency: (value) => { ... }
}

// Módulo de UI
const UIController = {
  updateRates: (rates) => { 
    // Atualiza a exibição das cotações atuais
  },
  displayResult: (currency, result) => { 
    // Exibe o resultado da conversão
  },
  showError: (message) => { 
    // Mostra mensagem de erro ao usuário
  },
  showLoading: (show) => { 
    // Controla indicador de carregamento
  }
}

// Inicialização
const App = {
  init: () => { ... },
  setupEventListeners: () => { ... }
}
```

#### 3.3.2 HTML Semântico
```html
<main class="converter-container">
  <header class="converter-header">
    <h1>Conversor de Moedas</h1>
    <p>Conversões em tempo real</p>
  </header>
  
  <section class="input-section">
    <label for="amount-input">Valor em BRL (Reais) a converter</label>
    <input id="amount-input" type="number" placeholder="Ex: 100.00" />
    <small>Digite o valor em reais que será convertido para outras moedas</small>
  </section>
  
  <section class="results-section">
    <article class="currency-card" data-currency="usd">
      <!-- Card mostrando o equivalente em outras moedas -->
    </article>
  </section>
</main>
```

**Nota:** A aplicação converte **DE** Real (BRL) **PARA** outras moedas (USD, EUR, BTC), conforme a implementação atual.

#### 3.3.3 CSS com Variáveis
```css
:root {
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --color-accent: #F59E0B;
  --color-error: #EF4444;
  --spacing-unit: 8px;
  --border-radius: 12px;
  --transition-speed: 0.3s;
}
```

### 3.4 Melhorias de Acessibilidade

#### 3.4.1 ARIA Labels
```html
<input 
  type="number" 
  id="amount-input"
  aria-label="Valor a ser convertido"
  aria-describedby="input-help"
/>
<span id="input-help" class="sr-only">
  Digite o valor em reais para converter
</span>
```

#### 3.4.2 Navegação por Teclado
- Tab order lógico
- Atalhos de teclado (Enter para converter)
- Focus visible em todos elementos interativos

#### 3.4.3 Contraste
- Mínimo de 4.5:1 para texto normal
- Mínimo de 3:1 para texto grande
- Testar com ferramentas de contraste

### 3.5 Performance

#### 3.5.1 Otimizações
- Lazy loading de imagens
- Debounce em conversões em tempo real
- Cache de cotações (5 minutos)
- Minificação de CSS/JS
- Usar CDN para bibliotecas

#### 3.5.2 PWA (Progressive Web App)
- Service Worker para offline
- Manifest.json
- Ícones para instalação
- Cache de recursos estáticos

---

## 4. Wireframes e Mockups

### 4.1 Layout Desktop (> 1024px)

```
╔════════════════════════════════════════════════════════════╗
║  [Logo]                    Conversor de Moedas   [Theme]  ║
║                Conversões em tempo real com API             ║
║                                                             ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │  💰 Valor em Reais (BRL)                           │  ║
║  │  ┌───────────────────────────────────────────────┐ │  ║
║  │  │ R$ 100,00                                     │ │  ║
║  │  └───────────────────────────────────────────────┘ │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                             ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    ║
║  │ 💵 USD       │  │ 💶 EUR       │  │ ₿ BTC        │    ║
║  │ R$ 5,42      │  │ R$ 5,89      │  │ R$ 342.580   │    ║
║  │              │  │              │  │              │    ║
║  │  $ 18,45     │  │  € 16,98     │  │  ₿ 0,0003   │    ║
║  │              │  │              │  │              │    ║
║  │  ↑ +0,5%     │  │  ↓ -0,2%     │  │  ↑ +2,3%     │    ║
║  └──────────────┘  └──────────────┘  └──────────────┘    ║
║                                                             ║
║  Última atualização: 09/01/2026 às 01:00  [🔄 Atualizar] ║
╚════════════════════════════════════════════════════════════╝
```

### 4.2 Layout Mobile (< 768px)

```
╔═══════════════════════════╗
║ [☰]  Conversor   [Theme] ║
║                           ║
║ ┌───────────────────────┐ ║
║ │ 💰 Valor em BRL       │ ║
║ │ ┌─────────────────┐   │ ║
║ │ │ R$ 100,00       │   │ ║
║ │ └─────────────────┘   │ ║
║ └───────────────────────┘ ║
║                           ║
║ ┌───────────────────────┐ ║
║ │ 💵 Dólar (USD)        │ ║
║ │ Cotação: R$ 5,42      │ ║
║ │                       │ ║
║ │  $ 18,45   ↑ +0,5%   │ ║
║ └───────────────────────┘ ║
║                           ║
║ ┌───────────────────────┐ ║
║ │ 💶 Euro (EUR)         │ ║
║ │ Cotação: R$ 5,89      │ ║
║ │                       │ ║
║ │  € 16,98   ↓ -0,2%   │ ║
║ └───────────────────────┘ ║
║                           ║
║ ┌───────────────────────┐ ║
║ │ ₿ Bitcoin (BTC)       │ ║
║ │ Cotação: R$ 342.580   │ ║
║ │                       │ ║
║ │  ₿ 0,0003   ↑ +2,3%  │ ║
║ └───────────────────────┘ ║
║                           ║
║ Atualizado: 01:00        ║
║ [🔄 Atualizar]            ║
╚═══════════════════════════╝
```

---

## 5. Roadmap de Implementação

### Fase 1: Correções Fundamentais (Prioridade Alta)
- [ ] Corrigir estrutura HTML (remover duplicações)
- [ ] Corrigir aninhamento de tags
- [ ] Implementar layout responsivo básico
- [ ] Melhorar sistema de cores e contraste
- [ ] Adicionar labels e ARIA apropriados

### Fase 2: Melhorias de UX (Prioridade Alta)
- [ ] Implementar conversão em tempo real (com debounce)
- [ ] Adicionar estados de loading
- [ ] Melhorar tratamento de erros com feedback visual
- [ ] Refatorar JavaScript para estrutura modular
- [ ] Implementar formatação automática de valores

### Fase 3: Design Visual (Prioridade Média)
- [ ] Implementar novo sistema de cores (glassmorphism)
- [ ] Redesenhar cards de conversão
- [ ] Melhorar tipografia
- [ ] Adicionar animações e transições suaves
- [ ] Implementar tema claro/escuro

### Fase 4: Funcionalidades Extras (Prioridade Baixa)
- [ ] Adicionar histórico de conversões
- [ ] Implementar cache de cotações
- [ ] Adicionar mais moedas (configurável)
- [ ] Implementar conversão bidirecional
- [ ] Adicionar gráficos de variação

### Fase 5: PWA e Performance (Prioridade Baixa)
- [ ] Implementar Service Worker
- [ ] Criar manifest.json
- [ ] Otimizar assets (minificação, compressão)
- [ ] Implementar lazy loading
- [ ] Configurar cache strategies

---

## 6. Métricas de Sucesso

### 6.1 Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** > 90

### 6.2 Acessibilidade
- **WCAG Level:** AA
- **Lighthouse Accessibility:** > 95

### 6.3 Usabilidade
- **Taxa de conversão:** Usuários que completam uma conversão
- **Tempo médio de conversão:** < 10 segundos
- **Taxa de erro:** < 5%

### 6.4 Compatibilidade
- **Browsers:** Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Mobile:** iOS 12+, Android 8+
- **Screen sizes:** 320px até 2560px

---

## 7. Referências e Inspirações

### 7.1 Ferramentas de Design
- **Cores:** Coolors.co, Adobe Color
- **Tipografia:** Google Fonts, Font Pair
- **Ícones:** Font Awesome, Heroicons
- **Componentes:** Tailwind UI, Material Design

### 7.2 Benchmarks
- XE Currency Converter
- Google Currency Converter
- Wise Currency Converter
- Currency.com

### 7.3 Tecnologias Recomendadas
- **Framework CSS:** Tailwind CSS ou CSS puro com variáveis
- **Build Tool:** Vite ou Parcel (opcional)
- **Linting:** ESLint, Prettier
- **Testing:** Jest para JavaScript

---

## 8. Considerações Finais

Este documento apresenta uma análise completa do estado atual do **Conversor de Moedas** e propõe melhorias significativas em design, usabilidade, acessibilidade e código. As mudanças propostas são incrementais e podem ser implementadas em fases, permitindo melhorias contínuas sem comprometer a funcionalidade existente.

O foco principal está em:
1. **Melhorar a experiência do usuário** com feedback visual claro e conversões em tempo real
2. **Modernizar o design visual** com um sistema de cores coerente e layout responsivo
3. **Aumentar a acessibilidade** seguindo padrões WCAG
4. **Melhorar a qualidade do código** com estrutura modular e melhores práticas
5. **Otimizar performance** com técnicas modernas de web development

### Próximos Passos
1. Revisar e aprovar este documento de design
2. Priorizar as fases de implementação
3. Criar issues/tasks para cada item do roadmap
4. Implementar incrementalmente, testando após cada fase
5. Coletar feedback dos usuários e iterar

---

**Documento criado em:** 09/01/2026  
**Versão:** 1.0  
**Status:** Proposta para Revisão
