# sony 電子紙命令行應用

以下皆以 dpt 來稱呼電子紙

## 安裝

clone 之後以 npm 安裝

```
git clone https://github.com/MROS/sony-dpt-app
cd sony-dpt-app
npm install -g . # 可能需要 sudo
```

需要先跟 dpt 取得金鑰，才能進行其他操作。然而本應用未實作取得金鑰的程序，得先使用 [dpt-rp1-py](https://github.com/janten/dpt-rp1-py) 來取得。

安裝 dpt-rp1-py
```
git clone https://github.com/janten/dpt-rp1-py
cd dpt-rp1-py
pip install . # 可能需要 sudo
```

由於本應用預設會到 ~/.config/digital-paper/ 目錄下查找 key 跟 client_id 兩個檔案，因此在使用 dpt-rp1-py 取得金鑰時，可以如以下執行：

```
cd ~/.config
mkdir digital-paper
cd digital-paper
dptrp1 --client-id client_id \
       --key key \
       --addr <addr> \
       register
```

至此安裝完成，請運行
```
dpt
```
會進入一個互動介面，請輸入 `ls` ，觀看是否列出最高層目錄下的檔案