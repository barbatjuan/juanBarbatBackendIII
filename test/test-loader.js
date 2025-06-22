// Cargador personalizado para Mocha que permite el uso de módulos ESM
export async function load(url, context, nextLoad) {
  if (url.endsWith('.js')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: await nextLoad(url, { ...context, format: 'module' })
    };
  }
  return nextLoad(url, context);
}
