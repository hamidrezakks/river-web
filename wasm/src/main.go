package main

import (
	"syscall/js"
	"fmt"
	"encoding/base64"
	"math/rand"
	"time"
)

var river *River

var (
	no             int
	beforeUnloadCh = make(chan struct{})
	connInfo       string
)

func main() {
	rand.Seed(time.Now().UnixNano())
	initLog()
	river = new(River)

	loadCB := js.NewCallback(func(args []js.Value) {
		connInfo = args[0].String()
	})
	defer loadCB.Release()
	js.Global().Get("setLoadConnInfo").Invoke(loadCB)

	initCB := js.NewCallback(initSDK)
	defer initCB.Release()
	js.Global().Get("setInitSDK").Invoke(initCB)

	fnCB := js.NewCallback(fnCall)
	defer fnCB.Release()
	js.Global().Get("setFnCall").Invoke(fnCB)

	receiveCB := js.NewCallback(wsReceive)
	defer receiveCB.Release()
	js.Global().Get("setReceive").Invoke(receiveCB)

	wsOpenCB := js.NewCallback(wsOpen)
	defer wsOpenCB.Release()
	js.Global().Get("setWsOpen").Invoke(wsOpenCB)

	fnEncryptCB := js.NewCallback(fnEncrypt)
	defer fnEncryptCB.Release()
	js.Global().Get("setFnEncrypt").Invoke(fnEncryptCB)

	fnDecryptCB := js.NewCallback(fnDecrypt)
	defer fnDecryptCB.Release()
	js.Global().Get("setFnDecrypt").Invoke(fnDecryptCB)

	<-beforeUnloadCh
	fmt.Println("Bye Wasm !")
}

func initSDK(args []js.Value) {
	var cb Callback = func(duration int64) {
		js.Global().Call("fnStarted", duration)
	}
	river.Start(connInfo, &cb)
}

func fnCall(args []js.Value) {
	reqId := uint64(args[0].Int())
	constructor := int64(args[1].Int())
	enc, err := base64.StdEncoding.DecodeString(args[2].String())
	if err == nil {
		river.ExecuteRemoteCommand(reqId, constructor, &enc, nil)
	}
}

func wsReceive(args []js.Value) {
	enc, err := base64.StdEncoding.DecodeString(args[0].String())
	if err == nil {
		river.receive(&enc, true)
	}
}

func wsOpen(args []js.Value) {
	river.RetryLast()
}

func fnEncrypt(args []js.Value) {
	reqId := uint64(args[0].Int())
	constructor := int64(args[1].Int())
	enc, err := base64.StdEncoding.DecodeString(args[2].String())
	if err == nil {
		river.ExecuteEncrypt(reqId, constructor, &enc)
	}
}

func fnDecrypt(args []js.Value) {
	enc, err := base64.StdEncoding.DecodeString(args[0].String())
	if err == nil {
		river.receive(&enc, false)
	}
}

func beforeUnload(event js.Value) {
	beforeUnloadCh <- struct{}{}
}