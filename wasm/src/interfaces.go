package main

import (
	"git.ronaksoftware.com/customers/river/messages/ext"
	"go.uber.org/zap"
	"time"
	"syscall/js"
	"encoding/hex"
	"fmt"
	"math/big"
	"github.com/monnand/dhkx"
	"crypto/rand"
	"crypto/rsa"
	"encoding/binary"
	"encoding/base64"
)

var (
	_ServerKeys serverKeys
)

type MessageHandler func(m *msg.MessageEnvelope)
type TimeoutCallback func()
type Callback func(time int64)

//type MessageQ map[uint64]*MessageHandler
var authTryCount = 0

type River struct {
	// Connection Info
	ConnInfo     *RiverConnection
	MessageQueue map[uint64]*MessageHandler
	LastMsg      *msg.MessageEnvelope

	// Authorization Keys
	authID     int64
	authKey    []byte
	messageSeq int64
}

func AuthProgress(progress int) {
	js.Global().Call("authProgress", progress)
}

func (r *River) Start(connInfo string, callback *Callback) {
	r.ConnInfo = NewRiverConnection(connInfo)
	r.MessageQueue = make(map[uint64]*MessageHandler)

	AuthProgress(0)
	// Initialize Server Keys
	if err := _ServerKeys.UnmarshalJSON([]byte(`{"PublicKeys":[{"N":"25118848897932282177245700919139384404750150099443051286420483958680932318999616785468117358656906868745535067114368253583642867447644069742034871690887327807641806393154362866814670869067082838910855582042571344627633847312858985989376011283293406446259224113424892885526467096873630090982411366060309228545939134187830467758087915442541333526473506224183662758369346162982899850891065845576237266688752908504452157782224543297742005937283247646798191769066825742717116948044645985042083938549757785369721749659525202291409273477753359658898944013607000873216784148319330165950486883420334054833644032847855482032509","FingerPrint":7394918641852592645,"E":65537},{"N":"21249707023259589828882625203572225674272580290693121144039064585772886999841963721536409526022282440843688128262657540061767032187088787519653928724034793475849047994789250487935742236267848935158291781289935130264092548463720489626032599455872076196089874292697176233901232972584747422218633150431148606115133786415925258966498648297190127103542990365765167875712382655400672904401808039905581013143219877381673335013417196709050371628383130063205039714231505438906188340348457944648916217683298881611185125570182541993037806056563338841286324689864878852103314733737724967696722326127563991449350826172408373703811","FingerPrint":2363776248257911173,"E":65537},{"N":"19863054550604193823488041727574907794553354963467193076917818924664132721754826665850220231906962083775008201369133561957397980133889912558248851951970519776044765817502621009587064784777693096628382835779877029866758294196797090656332977683146622524047322377443516436601239695252843413905686699399020467544689455363457822624449365145949732364643029028423685551893583641819962002723393831006146669077949073237542941080523176298527840258778842205532339989739100238320204236098210328490552190436163372996242056017356783361778247846127669138796572298996264305675423638602261670710374605191817283295227384113688431647741","FingerPrint":-5099141843327820626,"E":65537},{"N":"29760428901343664001028833309809794343544015677516397170674878601215588275791808212890742556162155895595827561470784507818927441382831252170628521332528557087987520295267196790927612592611029658149082172703008759671157419031039827342837361544291472718895472521013019716259483209354020921442127452371575891423820946699295605756004551833001279075974074080563224444666224932026454045362404382286378528513546737731664019469325785485757138817241905803574388304564238374420073230240484847573015947946433863321363117973803262320677243592635383550602155520291663476434998507275737426553598472331105536846460631682739989661219","FingerPrint":2195174703119182464,"E":65537},{"N":"18386064557489952286420347590296751434578282707405869816885958713299461000323959947566645042552856526031409640177153580413557456444169596581870998341797298680104080669684015732452983077686038078494582573312218274626467111808818429778886097765709133950743171507322894959330274463277504523606073120382446662040167960142274463155227517163276212205755835422067514615854827329645266346012533996475215453580382748104598835874268054865686479895544554797198146708876762174829892817477539609356506735917106650744544665071969880523400678780093929701726905569602897801522055926413967804403930759100613510462652269603976775523991","FingerPrint":4479840379683382772,"E":65537},{"N":"26856167804545448049290579564011023468588993763008293592188466181493624152203964999095367371420795128612430412472216110838073483063451607435345678606377899388181953712712568128395316210032734586003021350117744410467197964162932002685114458972873577239300798020981277258362899408637644884906090479440297628771615765991411446325782942661223836610577955450204097820932873841360326076035286707297809053813347011465715499268402698830927150083994456520884686861897089801285632944182913126283200633552976218386749841394603856739318115312415688232906365260846416122082293147230082963151578228644118548380817922335519702098503","FingerPrint":8569728225196202638,"E":65537},{"N":"25761140930539439978494783846660734379198950078321693758033663237052334640619530471139381746103855925800702484276297098648531198741474154475735948656994497481651905678934562912991440112672560383261093402078501161430697511324735371368031617819168590943786234823019615023005756998056375397284879696822974650961011580206091499395498399390492214337547240343451565823803753121080531070054153784629505452057439601601659807136850041526794231441222954424268629610149685990628010782230767695141965499949849652822543965784952473307155505095483489743547945382166911358040409429285318638614625039958145755691598575103601662635873","FingerPrint":-3518366518126294391,"E":65537},{"N":"21878729227264443273397917465852122220894317740032779776997968051790123215989999965841007199864479838712294015929085122553441217024812487754107081810828692874014089314153826066240729740923792526876590678500745479627405100598576824756706391682294987326965673261452172826182988573765370466024746236316548372296498943339682423467178382713458130758590318962795115037395346029561258543522802194745122834923204527595669724518557927046350328890508977160087250218063301295330767720877139867168393712617902052319906711468238632536228153728846644967777470083076472892276635992022186751494397742523839928248454129614564991083729","FingerPrint":2842355922125748985,"E":65537},{"N":"21657921575259117082437287735038824160972581974539609548491823065113660182941223450746616405735767608349485813933217527787805175774080112057626391016872155067405926907423276805486934732269185402251726464897721288759735238594916980944505711016119900765546002533418456991149932694983775618316688113269913087592812309102853747522924306054009231759094013878121201675566877636823973567095580198874586722886709122615656758634448002677386356379713382005231679191964292977504291853536019601586206944266621069762821758456214432463931452218289861680478993171959176435089862340125449068198909635604459895897355597575325195619933","FingerPrint":-3702519902476465341,"E":65537},{"N":"26560773297321496796638749735111859220513359531489936481661136779884784205625113812180402394116732738755028273755313585352103067809685809119858624584482833675871489309402205980675382020337358851404166618802304410342906475560595604118840081050808937188565007332779418031411195462315469094720417421137008865029869517973582341668257878628972653824064257107524501253937531889165608386214524613639093523758099418212998287757704077924182163275085135477703526566976609275979665583622386423029286172254415496073164236409043934726212766525195423766504808027467773836621258239588220853730478580185244315599773665364850566951753","FingerPrint":-2599890069662518803,"E":65537}],"DHGroups":[{"Prime":"FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AACAA68FFFFFFFFFFFFFFFF","Gen":2,"FingerPrint":-4978776997167059722}]}`)); err != nil {
		_LOG.Fatal(err.Error())
	}

	AuthProgress(1)

	if r.ConnInfo.AuthID == 0 {
		authErr := river.CreateAuthKey(func(time int64) {
			_LOG.Info("Auth initialized")
			r.authID = r.ConnInfo.AuthID
			r.authKey = r.ConnInfo.AuthKey[:]
			cb := *callback
			cb(time)
		})
		if (authErr != nil) {
			authTryCount++
			if (authTryCount < 10) {
				r.Start(connInfo, callback)
				return
			}
		}
		AuthProgress(10)
	} else {
		r.authID = r.ConnInfo.AuthID
		r.authKey = r.ConnInfo.AuthKey[:]
		AuthProgress(100)
		cb := *callback
		cb(-1)
	}
}

func (r *River) CreateAuthKey(callback Callback) (err error) {
	var clientNonce, serverNonce, serverPubFP, serverDHFP, serverPQ uint64
	// 1. Send InitConnect to Server
	req1 := new(msg.InitConnect)
	req1.ClientNonce = _RandomUint64()
	req1Bytes, _ := req1.Marshal()

	_LOG.Info("1st Step Started :: InitConnect")
	r.ExecuteRemoteCommand(
		_RandomUint64(),
		msg.C_InitConnect,
		&req1Bytes,
		func(res *msg.MessageEnvelope) {
			_LOG.Debug("Success Callback Called")
			AuthProgress(12)
			switch res.Constructor {
			case msg.C_InitResponse:
				x := new(msg.InitResponse)
				err = x.Unmarshal(res.Message)
				if err != nil {
					_LOG.Error(err.Error(),
						zap.String(_LK_DESC, "InitResponse Unmarshal"),
					)
				}
				AuthProgress(15)
				clientNonce = x.ClientNonce
				serverNonce = x.ServerNonce
				serverPubFP = x.RSAPubKeyFingerPrint
				serverDHFP = x.DHGroupFingerPrint
				serverPQ = x.PQ
				_LOG.Debug("InitResponse :: Received",
					zap.Uint64("ServerNonce", serverNonce),
					zap.Uint64("ClientNounce", clientNonce),
					zap.Uint64("ServerDhFingerPrint", serverDHFP),
					zap.Uint64("ServerFingerPrint", serverPubFP),
				)
			case msg.C_Error:
				err = ServerError(res.Message)
			default:
				err = ErrInvalidConstructor
			}
			if err != nil {
				_LOG.Info(err.Error())
				return
			} else {
				r.createAuthKeyStep2(clientNonce, serverNonce, serverPubFP, serverDHFP, serverPQ, &callback)
				_LOG.Info("1st Step Finished")
			}
		},
	)

	return
}

func (r *River) createAuthKeyStep2(clientNonce, serverNonce, serverPubFP, serverDHFP, serverPQ uint64, callback *Callback) (err error) {
	AuthProgress(17)
	var duration int64 = 0
	t := time.Now().Unix()
	// 2. Send InitCompleteAuth
	req2 := new(msg.InitCompleteAuth)
	req2.ServerNonce = serverNonce
	req2.ClientNonce = clientNonce

	// Generate DH Pub Key
	dhGroup, err := _ServerKeys.getDhGroup(int64(serverDHFP))
	if err != nil {
		return err
	}
	dhPrime := big.NewInt(0)
	dhPrime.SetString(dhGroup.Prime, 16)
	AuthProgress(30)

	dh := dhkx.CreateGroup(dhPrime, big.NewInt(int64(dhGroup.Gen)))
	AuthProgress(35)
	clientDhKey, _ := dh.GeneratePrivateKey(rand.Reader)
	AuthProgress(40)
	req2.ClientDHPubKey = clientDhKey.Bytes()
	AuthProgress(45)

	p, q := _SplitPQ(big.NewInt(int64(serverPQ)))
	if p.Cmp(q) < 0 {
		req2.P = p.Uint64()
		req2.Q = q.Uint64()
	} else {
		req2.P = q.Uint64()
		req2.Q = p.Uint64()
	}
	AuthProgress(55)
	_LOG.Debug("PQ Split",
		zap.Uint64("P", req2.P),
		zap.Uint64("Q", req2.Q),
	)

	q2Internal := new(msg.InitCompleteAuthInternal)
	q2Internal.SecretNonce = []byte(_RandomID(16))
	AuthProgress(60)

	serverPubKey, err := _ServerKeys.getPublicKey(int64(serverPubFP))
	if err != nil {
		return err
	}
	n := big.NewInt(0)
	n.SetString(serverPubKey.N, 10)
	rsaPublicKey := rsa.PublicKey{
		N: n,
		E: int(serverPubKey.E),
	}

	AuthProgress(65)
	decrypted, _ := q2Internal.Marshal()
	encrypted, err := rsa.EncryptPKCS1v15(rand.Reader, &rsaPublicKey, decrypted)
	if err != nil {
		_LOG.Error(err.Error())
	}

	AuthProgress(70)
	req2.EncryptedPayload = encrypted
	req2Bytes, _ := req2.Marshal()
	_LOG.Info("2nd Step Started :: InitConnect")
	duration = time.Now().Unix() - t
	_LOG.Info("Duration:", zap.Int64("time(s)", duration))

	AuthProgress(75)
	r.ExecuteRemoteCommand(
		_RandomUint64(),
		msg.C_InitCompleteAuth,
		&req2Bytes,
		func(res *msg.MessageEnvelope) {
			switch res.Constructor {
			case msg.C_InitAuthCompleted:
				x := new(msg.InitAuthCompleted)
				x.Unmarshal(res.Message)
				switch x.Status {
				case msg.InitAuthCompleted_OK:
					serverDhKey, err := dh.ComputeKey(dhkx.NewPublicKey(x.ServerDHPubKey), clientDhKey)
					if err != nil {
						_LOG.Error(err.Error())
						return
					}

					copy(r.ConnInfo.AuthKey[:], serverDhKey.Bytes())
					authKeyHash, _ := _Sha256(r.ConnInfo.AuthKey[:])
					r.ConnInfo.AuthID = int64(binary.LittleEndian.Uint64(authKeyHash[24:32]))
					AuthProgress(80)

					var secret []byte
					secret = append(secret, q2Internal.SecretNonce...)
					secret = append(secret, byte(msg.InitAuthCompleted_OK))
					secret = append(secret, authKeyHash[:8]...)
					secretHash, _ := _Sha256(secret)

					if x.SecretHash != binary.LittleEndian.Uint64(secretHash[24:32]) {
						fmt.Println(x.SecretHash, binary.LittleEndian.Uint64(secretHash[24:32]))
						err = ErrSecretNonceMismatch
						return
					}
					AuthProgress(90)
				case msg.InitAuthCompleted_RETRY:
					// TODO:: Retry with new DHKey
				case msg.InitAuthCompleted_FAIL:
					err = ErrAuthFailed
					return
				}
				r.ConnInfo.Save()
				r.authKey = r.ConnInfo.AuthKey[:]
				r.authID = r.ConnInfo.AuthID
				cb := *callback
				cb(duration)
				AuthProgress(100)
			case msg.C_Error:
				err = ServerError(res.Message)
				return
			default:
				err = ErrInvalidConstructor
				return
			}
		},
	)
	return
}

func (r *River) ExecuteRemoteCommand(requestID uint64, constructor int64, commandBytes *[]byte, successCB MessageHandler) {
	//r.queueCtrl.executeCommand(requestID, constructor, commandBytes, timeoutCB, successCB)
	_msg := new(msg.MessageEnvelope)
	_msg.RequestID = requestID
	_msg.Constructor = constructor
	_msg.Message = *commandBytes

	if successCB != nil {
		r.MessageQueue[requestID] = &successCB
	}
	r.send(_msg, true)
}

func (r *River) ExecuteEncrypt(requestID uint64, constructor int64, commandBytes *[]byte) {
	_msg := new(msg.MessageEnvelope)
	_msg.RequestID = requestID
	_msg.Constructor = constructor
	_msg.Message = *commandBytes

	r.send(_msg, false)
}

func (r *River) send(msgEnvelope *msg.MessageEnvelope, webSocket bool) {
	protoMessage := new(msg.ProtoMessage)
	protoMessage.AuthID = r.authID
	protoMessage.MessageKey = make([]byte, 32)
	if r.authID == 0 {
		protoMessage.Payload, _ = msgEnvelope.Marshal()
	} else {
		r.messageSeq++
		encryptedPayload := msg.ProtoEncryptedPayload{
			ServerSalt: 234242, // TODO:: ServerSalt ?
			Envelope:   msgEnvelope,
		}
		encryptedPayload.MessageID = uint64(time.Now().Unix()<<32 | r.messageSeq)
		unencryptedBytes, _ := encryptedPayload.Marshal()
		encryptedPayloadBytes, _ := _Encrypt(r.authKey, unencryptedBytes)
		messageKey := _GenerateMessageKey(r.authKey, unencryptedBytes)
		copy(protoMessage.MessageKey, messageKey)
		protoMessage.Payload = encryptedPayloadBytes
	}

	b, err := protoMessage.Marshal()
	if err != nil {
		_LOG.Warn(err.Error())
		return
	}
	if webSocket {
		if msgEnvelope.Constructor == msg.C_InitConnect || msgEnvelope.Constructor == msg.C_InitCompleteAuth {
			r.LastMsg = msgEnvelope
		}
		js.Global().Call("wsSend", base64.StdEncoding.EncodeToString(b))
	} else {
		js.Global().Call("fnEncryptCallback", msgEnvelope.RequestID, base64.StdEncoding.EncodeToString(b))
	}
}

func (r *River) receive(message *[]byte, webSocket bool) {
	res := msg.ProtoMessage{}

	// If it is a BINARY message

	res.Unmarshal(*message)
	if res.AuthID == 0 {
		receivedEnvelope := new(msg.MessageEnvelope)
		err := receivedEnvelope.Unmarshal(res.Payload)
		if err != nil {
			_LOG.Warn(err.Error())
			return
		}
		if webSocket {
			r.messageHandler(receivedEnvelope)
		} else {
			r.decryptHandler(receivedEnvelope)
		}
	} else {
		decryptedBytes, err := _Decrypt(r.authKey, res.MessageKey, res.Payload)
		if err != nil {
			_LOG.Warn(err.Error(),
				zap.Int64(_LK_CLIENT_AUTH_ID, r.authID),
				zap.Int64(_LK_SERVER_AUTH_ID, res.AuthID),
				zap.String(_LK_MSG_KEY, hex.Dump(res.MessageKey)),
			)
			js.Global().Call("fnDecryptError")
			return
		}
		receivedEncryptedPayload := new(msg.ProtoEncryptedPayload)
		err = receivedEncryptedPayload.Unmarshal(decryptedBytes)
		if err != nil {
			_LOG.Warn(err.Error())
			return
		}
		if webSocket {
			r.messageHandler(receivedEncryptedPayload.Envelope)
		} else {
			r.decryptHandler(receivedEncryptedPayload.Envelope)
		}
	}
}

func (r *River) messageHandler(m *msg.MessageEnvelope) {
	switch m.Constructor {
	case msg.C_MessageContainer:
		x := new(msg.MessageContainer)
		ee := x.Unmarshal(m.Message)
		if ee != nil {
			_LOG.Info("Error", zap.String("err", ee.Error()))
		}
		_LOG.Debug("kk-MessageContainer received",
			zap.Int32("LENGTH", x.Length),
		)
		for _, envelope := range x.Envelopes {
			r.messageHandler(envelope)
		}
	case msg.C_UpdateContainer:
		x := new(msg.UpdateContainer)
		x.Unmarshal(m.Message)
		_LOG.Debug("UpdateContainer received",
			zap.Int32("LENGTH", x.Length),
			zap.Int64("MIN_UPDATE_ID", x.MinUpdateID),
			zap.Int64("MAX_UPDATE_ID", x.MaxUpdateID),
		)
		js.Global().Call("fnUpdate", base64.StdEncoding.EncodeToString(m.Message))
	default:
		if val, ok := r.MessageQueue[m.RequestID]; ok && (*val) != nil {
			(*val)(m)
			delete(r.MessageQueue, m.RequestID)
		} else if m.Constructor == msg.C_Error {
			error := new(msg.Error)
			error.Unmarshal(m.Message)
			if error.Code == "E01" && error.Items == "AUTH" {
				js.Global().Call("wsError", m.RequestID, m.Constructor, base64.StdEncoding.EncodeToString(m.Message))
			} else {
				js.Global().Call("fnCallback", m.RequestID, m.Constructor, base64.StdEncoding.EncodeToString(m.Message))
			}
		} else {
			js.Global().Call("fnCallback", m.RequestID, m.Constructor, base64.StdEncoding.EncodeToString(m.Message))
		}
	}
}

func (r *River) decryptHandler(m *msg.MessageEnvelope) {
	switch m.Constructor {
	case msg.C_MessageContainer:
		x := new(msg.MessageContainer)
		ee := x.Unmarshal(m.Message)
		if ee != nil {
			_LOG.Info("Error", zap.String("err", ee.Error()))
		}
		for _, envelope := range x.Envelopes {
			r.decryptHandler(envelope)
		}
	case msg.C_UpdateContainer:
		x := new(msg.UpdateContainer)
		x.Unmarshal(m.Message)
		js.Global().Call("fnDecryptCallback", m.RequestID, m.Constructor, base64.StdEncoding.EncodeToString(m.Message))
	default:
		js.Global().Call("fnDecryptCallback", m.RequestID, m.Constructor, base64.StdEncoding.EncodeToString(m.Message))
	}
}

func (r *River) RetryLast() {
	if r.LastMsg != nil {
		r.send(r.LastMsg, true)
	}
}