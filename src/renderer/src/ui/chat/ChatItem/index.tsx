import { memo } from 'react'

import { IMessage } from 'types/model'
import { UserMessage } from './UserMessage'
import { AiMessage } from './AiMessage'
import { observer } from 'mobx-react-lite'

const ChatItem = observer<{ msg: IMessage }>(({ msg }) => {
  if (msg.role === 'user') {
    return <UserMessage msg={msg} />
  }
  if (msg.role === 'assistant') {
    return <AiMessage msg={msg} />
  }
})

export default ChatItem

export type { ChatItemProps } from './type'
