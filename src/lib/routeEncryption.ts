// 路由加密和解密工具函数

// 使用环境变量或配置文件中的密钥
// 注意：确保加密和解密使用完全相同的密钥！
const SECRET_KEY = process.env.ROUTE_ENCRYPTION_KEY || 'my-secret-key-change-me-in-production';



/**
 * 简单的XOR加密实现（用于演示，生产环境建议使用更安全的算法）
 * @param input 要加密的输入（可以是字符串或Buffer）
 * @param key 加密密钥
 * @returns 加密后的Buffer
 */
const xorEncrypt = (input: string | Buffer, key: string): Buffer => {
  const inputBuffer = Buffer.isBuffer(input) ? input : Buffer.from(input, 'utf8');
  const keyBuffer = Buffer.from(key, 'utf8');
  const resultBuffer = Buffer.alloc(inputBuffer.length);
  
  for (let i = 0; i < inputBuffer.length; i++) {
    resultBuffer[i] = inputBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }
  
  return resultBuffer;
};

/**
 * 将路由路径加密为Base64URL格式
 * @param path 原始路由路径
 * @returns 加密后的路由路径
 */
export const encryptRoute = (path: string): string => {  
  try {
    // 移除开头的斜杠
    const pathWithoutSlash = path.startsWith('/') ? path.slice(1) : path;
    
    // 使用XOR加密
    const xorEncrypted = xorEncrypt(pathWithoutSlash, SECRET_KEY);
    
    // 转换为Base64
    const encoded = xorEncrypted.toString('base64');
    
    // 转换为Base64URL格式（移除填充，替换字符）
    const result = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    
    return result;
  } catch (error) {
    return path.startsWith('/') ? path.slice(1) : path;
  }
}

/**
 * 将加密的路由路径解密为原始格式
 * @param encryptedPath 加密后的路由路径
 * @returns 原始路由路径
 */
export const decryptRoute = (encryptedPath: string): string => {  
  try {
    // 还原Base64URL编码
    const base64Url = encryptedPath.replace(/-/g, '+').replace(/_/g, '/');
    // 计算需要的填充字符数
    const paddingNeeded = (4 - base64Url.length % 4) % 4;
    // 只有在需要时才添加填充
    const padded = paddingNeeded > 0 ? base64Url.padEnd(base64Url.length + paddingNeeded, '=') : base64Url;
    // 解码Base64为Buffer
    const encryptedBuffer = Buffer.from(padded, 'base64');
    // 使用XOR解密
    const decryptedBuffer = xorEncrypt(encryptedBuffer, SECRET_KEY);
    // 转换为字符串并添加开头的斜杠
    const result = `/${decryptedBuffer.toString('utf8')}`;
    return result;
  } catch (error) {
    // 如果解密失败，返回原始路径（带斜杠）
    return `/${encryptedPath}`;
  }
}

/**
 * 检查路径是否已加密
 * @param path 要检查的路径
 * @returns 是否已加密
 */
export const isEncryptedRoute = (path: string): boolean => {  
  // 排除已知的静态资源路径
  const staticPaths = ['images', 'database', 'software', 'uploads', '_next', 'api'];
  if (staticPaths.includes(path)) {
    return false;
  }
  
  // 排除已知的一级路由
  const knownRoutes = ['rental', 'commenter'];
  if (knownRoutes.includes(path)) {
    return false;
  }
  
  // 检查是否符合Base64URL格式
  const base64UrlPattern = /^[A-Za-z0-9-_]+$/;
  if (!base64UrlPattern.test(path)) {
    return false;
  }
  
  // 尝试验解密，如果解密后的路径包含乱码或不符合预期格式，则认为不是加密路由
  try {
    const decrypted = decryptRoute(path);
    // 检查解密后的路径是否包含预期的一级路由
    const decryptedParts = decrypted.split('/').filter(Boolean);
    if (decryptedParts.length > 0 && knownRoutes.includes(decryptedParts[0])) {
      return true;
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * 加密URL路径的第一级路由
 * @param url 完整的URL（例如：http://localhost:3000/accountrental/my-account-rental?tab=overview）
 * @returns 加密后的URL
 */
export const encryptUrlFirstLevel = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 1) {
      // 获取第一级路由
      const firstLevel = `/${pathParts[0]}`;
      // 加密第一级路由
      const encrypted = encryptRoute(firstLevel);
      // 构建新的路径
      const remainingPath = pathParts.slice(1).join('/');
      const newPath = `/${encrypted}${remainingPath ? `/${remainingPath}` : ''}`;
      
      // 更新URL路径
      parsedUrl.pathname = newPath;
      const result = parsedUrl.toString();
      return result;
    }
    return url;
  } catch (error) {
    console.error('[] URL加密失败:', error);
    return url;
  }
};

/**
 * 解密URL路径的第一级路由
 * @param url 加密后的URL
 * @returns 解密后的URL
 */
export const decryptUrlFirstLevel = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
    
    if (pathParts.length >= 1 && isEncryptedRoute(pathParts[0])) {
      // 解密第一级路由
      const decrypted = decryptRoute(pathParts[0]);
      // 构建新的路径
      const remainingPath = pathParts.slice(1).join('/');
      const newPath = `${decrypted}${remainingPath ? `/${remainingPath}` : ''}`;
      
      // 更新URL路径
      parsedUrl.pathname = newPath;
      const result = parsedUrl.toString();
      return result;
    }
    return url;
  } catch (error) {
    console.error('[] URL解密失败:', error);
    return url;
  }
};