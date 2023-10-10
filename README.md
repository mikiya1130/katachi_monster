## 開発環境構築

```sh
. generate_env.sh
make upb
```

VSCode の PORTS で `3000` をポートフォワード

## EC2(Ubuntu22.04) コマンドメモ

```sh
git clone https://github.com/mikiya1130/katachi_monster.git
cd katachi_monster
. ec2_install_nginx.sh
. ec2_install_docker.sh
sudo usermod -aG docker ubuntu
(exit & 再ログイン)
cd katachi_monster
. generate_env.sh
sudo apt install -y make
make upb-prod
```
