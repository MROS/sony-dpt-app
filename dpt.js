const fs = require("fs");
const path = require("path");
const axios = require("axios");
const https = require("https");
const crypto = require("crypto");
const FormData = require("form-data");

const MAX_LENGTH = 100 * 1024 * 1024;

const KEY_PATH = `${process.env.HOME}/.config/digital-paper/key`;
const CLIENT_ID_PATH = `${process.env.HOME}/.config/digital-paper/client_id`;
const PORT = 8443;

function getHeaders(form) {
  let length = form.getLengthSync()
  let headers = Object.assign({ 'Content-Length': length }, form.getHeaders());
  return headers;
}

class DigitalPaper {

  constructor(address) {
    this.key = fs.readFileSync(KEY_PATH).toString();
    this.client_id = fs.readFileSync(CLIENT_ID_PATH).toString();
    this.address = address;
    this.http = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      baseURL: `https://${this.address}:${PORT}`,
      maxContentLength: MAX_LENGTH,
    });
  }

  base_url() {
    return `https://${this.address}:${PORT}`;
  }

  async get_nonce() {
    let path = `/auth/nonce/${this.client_id}`;
    let response = await this.http.get(path);
    return response.data.nonce;
  }

  async authenticate() {
    let nonce = await this.get_nonce();

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(nonce);
    let nonce_signed = sign.sign(this.key, "base64");

    let data = {
      client_id: this.client_id,
      nonce_signed: nonce_signed
    };
    let response = await this.http.put(`/auth`, data);

    this.cookie = response.headers["set-cookie"][0];
    this.http = axios.create({
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: { Cookie: this.cookie },
      baseURL: this.base_url(),
      maxContentLength: MAX_LENGTH
    });

    // console.log(this.cookie);
    return response;
  }

  async folder_info(folder_id) {
    let response = await this.http.get(`/folders/${folder_id}`);
    return response.data;
  }

  async ls_folder(folder_id) {
    let response = await this.http.get(`/folders/${folder_id}/entries2`);
    return response.data.entry_list;
  }

  async ls_all_doc() {
    let response = await this.http.get("/documents2");
    return response.data;
  }

  async new_folder(folder_name, parent_folder_id) {
    let info = {
      parent_folder_id: parent_folder_id,
      folder_name: folder_name,
      ext_id: ""
    }
    let response = await this.http.post("/folders2", info);
    return response.data;
  }

  async change_doc(doc_id, new_file_name, new_parent_folder_id) {
    let info = {
      parent_folder_id: new_parent_folder_id,
      file_name: new_file_name,
      ext_id: ""
    }
    let response = await this.http.put(`/documents2/${doc_id}`, info);
    return response.data;
  }

  async upload(filename, remote_dir_id) {
    remote_dir_id = remote_dir_id || "root";
    let base_name = path.basename(filename);
    let data = {
      file_name: base_name,
      parent_folder_id: remote_dir_id,
      ext_id: ""
    };
    let r = await this.http.post(`${this.base_url()}/documents2`, data);
    let id = r.data["document_id"];
    console.log(`document_id: ${id}`);
    let doc_url = `/documents/${id}/file`;

    const form = new FormData({ maxDataSize: MAX_LENGTH });

    let content = fs.readFileSync(filename);
    form.append("file", content, base_name);

    let response = await this.http.put(doc_url, form, {
      headers: getHeaders(form)
    })
    console.log(response);
  }
}


module.exports = DigitalPaper;