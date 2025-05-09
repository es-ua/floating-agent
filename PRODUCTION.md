# How to use the production build

1. Use the minified script `floating-agent.min.js` for production deployments.
2. Host it on your server or CDN, or copy it to your project.
3. Inject it into your webpage with:
   ```html
   <script src="./floating-agent.min.js"></script>
   ```
   Or use your CDN path if hosted elsewhere.
4. The floating Vue 3 agent will appear and function as in development, but with a smaller, optimized file size.

---

You can also inline the minified code for maximum portability.
