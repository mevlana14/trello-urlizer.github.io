// Unit tests for Power-Up project setup
// Tests Power-Up initialization and basic configuration
// Requirements: 5.1

describe('Power-Up Project Setup', () => {
  let mockTrelloPowerUp;
  let clientModule;

  beforeEach(() => {
    // Mock TrelloPowerUp global
    mockTrelloPowerUp = {
      initialize: jest.fn(),
      Promise: Promise
    };
    global.TrelloPowerUp = mockTrelloPowerUp;

    // Clear module cache and require fresh client
    jest.resetModules();
    delete require.cache[require.resolve('../public/js/client.js')];
    clientModule = require('../public/js/client.js');
  });

  afterEach(() => {
    delete global.TrelloPowerUp;
  });

  test('Power-Up configuration has correct properties', () => {
    expect(clientModule.POWER_UP_CONFIG).toBeDefined();
    expect(clientModule.POWER_UP_CONFIG.name).toBe('Feedback Link Replacer');
    expect(clientModule.POWER_UP_CONFIG.version).toBe('1.0.0');
    expect(clientModule.POWER_UP_CONFIG.capabilities).toEqual([
      'card-detail-badges',
      'show-settings'
    ]);
  });

  test('Power-Up initializes with required capabilities', () => {
    // Re-require the client to trigger initialization
    require('../public/js/client.js');
    
    expect(mockTrelloPowerUp.initialize).toHaveBeenCalledTimes(1);
    
    const initConfig = mockTrelloPowerUp.initialize.mock.calls[0][0];
    expect(initConfig).toHaveProperty('card-detail-badges');
    expect(initConfig).toHaveProperty('show-settings');
    expect(typeof initConfig['card-detail-badges']).toBe('function');
    expect(typeof initConfig['show-settings']).toBe('function');
  });

  test('card-detail-badges capability returns correct badge', async () => {
    require('../public/js/client.js');
    
    const initConfig = mockTrelloPowerUp.initialize.mock.calls[0][0];
    const badgeFunction = initConfig['card-detail-badges'];
    
    const mockT = {};
    const mockOptions = {};
    
    const result = await badgeFunction(mockT, mockOptions);
    
    expect(result).toEqual([{
      title: 'Feedback Link Replacer',
      text: 'Active',
      color: 'green'
    }]);
  });

  test('show-settings capability returns popup configuration', () => {
    require('../public/js/client.js');
    
    const initConfig = mockTrelloPowerUp.initialize.mock.calls[0][0];
    const settingsFunction = initConfig['show-settings'];
    
    const mockT = {
      popup: jest.fn().mockReturnValue('popup-result')
    };
    const mockOptions = {};
    
    const result = settingsFunction(mockT, mockOptions);
    
    expect(mockT.popup).toHaveBeenCalledWith({
      title: 'Feedback Link Replacer Settings',
      url: './settings.html'
    });
    expect(result).toBe('popup-result');
  });
});