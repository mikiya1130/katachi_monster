cat <<EOF > .env
USERNAME=$(id -un)
USER_UID=$(id -u)
USER_GID=$(id -g)
EOF
