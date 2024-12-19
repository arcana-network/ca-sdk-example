const isDevApp = import.meta.env.VITE_APP_ENV === 'dev'

export const devLogger = {
  log(message?: any, ...optionalParams: any[]) {
    if (isDevApp) {
      console.log('[Arcana Dev Logger]', message, ...optionalParams)
    }
  },

  error(message?: any, ...optionalParams: any[]) {
    if (isDevApp) {
      console.error('[Arcana Dev Logger]', message, ...optionalParams)
    }
  },
}
