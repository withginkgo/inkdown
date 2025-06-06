import { Dropdown } from 'antd'
import { modelToLabel } from '@/utils/ai'
import { Bolt, ChevronDown } from 'lucide-react'
import { useStore } from '@/store/store'
import { ModelIcon } from './ModelIcon'
import { Tooltip } from '@lobehub/ui'
import { useMemo } from 'react'
import { OpenAI } from '@lobehub/icons'
import { useSetState } from 'react-use'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

export const SwitchModel = observer((props: { maxWidth?: number }) => {
  const store = useStore()
  const { t } = useTranslation()
  const chat = store.chat.state.activeChat
  const { model, models, ready } = store.settings.state

  const chatModel = useMemo(() => {
    if (chat?.clientId) {
      const config = models.find((item) => item.id === chat.clientId)
      if (config) {
        return {
          id: config.id,
          model: chat.model || config.models[0],
          mode: config.mode
        }
      }
    } else {
      return model
    }
  }, [chat, model, models, ready])
  const [state, setState] = useSetState({
    open: false
  })
  return (
    <Dropdown
      trigger={['click']}
      open={state.open}
      onOpenChange={(v) => {
        if (v && !models.length) {
          store.settings.setData((data) => {
            data.open = true
            data.setTab = 2
          })
          return
        }
        setState({ open: v })
      }}
      menu={{
        className: 'switch-model-menu',
        style: {
          maxHeight: '400px'
        },
        onClick: (item) => {
          const [id, model] = item.key.split('::')
          store.chat.setChatModel(id, model)
          store.chat.modelChange$.next()
        },
        items: models.map((item) => ({
          children: item.models.map((m) => {
            return {
              label: modelToLabel(m),
              key: `${item.id}::${m}`
            }
          }),
          type: 'group',
          label: (
            <div className={'flex items-center justify-between'}>
              <div className={'flex items-center space-x-2'}>
                <ModelIcon mode={item.mode} size={16} />
                <span className={'text-sm dark:text-gray-400 text-gray-500 max-w-40 truncate'}>
                  {item.name}
                </span>
              </div>
              <Tooltip title={t('chat.go_to_settings')} mouseEnterDelay={0.5}>
                <div
                  className={'action p-1'}
                  onClick={() => {
                    store.settings.setData((data) => {
                      data.open = true
                      data.setTab = 2
                    })
                    setState({ open: false })
                  }}
                >
                  <Bolt size={14} />
                </div>
              </Tooltip>
            </div>
          ),
          key: item.id
        }))
      }}
    >
      <div className={'flex items-center justify-between p-2 rounded-lg h-7 cursor-pointer'}>
        {ready && (
          <>
            <div className={'flex items-center flex-1'}>
              {chatModel ? (
                <ModelIcon mode={chatModel.mode} size={17} />
              ) : (
                <OpenAI.Avatar size={20} />
              )}
              <span
                className={'ml-1.5 text-sm dark:text-white/90 truncate'}
                style={{
                  maxWidth: props.maxWidth
                }}
              >
                {chatModel ? modelToLabel(chatModel.model) : t('chat.no_models_added')}
              </span>
            </div>
            <div className={'flex items-center ml-1 text-white/50'}>
              <ChevronDown size={16} className={'dark:stroke-white/60 stroke-black/60'} />
            </div>
          </>
        )}
      </div>
    </Dropdown>
  )
})
