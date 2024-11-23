import { type Preview } from '@storybook/angular';
import 'primeng/resources/themes/lara-light-blue/theme.css';
import 'primeng/resources/primeng.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


const preview: Preview = {

  parameters: {
    actions: { argTypesRegex: '^[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            reviewOnFail: true,
          },
        ],
      },
      manual: true,
    },
  },
};

export default preview;
