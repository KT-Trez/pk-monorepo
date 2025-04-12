import packageJSON from '../../../../package.json' with { type: 'json' };

export const injectVersion = () => {
  process.env.npm_package_version = packageJSON.version;
};
