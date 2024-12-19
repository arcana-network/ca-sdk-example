import { Intent } from '@arcana/ca-sdk'

type IntentDataType = {
  open: boolean
  allow: () => void
  deny: () => void
  refresh: (() => Promise<Intent>) | null
  intent: Intent | null
}

export type { IntentDataType }
