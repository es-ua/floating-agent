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
      .speed-dial-btn img {
        width: 28px;
        height: 28px;
        display: block;
      }
    `;
    document.head.appendChild(style);

    // Vue app template
    container.innerHTML = `
      <div id="floating-vue-agent">
        <div class="floating-agent-speed-dial">
          <a v-for="btn in buttons" :key="btn.name" :href="btn.url" target="_blank" rel="noopener" class="speed-dial-btn" :class="{show: open}" :style="{transitionDelay: open ? btn.delay : (buttons.length-btn.idx)*0.05+'s'}" @click.stop>
            <img :src="btn.icon" :alt="btn.name" />
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
              icon: "./telegram.svg",
              delay: "0.05s",
              idx: 0,
            },
            {
              name: "WhatsApp",
              url: "https://wa.me/",
              icon: "./whatsapp.svg",
              delay: "0.1s",
              idx: 1,
            },
            {
              name: "Messenger",
              url: "https://m.me/",
              icon: "./messenger.svg",
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
