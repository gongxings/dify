'use client'
import type { FC } from 'react'
import Editor from '@monaco-editor/react'
import React, { useRef } from 'react'
import Base from '../base'
import { CodeLanguage } from '@/app/components/workflow/nodes/code/types'
import './style.css'

type Props = {
  value?: string | object
  onChange?: (value: string) => void
  title: JSX.Element
  language: CodeLanguage
  headerRight?: JSX.Element
  readOnly?: boolean
  isJSONStringifyBeauty?: boolean
}

const languageMap = {
  [CodeLanguage.javascript]: 'javascript',
  [CodeLanguage.python3]: 'python',
  [CodeLanguage.json]: 'json',
}

const CodeEditor: FC<Props> = ({
  value = '',
  onChange = () => { },
  title,
  headerRight,
  language,
  readOnly,
  isJSONStringifyBeauty,
}) => {
  const [isFocus, setIsFocus] = React.useState(false)

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  const editorRef = useRef(null)
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    editor.onDidFocusEditorText(() => {
      setIsFocus(true)
    })
    editor.onDidBlurEditorText(() => {
      setIsFocus(false)
    })

    monaco.editor.defineTheme('blur-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#F2F4F7',
      },
    })

    monaco.editor.defineTheme('focus-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      },
    })
  }

  const outPutValue = (() => {
    if (!isJSONStringifyBeauty)
      return value as string
    try {
      return JSON.stringify(value as object, null, 2)
    }
    catch (e) {
      return value as string
    }
  })()

  return (
    <div>
      <Base
        title={title}
        value={outPutValue}
        headerRight={headerRight}
        isFocus={isFocus}
        minHeight={200}
      >
        {/* https://www.npmjs.com/package/@monaco-editor/react */}
        <Editor
          className='h-full'
          // language={language === CodeLanguage.javascript ? 'javascript' : 'python'}
          language={languageMap[language] || 'javascript'}
          theme={isFocus ? 'focus-theme' : 'blur-theme'}
          value={outPutValue}
          onChange={handleEditorChange}
          // https://microsoft.github.io/monaco-editor/typedoc/interfaces/editor.IEditorOptions.html
          options={{
            readOnly,
            quickSuggestions: false,
            minimap: { enabled: false },
            lineNumbersMinChars: 1, // would change line num width
            // lineNumbers: (num) => {
            //   return <div>{num}</div>
            // }
          }}
          onMount={handleEditorDidMount}
        />
      </Base>
    </div>
  )
}
export default React.memo(CodeEditor)
