module.exports = {
  input: [
    'app/**/*.{js,jsx,ts,tsx}',
  ],
  output: './i18next/locales/',
  options: {
    debug: true,
    removeUnusedKeys: true,
    sort: true,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    trans: {
      component: 'Trans',
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    lngs: ['en-US', 'ro-RO'],
    ns: ['translation'],
    defaultLng: 'en-US',
    defaultNs: 'translation',
    defaultValue: '',
    resource: {
      loadPath: 'src/locales/{{lng}}/{{ns}}.json',
      savePath: '{{lng}}/{{ns}}.json'
    },
    nsSeparator: ':',
    keySeparator: '.'
  }
};