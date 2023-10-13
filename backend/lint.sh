python -m mypy --strict src
status_mypy=$?
python -m ruff check src
status_ruff=$?
# python -m black src

# 全てコマンドの終了ステータスが0なら、このスクリプトの終了ステータスも0
[ $status_mypy -eq 0 ] && [ $status_ruff -eq 0 ]
