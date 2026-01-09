// Currency Converter Application
// Modular structure with improved UX

// ============================================
// Currency API Module
// ============================================
const CurrencyAPI = {
  baseURL: 'https://economia.awesomeapi.com.br/json/all/USD-BRL,EUR-BRL,BTC-BRL',
  rates: {},
  
  async fetchRates() {
    UIController.showLoading(true);
    UIController.hideError();
    
    try {
      const response = await fetch(this.baseURL);
      
      if (!response.ok) {
        throw new Error('Falha ao buscar cotações');
      }
      
      const result = await response.json();
      
      this.rates = {
        USD: parseFloat(result.USD.ask),
        EUR: parseFloat(result.EUR.ask),
        BTC: parseFloat(result.BTC.ask)
      };
      
      return this.rates;
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
      UIController.showError('Não foi possível carregar as cotações. Tente novamente mais tarde.');
      throw error;
    } finally {
      UIController.showLoading(false);
    }
  },
  
  getRate(currencyCode) {
    return this.rates[currencyCode] || 0;
  }
};

// ============================================
// Currency Converter Module
// ============================================
const CurrencyConverter = {
  convert(amount, rate) {
    if (!amount || amount <= 0) return 0;
    return amount / rate;
  },
  
  convertToBRL(amount, rate) {
    if (!amount || amount <= 0) return 0;
    return amount * rate;
  },
  
  formatCurrency(value, currencyCode) {
    if (!value || isNaN(value)) return '--';
    
    const formatOptions = {
      USD: { symbol: '$', decimals: 2 },
      EUR: { symbol: '€', decimals: 2 },
      BTC: { symbol: '₿', decimals: 8 }
    };
    
    const config = formatOptions[currencyCode] || { symbol: '', decimals: 2 };
    
    // Format with Brazilian decimal notation (comma as decimal separator)
    const formattedValue = value.toLocaleString('pt-BR', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    });
    
    return `${config.symbol} ${formattedValue}`;
  },
  
  formatBRL(value) {
    if (!value || isNaN(value)) return '--';
    
    // Format with Brazilian decimal notation (comma as decimal separator)
    const formattedValue = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return `R$ ${formattedValue}`;
  }
};

// ============================================
// UI Controller Module
// ============================================
const UIController = {
  // Currency code to element ID mapping
  currencyElementMap: {
    'USD': 'resultDolar',
    'EUR': 'resultEuro',
    'BTC': 'resultBtc'
  },
  
  currencyDecimals: {
    'USD': 2,
    'EUR': 2,
    'BTC': 8
  },
  
  elements: {
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    inputField: document.getElementById('entrada'),
    currentRates: document.getElementById('valor-atual'),
    brlResult: document.getElementById('brl-result'),
    brlResultValue: document.getElementById('brl-result-value'),
    resultDolar: document.getElementById('resultado-dolar'),
    resultEuro: document.getElementById('resultado-euro'),
    resultBtc: document.getElementById('resultado-btc'),
    rateDolar: document.getElementById('rate-usd'),
    rateEuro: document.getElementById('rate-eur'),
    rateBtc: document.getElementById('rate-btc')
  },
  
  isUpdating: false, // Flag to prevent circular updates
  
  showLoading(show) {
    if (this.elements.loading) {
      this.elements.loading.classList.toggle('hidden', !show);
    }
  },
  
  showError(message) {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorMessage.classList.remove('hidden');
    }
  },
  
  hideError() {
    if (this.elements.errorMessage) {
      this.elements.errorMessage.classList.add('hidden');
    }
  },
  
  updateRates(rates) {
    // Update rate displays on cards
    if (this.elements.rateDolar) {
      this.elements.rateDolar.textContent = `Cotação: ${CurrencyConverter.formatBRL(rates.USD)}`;
    }
    if (this.elements.rateEuro) {
      this.elements.rateEuro.textContent = `Cotação: ${CurrencyConverter.formatBRL(rates.EUR)}`;
    }
    if (this.elements.rateBtc) {
      this.elements.rateBtc.textContent = `Cotação: ${CurrencyConverter.formatBRL(rates.BTC)}`;
    }
    
    // Update summary display
    if (this.elements.currentRates) {
      const lastUpdate = new Date().toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      this.elements.currentRates.innerHTML = `
        Última atualização: ${lastUpdate} | 
        Dólar: ${CurrencyConverter.formatBRL(rates.USD)} | 
        Euro: ${CurrencyConverter.formatBRL(rates.EUR)} | 
        BTC: ${CurrencyConverter.formatBRL(rates.BTC)}
      `;
    }
  },
  
  displayResults(amount, rates) {
    if (!amount || amount <= 0) {
      this.clearResults();
      this.hideBRLResult();
      return;
    }
    
    if (this.isUpdating) return;
    this.isUpdating = true;
    
    // Convert BRL to other currencies
    const dollarAmount = CurrencyConverter.convert(amount, rates.USD);
    const euroAmount = CurrencyConverter.convert(amount, rates.EUR);
    const btcAmount = CurrencyConverter.convert(amount, rates.BTC);
    
    // Display formatted results with Brazilian decimal notation
    if (this.elements.resultDolar) {
      this.elements.resultDolar.value = dollarAmount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace('.', ',');
    }
    if (this.elements.resultEuro) {
      this.elements.resultEuro.value = euroAmount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace('.', ',');
    }
    if (this.elements.resultBtc) {
      this.elements.resultBtc.value = btcAmount.toLocaleString('pt-BR', {
        minimumFractionDigits: 8,
        maximumFractionDigits: 8
      }).replace('.', ',');
    }
    
    this.hideBRLResult();
    this.isUpdating = false;
  },
  
  displayBRLResult(currencyAmount, currencyCode, rates) {
    if (!currencyAmount || currencyAmount <= 0) {
      this.hideBRLResult();
      this.clearBRLInput();
      return;
    }
    
    if (this.isUpdating) return;
    this.isUpdating = true;
    
    const rate = rates[currencyCode];
    const brlAmount = CurrencyConverter.convertToBRL(currencyAmount, rate);
    
    // Update BRL input field with Brazilian decimal notation
    if (this.elements.inputField) {
      this.elements.inputField.value = brlAmount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace('.', ',');
    }
    
    // Show BRL result display
    if (this.elements.brlResult && this.elements.brlResultValue) {
      this.elements.brlResultValue.textContent = CurrencyConverter.formatBRL(brlAmount);
      this.elements.brlResult.classList.remove('hidden');
    }
    
    // Update other currency fields
    const otherCurrencies = {
      'USD': ['EUR', 'BTC'],
      'EUR': ['USD', 'BTC'],
      'BTC': ['USD', 'EUR']
    };
    
    const others = otherCurrencies[currencyCode];
    
    others.forEach(otherCode => {
      const otherAmount = CurrencyConverter.convert(brlAmount, rates[otherCode]);
      const elementId = this.currencyElementMap[otherCode];
      const element = this.elements[elementId];
      
      if (element) {
        const decimals = this.currencyDecimals[otherCode];
        element.value = otherAmount.toLocaleString('pt-BR', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).replace('.', ',');
      }
    });
    
    this.isUpdating = false;
  },
  
  hideBRLResult() {
    if (this.elements.brlResult) {
      this.elements.brlResult.classList.add('hidden');
    }
  },
  
  clearResults() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    
    if (this.elements.resultDolar) this.elements.resultDolar.value = '';
    if (this.elements.resultEuro) this.elements.resultEuro.value = '';
    if (this.elements.resultBtc) this.elements.resultBtc.value = '';
    
    this.isUpdating = false;
  },
  
  clearBRLInput() {
    if (this.isUpdating) return;
    this.isUpdating = true;
    
    if (this.elements.inputField) this.elements.inputField.value = '';
    
    this.isUpdating = false;
  },
  
  getInputValue() {
    let valueStr = this.elements.inputField.value;
    // Convert Brazilian format (comma) to standard format (period) for parsing
    valueStr = valueStr.replace(/\./g, '').replace(',', '.');
    const value = parseFloat(valueStr);
    return isNaN(value) ? 0 : value;
  }
};

// ============================================
// Application Controller
// ============================================
const App = {
  debounceTimer: null,
  debounceDelay: 500, // milliseconds
  MAX_CONVERSION_AMOUNT: 999999999,
  
  async init() {
    console.log('Iniciando conversor de moedas...');
    
    try {
      // Fetch initial rates
      const rates = await CurrencyAPI.fetchRates();
      UIController.updateRates(rates);
      
      // Setup event listeners
      this.setupEventListeners();
      
      console.log('Conversor inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar aplicação:', error);
    }
  },
  
  setupEventListeners() {
    const inputField = UIController.elements.inputField;
    const resultDolar = UIController.elements.resultDolar;
    const resultEuro = UIController.elements.resultEuro;
    const resultBtc = UIController.elements.resultBtc;
    
    // BRL to currencies conversion
    if (inputField) {
      // Real-time conversion with debounce
      inputField.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.handleConversion();
        }, this.debounceDelay);
      });
      
      // Also convert on Enter key
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(this.debounceTimer);
          this.handleConversion();
        }
      });
    }
    
    // Currency to BRL conversions
    if (resultDolar) {
      resultDolar.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.handleReverseConversion('USD');
        }, this.debounceDelay);
      });
      
      resultDolar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(this.debounceTimer);
          this.handleReverseConversion('USD');
        }
      });
    }
    
    if (resultEuro) {
      resultEuro.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.handleReverseConversion('EUR');
        }, this.debounceDelay);
      });
      
      resultEuro.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(this.debounceTimer);
          this.handleReverseConversion('EUR');
        }
      });
    }
    
    if (resultBtc) {
      resultBtc.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.handleReverseConversion('BTC');
        }, this.debounceDelay);
      });
      
      resultBtc.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          clearTimeout(this.debounceTimer);
          this.handleReverseConversion('BTC');
        }
      });
    }
  },
  
  handleConversion() {
    const amount = UIController.getInputValue();
    
    if (amount < 0) {
      UIController.showError('Por favor, digite um valor positivo.');
      UIController.clearResults();
      return;
    }
    
    if (amount > this.MAX_CONVERSION_AMOUNT) {
      UIController.showError('Valor muito grande. Digite um valor menor.');
      UIController.clearResults();
      return;
    }
    
    UIController.hideError();
    UIController.displayResults(amount, CurrencyAPI.rates);
  },
  
  handleReverseConversion(currencyCode) {
    const elementMap = {
      'USD': UIController.elements.resultDolar,
      'EUR': UIController.elements.resultEuro,
      'BTC': UIController.elements.resultBtc
    };
    
    const element = elementMap[currencyCode];
    if (!element) return;
    
    // Parse Brazilian format (comma as decimal separator)
    let valueStr = element.value;
    valueStr = valueStr.replace(/\./g, '').replace(',', '.');
    const amount = parseFloat(valueStr);
    
    if (!amount || isNaN(amount)) {
      UIController.hideBRLResult();
      UIController.clearBRLInput();
      return;
    }
    
    if (amount < 0) {
      UIController.showError('Por favor, digite um valor positivo.');
      UIController.hideBRLResult();
      return;
    }
    
    if (amount > this.MAX_CONVERSION_AMOUNT) {
      UIController.showError('Valor muito grande. Digite um valor menor.');
      UIController.hideBRLResult();
      return;
    }
    
    UIController.hideError();
    UIController.displayBRLResult(amount, currencyCode, CurrencyAPI.rates);
  }
};

// ============================================
// Initialize Application
// ============================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
