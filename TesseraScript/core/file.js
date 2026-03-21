// core/file.js
//
// 这个模块负责处理 Obsidian vault 中的文件读取。
// 设计目标：
// - 在 Dataview / 手动载入脚本场景中直接可用
// - 优先兼容 context.app，其次回退到全局 app
// - 统一提供文本、JSON、CSS 等文件读取能力
// - 为其他 core 模块（例如 css.js）提供可复用的底层能力

/**
 * 创建一个文件控制器。
 *
 * @param {Object} [context]
 * @param {Object} [context.app] - Obsidian app 实例，可选；若未传入则尝试使用 globalThis.app。
 * @returns {{
 *   getApp: Function,
 *   normalizePath: Function,
 *   getAbstractFileByPath: Function,
 *   exists: Function,
 *   read: Function,
 *   readText: Function,
 *   readCss: Function,
 *   readJson: Function,
 * }}
 */
function createFileController(context = {}) {
  /**
   * 获取可用的 Obsidian app 实例。
   */
  function getApp() {
    const appInstance = context.app || globalThis.app;
    if (!appInstance || !appInstance.vault) {
      throw new Error("[file] 未找到 Obsidian app 实例，无法读取 vault 文件。");
    }
    return appInstance;
  }

  /**
   * 统一规整路径，去除首尾空白并把反斜杠转为正斜杠。
   * 这样在 Windows / Obsidian vault 内部路径上更稳定。
   */
  function normalizePath(path) {
    const normalized = String(path || "").trim().replace(/\\/g, "/");
    return normalized.replace(/\/+/g, "/");
  }

  /**
   * 获取 vault 中的抽象文件对象。
   * 若路径无效或文件不存在，返回 null。
   */
  function getAbstractFileByPath(path) {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath) return null;

    const appInstance = getApp();
    return appInstance.vault.getAbstractFileByPath(normalizedPath);
  }

  /**
   * 判断某个 vault 路径是否存在。
   */
  function exists(path) {
    return !!getAbstractFileByPath(path);
  }

  /**
   * 读取 vault 文件文本。
   *
   * @param {string} path - vault 内相对路径
   * @param {Object} [options]
   * @param {boolean} [options.cached=true] - 优先使用 cachedRead
   * @returns {Promise<string>}
   */
  async function read(path, options = {}) {
    const normalizedPath = normalizePath(path);
    if (!normalizedPath) {
      throw new Error("[file] path 不能为空。");
    }

    const appInstance = getApp();
    const file = getAbstractFileByPath(normalizedPath);

    if (!file) {
      throw new Error(`[file] 未找到文件：${normalizedPath}`);
    }

    const useCached = options.cached !== false;

    if (useCached && typeof appInstance.vault.cachedRead === "function") {
      return appInstance.vault.cachedRead(file);
    }

    if (typeof appInstance.vault.read === "function") {
      return appInstance.vault.read(file);
    }

    throw new Error("[file] 当前 vault 不支持读取文件内容。");
  }

  /**
   * read 的语义化别名，强调返回文本。
   */
  async function readText(path, options = {}) {
    return read(path, options);
  }

  /**
   * 读取 CSS 文件。
   * 目前本质仍是文本读取，只是提供更明确的语义入口。
   */
  async function readCss(path, options = {}) {
    return read(path, options);
  }

  /**
   * 读取并解析 JSON 文件。
   */
  async function readJson(path, options = {}) {
    const text = await read(path, options);

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`[file] JSON 解析失败：${normalizePath(path)}\n${error.message}`);
    }
  }

  return {
    getApp,
    normalizePath,
    getAbstractFileByPath,
    exists,
    read,
    readText,
    readCss,
    readJson,
  };
}

module.exports = createFileController;
module.exports.createFileController = createFileController;
