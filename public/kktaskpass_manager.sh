#!/bin/bash

# 增强版Web服务运维脚本 - KKTaskPaaS专用
# 功能：服务状态监控 + 独立启停 + 项目构建 + 日志管理

# 服务器配置
SERVER_IP="13.228.146.70"
SERVER_USER="bitnami"
SSH_KEY="$HOME/.ssh/id_rsa"
DEPLOY_PATH="/home/taskweb/bcom/www"
PROJECT_NAME="KKTaskPaaS"

# 颜色配置
RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
CYAN='\033[1;36m'
PURPLE='\033[1;35m'
NC='\033[0m'

# 日志函数
log_info() { echo -e "${BLUE}[信息]${NC} $1"; }
log_success() { echo -e "${GREEN}[成功]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[警告]${NC} $1"; }
log_error() { echo -e "${RED}[错误]${NC} $1"; }

# SSH连接函数
ssh_connect() {
    local command="$1"
    ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -i "$SSH_KEY" "${SERVER_USER}@${SERVER_IP}" "$command" 2>/dev/null
}

# 显示菜单头
show_header() {
    clear
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                  KKTaskPaaS 运维管理平台                 ║"
    echo "║                 Enhanced Web Service Manager            ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "服务器: ${CYAN}${SERVER_USER}@${SERVER_IP}${NC} | 项目: ${CYAN}${PROJECT_NAME}${NC}"
    echo -e "时间: ${CYAN}$(date +'%Y年%m月%d日 %H:%M:%S')${NC}"
    echo ""
}

# 检查服务状态
check_service_status() {
    log_info "检查服务状态..."
    
    echo -e "${CYAN}=== PM2应用状态 ===${NC}"
    local pm2_status=$(ssh_connect "pm2 list 2>/dev/null | grep -E '(kktaskpaas|App name|status)'")
    echo "$pm2_status" | while read -r line; do
        if echo "$line" | grep -q "online"; then
            echo -e "$line ${GREEN}【运行中】${NC}"
        elif echo "$line" | grep -q "stopped"; then
            echo -e "$line ${RED}【已停止】${NC}"
        elif echo "$line" | grep -q "errored"; then
            echo -e "$line ${RED}【错误】${NC}"
        else
            echo "$line"
        fi
    done
    
    # 检查端口状态
    echo -e "\n${CYAN}=== 端口监听状态 ===${NC}"
    local b_port=$(ssh_connect "netstat -tulpn 2>/dev/null | grep ':7770 ' | wc -l")
    local c_port=$(ssh_connect "netstat -tulpn 2>/dev/null | grep ':8890 ' | wc -l")
    
    if [ "$b_port" -eq "1" ]; then
        echo -e "B端端口(7770): ${GREEN}监听中【正常】${NC}"
    else
        echo -e "B端端口(7770): ${RED}未监听【异常】${NC}"
    fi
    
    if [ "$c_port" -eq "1" ]; then
        echo -e "C端端口(8890): ${GREEN}监听中【正常】${NC}"
    else
        echo -e "C端端口(8890): ${RED}未监听【异常】${NC}"
    fi
}

# 启动B端服务
start_b_service() {
    log_info "启动B端服务..."
    if ssh_connect "cd $DEPLOY_PATH && pm2 start ecosystem.config.js --only kktaskpaas-b-end"; then
        log_success "B端服务启动成功"
    else
        log_error "B端服务启动失败"
    fi
}

# 停止B端服务
stop_b_service() {
    log_info "停止B端服务..."
    if ssh_connect "pm2 stop kktaskpaas-b-end"; then
        log_success "B端服务已停止"
    else
        log_error "B端服务停止失败"
    fi
}

# 启动C端服务
start_c_service() {
    log_info "启动C端服务..."
    if ssh_connect "cd $DEPLOY_PATH && pm2 start ecosystem.config.js --only kktaskpaas-c-end"; then
        log_success "C端服务启动成功"
    else
        log_error "C端服务启动失败"
    fi
}

# 停止C端服务
stop_c_service() {
    log_info "停止C端服务..."
    if ssh_connect "pm2 stop kktaskpaas-c-end"; then
        log_success "C端服务已停止"
    else
        log_error "C端服务停止失败"
    fi
}

# 重启所有服务
restart_all_services() {
    log_info "重启所有服务..."
    ssh_connect "pm2 restart all" && log_success "所有服务重启完成"
}

# 构建项目
build_project() {
    log_info "开始构建项目..."
    echo -e "${CYAN}=== 构建进度 ===${NC}"
    
    if ssh_connect "cd $DEPLOY_PATH && npm install"; then
        echo -e "依赖安装: ${GREEN}完成【成功】${NC}"
    else
        echo -e "依赖安装: ${RED}失败【异常】${NC}"
        return 1
    fi
    
    if ssh_connect "cd $DEPLOY_PATH && npm run build"; then
        echo -e "项目构建: ${GREEN}完成【成功】${NC}"
        log_success "项目构建完成"
    else
        echo -e "项目构建: ${RED}失败【异常】${NC}"
        return 1
    fi
}

# 查看实时日志
view_realtime_logs() {
    echo -e "${CYAN}选择日志类型:${NC}"
    echo "1) B端服务日志"
    echo "2) C端服务日志" 
    echo "3) Nginx访问日志"
    echo "4) Nginx错误日志"
    echo "5) 所有PM2日志"
    echo -n "请选择 (1-5): "
    
    read -r choice
    log_info "按 Ctrl+C 退出日志查看"
    
    case $choice in
        1) ssh_connect "pm2 logs kktaskpaas-b-end --lines 50 --raw" ;;
        2) ssh_connect "pm2 logs kktaskpaas-c-end --lines 50 --raw" ;;
        3) ssh_connect "sudo tail -f /opt/bitnami/nginx/logs/access.log" ;;
        4) ssh_connect "sudo tail -f /opt/bitnami/nginx/logs/error.log" ;;
        5) ssh_connect "pm2 logs --lines 30" ;;
        *) log_error "无效选择" ;;
    esac
}

# 显示主菜单
show_menu() {
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════╗"
    echo "║                 主菜单                  ║"
    echo "╠══════════════════════════════════════════╣"
    echo "║ 1️⃣   📊 服务状态概览                   ║"
    echo "║ 2️⃣   🚀 B端服务管理                  ║"
    echo "║ 3️⃣   🚀 C端服务管理                  ║"
    echo "║ 4️⃣   🔄 重启所有服务                  ║"
    echo "║ 5️⃣   🛠️  项目构建                   ║"
    echo "║ 6️⃣   📋 实时日志查看                 ║"
    echo "║ 7️⃣   ⚙️  系统配置检查                 ║"
    echo "║ 8️⃣   ❌ 退出                        ║"
    echo "╚══════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -n "请选择操作 (1-8): "
}

# B端服务管理子菜单
b_service_menu() {
    echo -e "\n${CYAN}=== B端服务管理 ===${NC}"
    echo "1) 启动B端服务"
    echo "2) 停止B端服务"
    echo "3) 重启B端服务"
    echo "4) 返回主菜单"
    echo -n "请选择 (1-4): "
    
    read -r choice
    case $choice in
        1) start_b_service ;;
        2) stop_b_service ;;
        3) ssh_connect "pm2 restart kktaskpaas-b-end" && log_success "B端服务重启完成" ;;
        4) return ;;
        *) log_error "无效选择" ;;
    esac
}

# C端服务管理子菜单
c_service_menu() {
    echo -e "\n${CYAN}=== C端服务管理 ===${NC}"
    echo "1) 启动C端服务"
    echo "2) 停止C端服务"
    echo "3) 重启C端服务"
    echo "4) 返回主菜单"
    echo -n "请选择 (1-4): "
    
    read -r choice
    case $choice in
        1) start_c_service ;;
        2) stop_c_service ;;
        3) ssh_connect "pm2 restart kktaskpaas-c-end" && log_success "C端服务重启完成" ;;
        4) return ;;
        *) log_error "无效选择" ;;
    esac
}

# 系统配置检查
system_config_check() {
    log_info "检查系统配置..."
    
    echo -e "${CYAN}=== Nginx配置检查 ===${NC}"
    local nginx_test=$(ssh_connect "sudo /opt/bitnami/nginx/sbin/nginx -t 2>&1")
    if echo "$nginx_test" | grep -q "successful"; then
        echo -e "配置语法: ${GREEN}正常【通过】${NC}"
    else
        echo -e "配置语法: ${RED}异常【失败】${NC}"
        echo "$nginx_test"
    fi
    
    echo -e "\n${CYAN}=== 磁盘空间检查 ===${NC}"
    ssh_connect "df -h / | awk 'NR==2 {print \"根目录: \" \$3 \"/\" \$2 \" (使用率: \" \$5 \")\"}'"
    
    echo -e "\n${CYAN}=== 内存使用检查 ===${NC}"
    ssh_connect "free -h | awk '/Mem/ {print \"内存: \" \$3 \"/\" \$2 \" (使用率: \" \$3/\$2 * 100 \"%)\"}'"
}

# 主程序
main() {
    # 检查SSH连接
    if ! ssh_connect "echo '连接测试成功'" > /dev/null; then
        log_error "SSH连接失败，请检查配置"
        exit 1
    fi
    
    while true; do
        show_header
        show_menu
        read -r choice
        
        show_header
        
        case $choice in
            1) check_service_status ;;
            2) b_service_menu ;;
            3) c_service_menu ;;
            4) restart_all_services ;;
            5) build_project ;;
            6) view_realtime_logs ;;
            7) system_config_check ;;
            8)
                log_success "感谢使用！再见！"
                exit 0
                ;;
            *)
                log_error "无效选择，请重新输入"
                ;;
        esac
        
        echo
        read -p "按回车键继续..."
    done
}

# 脚本入口
if [ "$1" = "status" ]; then
    check_service_status
elif [ "$1" = "start-b" ]; then
    start_b_service
elif [ "$1" = "start-c" ]; then
    start_c_service
elif [ "$1" = "build" ]; then
    build_project
else
    main
fi