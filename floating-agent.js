// floating-agent.js
// Self-contained script to inject a floating Vue 3 component into any webpage
(function () {
  // Load Vue 3 from CDN if not present
  function loadVue(callback) {
    if (window.Vue && window.Vue.createApp) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://unpkg.com/vue@3/dist/vue.global.prod.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  // Загрузка конфига с урлом для iframe
  function getIframeUrlFromConfig(callback) {
    fetch("agent-config.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((cfg) => {
        if (cfg && cfg.iframeUrl) callback(cfg.iframeUrl);
        else callback(null);
      })
      .catch(() => callback(null));
  }

  function injectFloatingAgent() {
    // Create container for the floating agent
    var container = document.createElement("div");
    container.id = "floating-vue-agent-root";
    document.body.appendChild(container);

    // Add styles
    var style = document.createElement("style");
    style.innerHTML = `
      #floating-vue-agent-root {
        position: fixed;
        bottom: 32px;
        right: 32px;
        z-index: 99999;
      }
      .floating-agent-ico {
        width: 56px;
        height: 56px;
        background: #4285f4;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #fff;
        font-size: 32px;
        transition: box-shadow 0.2s, background 0.2s, transform 0.2s;
        position: relative;
        z-index: 2;
      }
      .floating-agent-ico.open {
        background: #d32f2f;
        transform: rotate(45deg);
      }
      .floating-agent-speed-dial {
        position: absolute;
        bottom: 70px;
        right: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 16px;
        z-index: 1;
      }
      .speed-dial-btn {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.25s;
        opacity: 0;
        transform: translateY(40px) scale(0.7);
        pointer-events: none;
      }
      .speed-dial-btn.show {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }
      .speed-dial-btn svg {
        width: 28px;
        height: 28px;
      }
    `;
    document.head.appendChild(style);

    // Vue app template
    container.innerHTML = `
      <div id="floating-vue-agent">
        <div class="floating-agent-speed-dial">
          <a v-for="btn in buttons" :key="btn.name" :href="btn.url" target="_blank" rel="noopener" class="speed-dial-btn" :class="{show: open}" :style="{transitionDelay: open ? btn.delay : (buttons.length-btn.idx)*0.05+'s'}" @click.stop>
            <span v-html="btn.icon"></span>
          </a>
        </div>
        <div class="floating-agent-ico" :class="{open: open}" @click="toggleDial">
          <span v-if="!open">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#4285f4"/>
              <text x="12" y="17" text-anchor="middle" fill="#fff" font-size="16" font-family="Arial" font-weight="bold">i</text>
            </svg>
          </span>
          <span v-else>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#d32f2f"/>
              <line x1="7" y1="7" x2="17" y2="17" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
              <line x1="17" y1="7" x2="7" y2="17" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </span>
        </div>
      </div>
    `;

    // Mount Vue app
    window.Vue.createApp({
      data() {
        return {
          open: false,
          buttons: [
            {
              name: "Telegram",
              url: "https://t.me/",
              icon: `<svg viewBox='0 0 24 24'><circle fill='#229ED9' cx='12' cy='12' r='12'/><path d='M17.5 7.5L6.5 11.5c-.5.2-.5.5 0 .7l2.7.8 1 3.1c.1.3.2.3.4.1l1.4-1.4 2.9 2.1c.3.2.5.1.6-.2l2.1-8.2c.1-.4-.1-.6-.5-.5z' fill='#fff'/></svg>`,
              delay: "0.05s",
              idx: 0,
            },
            {
              name: "WhatsApp",
              url: "https://wa.me/",
              icon: `<svg viewBox='0 0 24 24'><circle fill='#25D366' cx='12' cy='12' r='12'/><path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.205 5.077 4.369.71.244 1.263.389 1.695.497.712.181 1.36.156 1.872.095.571-.067 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z' fill='#fff'/></svg>`,
              delay: "0.1s",
              idx: 1,
            },
            {
              name: "Messenger",
              url: "https://m.me/",
              icon: `<svg viewBox='0 0 24 24'><circle fill='#0084FF' cx='12' cy='12' r='12'/><path d='M12 4C7.03 4 3 7.58 3 12c0 2.02.89 3.84 2.37 5.19.12.11.19.27.17.43l-.23 1.62c-.04.28.19.53.48.53.1 0 .19-.03.27-.08l1.98-1.23c.13-.08.29-.13.44-.13.32.03.65.05.98.05 4.97 0 9-3.58 9-8s-4.03-8-9-8zm1.13 10.47l-1.7-1.81-3.13 1.81 4.13-4.47 1.7 1.81 3.13-1.81-4.13 4.47z' fill='#fff'/></svg>`,
              delay: "0.15s",
              idx: 2,
            },
          ],
        };
      },
      methods: {
        toggleDial() {
          this.open = !this.open;
        },
      },
    }).mount("#floating-vue-agent");
  }

  loadVue(injectFloatingAgent);
})();
