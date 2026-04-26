/**
 * ╔═══════════════════════════════════════════════════════════╗
 * ║  Aerogel NeoSurface Pro — Custom Lovelace Cards         ║
 * ║  Premium soft-3D cards for Home Assistant                ║
 * ║  https://github.com/skeep83/aerogel-theme               ║
 * ╚═══════════════════════════════════════════════════════════╝
 */
const AEROGEL_VERSION = '6.0.0';

/* ─── Shared CSS ────────────────────────────────────────── */
const AEROGEL_BASE_STYLES = `
  * { box-sizing: border-box; }
  :host {
    --ag-font: var(--aerogel-font, 'Inter', 'SF Pro Display', 'Segoe UI Variable', system-ui, sans-serif);
    --ag-accent: var(--aerogel-accent, #3B82F6);
    --ag-accent-rgb: var(--aerogel-accent-rgb, 59, 130, 246);
    --ag-accent-secondary: var(--aerogel-accent-secondary, #38BDF8);
    --ag-base: var(--aerogel-base, #111827);
    --ag-base-alt: var(--aerogel-base-alt, #0F172A);
    --ag-surface: var(--aerogel-surface, #111827);
    --ag-surface-raised: var(--aerogel-surface-raised, #182131);
    --ag-surface-pressed: var(--aerogel-surface-pressed, #0F172A);
    --ag-border: 1px solid var(--aerogel-border, rgba(255,255,255,0.08));
    --ag-elev-1: var(--aerogel-shadow-soft, 7px 7px 18px rgba(0,0,0,0.54), -6px -6px 16px rgba(255,255,255,0.05));
    --ag-elev-2: var(--aerogel-shadow-raised, 12px 12px 30px rgba(0,0,0,0.62), -9px -9px 22px rgba(255,255,255,0.06));
    --ag-elev-3: var(--aerogel-shadow-hover, 18px 18px 38px rgba(0,0,0,0.72), -12px -12px 28px rgba(255,255,255,0.07));
    --ag-elev-pressed: var(--aerogel-shadow-pressed, inset 7px 7px 16px rgba(0,0,0,0.60), inset -6px -6px 14px rgba(255,255,255,0.05));
    --ag-text: var(--primary-text-color, #F8FAFC);
    --ag-text-sec: var(--secondary-text-color, #94A3B8);
    --ag-radius: var(--aerogel-radius-lg, 28px);
    --ag-radius-sm: var(--aerogel-radius-sm, 14px);
    --ag-radius-md: var(--aerogel-radius-md, 20px);
    display: block;
    font-family: var(--ag-font);
  }
  .card {
    background: var(--ag-surface);
    border: var(--ag-border);
    border-radius: var(--ag-radius);
    box-shadow: var(--ag-elev-2);
    padding: 16px;
    position: relative;
    overflow: hidden;
    transition: transform 240ms ease, box-shadow 240ms ease, border-color 160ms ease, background 160ms ease;
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-2px);
    border-color: rgba(var(--ag-accent-rgb), 0.22);
    box-shadow: var(--ag-elev-3);
  }
  .card:active {
    transform: translateY(1px);
    box-shadow: var(--ag-elev-pressed);
    transition: transform 120ms ease;
  }
  .entity-row {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .icon-wrap {
    width: 50px;
    height: 50px;
    border-radius: var(--ag-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    background: var(--ag-surface-raised);
    border: 1px solid rgba(var(--ag-accent-rgb), 0.08);
    box-shadow: var(--ag-elev-1);
    transition: filter 240ms ease, background 240ms ease, color 240ms ease;
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
    margin-top: 4px;
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
    0%,100%{filter:drop-shadow(0 0 6px rgba(var(--ag-accent-rgb),0.18));}
    50%{filter:drop-shadow(0 0 16px rgba(var(--ag-accent-rgb),0.42));}
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

function parseNumber(stateObj) {
  if (!stateObj) return null;
  const value = Number.parseFloat(stateObj.state);
  return Number.isFinite(value) ? value : null;
}

function countActiveEntities(hass, entityIds = []) {
  return entityIds.reduce((count, entityId) => {
    const stateObj = getEntity(hass, entityId);
    if (!stateObj) return count;
    return ['on', 'home', 'playing', 'heat', 'cool'].includes(stateObj.state) ? count + 1 : count;
  }, 0);
}

function formatMaybeNumber(value, digits = 1) {
  return Number.isFinite(value) ? value.toFixed(digits) : '--';
}

function fireEvent(el, type, detail) {
  const ev = new Event(type, { bubbles: true, composed: true });
  ev.detail = detail;
  el.dispatchEvent(ev);
}

/* ═══════════════════════════════════════════════════════════
   1. Aerogel Glass Card — Decorative translucent accent card
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
          background: linear-gradient(180deg, rgba(var(--ag-accent-rgb), 0.12), rgba(var(--ag-accent-rgb), 0.04) 34%, var(--ag-surface) 100%);
        }
        .card:hover {
          border-color: rgba(var(--ag-accent-rgb), 0.24);
        }
        .icon-wrap {
          background: rgba(var(--ag-accent-rgb), 0.12);
          color: var(--ag-accent);
        }
        .icon-wrap.on {
          background: rgba(var(--ag-accent-rgb), 0.18);
          filter: drop-shadow(0 0 10px rgba(var(--ag-accent-rgb), 0.4));
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
          background: linear-gradient(160deg, rgba(34, 211, 238, 0.12), rgba(168, 85, 247, 0.1), rgba(15, 23, 42, 0.82));
          border: 1px solid ${c}33;
          box-shadow: 0 16px 42px rgba(3, 7, 18, 0.34), 0 0 0 1px ${c}14 inset;
          color: #E0F2FE;
        }
        .card:hover {
          border-color: ${c}66;
          box-shadow: 0 18px 48px rgba(3, 7, 18, 0.38), 0 0 24px ${c}26;
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
          background: linear-gradient(180deg, rgba(var(--ag-accent-rgb), 0.06), var(--ag-surface));
        }
        .card.unavailable {
          opacity: 0.4;
          filter: grayscale(1);
        }
        .icon-wrap {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.08);
          color: var(--ag-text-sec);
        }
        .icon-wrap.on {
          color: var(--ag-accent);
          background: rgba(var(--ag-accent-rgb), 0.1);
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
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.22);
          color: white;
        }
        .icon-wrap {
          background: rgba(255,255,255,0.2);
          color: white;
          border-color: rgba(255,255,255,0.24);
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
          padding: 20px;
          background: linear-gradient(180deg, rgba(var(--ag-accent-rgb), 0.14), var(--ag-surface));
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
          border-top: 1px solid rgba(var(--ag-accent-rgb), 0.14);
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
        background: var(--ag-surface);
      `,
      glass: `
        background: linear-gradient(180deg, rgba(var(--ag-accent-rgb), 0.12), var(--ag-surface)) !important;
      `,
      gradient: `
        background: var(--aerogel-gradient, linear-gradient(135deg, #6CB4EE 0%, #9BD4F5 50%, #A8E6CF 100%));
        border: 1px solid rgba(255,255,255,0.14);
        box-shadow: 0 18px 44px rgba(15, 23, 42, 0.22);
        color: white;
      `,
      flat: `
        box-shadow: var(--ag-elev-1);
        border: 1px solid var(--divider-color, rgba(0,0,0,0.08));
      `,
      glow: `
        box-shadow: var(--ag-elev-2)${isOn ? ', 0 0 24px rgba(var(--ag-accent-rgb), 0.28)' : ''};
        transition: box-shadow 0.4s ease;
      `,
      inset: `
        box-shadow: var(--aerogel-concave-md, inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 6px rgba(2,8,23,0.22));
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
          background: ${isGradient ? 'rgba(255,255,255,0.2)' : 'rgba(var(--ag-accent-rgb), 0.08)'};
          box-shadow: none;
          color: ${isGradient ? 'white' : isOn ? 'var(--ag-accent)' : 'var(--ag-text-sec)'};
          border-color: ${isGradient ? 'rgba(255,255,255,0.24)' : 'rgba(var(--ag-accent-rgb), 0.12)'};
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
   7. Aerogel Room Card
   ═══════════════════════════════════════════════════════════ */
class AerogelRoomCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-room-card-editor'); }
  static getStubConfig() {
    return {
      name: 'Living Room',
      temperature: 'sensor.living_room_temperature',
      humidity: 'sensor.living_room_humidity',
      lights: ['light.living_room_main'],
      climate: 'climate.living_room',
      motion: 'binary_sensor.living_room_motion',
      media_player: 'media_player.living_room',
    };
  }

  setConfig(config) {
    if (!config.name) throw new Error('Please define a room name');
    this._config = { lights: [], chips: [], ...config };
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const temp = parseNumber(getEntity(this._hass, this._config.temperature));
    const humidity = parseNumber(getEntity(this._hass, this._config.humidity));
    const climate = getEntity(this._hass, this._config.climate);
    const motion = getEntity(this._hass, this._config.motion);
    const media = getEntity(this._hass, this._config.media_player);
    const lightsOn = countActiveEntities(this._hass, this._config.lights);
    const chips = [
      lightsOn ? `${lightsOn} light${lightsOn === 1 ? '' : 's'}` : 'Lights idle',
      motion?.state === 'on' ? 'Motion' : 'No motion',
      humidity != null ? `${Math.round(humidity)}% RH` : null,
      climate?.state && climate.state !== 'off' ? climate.state : null,
    ].filter(Boolean).slice(0, 4);
    const actions = [
      { label: 'Lights', icon: 'mdi:lightbulb-group', entity: this._config.lights?.[0], active: lightsOn > 0 },
      { label: 'Climate', icon: 'mdi:thermostat', entity: this._config.climate, active: climate && climate.state !== 'off' },
      { label: 'Media', icon: 'mdi:play-circle', entity: this._config.media_player, active: media && ['playing', 'on'].includes(media.state) },
    ].filter((item) => item.entity);

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          padding: 20px;
          background: linear-gradient(180deg, rgba(var(--ag-accent-rgb), 0.14), rgba(255,255,255,0.02) 34%, var(--ag-surface) 100%);
        }
        .top, .actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .title { font-size: 18px; font-weight: 700; color: var(--ag-text); }
        .metric { font-size: 28px; font-weight: 800; color: var(--ag-text); }
        .submetric { color: var(--ag-text-sec); font-size: 13px; margin-top: 2px; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0; }
        .chip {
          padding: 8px 12px;
          border-radius: var(--ag-radius-sm);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--ag-text-sec);
          font-size: 12px;
        }
        .actions { margin-top: 16px; justify-content: flex-start; }
        .action {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(var(--ag-accent-rgb), 0.08);
          border: 1px solid rgba(var(--ag-accent-rgb), 0.14);
          color: var(--ag-text);
          cursor: pointer;
          font-size: 13px;
        }
        .action.active {
          background: rgba(var(--ag-accent-rgb), 0.16);
          color: var(--ag-accent);
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="top">
            <div>
              <div class="title">${this._config.name}</div>
              <div class="submetric">${chips.join(' · ') || 'Room overview'}</div>
            </div>
            <div style="text-align:right">
              <div class="metric">${formatMaybeNumber(temp)}°</div>
              <div class="submetric">${humidity != null ? `${Math.round(humidity)}% humidity` : 'No humidity sensor'}</div>
            </div>
          </div>
          <div class="chips">
            ${chips.map((chip) => `<div class="chip">${chip}</div>`).join('')}
          </div>
          <div class="actions">
            ${actions.map((action, index) => `<button class="action ${action.active ? 'active' : ''}" data-entity="${action.entity}" data-index="${index}"><ha-icon icon="${action.icon}"></ha-icon>${action.label}</button>`).join('')}
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      if (this._config.climate) fireEvent(this, 'hass-more-info', { entityId: this._config.climate });
    });
    this.shadowRoot.querySelectorAll('.action').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        fireEvent(this, 'hass-more-info', { entityId: button.dataset.entity });
      });
    });
  }

  getCardSize() { return 3; }
}

/* ═══════════════════════════════════════════════════════════
   8. Aerogel Climate Card
   ═══════════════════════════════════════════════════════════ */
class AerogelClimateCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-climate-card-editor'); }
  static getStubConfig() {
    return {
      entity: 'climate.home',
      supply_temperature: 'sensor.hvac_supply_temperature',
      return_temperature: 'sensor.hvac_return_temperature',
      cop: 'sensor.heat_pump_cop',
      outdoor_temperature: 'sensor.outdoor_temperature',
    };
  }

  setConfig(config) {
    if (!config.entity) throw new Error('Please define a climate entity');
    this._config = config;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const climate = getEntity(this._hass, this._config.entity);
    if (!climate) return;
    const current = Number.parseFloat(climate.attributes.current_temperature ?? climate.state);
    const target = Number.parseFloat(climate.attributes.temperature);
    const supply = parseNumber(getEntity(this._hass, this._config.supply_temperature));
    const ret = parseNumber(getEntity(this._hass, this._config.return_temperature));
    const cop = parseNumber(getEntity(this._hass, this._config.cop));
    const outside = parseNumber(getEntity(this._hass, this._config.outdoor_temperature));
    const delta = Number.isFinite(supply) && Number.isFinite(ret) ? supply - ret : null;
    const hvacAction = climate.attributes.hvac_action || climate.state;
    const chips = [
      hvacAction && hvacAction !== 'off' ? hvacAction : 'Idle',
      climate.attributes.preset_mode || null,
      climate.attributes.fan_mode || null,
      cop != null ? `COP ${cop.toFixed(1)}` : null,
    ].filter(Boolean).slice(0, 4);

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card { padding: 22px; }
        .layout { display:grid; grid-template-columns: 124px 1fr; gap: 18px; align-items: center; }
        .ring {
          width: 124px; height: 124px; border-radius: 50%;
          display:flex; align-items:center; justify-content:center; flex-direction:column;
          background:
            radial-gradient(circle at center, rgba(15,23,42,0.88) 0 56%, transparent 57%),
            conic-gradient(var(--ag-accent) 0deg 240deg, rgba(255,255,255,0.08) 240deg 360deg);
          border: 1px solid rgba(var(--ag-accent-rgb), 0.22);
          box-shadow: var(--ag-elev-2);
        }
        .ring-value { font-size: 30px; font-weight: 800; color: var(--ag-text); line-height: 1; }
        .ring-label { font-size: 12px; color: var(--ag-text-sec); margin-top: 6px; }
        .title { font-size: 18px; font-weight: 700; color: var(--ag-text); }
        .target { font-size: 14px; color: var(--ag-text-sec); margin-top: 4px; }
        .chips { display:flex; flex-wrap:wrap; gap:8px; margin-top: 14px; }
        .chip {
          padding: 8px 12px; border-radius: 999px; font-size: 12px;
          background: rgba(var(--ag-accent-rgb), 0.08); border: 1px solid rgba(var(--ag-accent-rgb), 0.14);
        }
        .stats { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
        .stat {
          padding: 12px 14px; border-radius: var(--ag-radius-md);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        }
        .stat-label { font-size: 12px; color: var(--ag-text-sec); margin-bottom: 6px; }
        .stat-value { font-size: 18px; font-weight: 700; color: var(--ag-text); }
      </style>
      <ha-card>
        <div class="card">
          <div class="layout">
            <div class="ring">
              <div class="ring-value">${formatMaybeNumber(current)}°</div>
              <div class="ring-label">Current</div>
            </div>
            <div>
              <div class="title">${getFriendlyName(climate)}</div>
              <div class="target">Target ${formatMaybeNumber(target)}° · ${hvacAction || 'idle'}</div>
              <div class="chips">${chips.map((chip) => `<div class="chip">${chip}</div>`).join('')}</div>
            </div>
          </div>
          <div class="stats">
            <div class="stat"><div class="stat-label">Supply</div><div class="stat-value">${formatMaybeNumber(supply)}°</div></div>
            <div class="stat"><div class="stat-label">Return</div><div class="stat-value">${formatMaybeNumber(ret)}°</div></div>
            <div class="stat"><div class="stat-label">Delta T</div><div class="stat-value">${delta != null ? delta.toFixed(1) : '--'}°</div></div>
            <div class="stat"><div class="stat-label">Outdoor</div><div class="stat-value">${formatMaybeNumber(outside)}°</div></div>
          </div>
        </div>
      </ha-card>
    `;
    this.shadowRoot.querySelector('.card').addEventListener('click', () => {
      fireEvent(this, 'hass-more-info', { entityId: this._config.entity });
    });
  }

  getCardSize() { return 4; }
}

/* ═══════════════════════════════════════════════════════════
   9. Aerogel Energy Card
   ═══════════════════════════════════════════════════════════ */
class AerogelEnergyCard extends HTMLElement {
  static getConfigElement() { return document.createElement('aerogel-energy-card-editor'); }
  static getStubConfig() {
    return {
      solar: 'sensor.solar_power',
      home: 'sensor.home_consumption',
      grid: 'sensor.grid_power',
      battery: 'sensor.battery_soc',
      daily_cost: 'sensor.daily_energy_cost',
    };
  }

  setConfig(config) {
    this._config = config;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._render(); }

  _render() {
    if (!this._config || !this._hass) return;
    const solar = parseNumber(getEntity(this._hass, this._config.solar));
    const home = parseNumber(getEntity(this._hass, this._config.home));
    const grid = parseNumber(getEntity(this._hass, this._config.grid));
    const battery = parseNumber(getEntity(this._hass, this._config.battery));
    const dailyCost = parseNumber(getEntity(this._hass, this._config.daily_cost));
    const flowLabel = grid == null ? 'Grid unknown' : grid >= 0 ? 'Importing from grid' : 'Exporting to grid';

    if (!this.shadowRoot) this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `
      <style>
        ${AEROGEL_BASE_STYLES}
        .card {
          padding: 22px;
          background: linear-gradient(180deg, rgba(34,197,94,0.10), rgba(var(--ag-accent-rgb), 0.06) 42%, var(--ag-surface));
        }
        .header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
        .title { font-size: 18px; font-weight: 700; color: var(--ag-text); }
        .subtitle { font-size: 13px; color: var(--ag-text-sec); margin-top: 4px; }
        .battery {
          padding: 10px 12px; border-radius: 999px; font-size: 13px;
          background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.18);
        }
        .grid { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
        .cell {
          padding: 14px; border-radius: var(--ag-radius-md);
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
        }
        .label { font-size: 12px; color: var(--ag-text-sec); margin-bottom: 6px; }
        .value { font-size: 26px; font-weight: 800; color: var(--ag-text); }
        .flow {
          margin-top: 16px; padding: 14px; border-radius: var(--ag-radius-md);
          background: rgba(var(--ag-accent-rgb), 0.08); border: 1px solid rgba(var(--ag-accent-rgb), 0.14);
          color: var(--ag-text);
        }
      </style>
      <ha-card>
        <div class="card">
          <div class="header">
            <div>
              <div class="title">Energy Cockpit</div>
              <div class="subtitle">${flowLabel}</div>
            </div>
            ${battery != null ? `<div class="battery">Battery ${battery.toFixed(0)}%</div>` : ''}
          </div>
          <div class="grid">
            <div class="cell"><div class="label">Solar</div><div class="value">${formatMaybeNumber(solar, 0)}</div><div class="subtitle">W production</div></div>
            <div class="cell"><div class="label">Home</div><div class="value">${formatMaybeNumber(home, 0)}</div><div class="subtitle">W consumption</div></div>
            <div class="cell"><div class="label">Grid</div><div class="value">${formatMaybeNumber(grid, 0)}</div><div class="subtitle">W net</div></div>
          </div>
          <div class="flow">Daily cost ${dailyCost != null ? dailyCost.toFixed(2) : '--'} · Use this card with solar, battery, and tariff sensors for a full cockpit view.</div>
        </div>
      </ha-card>
    `;
  }

  getCardSize() { return 4; }
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
          padding: 10px 12px;
          border: 1px solid var(--divider-color, rgba(148,163,184,0.24));
          border-radius: 12px;
          background: var(--card-background-color, rgba(17,24,39,0.72));
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

class AerogelRoomCardEditor extends AerogelCardEditor {
  _fields = [
    { key: 'name', label: 'Room Name', type: 'text' },
    { key: 'temperature', label: 'Temperature Sensor', type: 'text' },
    { key: 'humidity', label: 'Humidity Sensor', type: 'text' },
    { key: 'climate', label: 'Climate Entity', type: 'text' },
    { key: 'motion', label: 'Motion Sensor', type: 'text' },
    { key: 'media_player', label: 'Media Player', type: 'text' },
  ];
}

class AerogelClimateCardEditor extends AerogelCardEditor {
  _fields = [
    { key: 'entity', label: 'Climate Entity', type: 'entity' },
    { key: 'supply_temperature', label: 'Supply Temp Sensor', type: 'text' },
    { key: 'return_temperature', label: 'Return Temp Sensor', type: 'text' },
    { key: 'cop', label: 'COP Sensor', type: 'text' },
    { key: 'outdoor_temperature', label: 'Outdoor Temp Sensor', type: 'text' },
  ];
}

class AerogelEnergyCardEditor extends AerogelCardEditor {
  _fields = [
    { key: 'solar', label: 'Solar Power Sensor', type: 'text' },
    { key: 'home', label: 'Home Consumption Sensor', type: 'text' },
    { key: 'grid', label: 'Grid Power Sensor', type: 'text' },
    { key: 'battery', label: 'Battery SOC Sensor', type: 'text' },
    { key: 'daily_cost', label: 'Daily Cost Sensor', type: 'text' },
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
customElements.define('aerogel-room-card', AerogelRoomCard);
customElements.define('aerogel-climate-card', AerogelClimateCard);
customElements.define('aerogel-energy-card', AerogelEnergyCard);

customElements.define('aerogel-glass-card-editor', AerogelGlassCardEditor);
customElements.define('aerogel-neon-card-editor', AerogelNeonCardEditor);
customElements.define('aerogel-entity-card-editor', AerogelEntityCardEditor);
customElements.define('aerogel-gradient-card-editor', AerogelGradientCardEditor);
customElements.define('aerogel-weather-card-editor', AerogelWeatherCardEditor);
customElements.define('aerogel-tile-card-editor', AerogelTileCardEditor);
customElements.define('aerogel-room-card-editor', AerogelRoomCardEditor);
customElements.define('aerogel-climate-card-editor', AerogelClimateCardEditor);
customElements.define('aerogel-energy-card-editor', AerogelEnergyCardEditor);

/* ─── Register in card picker ───────────────────────────── */
window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: 'aerogel-glass-card',
    name: '🫧 Aerogel Glass',
    description: 'Decorative accent card with restrained translucency and soft depth',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-neon-card',
    name: '⚡ Aerogel Neon',
    description: 'Neon accent card for standout controls, scenes, and dashboards',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-entity-card',
    name: '🎯 Aerogel Entity',
    description: 'General-purpose entity card with semantic glow and offline dimming',
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
    description: 'Weather summary card with premium surface treatment and animated conditions',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-tile-card',
    name: '🔲 Aerogel Tile',
    description: 'Multi-variant tile with NeoSurface, gradient, flat, glow, and inset styles',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-room-card',
    name: '🛋️ Aerogel Room',
    description: 'Room-first summary card with temperature, chips, and quick actions',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-climate-card',
    name: '🌡️ Aerogel Climate',
    description: 'Premium HVAC overview with current, target, supply, return, and COP',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
  {
    type: 'aerogel-energy-card',
    name: '⚡ Aerogel Energy',
    description: 'Energy cockpit card for solar, home load, grid flow, battery, and cost',
    preview: true,
    documentationURL: 'https://github.com/skeep83/aerogel-theme',
  },
);

console.info(`%c🫧 AEROGEL PRO CARDS v${AEROGEL_VERSION} loaded`, 'color: #3B82F6; font-weight: bold; font-size: 14px;');
