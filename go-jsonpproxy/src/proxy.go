package main

import (
	"fmt"
	goconfig "./goconfig"
	"io"
	"io/ioutil"
	"log"
	"net/http"
)

func configTarget() string {
	c, err := goconfig.LoadConfigFile("config.ini")
	if err != nil {
		log.Fatal(err)
	}

	value, _ := c.GetValue("Target", "url")
	return value

}

func configPort() string {
	c, err := goconfig.LoadConfigFile("config.ini")
	if err != nil {
		log.Fatal(err)
	}

	value, _ := c.GetValue("local", "port")
	return value

}

func fetch(w http.ResponseWriter, r *http.Request) {

	var html string
	var target = configTarget()
	var callback string = r.URL.Query().Get("callback")
	fmt.Println(target + r.URL.RequestURI())
	req, err := http.NewRequest("GET", target+r.URL.RequestURI(), nil)
	if err != nil {
		log.Fatal(err.Error())
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err.Error())
	}
	if resp.StatusCode == 200 {
		robots, err := ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		if err != nil {
			log.Fatal(err.Error())
		}
		html = string(robots)
	} else {
		html = ""
	}
	fmt.Println("data:" + html)
	w.Header().Set("Content-Type", "text/javascript")
	io.WriteString(w, callback+"("+html+")")
	return
}

func main() {

	http.HandleFunc("/", fetch)

	err := http.ListenAndServe(":"+configPort(), nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
	fmt.Println("Start ...")
}
