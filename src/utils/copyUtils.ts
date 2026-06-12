/**
 * 剪贴板工具函数
 *
 * 提供将文本写入系统剪贴板的能力，并通过 Naive UI 消息实例
 * 向用户反馈复制成功或失败的结果。
 */

/**
 * Naive UI 消息接口，仅声明本模块所需的 success / error 方法
 */
export interface MessageApi {
  success: (content: string) => unknown
  error: (content: string) => unknown
}

/**
 * 将文本写入系统剪贴板
 *
 * 优先使用现代 Clipboard API（需安全上下文），
 * 若不可用则降级为创建临时 textarea 并执行 execCommand('copy')。
 *
 * @param text - 需要复制的文本内容
 * @returns 是否复制成功
 */
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
    console.warn('复制失败:', err)
    return false
  }
}

/**
 * 复制文本到剪贴板并通过消息提示反馈结果
 *
 * 调用此函数需传入 Naive UI 的消息实例（通过 useMessage 获取），
 * 复制成功时弹出成功提示，失败时弹出错误提示。
 *
 * @param text    - 需要复制的文本内容
 * @param label   - 色值类型的中文标签，如「十六进制色值」「红绿蓝色值」，用于提示文案
 * @param message - Naive UI 消息实例，用于弹出成功/失败提示
 */
export async function copyText(
  text: string,
  label: string,
  message: MessageApi
): Promise<void> {
  const success = await copyToClipboard(text)
  if (success) {
    message.success(`${label}已复制到剪贴板`)
  } else {
    message.error('复制失败，请手动复制')
  }
}
