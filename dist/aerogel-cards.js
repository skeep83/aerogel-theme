/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  Aerogel — Custom Lovelace Cards                        ║
 * ║  Premium neumorphic cards for Home Assistant             ║
 * ║  https://github.com/skeep83/aerogel-theme               ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
const AEROGEL_VERSION = '4.1.0';

/* ─── Shared CSS ────────────────────────────────────────── */
const AEROGEL_BASE_STYLES = `
  * { box-sizing: border-box; }
  :host {
    --ag-font: var(--aerogel-font, 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif);
    --ag-accent: var(--aerogel-accent, #6CB4EE);
    --ag-accent-rgb: var(--aerogel-accent-rgb, 108,180,238);
    --ag-base: var(--aerogel-base, #E3E6EC);
    --ag-base-alt: var(--aerogel-base-alt, #DDE1E8);
    --ag-shadow-dark: var(--aerogel-shadow-dark, #C8CBD3);
    --ag-shadow-light: var(--aerogel-shadow-light, #FFFFFF);
    --ag-text: var(--primary-text-color, #2C3345);
    --ag-text-sec: var(--secondary-text-color, #8A90A0);
    --ag-radius: var(--aerogel-radius-lg, 24px);
    --ag-radius-sm: var(--aerogel-radius-sm, 12px);
    --ag-convex: 8px 8px 16px var(--ag-shadow-dark), -8px -8px 16px var(--ag-shadow-light);
    --ag-concave: inset 4px 4px 8px var(--ag-shadow-dark), inset -4px -4px 8px var(--ag-shadow-light);
    display: block;
    font-family: var(--ag-font);
  }
  .card {
    background: var(--ha-card-background, var(--ag-base));
    border-radius: var(--ag-radius);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1),
                box-shadow 0.3s cubic-bezier(0.4,0,0.2,1);
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-2px);
  }
  .card:active {
    transform: scale(0.985);
    transition: transform 0.1s ease;
  }
  .entity-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: var(--ag-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    transition: filter 0.3s ease;
    flex-shrink: 0;
  }
  .info {
    flex: 1;
    min-width: 0;
  }
  .name {
    font-size: 14px;
    font-weight: 600;
    color: var(--ag-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .state {
    font-size: 13px;
    color: var(--ag-text-sec);
    margin-top: 2px;
  }
  .value {
    font-size: 28px;
    font-weight: 700;
    color: var(--ag-text);
  }
  .unit {
    font-size: 14px;
    font-weight: 400;
    color: var(--ag-text-sec);
    margin-left: 2px;
  }
  @keyframes ag-pulse {
    0%,100%{filter:drop-shadow(0 0 4px rgba(var(--ag-accent-rgb),0.2));}
    50%{filter:drop-shadow(0 0 12px rgba(var(--ag-accent-rgb),0.5));}
  }
  @keyframes ag-shimmer {
    0%{background-position:-200% 0;}
    100%{background-position:200% 0;}
  }
`;

/* ─── Helper: get entity state/attr ─────────────────────── */
function getEntity(hass, entityId) {
  if (!hass || !entityId) return null;
  return hass.states[entityId] || null;
}

function getIcon(stateObj) {
  if (!stateObj) return 'mdi:help-circle';
  const domain = stateObj.entity_id.split('.')[0];
  const state = stateObj.state;
  const icons = {
    light: state === 'on' ? 'mdi:lightbulb' : 'mdi:lightbulb-off',
    switch: state === 'on' ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off',
    sensor: 'mdi:eye',
    binary_sensor: state === 'on' ? 'mdi:checkbox-marked-circle' : 'mdi:checkbox-blank-circle-outline',
    climate: 'mdi:thermostat',
    fan: 'mdi:fan',
    cover: 'mdi:window-shutter',
    lock: state === 'locked' ? 'mdi:lock' : 'mdi:lock-open',
    camera: 'mdi:camera',
    media_player: 'mdi:cast',
    weather: 'mdi:weather-cloudy',
    person: 'mdi:account',
    vacuum: 'mdi:robot-vacuum',
    automation: 'mdi:robot',
    script: 'mdi:script-text',
    scene: 'mdi:palette',
    input_boolean: state === 'on' ? 'mdi:check-circle' : 'mdi:close-circle',
  };
  return stateObj.attributes.icon || icons[domain] || 'mdi:alert-circle';
}

function getFriendlyName(stateObj) {
  return stateObj?.attributes?.friendly_name || stateObj?.entity_id || 'Unknown';
}

function getStateDisplay(stateObj) {
  if (!stateObj) return 'unavailable';
  const s = stateObj.state;
  const unit = stateObj.attributes.unit_of_measurement || '';
  if (!isNaN(parseFloat(s)) && unit) return `${s} ${unit}`;
  return s;
}

function fireEvent(el, type, detail) {
  const ev = new Event(type, { bubbles: true, composed: true });
  ev.detail = detail;
  el.dispatchEvent(ev);
}

/* ═══════════════════════════════════════════════════════════
   1. Aerogel Glass Card — Frosted glass entity card
   ═══════════════════════════════════════════════════════════ */
class AerogelGlassCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-glass-card-editor'); }
  static getStubConfig() { return { entity: '', name: '' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = config;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    const name = this._config.name || getFriendlyName(stateObj);
    const icon = this._config.icon || getIcon(stateObj);
    const state = getStateDisplay(stateObj);
    const isOn = stateObj?.state === 'on';

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          background: rgba(var(--rgb-card-background-color, 227,230,236), 0.5) !important;
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          border-color: rgba(var(--ag-accent-rgb), 0.3);
        }
        .icon-wrap {
          background: rgba(var(--ag-accent-rgb), 0.1);
          color: var(--ag-accent);
        }
        .icon-wrap.on {
          background: rgba(var(--ag-accent-rgb), 0.2);
          filter: drop-shadow(0 0 8px rgba(var(--ag-accent-rgb), 0.4));
        }
      </style>
      <ha-card>
        <div class="card" @click>
          <div class="entity-row">
            <div class="icon-wrap ${isOn ? 'on' : ''}">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="info">
              <div class="name">${name}</div>
              <div class="state">${state}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 2; }
}

/* ═══════════════════════════════════════════════════════════
   2. Aerogel Neon Card — Cyberpunk glow border
   ═══════════════════════════════════════════════════════════ */
class AerogelNeonCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-neon-card-editor'); }
  static getStubConfig() { return { entity: '', name: '', color: '#00F5D4' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = { color: '#00F5D4', ...config };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    const name = this._config.name || getFriendlyName(stateObj);
    const icon = this._config.icon || getIcon(stateObj);
    const state = getStateDisplay(stateObj);
    const c = this._config.color;
    const isOn = stateObj?.state === 'on';

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          background: var(--ha-card-background, #0F0F1E);
          border: 1px solid ${c}33;
          box-shadow: 0 0 12px ${c}1A, inset 0 1px 0 ${c}10;
          color: #E0FFE0;
        }
        .card:hover {
          border-color: ${c}66;
          box-shadow: 0 0 24px ${c}33, 0 0 48px ${c}14, inset 0 1px 0 ${c}1F;
        }
        .icon-wrap {
          background: ${c}1A;
          color: ${c};
          border: 1px solid ${c}33;
        }
        .icon-wrap.on {
          filter: drop-shadow(0 0 10px ${c}66);
          animation: ag-neon 2s ease-in-out infinite;
        }
        .name { color: #E0FFE0; }
        .state { color: ${c}AA; }
        @keyframes ag-neon {
          0%,100%{filter:drop-shadow(0 0 6px ${c}44);}
          50%{filter:drop-shadow(0 0 16px ${c}88);}
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="entity-row">
            <div class="icon-wrap ${isOn ? 'on' : ''}">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="info">
              <div class="name">${name}</div>
              <div class="state">${state}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 2; }
}

/* ═══════════════════════════════════════════════════════════
   3. Aerogel Entity Card — Auto state glow/dim
   ═══════════════════════════════════════════════════════════ */
class AerogelEntityCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-entity-card-editor'); }
  static getStubConfig() { return { entity: '', name: '' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = config;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    const name = this._config.name || getFriendlyName(stateObj);
    const icon = this._config.icon || getIcon(stateObj);
    const state = getStateDisplay(stateObj);
    const domain = this._config.entity.split('.')[0];
    const s = stateObj?.state || 'unknown';
    const isOn = s === 'on';
    const isUnavail = s === 'unavailable';

    let glowColor = `rgba(var(--ag-accent-rgb), 0.4)`;
    if (domain === 'light' && isOn) glowColor = 'rgba(249,215,28,0.5)';
    else if (domain === 'climate' && s === 'heat') glowColor = 'rgba(231,76,60,0.4)';
    else if (domain === 'climate' && s === 'cool') glowColor = 'rgba(108,180,238,0.4)';

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          box-shadow: var(--ag-convex);
          border: none;
        }
        .card:hover {
          box-shadow: 10px 10px 20px var(--ag-shadow-dark), -10px -10px 20px var(--ag-shadow-light);
        }
        .card.unavailable {
          opacity: 0.4;
          filter: grayscale(1);
        }
        .icon-wrap {
          background: var(--ag-base-alt);
          box-shadow: var(--ag-concave);
          color: var(--ag-text-sec);
        }
        .icon-wrap.on {
          color: var(--ag-accent);
          background: rgba(var(--ag-accent-rgb), 0.1);
          box-shadow: none;
          filter: drop-shadow(0 0 8px ${glowColor});
          animation: ag-pulse 3s ease-in-out infinite;
        }
      </style>
      <ha-card>
        <div class="card ${isUnavail ? 'unavailable' : ''}">
          <div class="entity-row">
            <div class="icon-wrap ${isOn ? 'on' : ''}">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="info">
              <div class="name">${name}</div>
              <div class="state">${state}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 2; }
}

/* ═══════════════════════════════════════════════════════════
   4. Aerogel Gradient Card — Gradient background
   ═══════════════════════════════════════════════════════════ */
class AerogelGradientCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-gradient-card-editor'); }
  static getStubConfig() { return { entity: '', name: '', gradient: 'default' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = { gradient: 'default', ...config };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    const name = this._config.name || getFriendlyName(stateObj);
    const icon = this._config.icon || getIcon(stateObj);
    const state = getStateDisplay(stateObj);

    const gradients = {
      default: 'linear-gradient(135deg, #6CB4EE 0%, #9BD4F5 50%, #A8E6CF 100%)',
      warm: 'linear-gradient(135deg, #F39C12 0%, #E74C3C 100%)',
      cool: 'linear-gradient(135deg, #6CB4EE 0%, #9B8EC4 100%)',
      neon: 'linear-gradient(135deg, #00F5D4 0%, #3A86FF 50%, #FF006E 100%)',
      sunset: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
      ocean: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
      forest: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)',
      fire: 'linear-gradient(135deg, #F83600 0%, #F9D423 100%)',
    };
    const bg = this._config.gradient_css || gradients[this._config.gradient] || gradients.default;

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          background: ${bg};
          box-shadow: var(--ag-convex);
          border: none;
          color: white;
        }
        .card:hover {
          box-shadow: 10px 10px 20px var(--ag-shadow-dark), -10px -10px 20px var(--ag-shadow-light);
        }
        .icon-wrap {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .name { color: white; }
        .state { color: rgba(255,255,255,0.8); }
      </style>
      <ha-card>
        <div class="card">
          <div class="entity-row">
            <div class="icon-wrap">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="info">
              <div class="name">${name}</div>
              <div class="state">${state}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 2; }
}

/* ═══════════════════════════════════════════════════════════
   5. Aerogel Weather Card — Animated weather icons
   ═══════════════════════════════════════════════════════════ */
class AerogelWeatherCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-weather-card-editor'); }
  static getStubConfig() { return { entity: 'weather.home' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define a weather entity');
    this._config = config;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _getWeatherIcon(condition) {
    const map = {
      'clear-night': 'mdi:weather-night', sunny: 'mdi:weather-sunny',
      cloudy: 'mdi:weather-cloudy', partlycloudy: 'mdi:weather-partly-cloudy',
      rainy: 'mdi:weather-rainy', pouring: 'mdi:weather-pouring',
      snowy: 'mdi:weather-snowy', 'snowy-rainy': 'mdi:weather-snowy-rainy',
      hail: 'mdi:weather-hail', fog: 'mdi:weather-fog',
      windy: 'mdi:weather-windy', 'windy-variant': 'mdi:weather-windy-variant',
      lightning: 'mdi:weather-lightning', 'lightning-rainy': 'mdi:weather-lightning-rainy',
      exceptional: 'mdi:alert-circle',
    };
    return map[condition] || 'mdi:weather-cloudy';
  }

  _getAnimation(condition) {
    const anims = {
      sunny: 'ag-sunny 3s ease-in-out infinite',
      'clear-night': 'ag-pulse 4s ease-in-out infinite',
      rainy: 'ag-rain 1.2s ease-in-out infinite',
      pouring: 'ag-rain 0.8s ease-in-out infinite',
      snowy: 'ag-snow 2.5s ease-in-out infinite',
      'snowy-rainy': 'ag-snow 2s ease-in-out infinite',
      lightning: 'ag-thunder 4s ease infinite',
      'lightning-rainy': 'ag-thunder 3s ease infinite',
      fog: 'ag-fog 4s ease-in-out infinite',
      cloudy: 'ag-clouds 5s ease-in-out infinite',
      partlycloudy: 'ag-clouds 6s ease-in-out infinite',
      windy: 'ag-clouds 3s ease-in-out infinite',
    };
    return anims[condition] || 'none';
  }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    if (!stateObj) return;
    const condition = stateObj.state;
    const temp = stateObj.attributes.temperature || '--';
    const unit = stateObj.attributes.temperature_unit || '°C';
    const icon = this._getWeatherIcon(condition);
    const anim = this._getAnimation(condition);
    const name = this._config.name || getFriendlyName(stateObj);
    const humidity = stateObj.attributes.humidity;
    const wind = stateObj.attributes.wind_speed;

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          box-shadow: var(--ag-convex);
          border: none;
          padding: 20px;
        }
        .card:hover {
          box-shadow: 10px 10px 20px var(--ag-shadow-dark), -10px -10px 20px var(--ag-shadow-light);
        }
        .weather-main {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .weather-icon {
          font-size: 48px;
          color: var(--ag-accent);
          animation: ${anim};
        }
        .weather-info { flex: 1; }
        .temp {
          font-size: 36px;
          font-weight: 800;
          color: var(--ag-text);
          line-height: 1;
        }
        .temp .unit {
          font-size: 18px;
          font-weight: 400;
          color: var(--ag-text-sec);
        }
        .condition {
          font-size: 14px;
          color: var(--ag-text-sec);
          margin-top: 4px;
          text-transform: capitalize;
        }
        .weather-details {
          display: flex;
          gap: 16px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(var(--ag-accent-rgb), 0.1);
        }
        .detail {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--ag-text-sec);
        }
        .detail ha-icon { --mdc-icon-size: 16px; color: var(--ag-accent); }
        .w-name {
          font-size: 12px;
          color: var(--ag-text-sec);
          margin-bottom: 4px;
        }
        @keyframes ag-sunny {
          0%,100%{filter:drop-shadow(0 0 8px rgba(249,215,28,0.4));}
          50%{filter:drop-shadow(0 0 20px rgba(249,215,28,0.8));}
        }
        @keyframes ag-rain {
          0%{transform:translateY(-6px);opacity:0;}
          50%{opacity:1;}
          100%{transform:translateY(6px);opacity:0;}
        }
        @keyframes ag-snow {
          0%{transform:translateY(-5px) rotate(0);opacity:0;}
          50%{opacity:1;}
          100%{transform:translateY(5px) rotate(180deg);opacity:0;}
        }
        @keyframes ag-thunder {
          0%,90%,100%{opacity:1;}92%{opacity:0.2;}94%{opacity:1;}96%{opacity:0.3;}
        }
        @keyframes ag-fog {
          0%,100%{opacity:0.5;transform:translateX(0);}
          50%{opacity:0.8;transform:translateX(5px);}
        }
        @keyframes ag-clouds {
          0%,100%{transform:translateX(0);}
          50%{transform:translateX(4px);}
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="w-name">${name}</div>
          <div class="weather-main">
            <div class="weather-icon">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="weather-info">
              <div class="temp">${temp}<span class="unit">${unit}</span></div>
              <div class="condition">${condition.replace(/-/g, ' ')}</div>
            </div>
          </div>
          ${humidity || wind ? `
          <div class="weather-details">
            ${humidity != null ? `<div class="detail"><ha-icon icon="mdi:water-percent"></ha-icon>${humidity}%</div>` : ''}
            ${wind != null ? `<div class="detail"><ha-icon icon="mdi:weather-windy"></ha-icon>${wind} ${stateObj.attributes.wind_speed_unit || 'km/h'}</div>` : ''}
          </div>` : ''}
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 3; }
}

/* ═══════════════════════════════════════════════════════════
   6. Aerogel Tile Card — Multi-variant tile
   ═══════════════════════════════════════════════════════════ */
class AerogelTileCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-tile-card-editor'); }
  static getStubConfig() { return { entity: '', name: '', variant: 'default' }; }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define an entity');
    this._config = { variant: 'default', ...config };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _getVariantStyles(variant, isOn) {
    const variants = {
      default: `
        box-shadow: var(--ag-convex);
        border: none;
      `,
      glass: `
        background: rgba(var(--rgb-card-background-color, 227,230,236), 0.5) !important;
        backdrop-filter: blur(16px) saturate(1.3);
        -webkit-backdrop-filter: blur(16px) saturate(1.3);
        border: 1px solid rgba(255,255,255,0.25);
        box-shadow: 0 8px 32px rgba(0,0,0,0.08);
      `,
      gradient: `
        background: var(--aerogel-gradient, linear-gradient(135deg, #6CB4EE 0%, #9BD4F5 50%, #A8E6CF 100%));
        border: none;
        box-shadow: var(--ag-convex);
        color: white;
      `,
      flat: `
        box-shadow: none;
        border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
      `,
      glow: `
        box-shadow: var(--ag-convex)${isOn ? ', 0 0 20px rgba(var(--ag-accent-rgb), 0.3)' : ''};
        border: none;
        transition: box-shadow 0.4s ease;
      `,
      inset: `
        box-shadow: var(--ag-concave);
        border: none;
      `,
    };
    return variants[variant] || variants.default;
  }

  _render() {
    if (!this._config || !this._hass) return;
    const stateObj = getEntity(this._hass, this._config.entity);
    const name = this._config.name || getFriendlyName(stateObj);
    const icon = this._config.icon || getIcon(stateObj);
    const state = getStateDisplay(stateObj);
    const isOn = stateObj?.state === 'on';
    const variant = this._config.variant;
    const variantCSS = this._getVariantStyles(variant, isOn);
    const isGradient = variant === 'gradient';

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          ${variantCSS}
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .icon-wrap {
          background: ${isGradient ? 'rgba(255,255,255,0.2)' : 'var(--ag-base-alt)'};
          box-shadow: ${variant === 'inset' ? 'var(--ag-convex)' : variant === 'flat' ? 'none' : 'var(--ag-concave)'};
          color: ${isGradient ? 'white' : isOn ? 'var(--ag-accent)' : 'var(--ag-text-sec)'};
        }
        .icon-wrap.on {
          filter: ${isGradient ? 'none' : 'drop-shadow(0 0 6px rgba(var(--ag-accent-rgb), 0.3))'};
        }
        .name { color: ${isGradient ? 'white' : 'var(--ag-text)'}; }
        .state { color: ${isGradient ? 'rgba(255,255,255,0.8)' : 'var(--ag-text-sec)'}; }
        .variant-label {
          position: absolute;
          top: 8px;
          right: 12px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: ${isGradient ? 'rgba(255,255,255,0.5)' : 'var(--ag-text-sec)'};
          opacity: 0.6;
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="entity-row">
            <div class="icon-wrap ${isOn ? 'on' : ''}">
              <ha-icon icon="${icon}"></ha-icon>
            </div>
            <div class="info">
              <div class="name">${name}</div>
              <div class="state">${state}</div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 2; }
}

/* ═══════════════════════════════════════════════════════════
   Card Editors (minimal config UI)
   ═══════════════════════════════════════════════════════════ */
class AerogelCardEditor extends HTMLElement {
  _fields = [
    { key: 'entity', label: 'Entity', type: 'entity' },
    { key: 'name', label: 'Name (optional)', type: 'text' },
    { key: 'icon', label: 'Icon (optional)', type: 'text' },
  ];
  _extraFields = [];

  setConfig(config) { this._config = { ...config }; this._render(); }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config) return;
    if (!this.shadowRoot) this.attachShadow({mode: 'open'});

    const allFields = [...this._fields, ...this._extraFields];
    this.shadowRoot.innerHTML = `
      <style>
        .form { padding: 16px; }
        .field { margin-bottom: 12px; }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
          color: var(--primary-text-color);
        }
        .field input, .field select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid var(--divider-color, #ddd);
          border-radius: 8px;
          background: var(--card-background-color, #fff);
          color: var(--primary-text-color);
          font-size: 14px;
        }
        ha-entity-picker { display: block; }
      </style>
      <div class="form">
        ${allFields.map(f => `
          <div class="field">
            <label>${f.label}</label>
            ${f.type === 'entity'
              ? `<ha-entity-picker
                   .hass=${null}
                   .value="${this._config[f.key] || ''}"
                   allow-custom-entity
                 ></ha-entity-picker>`
              : f.type === 'select'
                ? `<select data-key="${f.key}">
                     ${f.options.map(o => `<option value="${o}" ${this._config[f.key] === o ? 'selected' : ''}>${o}</option>`).join('')}
                   </select>`
                : `<input type="text" data-key="${f.key}" value="${this._config[f.key] || ''}" placeholder="${f.placeholder || ''}">`
            }
          </div>
        `).join('')}
      </div>
    `;

    // Bind entity picker
    const ep = this.shadowRoot.querySelector('ha-entity-picker');
    if (ep && this._hass) {
      ep.hass = this._hass;
      ep.value = this._config.entity || '';
      ep.addEventListener('value-changed', (e) => {
        this._config.entity = e.detail.value;
        this._fire();
      });
    }

    // Bind inputs
    this.shadowRoot.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', (e) => {
        this._config[e.target.dataset.key] = e.target.value;
        this._fire();
      });
    });
  }

  _fire() {
    const ev = new CustomEvent('config-changed', { detail: { config: this._config }, bubbles: true, composed: true });
    this.dispatchEvent(ev);
  }
}

/* ─── Specific editors ──────────────────────────────────── */
class AerogelGlassCardEditor extends AerogelCardEditor {}
class AerogelEntityCardEditor extends AerogelCardEditor {}

class AerogelNeonCardEditor extends AerogelCardEditor {
  _extraFields = [
    { key: 'color', label: 'Neon Color', type: 'text', placeholder: '#00F5D4' },
  ];
}

class AerogelGradientCardEditor extends AerogelCardEditor {
  _extraFields = [
    { key: 'gradient', label: 'Gradient Preset', type: 'select', options: ['default','warm','cool','neon','sunset','ocean','forest','fire'] },
  ];
}

class AerogelWeatherCardEditor extends AerogelCardEditor {
  _fields = [
    { key: 'entity', label: 'Weather Entity', type: 'entity' },
    { key: 'name', label: 'Name (optional)', type: 'text' },
  ];
}

class AerogelTileCardEditor extends AerogelCardEditor {
  _extraFields = [
    { key: 'variant', label: 'Variant', type: 'select', options: ['default','glass','gradient','flat','glow','inset'] },
  ];
}

/* ═══════════════════════════════════════════════════════════
   Registration
   ═══════════════════════════════════════════════════════════ */
customElements.define('aerogel-glass-card', AerogelGlassCard);
customElements.define('aerogel-neon-card', AerogelNeonCard);
customElements.define('aerogel-entity-card', AerogelEntityCard);
customElements.define('aerogel-gradient-card', AerogelGradientCard);
customElements.define('aerogel-weather-card', AerogelWeatherCard);
customElements.define('aerogel-tile-card', AerogelTileCard);

customElements.define('aerogel-glass-card-editor', AerogelGlassCardEditor);
customElements.define('aerogel-neon-card-editor', AerogelNeonCardEditor);
customElements.define('aerogel-entity-card-editor', AerogelEntityCardEditor);
customElements.define('aerogel-gradient-card-editor', AerogelGradientCardEditor);
customElements.define('aerogel-weather-card-editor', AerogelWeatherCardEditor);
customElements.define('aerogel-tile-card-editor', AerogelTileCardEditor);

/* ─── Register in card picker ───────────────────────────── */
window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'aerogel-glass-card',
    name: '🫧 Aerogel Glass',
    description: 'Frosted glass card with backdrop blur and translucent background',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-neon-card',
    name: '⚡ Aerogel Neon',
    description: 'Cyberpunk neon glow card with animated border lighting',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-entity-card',
    name: '🎯 Aerogel Entity',
    description: 'Neumorphic entity card with auto state glow and unavailable dimming',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-gradient-card',
    name: '🌈 Aerogel Gradient',
    description: 'Entity card with 8 gradient presets (sunset, ocean, forest, fire...)',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-weather-card',
    name: '🌦️ Aerogel Weather',
    description: 'Weather card with animated icons (sun pulse, rain, snow, thunder, fog)',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-tile-card',
    name: '🔲 Aerogel Tile',
    description: 'Multi-variant tile: default, glass, gradient, flat, glow, inset',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
);

console.info(`%c🫧 AEROGEL CARDS v${AEROGEL_VERSION} loaded`, 'color: #6CB4EE; font-weight: bold; font-size: 14px;');
