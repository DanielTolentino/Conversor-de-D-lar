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
  
  formatCurrency(value, currencyCode) {
    if (!value || isNaN(value)) return '--';
    
    const formatOptions = {
      USD: { symbol: '$', decimals: 2 },
      EUR: { symbol: '€', decimals: 2 },
      BTC: { symbol: '₿', decimals: 8 }
    };
    
    const config = formatOptions[currencyCode] || { symbol: '', decimals: 2 };
    
    return `${config.symbol} ${value.toFixed(config.decimals)}`;
  },
  
  formatBRL(value) {
    if (!value || isNaN(value)) return '--';
    return `R$ ${value.toFixed(2)}`;
  }
};

// ============================================
// UI Controller Module
// ============================================
const UIController = {
  elements: {
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    inputField: document.getElementById('entrada'),
    currentRates: document.getElementById('valor-atual'),
    resultDolar: document.getElementById('resultado-dolar'),
    resultEuro: document.getElementById('resultado-euro'),
    resultBtc: document.getElementById('resultado-btc'),
    rateDolar: document.getElementById('rate-usd'),
    rateEuro: document.getElementById('rate-eur'),
    rateBtc: document.getElementById('rate-btc')
  },
  
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
      return;
    }
    
    // Convert BRL to other currencies
    const dollarAmount = CurrencyConverter.convert(amount, rates.USD);
    const euroAmount = CurrencyConverter.convert(amount, rates.EUR);
    const btcAmount = CurrencyConverter.convert(amount, rates.BTC);
    
    // Display formatted results
    if (this.elements.resultDolar) {
      this.elements.resultDolar.value = CurrencyConverter.formatCurrency(dollarAmount, 'USD');
    }
    if (this.elements.resultEuro) {
      this.elements.resultEuro.value = CurrencyConverter.formatCurrency(euroAmount, 'EUR');
    }
    if (this.elements.resultBtc) {
      this.elements.resultBtc.value = CurrencyConverter.formatCurrency(btcAmount, 'BTC');
    }
  },
  
  clearResults() {
    if (this.elements.resultDolar) this.elements.resultDolar.value = '';
    if (this.elements.resultEuro) this.elements.resultEuro.value = '';
    if (this.elements.resultBtc) this.elements.resultBtc.value = '';
  },
  
  getInputValue() {
    const value = parseFloat(this.elements.inputField.value);
    return isNaN(value) ? 0 : value;
  }
};

// ============================================
// Application Controller
// ============================================
const App = {
  debounceTimer: null,
  debounceDelay: 500, // milliseconds
  
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
  },
  
  handleConversion() {
    const amount = UIController.getInputValue();
    
    if (amount < 0) {
      UIController.showError('Por favor, digite um valor positivo.');
      UIController.clearResults();
      return;
    }
    
    if (amount > 999999999) {
      UIController.showError('Valor muito grande. Digite um valor menor.');
      UIController.clearResults();
      return;
    }
    
    UIController.hideError();
    UIController.displayResults(amount, CurrencyAPI.rates);
  }
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Also initialize if DOM is already loaded (for dynamic scripts)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
