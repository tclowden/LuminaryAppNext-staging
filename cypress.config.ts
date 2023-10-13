import { defineConfig } from 'cypress';

export default defineConfig({
   e2e: {
      retries: {
         runMode: 5,
      },
      includeShadowDom: true,
      testIsolation: false,
      setupNodeEvents(on, config) {
         // implement node event listeners here
      },
      viewportWidth: 760,
      viewportHeight: 1020,
   },
});
