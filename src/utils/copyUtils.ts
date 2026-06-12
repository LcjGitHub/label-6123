import type { MessageReactive } from 'naive-ui'

let messageInstance: {
  success: (content: string) => MessageReactive
  error: (content: string) => MessageReactive
} | null = null

export function setMessageInstance(
  instance: {
    success: (content: string) => MessageReactive
    error: (content: string) => MessageReactive
  }
) {
  messageInstance = instance
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    textArea.style.top = '-9999px'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    return successful
  } catch (err) {
    console.warn('Copy failed:', err)
    return false
  }
}

export async function copyText(text: string, label?: string): Promise<void> {
  const success = await copyToClipboard(text)
  if (messageInstance) {
    if (success) {
      messageInstance.success(label ? `${label}已复制到剪贴板` : '已复制到剪贴板')
    } else {
      messageInstance.error('复制失败，请手动复制')
    }
  }
}
