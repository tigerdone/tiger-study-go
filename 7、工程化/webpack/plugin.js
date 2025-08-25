class CodeInjectionPlugin {
    constructor(options) {
        this.options = {
            code: '// Injected by plugin',
            position: 'top', // 'top' or 'bottom'
            ...options
        };
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('CodeInjectionPlugin', (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: 'CodeInjectionPlugin',
                    stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
                },
                (assets) => {
                    Object.keys(assets).forEach(filename => {
                        if (filename.endsWith('.js')) {
                            const asset = assets[filename];
                            const source = asset.source();
                            const { code, position } = this.options;

                            let newSource;
                            if (position === 'top') {
                                newSource = `${code}\n${source}`;
                            } else {
                                newSource = `${source}\n${code}`;
                            }

                            assets[filename] = {
                                source: () => newSource,
                                size: () => newSource.length
                            };
                        }
                    });
                }
            );
        });
    }
}

module.exports = CodeInjectionPlugin;