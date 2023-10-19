-- ユーザー mysql の権限をリセット後、必要な権限を付与する
REVOKE ALL ON *.* FROM mysql;
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,ALTER,DROP,INDEX,REFERENCES ON katachi_monster.* TO mysql;
