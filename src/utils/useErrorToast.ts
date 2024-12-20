import { createToaster } from '@ark-ui/vue'

const toaster = createToaster({
  placement: 'top-end',
  overlap: false,
  gap: 24,
  duration: 5000,
})

export function useErrorToast() {
  const createErrorToast = (error: Error | string | unknown) => {
    console.log({ error })
    let message = 'An unknown error occurred'
    if (error instanceof Error) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    console.log({ errorToast: message })
    toaster.create({
      title: 'Error',
      description: message,
      type: 'error',
    })
  }

  return { createErrorToast }
}
