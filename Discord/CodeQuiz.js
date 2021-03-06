/* eslint-disable no-console */
/*
  proj- Keep Typing and Nobody Explodes. The Discord Bot,

  We Don't Like Close-Source. Email: pmhstudio.pmh@gmail.com
*/

const discord = require('discord.js')
const QuizData = require('../QuizData/QuizData.json')

const botToken = process.env.Token
const bot = new discord.Client()

bot.login(botToken)

bot.on('ready', () => {
  console.log(bot.user.username + ' is Booted!')
  bot.user.setActivity("Dev | 'cq!'를 입력해 퀴즈를 출력합니다!")
})

bot.on('message', (input) => {
  if (input.author.id === bot.user.id) { return }
  console.log('Message Detected')

  let filter = (reaction, user) => (reaction.emoji.name === '⭕' || reaction.emoji.name === '❌') && user.id === input.author.id

  // Message Caculation.
  let msgArray = input.content.split('!')
  if (msgArray[0] === 'cq' || msgArray[0] === 'codequiz') {
    let quizNum
    if (!msgArray[1]) {
      quizNum = Math.floor(Math.random() * (QuizData.quiz.length - 1))
    } else {
      if (msgArray[1] < QuizData.quiz.length) {
        quizNum = msgArray[1]
      } else if (QuizData.info.languages.includes(msgArray[1])) {
        do {
          quizNum = Math.floor(Math.random() * (QuizData.quiz.length - 1))
        } while (QuizData.quiz[quizNum].language === msgArray[1])
      } else {
        let quizNumberNotExist = new discord.RichEmbed()
          .setColor(0xff0000)
          .addField('퀴즈 No. ' + msgArray[1] + '(을)를 찾을 수 없습니다', '퀴즈는 No. ' + (QuizData.quiz.length - 1) + '까지만 존재합니다')
        return input.channel.send(quizNumberNotExist)
      }
    }
    let quizEmbed = new discord.RichEmbed()
      .setColor(0x0000ff)
      .setAuthor(input.author.username + '님이 Code Quiz를 풀고있습니다', input.author.displayAvatarURL)
      .setTitle('Quiz No.' + quizNum)
      .addField('Q. ' + QuizData.quiz[quizNum].question.replace('{username}', input.author.username), '제한시간 **1분**')
    if (QuizData.quiz[quizNum].image) {
      quizEmbed.setImage(QuizData.quiz[quizNum].image)
    }
    input.channel.send(quizEmbed).then((th) => {
      if (Math.floor(Math.random() * 1)) {
        th.react('⭕')
        setTimeout(() => {
          th.react('❌')
        }, 1000)
      } else {
        th.react('❌')
        setTimeout(() => {
          th.react('⭕')
        }, 1000)
      }
      th.awaitReactions(filter, {
        time: 60000,
        max: 1
      }).then((collected) => {
        if (!collected) {
          let quizFailByLate = new discord.RichEmbed()
            .setColor(0x808080)
            .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
            .setAuthor(input.author.username + '님이 Code Quiz를 풀지못하셨습니다', input.author.displayAvatarURL)
            .setTitle('Quiz No.' + quizNum)
            .addField('Q. ' + QuizData.quiz[quizNum].question.replace('{username}', input.author.username), '**A.** ' + QuizData.quiz[quizNum].explanation)
          if (QuizData.quiz[quizNum].image) {
            quizFailByLate.setImage(QuizData.quiz[quizNum].image)
          }
          th.edit(quizFailByLate)
        } else {
          let QuizAwnser
          if (QuizData.quiz[quizNum].awsner === true) {
            QuizAwnser = '⭕'
          } else if (QuizData.quiz[quizNum].awsner === false) {
            QuizAwnser = '❌'
          }

          if (collected.array()[0].emoji.name === QuizAwnser) {
            let quizCorrectEmbed = new discord.RichEmbed()
              .setColor(0x00ff00)
              .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
              .setAuthor(input.author.username + '님이 Code Quiz를 맞추셨습니다!', input.author.displayAvatarURL)
              .setTitle('Quiz No.' + quizNum)
              .addField('Q. ' + QuizData.quiz[quizNum].question.replace('{username}', input.author.username), '**A.** ' + QuizData.quiz[quizNum].explanation)
            if (QuizData.quiz[quizNum].image) {
              quizCorrectEmbed.setImage(QuizData.quiz[quizNum].image)
            }
            th.edit(quizCorrectEmbed)
          } else {
            let quizNotCorrectEmbed = new discord.RichEmbed()
              .setColor(0xff0000)
              .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
              .setAuthor(input.author.username + '님이 Code Quiz를 풀지못하셨습니다', input.author.displayAvatarURL)
              .setTitle('Quiz No.' + quizNum)
              .addField('Q. ' + QuizData.quiz[quizNum].question.replace('{username}', input.author.username), '**A.** ' + QuizData.quiz[quizNum].explanation)
            if (QuizData.quiz[quizNum].image) {
              quizNotCorrectEmbed.setImage(QuizData.quiz[quizNum].image)
            }
            th.edit(quizNotCorrectEmbed)
          }
        }
      })
    })
  }
})
