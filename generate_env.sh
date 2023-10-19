function mkpassword {
    # 15-20桁のランダムな英数文字列を生成
    DIGIT=$(seq 15 20 | shuf | head -1)
    echo $(cat /dev/urandom | tr -dc 'A-Za-z0-9' | head -c $DIGIT)
}

cat <<EOF > .env
USERNAME=$(id -un)
USER_UID=$(id -u)
USER_GID=$(id -g)
MYSQL_ROOT_PASSWORD=$(mkpassword)
MYSQL_USER_PASSWORD=$(mkpassword)
EOF
