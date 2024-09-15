# 使用vpn 导致npm mirror 访问不上


# 以编辑文件并取消以下行的注释来强制使用 IPv4 优先级

```cmd
sudo nano /etc/gai.conf

```



# 删除这一行前的 # 符号，使其变为：

```nano

precedence ::ffff:0:0/96  100

```



