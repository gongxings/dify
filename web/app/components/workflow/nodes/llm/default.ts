import { BlockEnum } from '../../types'
import { type NodeDefault, PromptRole } from '../../types'
import type { LLMNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'

const i18nPrefix = 'workflow.errorMsg'

const nodeDefault: NodeDefault<LLMNodeType> = {
  defaultValue: {
    model: {
      provider: '',
      name: '',
      mode: 'chat',
      completion_params: {
        temperature: 0.7,
      },
    },
    variables: [],
    memory: {
      role_prefix: undefined,
      window: {
        enabled: false,
        size: 50,
      },
    },
    prompt_template: [{
      role: PromptRole.system,
      text: '',
    }],
    context: {
      enabled: false,
      variable_selector: [],
    },
    vision: {
      enabled: false,
    },
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.Answer)
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: LLMNodeType, t: any) {
    let errorMessages = ''
    if (!errorMessages && !payload.model.provider)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t(`${i18nPrefix}.fields.model`) })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
