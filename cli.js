const dns = require("dns").promises;
const DigitalPaper = require("./dpt");
const readline = require('readline');
const child_process = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function find_name(list, id) {
  let name = null;
  for (let l of list) {
    if (l.entry_id == id) {
      name = l.entry_name;
      break;
    }
  }
  return name;
}
function find_id(list, name) {
  let id = null;
  for (let l of list) {
    if (l.entry_name == name) {
      id = l.entry_id;
      break;
    }
  }
  return id;
}

// 記錄當前路徑、並快取部分資訊
class DigitalPaperCache extends DigitalPaper {
  constructor(address) {
    super(address);
    this.current_folder_id = "root";
    this.cache = new Map();
  }
  async ls_folder_cache(folder_id) {
    let list = this.cache.get(folder_id);
    if (list != undefined) {
      return list;
    }
    list = await this.ls_folder(folder_id);
    this.cache.set(folder_id, list)
    return list
  }
  async ls_folder_force_cache(folder_id) {
    let list = await this.ls_folder(folder_id);
    this.cache.set(folder_id, list)
    return list
  }
  async ls() {
    return await this.ls_folder_cache(this.current_folder_id);
  }
  async lsdir() {
    let list = await this.ls_folder_cache(this.current_folder_id);
    return list.filter(x => x.entry_type == "folder");
  }
  async lsdir_folder(folder_id) {
    let list = await this.ls_folder_cache(folder_id);
    return list.filter(x => x.entry_type == "folder");
  }
  async mkdir(folder_name) {
    await this.new_folder(folder_name, this.current_folder_id);
    // 已經發生變動，清除快取
    this.cache.set(this.current_folder_id, undefined);
  }
  async move(doc_name, parent_name) {
    let list = await this.ls();
    let doc_id = find_id(list, doc_name);
    let parent_id = find_id(list, parent_name);
    this.cache.set(this.current_folder_id, undefined);
    this.cache.set(parent_id, undefined);
    await this.change_doc(doc_id, undefined, parent_id);
  }
  async cd(folder_name) {
    let dirs = await this.lsdir();
    let id = find_id(dirs, folder_name);
    if (id != null) {
      this.current_folder_id = id;
    }
  }
}

(async function () {

  let address = (await dns.lookup("digitalpaper.local")).address;

  let dp
  try {
    dp = new DigitalPaperCache(address);
    await dp.authenticate();
  } catch (err) {
    console.log(err);
  }

  console.log(`取得連線，ip 爲 ${address}`);
  process.stdout.write("> ");
  rl.on('line', async function (line) {
    // 若以 - 開頭，執行本地指令
    cmd = line.split(" ");

    if (cmd[0] == "-cd") {
      process.chdir(cmd[1]);
      process.stdout.write("> ");
      return;
    } else if (line[0] == "-") {
      let ret = child_process.execSync(line.slice(1)).toString();
      console.log(ret);
      process.stdout.write("> ");
      return;
    }

    switch (cmd[0]) {
      case "ls-all": {
        try {
          const list = await dp.ls_all_doc();
          console.log(list.entry_list.map(b => b.entry_name));
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "put": {
        try {
          for (let i = 1; i < cmd.length; i++) {
            let file_path = cmd[i].replace(/\'/g, "");
            console.log(`正在上傳 ${file_path}......`);
            await dp.upload(file_path);
            console.log(`成功上傳 ${file_path}！`);
          }
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "ls": {
        try {
          const list = (cmd.length == 1 ? await dp.ls() : await dp.ls_folder_cache(cmd[1]));
          console.log(list.map(b => {
            return {
              name: b.entry_name,
              type: b.entry_type,
              id: b.entry_id,
            }
          }));
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "lsdir": {
        try {
          let list = (cmd.length == 1 ? await dp.lsdir() : await dp.lsdir_folder(cmd[1]));
          console.log(list.map(b => {
            return {
              name: b.entry_name,
              id: b.entry_id,
            }
          }));
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "mkdir": {
        try {
          await dp.mkdir(cmd[1]);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "cd": {
        try {
          await dp.cd(cmd[1]);
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "move": {
        try {
          if (cmd.length < 3) {
            throw "move 的參數至少爲 3";
          }
          let target = cmd[cmd.length - 1];
          for (let i = 1; i < cmd.length - 1; i++) {
            console.log(`正在移動 ${cmd[i]}......`);
            await dp.move(cmd[i], target);
            console.log(`成功移動 ${cmd[i]}！`);
          }
        } catch (err) {
          console.log(err);
        }
        break;
      }
      case "move-re": {
        try {
          if (cmd.length != 3) {
            throw "move-re [正則表達式] [目的地]";
          }
          let target = cmd[2];
          let re = new RegExp(cmd[1]);
          let list = await dp.ls();
          for (let x of list) {
            if (x.entry_name.match(re)) {
              console.log(`正在移動 ${x.entry_name}......`);
              await dp.move(x.entry_name, target);
              console.log(`成功移動 ${x.entry_name}！`);
            }
          }
        } catch (err) {
          console.log(err);
        }
        break;
      }
      default: {
        console.log(`不知名的指令：${cmd[0]}`);
      }
    }
    process.stdout.write("> ");
  });
})()

