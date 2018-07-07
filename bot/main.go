package main
 
import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "log"
    "net/http"
 
    "github.com/Syfaro/telegram-bot-api"
     
)
 
type TodoData []struct {
    Value string `json:"item"`
}
 
func main() {
    var bot *tgbotapi.BotAPI
    var err error
 
    if bot, err = tgbotapi.NewBotAPI("487436514:AAFFwtnWKPvgqUP8-_PW8NG1ey0SiRwrICY"); err != nil {
        log.Panic(err)
        return
    }
 
    ucfg := tgbotapi.NewUpdate(0)
    ucfg.Timeout = 60
 
    var updates tgbotapi.UpdatesChannel
    if updates, err = bot.GetUpdatesChan(ucfg); err != nil {
        log.Panic(err)
        return
    }
 
    for {
        update := <-updates
        if update.Message.Text == "/todo" {
            var resp string
            if resp, err = getList(); err != nil {
                continue
            }
 
            msg := tgbotapi.NewMessage(update.Message.Chat.ID, resp)
            bot.Send(msg)
        }
    }
}
 
func getList() (string, error) {
    var response *http.Response
    var err error
    
     response, err = http.Get("http://todolist:80/todo"); 
     if err != nil {
        fmt.Println(err)
    }
    defer response.Body.Close()
 
    var data TodoData
    responseData, err := ioutil.ReadAll(response.Body)
    if err != nil {
        log.Fatal(err)
    }
 
     json.Unmarshal(responseData, &data);    if err != nil {
        fmt.Println(err)
    }
 
    var result string
    for i, elem := range data {
        result += fmt.Sprintf("%d. %s\n", i+1, elem.Value)
    }
 
    return result, nil
}
