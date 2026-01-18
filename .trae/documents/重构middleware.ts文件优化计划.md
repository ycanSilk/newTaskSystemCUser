# 修复和重构middleware.ts文件计划

## 问题分析

1. **handleCheckToken函数问题**：
   - 当前`handleCheckToken`函数没有从客户端请求中获取token
   - 依赖请求拦截器在服务器端获取token，这是不正确的
   - 需要修改为从客户端请求头中获取`X-Token`字段，并传递给外部API

2. **middleware.ts结构问题**：
   - 代码结构复杂，包含过多日志
   - 逻辑分支过多，可维护性差
   - 需要简化结构，分离关注点

## 修复计划

### 第一步：修复checkToken相关文件

1. **修改checkTokenHandler.ts**：
   - 添加`req`参数，从请求头中获取`X-Token`
   - 将token传递给apiClient请求

2. **修改checkToken路由**：
   - 将`req`参数传递给`handleCheckToken`函数

3. **修改apiClient配置**：
   - 确保请求拦截器正确处理token

### 第二步：重构middleware.ts

1. **简化结构**：
   - 分为路径解密、认证授权、路径加密三个逻辑模块
   - 减少不必要的日志输出
   - 简化条件判断

2. **优化Token验证**：
   - 确保validateToken函数正确调用checkToken API
   - 返回正确的布尔值

3. **优化路由加密逻辑**：
   - 只对非GET请求进行加密
   - 避免无限重定向

## 具体实现

### 1. 修改checkTokenHandler.ts

```typescript
export async function handleCheckToken(req: NextRequest): Promise<NextResponse> {
  try {
    // 从请求头中获取X-Token
    const token = req.headers.get('X-Token') || '';
    
    // 使用apiClient发送检查Token请求，传递token
    const response = await apiClient.get<CheckTokenApiResponse>(CHECK_TOKEN_ENDPOINT, {
      headers: {
        'X-Token': token
      }
    });
    
    // 返回标准化的成功响应
    return NextResponse.json({
      success: response.data.code === 0,
      code: response.data.code,
      message: response.data.message,
      data: response.data.data,
      timestamp: response.data.timestamp
    }, { status: 200 });
  } catch (error) {
    // 处理错误，转换为标准化的错误响应
    const apiError: ApiError = handleApiError(error);
    
    // 返回符合要求格式的错误响应
    return NextResponse.json({
      success: false,
      code: apiError.code,
      message: apiError.message,
      data: null,
      timestamp: Math.floor(Date.now() / 1000)
    }, { status: apiError.status });
  }
}
```

### 2. 修改checkToken路由

```typescript
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleCheckToken(req);
}
```

### 3. 重构middleware.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { decryptRoute, isEncryptedRoute, encryptRoute } from './lib/routeEncryption';

// 定义公共路径
const PUBLIC_PATHS = ['/commenter/auth/login', '/commenter/auth/register'];

// 定义需要保护的路径前缀
const PROTECTED_PREFIXES = ['/commenter'];

// 检查路径是否为公共路径
const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.includes(path);
};

// 检查路径是否需要保护
const isProtectedPath = (path: string): boolean => {
  return PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix));
};

// 验证Token有效性
const validateToken = async (token: string, origin: string): Promise<boolean> => {
  try {
    const response = await fetch(`${origin}/api/auth/checkToken`, {
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    });
    
    const result = await response.json();
    return response.status === 200 && result.code === 0 && result.data?.valid === true;
  } catch (error) {
    return false;
  }
};

export async function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl;
  const pathParts = pathname.split('/').filter(Boolean);
  
  // ========== 1. 路径解密处理 ==========
  let decryptedPathname = pathname;
  let isEncrypted = false;
  
  if (pathParts.length > 0 && isEncryptedRoute(pathParts[0])) {
    isEncrypted = true;
    try {
      const decryptedPath = decryptRoute(pathParts[0]);
      const decryptedParts = decryptedPath.split('/').filter(Boolean);
      const remainingPath = pathParts.slice(1).join('/');
      decryptedPathname = `/${decryptedParts.join('/')}${remainingPath ? `/${remainingPath}` : ''}`;
    } catch (error) {
      decryptedPathname = pathname;
    }
  }
  
  // ========== 2. 认证和授权处理 ==========
  let isAuthorized = false;
  
  // 公共路径直接授权
  if (isPublicPath(decryptedPathname)) {
    isAuthorized = true;
  }
  // 非保护路径直接授权
  else if (!isProtectedPath(decryptedPathname)) {
    isAuthorized = true;
  }
  // 需要保护的路径，检查Token
  else {
    const token = request.cookies.get('Commenter_token')?.value;
    
    if (token && await validateToken(token, origin)) {
      isAuthorized = true;
    }
  }
  
  // 未授权，重定向到登录页
  if (!isAuthorized) {
    const loginUrl = new URL('/commenter/auth/login', origin);
    loginUrl.searchParams.set('redirect', decryptedPathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 如果路径已加密，重写到解密后的路径
  if (isEncrypted) {
    const newUrl = new URL(request.nextUrl.origin + decryptedPathname + search);
    return NextResponse.rewrite(newUrl);
  }
  
  // ========== 3. 路径加密处理 ==========
  // 只对非GET请求进行加密
  if (request.method !== 'GET') {
    if (pathParts.length >= 2 && !isEncryptedRoute(pathParts[0])) {
      const isFromMiddleware = request.headers.get('x-from-middleware') === '1';
      
      if (!isFromMiddleware) {
        try {
          const firstTwoLevels = `/${pathParts[0]}/${pathParts[1]}`;
          const encrypted = encryptRoute(firstTwoLevels);
          const remainingPath = pathParts.slice(2).join('/');
          const newPath = `/${encrypted}${remainingPath ? `/${remainingPath}` : ''}`;
          
          const newUrl = new URL(request.nextUrl.origin + newPath + search);
          const response = NextResponse.redirect(newUrl);
          response.headers.set('x-from-middleware', '1');
          return response;
        } catch (error) {
          return NextResponse.next();
        }
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|images|database|software|uploads).*)',
  ],
};
```

## 测试计划

1. **测试checkToken API**：
   - 使用curl或Postman发送GET请求到`/api/auth/checkToken`，包含有效的`X-Token`头
   - 验证返回结果是否正确

2. **测试登录流程**：
   - 访问受保护的路径，验证是否重定向到登录页
   - 使用正确的凭据登录，验证是否跳转到原始路径
   - 验证登录后是否能访问受保护的路径

3. **测试路由加密**：
   - 访问非加密路径，验证是否被重定向到加密路径
   - 访问加密路径，验证是否能正确解密
   - 登录后，验证是否跳转到解密后的路径

4. **测试Token失效处理**：
   - 使用无效的Token访问受保护的路径，验证是否重定向到登录页
   - 登出后，验证是否无法访问受保护的路径

通过以上修复和测试，我将确保middleware.ts文件的功能正常，结构清晰，可维护性高。