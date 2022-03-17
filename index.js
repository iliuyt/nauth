const totp = require("totp-generator");
const os = require("os");
const path = require("path");
const fs = require("fs");
const nauthPath = path.join(os.homedir(), "/.nauth/");
const configPath = path.join(os.homedir(), "/.nauth/config");

let mkdirSync = function (dirpath, mode) {
    if (!fs.existsSync(dirpath)) {
        let pathtmp;
        let arr = dirpath.split(/[/\\]/);
        arr.forEach(function (dirname) {
            if (dirname === "") {
                if (!pathtmp) {
                    pathtmp = "/";
                }
                return false;
            }
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        });
    }
    return true;
};

module.exports = {
    set: function () {
        let data = mkdirSync(nauthPath);
        console.log(data, nauthPath);
        let opts = process.argv.slice(2);
        let name = opts[1];
        let value = opts[2];
        if (!name) {
            console.error("请输入名称");
        }
        if (!value) {
            console.error("请输入密钥");
        }
        let config = {};
        let stat = fs.existsSync(configPath);
        if (stat) {
            let configJson = fs.readFileSync(configPath);
            config = JSON.parse(configJson);
        }

        config[name] = value;

        fs.writeFileSync(configPath, JSON.stringify(config));

        console.log("保存成功");
    },
    get: function () {
        let opts = process.argv.slice(2);
        let name = opts[1];
        if (!name) {
            console.error("请输入名称");
        }
        let configJson = fs.readFileSync(configPath);
        if (!configJson) {
            console.error("配置文件不存在");
        }

        let config = JSON.parse(configJson);

        if (!config[name]) {
            console.error(`${name}配置不存在`);
        }

        const token = totp(config[name]);
        console.log(token);
    },
};
