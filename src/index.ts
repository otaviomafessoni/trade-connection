import robot from "robotjs";
import fs from "fs";
import { Client as Discord, Intents } from "discord.js";
import Client from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const readline = require("readline");

require("dotenv").config();

const run = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const { Client, LocalAuth } = require("whatsapp-web.js");
  const qrcode = require("qrcode-terminal");

  const whats = new Client({
    // authStrategy: new LocalAuth()
  });

  whats.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  whats.on("ready", async () => {
    console.log("Whats is ready!");
  });

  whats.on("message", async (message) => {
    // console.log(message.body);
    // if (message.body.startsWith('!BUY') == true) {
    //   whats.sendMessage(message.from, 'pong');
    // }
  });

  whats.on("message_create", (msg) => {
    // if (msg.body.startsWith('!BUY') == true) {
    //   console.log("tamo aqui")
    //   whats.reply( "testando"); //'554688352129@c.us',
    // }
  });

  whats.initialize();

  console.log(process.env.IDDISCORD);

  rl.question("Informe o Token do seu Discord: ", (token) => {
    //if (token) {
    const client = new Discord({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    let channel = null;

    try {
      client.login(process.env.IDDISCORD);

      client.on("ready", async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        rl.question("Enter your channel ID: ", async (IDChannel) => {
          channel = await client.channels.fetch(process.env.IDCANAL); //822208956306161698 //IDChannel
          console.log(`Notification in channel:  ${IDChannel}`);

          rl.question(
            "Enter the file path (Client.txt): ",
            async (pathFile) => {
              pathFile = `C:/Program Files (x86)/Grinding Gear Games/Path of Exile/logs/Client.txt`;
              let arquivoTrade = pathFile;
              let arquivo = pathFile;

              let md5Previous = null;
              let fsWait = false;
              fs.access(pathFile, fs.constants.F_OK, (err) => {
                if (err) {
                  throw new Error("File not found");
                } else {
                  console.log("Ok!");
                  fs.watch(arquivo, (event, filename) => {
                    if (filename) {
                      //console.log(`Listening file ${pathFile}` );
                      // if (fsWait) return;
                      // fsWait = setTimeout(() => {
                      //   fsWait = false;
                      // }, 500);
                      // const content = fs.readFileSync(filename);
                      // const md5Current = md5(content);

                      //md5Previous = md5Current;
                      fs.readFile(
                        arquivo,
                        { encoding: "utf-8" },
                        async function (err, data) {
                          if (!err) {
                            let linhas = data.trim().split("\n");
                            let ultima = linhas.slice(-1)[0];
                            let str = ultima;
                            //let regexp = /^(.*\s)?(.+), (.+ to buy your\s+?(.+?)(\s+?listed for\s+?([\d\.]+?)\s+?(.+))?\s+?in\s+?(.+?)\s+?\(stash tab \"(.*)\"; position: left (\d+), top (\d+)\)\s*?(.*))$/;
                            let regexp =
                              /^(.*@)(.*\s)?(.*), (.+ to buy your\s+?(.+?)(\s+?listed for\s+?([\d\.]+?)\s+?(.+))?\s+?in\s+?(.+?)\s+?\(stash tab \"(.*)\"; position: left (\d+), top (\d+)\)\s*?(.*)$)/;
                            let matchAll = str.match(regexp);

                            if (matchAll) {
                              conteudo_anterior = ultima;

                              let body =
                                "!BUY De: " +
                                matchAll[2] +
                                " Quer comprar: " +
                                matchAll[5] +
                                " Por: " +
                                matchAll[7] +
                                " " +
                                matchAll[8] +
                                " Liga: " +
                                matchAll[9] +
                                " Stash: " +
                                matchAll[10] +
                                " Left: " +
                                matchAll[11] +
                                " Top: " +
                                matchAll[8];

                              channel.send(`@everyone ${body}`);

                              whats.sendMessage(
                                process.env.NROCELULAR + "@c.us",
                                `${body}`
                              );

                              const sendMessageData = await whats.sendMessage(
                                process.env.NROCELULAR + "@c.us",
                                `${body}`
                              );
                            }
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          );
        });
      });
      let whisper = "";
      client.on("message", (msg) => {
        // if (msg.content.indexOf("@everyone De:") != -1) {
        //   robot.keyTap("enter");
        //   var mensagem = msg.content.split(" ");

        //   if (mensagem[3].indexOf("<") != -1) {
        //     whisper = mensagem[4];
        //   } else whisper = mensagem[5];
        //   robot.setKeyboardDelay(1);
        //   robot.typeString("@" + whisper.replace(":", "") + " Hi, wait a minute. I'm busy.");

        //   robot.keyTap("enter");
        // }
        //Para responder uma mensagem qualquer
        if (msg.content.startsWith("!responder")) {
          robot.keyTap("enter");
          const arr = msg.content.split(" ");
          arr.shift();
          var whisper = arr.shift();
          var mensagem = msg.content.split(" ");
          if (mensagem[0].indexOf("<") != -1) {
            whisper = mensagem[0];
          } else {
            whisper = mensagem[1];
          }
          console.log(whisper);
          robot.setKeyboardDelay(1);
          robot.typeString(" @" + whisper.toString() + " " + arr.join(" "));
          robot.keyTap("enter");
        }
        if (msg.content === "ping") {
          robot.typeString("pong");
          robot.keyTap("enter");
        }
      });
    } catch (err) {
      console.log("Token inválido!");
    }

    let conteudo_anterior = "";
    //let arquivo = "./arquivo.txt";
    //}
  });
};

run();
