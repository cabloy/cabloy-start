/* eslint-env node */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

import { defineConfig } from '@quasar/app-vite/wrappers';
import { codeInspectorPlugin } from 'code-inspector-plugin';
// import Fonts from 'unplugin-fonts/vite';
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

export default defineConfig(ctx => {
  return {
    css: ['settings.scss'],

    build: {
      extendViteConf(viteConf) {
        if (ctx.dev) {
          // Quasar provides this resolver at runtime but omits it from IResolve.
          const resolveEntry = (
            ctx.appPaths.resolve as typeof ctx.appPaths.resolve & {
              entry: (file: string) => string;
            }
          ).entry;
          viteConf.plugins ??= [];
          viteConf.plugins.unshift(
            codeInspectorPlugin({
              bundler: 'vite',
              dev: ctx.dev,
              enforcePre: true,
              injectTo: resolveEntry('client-entry.js'),
              match: /\.tsx$/,
              exclude: /\/\.metadata\//,
              // Component roots may be fragments or teleports; locate their native TSX instead.
              escapeTags: [/^[A-Z]/, /\./],
              pathType: 'absolute',
              server: 'close',
              skipSnippets: ['console'],
              behavior: {
                locate: false,
                target: 'vscode://file/{file}:{line}:{column}',
              },
            }),
          );
        }
        // Ensure Vuetify is bundled for SSR so Node doesn't try to import raw CSS
        viteConf.ssr = {
          ...viteConf.ssr,
          noExternal: [...((viteConf.ssr && (viteConf.ssr as any).noExternal) || []), 'vuetify'],
        } as any;
        // plugins
        viteConf.plugins = viteConf.plugins!.concat([
          // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
          <any>Vuetify({
            autoImport: false,
          }),
          // Fonts({
          //   fontsource: {
          //     families: [
          //       {
          //         name: 'Roboto',
          //         weights: [100, 300, 400, 500, 700, 900],
          //         styles: ['normal', 'italic'],
          //       },
          //     ],
          //   },
          // }),
        ]);
      },
      viteVuePluginOptions: {
        template: { transformAssetUrls },
      },
    },

    devServer: {
      open: false, // opens browser window automatically
    },
  };
});
