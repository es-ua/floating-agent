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
    getIframeUrlFromConfig(function (configUrl) {
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
          transition: box-shadow 0.2s;
        }
        .floating-agent-ico:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }
        .floating-agent-popup {
          position: fixed;
          bottom: 100px;
          right: 32px;
          width: 400px;
          height: 600px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          z-index: 100000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: popupIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          transform: scale(1);
        }
        @media (max-width: 600px) {
          .floating-agent-popup {
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            border-radius: 0 !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
          }
          .floating-agent-popup-header {
            border-radius: 0 !important;
          }
        }
        .floating-agent-popup[style*="display: none"] {
          animation: none !important;
        }
        @keyframes popupIn {
          0% {
            opacity: 0;
            transform: scale(0.7) translateY(40px);
          }
          80% {
            opacity: 1;
            transform: scale(1.05) translateY(-8px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .floating-agent-popup-header {
          background: #4285f4;
          color: #fff;
          padding: 12px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .floating-agent-popup-close {
          cursor: pointer;
          font-size: 20px;
          margin-left: 8px;
        }
        .floating-agent-popup-iframe {
          flex: 1;
          border: none;
          width: 100%;
          height: 100%;
        }
      `;
      document.head.appendChild(style);

      // Vue app template
      container.innerHTML = `
        <div id="floating-vue-agent">
          <div v-if="!showPopup" class="floating-agent-ico" @click="showPopup = true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#4285f4"/>
              <text x="12" y="17" text-anchor="middle" fill="#fff" font-size="16" font-family="Arial" font-weight="bold">i</text>
            </svg>
          </div>
          <div v-if="showPopup" class="floating-agent-popup">
            <div class="floating-agent-popup-header">
              Floating Agent
              <span class="floating-agent-popup-close" @click="showPopup = false">&times;</span>
            </div>
            <iframe class="floating-agent-popup-iframe" :src="iframeUrl"></iframe>
          </div>
        </div>
      `;

      // Mount Vue app
      window.Vue.createApp({
        data() {
          let defaultUrl =
            configUrl ||
            (window.FloatingAgentConfig &&
              window.FloatingAgentConfig.iframeUrl) ||
            (window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.hostname === "0.0.0.0"
              ? "http://localhost:3000"
              : "https://your-production-domain.com");
          return {
            showPopup: false,
            iframeUrl: defaultUrl,
          };
        },
      }).mount("#floating-vue-agent");
    });
  }

  loadVue(injectFloatingAgent);
})();
