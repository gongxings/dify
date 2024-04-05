import {
  memo,
  useCallback,
  useEffect,
} from 'react'
import type { TextNode } from 'lexical'
import { $applyNodeReplacement } from 'lexical'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { decoratorTransform } from '../../utils'
import type { WorkflowVariableBlockType } from '../../types'
import { CustomTextNode } from '../custom-text/node'
import { $createWorkflowVariableBlockNode } from './node'
import { WorkflowVariableBlockNode } from './index'

const REGEX = /\{\{(#[a-zA-Z0-9_]{1,50}(\.[a-zA-Z_][a-zA-Z0-9_]{0,29}){1,10}#)\}\}/gi

const WorkflowVariableBlockReplacementBlock = ({
  workflowNodesMap,
  onInsert,
}: WorkflowVariableBlockType) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([WorkflowVariableBlockNode]))
      throw new Error('WorkflowVariableBlockNodePlugin: WorkflowVariableBlockNode not registered on editor')
  }, [editor])

  const createWorkflowVariableBlockNode = useCallback((textNode: TextNode): WorkflowVariableBlockNode => {
    if (onInsert)
      onInsert()

    const nodePathString = textNode.getTextContent().slice(3, -3)
    return $applyNodeReplacement($createWorkflowVariableBlockNode(nodePathString.split('.'), workflowNodesMap))
  }, [onInsert, workflowNodesMap])

  const getMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text)

    if (matchArr === null)
      return null

    const startOffset = matchArr.index
    const endOffset = startOffset + matchArr[0].length
    return {
      end: endOffset,
      start: startOffset,
    }
  }, [])

  useEffect(() => {
    return mergeRegister(
      editor.registerNodeTransform(CustomTextNode, textNode => decoratorTransform(textNode, getMatch, createWorkflowVariableBlockNode)),
    )
  }, [])

  return null
}

export default memo(WorkflowVariableBlockReplacementBlock)
