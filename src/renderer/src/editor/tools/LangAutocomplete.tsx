import { useCallback, useEffect, useRef } from 'react'
import { Editor, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import { langIconMap } from './langIconMap'
import { getOffsetLeft, getOffsetTop } from '../../utils/dom'
import { EditorUtils } from '../utils/editorUtils'
import { TabStore } from '@/store/note/tab'
import { useGetSetState } from 'react-use'
import { observer } from 'mobx-react-lite'

const list = Array.from(langIconMap)
  .map((item) => {
    return { icon: item[1], lang: item[0] }
  })
  .sort((a, b) => (a.lang > b.lang ? 1 : -1))
export const LangAutocomplete = observer(({ tab }: { tab: TabStore }) => {
  const dom = useRef<HTMLDivElement>(null)
  const path = useRef<number[]>([])
  const [state, setState] = useGetSetState({
    index: -1,
    showOptions: [] as { icon: string; lang: string }[],
    left: 0,
    top: 0 as number | undefined,
    bottom: 0 as number | undefined,
    text: ''
  })
  const keydown = useCallback((e: KeyboardEvent) => {
    if (state().showOptions.length && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      e.preventDefault()
      if (e.key === 'ArrowUp' && state().index > 0) {
        setState({ index: state().index - 1 })
        const target = dom.current!.children[state().index] as HTMLDivElement
        if (dom.current!.scrollTop > target.offsetTop) {
          dom.current!.scroll({
            top: dom.current!.scrollTop - 160 + 30
          })
        }
      }
      if (e.key === 'ArrowDown' && state().index < state().showOptions.length - 1) {
        setState({ index: state().index + 1 })
        const target = dom.current!.children[state().index] as HTMLDivElement
        if (target.offsetTop > dom.current!.scrollTop + dom.current!.clientHeight - 30) {
          dom.current!.scroll({
            top: target.offsetTop
          })
        }
      }
    }
    if (e.key === 'Enter' && tab.state.openLangCompletion) {
      e.preventDefault()
      const current = state().showOptions[state().index]
      createCodeFence(current ? current.lang : state().text)
    }
  }, [])
  useEffect(() => {
    if (tab.state.openLangCompletion) {
      const text = tab.state.langCompletionText || ''
      setState({
        index: -1,
        text,
        showOptions: list.filter((l) => l.lang.startsWith(text.toLowerCase()))
      })
    }
  }, [tab.state.langCompletionText])
  useEffect(() => {
    if (tab.state.openLangCompletion) {
      const [node] = Editor.nodes<any>(tab.editor, {
        match: (n) => Element.isElement(n),
        mode: 'lowest'
      })
      path.current = node[1]
      window.addEventListener('keydown', keydown)
      if (node[0].type === 'paragraph') {
        const el = ReactEditor.toDOMNode(tab.editor, node[0])
        if (el) {
          let top = getOffsetTop(el, tab.container!)
          if (
            top >
            tab.container!.scrollTop + tab.container!.clientHeight - 164 - el.clientHeight
          ) {
            setState({
              top: undefined,
              bottom: -(top - tab.container!.clientHeight),
              left: getOffsetLeft(el, tab.container!)
            })
          } else {
            setState({
              left: getOffsetLeft(el, tab.container!),
              top: top + el.clientHeight,
              bottom: undefined
            })
          }
        }
      }
    } else {
      window.removeEventListener('keydown', keydown)
    }
  }, [tab.state.openLangCompletion])

  const createCodeFence = useCallback((lang: string) => {
    EditorUtils.insertCodeFence({
      editor: tab.editor,
      codes: tab.codeMap,
      opt: {
        language: lang,
        children: [{ text: '' }],
        code: ''
      },
      path: path.current
    })
  }, [])
  return (
    <div
      ref={dom}
      className={`
      ${!tab.state.openLangCompletion || !state().showOptions.length ? 'hidden' : ''}
      absolute z-50 w-40 max-h-40 overflow-y-auto ctx-panel rounded-lg py-1 text-gray-700/90 dark:text-gray-300
      `}
      style={{
        left: state().left,
        top: state().top,
        bottom: state().bottom
      }}
    >
      {state().showOptions.map((l, i) => (
        <div
          key={l.lang}
          className={`px-2 py-1.5 flex items-center cursor-pointer
          ${i === state().index ? 'bg-gray-100 dark:bg-gray-300/10' : ''}`}
          onMouseEnter={() => setState({ index: i })}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            createCodeFence(l.lang)
          }}
        >
          <img src={l.icon} alt="" className={'w-4 h-4 mr-1.5'} />
          <span className={'text-base'}>{l.lang}</span>
        </div>
      ))}
    </div>
  )
})
