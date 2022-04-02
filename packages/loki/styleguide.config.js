const path = require('path');
const pkg = require('./package.json');
const version = `v${pkg.version}`;
const glob = require('glob');

function loadComponent() {
  const componentPaths = glob.sync(path.resolve(__dirname, 'src/components/StyleGuide/*/index.{ts,tsx}'));
  const allComponents = componentPaths.reduce((acc, componentPath) => {
    const componentName = componentPath.replace(/^([\s\S]+)\/([a-zA-Z0-9]+)\/*.(ts|tsx?)$/, '$2');
    return Object.assign(acc, { [componentName]: componentPath });
  }, {});

  return allComponents;
}

function getExampleFilename(componentPath) {
  const result = componentPath.replace(/index.(js|jsx|ts|tsx)?$/, 'docs.md');
  return result;
}

const sections = [
  {
    name: 'Colors',
    content: 'src/docs/colors/docs.md',
    exampleMode: 'collapse',
    usageMode: 'expand',
    sectionDepth: 0,
  },
  {
    name: 'Components',
    components: 'src/components/StyleGuide/*/index.{js,jsx,ts,tsx}',
    exampleMode: 'collapse',
    usageMode: 'expand',
    sectionDepth: 1,
  },
];

function resolveStyleguideComponent(name) {
  return path.join(__dirname, `src/docs/components/${name}`);
}

module.exports = {
  title: 'Alopay',
  version,
  sections,
  getExampleFilename,
  require: [path.join(__dirname, 'src/styles/variables.scss')],
  pagePerSection: true,
  moduleAliases: {
    '@alopay/styles': path.resolve(__dirname, 'src/styles'),
    '@alopay/ui': path.resolve(__dirname, 'src/components/StyleGuide'),
  },
  context: loadComponent(),
  template: {
    container: 'root',
    trimWhitespace: true,
  },
  skipComponentsWithoutExample: true,
  components: 'components/StyleGuide/**/*.{js,jsx,ts,tsx}',
  ignore: [
    'components/StyleGuide/**/*.ts',
    'components/StyleGuide/CSSBaseLine/index.tsx',
    'components/StyleGuide/Portal/index.tsx',
  ],
  styleguideComponents: {
    StyleGuideRenderer: resolveStyleguideComponent('StyleGuideRenderer'),
    HeadingRenderer: resolveStyleguideComponent('HeadingRenderer'),
    SectionRenderer: resolveStyleguideComponent('SectionRenderer'),
  },
};
