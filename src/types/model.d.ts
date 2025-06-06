import { Range as SlateRange } from 'slate'
export type MessageRole = 'user' | 'assistant' | 'system'
export type AiMode =
  | 'qwen'
  | 'deepseek'
  | 'openai'
  | 'claude'
  | 'lmstudio'
  | 'ollama'
  | 'custom'
  | 'mowen'
  | 'gemini'

export interface IMessageModel {
  role: MessageRole
  content: string
  summary?: string
  images?: IMessageFile[]
}

export interface IMessage extends IMessageModel {
  id: string
  created: number
  chatId: string
  tokens: number
  updated: number
  reasoning?: string
  duration?: number
  terminated?: boolean
  context?: IMessageContext[]
  model?: string
  height?: number
  error?: { code: string; message: string }
  files?: IMessageFile[]
  images?: IMessageFile[]
  docs?: IMessageDoc[]
}

export interface IChat {
  id: string
  topic?: string
  created: number
  pending?: boolean
  updated: number
  messages?: IMessage[]
  promptId?: string
  docContext?: boolean
  websearch?: boolean
  model?: string // 对话正在使用的模型
  clientId?: string // 对话正在使用的模型配置id
  model?: string
  summaryIndex?: number
  summary?: string
}

export interface IClient {
  id: string
  name: string
  mode: AiMode
  baseUrl?: string
  sort: number
  apiKey?: string
  models: string[]
  //
  options?: Record<string, any>
}

export interface IPrompt {
  id: string
  name: string
  content: string
  sort: number
}

export interface ISetting {
  key: string
  value: any
}

export interface IMessageFile {
  id: string
  name: string
  size: number
  url?: string
  // open ai base64
  content?: string
  status?: 'pending' | 'success' | 'error'
}

export interface IMessageDoc {
  docId: string
  name: string
  content: string
}

export interface IMessageContext {
  name: string
  content: string
  id: string
}

export type IChatTable = Pick<
  IChat,
  | 'id'
  | 'topic'
  | 'created'
  | 'updated'
  | 'promptId'
  | 'websearch'
  | 'model'
  | 'clientId'
  | 'summaryIndex'
  | 'summary'
>

export interface ISpace {
  id: string
  name: string
  created: number
  lastOpenTime: number
  sort: number
  writeFolderPath?: string | null
  opt?: Record<string, any>
}

export interface IDoc {
  id: string
  name: string
  spaceId: string
  parentId: string
  folder: boolean
  schema?: any[]
  updated: number
  deleted?: boolean
  expand?: boolean
  created: number
  sort: number
  links?: string[]
  medias?: string[]
  children?: IDoc[]
  lastOpenTime?: number
}

export interface IHistory {
  id: string
  docId: string
  schema: any[]
  spaceId: string
  created: number
  links?: string[]
  medias?: string[]
}
export interface IFile {
  name: string
  created: number
  size: number
  spaceId?: string
  messageId?: string
}

export interface IKeyboard {
  task: string
  key: string
}
