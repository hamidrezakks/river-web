package main

import "time"

// Global Parameters
const (
	PRODUCTION_SERVER_WEBSOCKET_ENDPOINT = "ws://river.im"
	DEFAULT_WS_PING_TIME                 = 30 * time.Second
	DEFAULT_WS_PONG_TIMEOUT              = 3 * time.Second
	DEFAULT_WS_WRITE_TIMEOUT             = 3 * time.Second
	DEFAULT_REQUEST_TIMEOUT              = 30 * time.Second
)

// LOG KEYS
const (
	_LK_FUNC_NAME        = "FUNC"
	_LK_CLIENT_AUTH_ID   = "C_AUTHID"
	_LK_SERVER_AUTH_ID   = "S_AUTHID"
	_LK_MSG_KEY          = "MSG_KEY"
	_LK_MSG_SIZE         = "MSG_SIZE"
	_LK_DESC             = "DESC"
	_LK_REQUEST_ID       = "REQUEST_ID"
	_LK_CONSTRUCTOR_NAME = "CONSTRUCTOR"
)

// Table Column Names
const (
	_CN_CONN_INFO = "CONN_INFO"
	_CN_UPDATE_ID = "UPDATE_ID"
)

type NetworkStatus int

const (
	DISCONNECTED NetworkStatus = iota
	CONNECTING
	WEAK
	SLOW
	FAST
)

type SyncStatus int

const (
	OutOfSync SyncStatus = iota
	Syncing
	Synced
)