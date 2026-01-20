/**
 * 检查支付密码的后端API端点,请求方法：GET
 */
export const CHECK_WALLET_PWD_ENDPOINT = '/c/v1/check-wallet-password.php';

//设置支付密码的后端API端点,请求方法：POST
export const SET_WALLET_PWD_ENDPOINT = '/c/v1/wallet-password.php';  // 设置支付密码


//获取钱包余额和交易明细的后端API端点,请求方法：GET
export const GET_WALLET_BALANCE_ENDPOINT = '/c/v1/wallet.php';  // 获取钱包余额和交易明细


//提现的后端API端点,请求方法：POST
export const WITHDRAWAL_WALLET_ENDPOINT = '/c/v1/withdraw.php';  // 提现


//提现记录的后端API端点,请求方法：GET
export const GET_WITHDRAWAL_RECORD_ENDPOINT = '/c/v1/withdraw-list.php';  // 提现记录
