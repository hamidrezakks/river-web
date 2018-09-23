let outputBuf = "";
const fs = {
    constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 }, // unused
    writeSync(fd: any, buf: any) {
        outputBuf += decoder.decode(buf);
        const nl = outputBuf.lastIndexOf("\n");
        if (nl != -1) {
            console.log(outputBuf.substr(0, nl));
            outputBuf = outputBuf.substr(nl + 1);
        }
        return buf.length;
    },
    openSync(path: any, flags: any, mode: any) {
        const err: any = new Error("not implemented");
        err.code = "ENOSYS";
        throw err;
    },
};

// @ts-ignore
const encoder = new TextEncoder("utf-8");
const decoder = new TextDecoder("utf-8");

export default class Go {
    public importObject: any;
    private argv: any;
    private env: any;
    private exit: any;
    private _callbackTimeouts: any;
    private _resolveCallbackPromise: any;
    // private _callbackShutdown: any;
    private _nextCallbackTimeoutID: any;
    private _inst: any;
    private _values: any;
    private _refs: any;
    private exited: any;

    public constructor() {
        this.argv = ["js"];
        this.env = {};
        this.exit = (code: number) => {
            if (code !== 0) {
                console.warn("exit code:", code);
            }
        };
        this._callbackTimeouts = new Map();
        this._nextCallbackTimeoutID = 1;

        const mem = () => {
            // The buffer may change when requesting more memory.
            return new DataView(this._inst.exports.mem.buffer);
        }

        const setInt64 = (addr: any, v: any) => {
            mem().setUint32(addr + 0, v, true);
            mem().setUint32(addr + 4, Math.floor(v / 4294967296), true);
        }

        const getInt64 = (addr: any) => {
            const low = mem().getUint32(addr + 0, true);
            const high = mem().getInt32(addr + 4, true);
            return low + high * 4294967296;
        }

        const loadValue = (addr: any) => {
            const f = mem().getFloat64(addr, true);
            if (!isNaN(f)) {
                return f;
            }

            const id = mem().getUint32(addr, true);
            return this._values[id];
        }

        const storeValue = (addr: any, v: any) => {
            const nanHead = 0x7FF80000;

            if (typeof v === "number") {
                if (isNaN(v)) {
                    mem().setUint32(addr + 4, nanHead, true);
                    mem().setUint32(addr, 0, true);
                    return;
                }
                mem().setFloat64(addr, v, true);
                return;
            }

            switch (v) {
                case undefined:
                    mem().setUint32(addr + 4, nanHead, true);
                    mem().setUint32(addr, 1, true);
                    return;
                case null:
                    mem().setUint32(addr + 4, nanHead, true);
                    mem().setUint32(addr, 2, true);
                    return;
                case true:
                    mem().setUint32(addr + 4, nanHead, true);
                    mem().setUint32(addr, 3, true);
                    return;
                case false:
                    mem().setUint32(addr + 4, nanHead, true);
                    mem().setUint32(addr, 4, true);
                    return;
            }

            let ref = this._refs.get(v);
            if (ref === undefined) {
                ref = this._values.length;
                this._values.push(v);
                this._refs.set(v, ref);
            }
            let typeFlag = 0;
            switch (typeof v) {
                case "string":
                    typeFlag = 1;
                    break;
                case "symbol":
                    typeFlag = 2;
                    break;
                case "function":
                    typeFlag = 3;
                    break;
            }
            mem().setUint32(addr + 4, nanHead | typeFlag, true);
            mem().setUint32(addr, ref, true);
        }

        const loadSlice = (addr: any) => {
            const array = getInt64(addr + 0);
            const len = getInt64(addr + 8);
            return new Uint8Array(this._inst.exports.mem.buffer, array, len);
        }

        const loadSliceOfValues = (addr: any) => {
            const array = getInt64(addr + 0);
            const len = getInt64(addr + 8);
            const a = new Array(len);
            for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
            }
            return a;
        }

        const loadString = (addr: any) => {
            const saddr = getInt64(addr + 0);
            const len = getInt64(addr + 8);
            return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
        }

        const timeOrigin = Date.now() - performance.now();
        this.importObject = {
            go: {
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp: any) => {
                    const code = mem().getInt32(sp + 8, true);
                    this.exited = true;
                    delete this._inst;
                    delete this._values;
                    delete this._refs;
                    this.exit(code);
                },

                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp: any) => {
                    const fd = getInt64(sp + 8);
                    const p = getInt64(sp + 16);
                    const n = mem().getInt32(sp + 24, true);
                    fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },

                // func nanotime() int64
                "runtime.nanotime": (sp: any) => {
                    setInt64(sp + 8, (timeOrigin + performance.now()) * 1000000);
                },

                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp: any) => {
                    const msec = (new Date).getTime();
                    setInt64(sp + 8, msec / 1000);
                    mem().setInt32(sp + 16, (msec % 1000) * 1000000, true);
                },

                // func scheduleCallback(delay int64) int32
                "runtime.scheduleCallback": (sp: any) => {
                    const id = this._nextCallbackTimeoutID;
                    this._nextCallbackTimeoutID++;
                    this._callbackTimeouts.set(id, setTimeout(
                        () => { this._resolveCallbackPromise(); },
                        getInt64(sp + 8) + 1, // setTimeout has been seen to fire up to 1 millisecond early
                    ));
                    mem().setInt32(sp + 16, id, true);
                },

                // func clearScheduledCallback(id int32)
                "runtime.clearScheduledCallback": (sp: any) => {
                    const id = mem().getInt32(sp + 8, true);
                    clearTimeout(this._callbackTimeouts.get(id));
                    this._callbackTimeouts.delete(id);
                },

                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp: any) => {
                    crypto.getRandomValues(loadSlice(sp + 8));
                },

                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp: any) => {
                    storeValue(sp + 24, loadString(sp + 8));
                },

                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp: any) => {
                    storeValue(sp + 32, Reflect.get(loadValue(sp + 8), loadString(sp + 16)));
                },

                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp: any) => {
                    Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },

                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp: any) => {
                    storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },

                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp: any) => {
                    Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },

                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp: any) => {
                    try {
                        const v = loadValue(sp + 8);
                        const m = Reflect.get(v, loadString(sp + 16));
                        const args = loadSliceOfValues(sp + 32);
                        storeValue(sp + 56, Reflect.apply(m, v, args));
                        mem().setUint8(sp + 64, 1);
                    } catch (err) {
                        storeValue(sp + 56, err);
                        mem().setUint8(sp + 64, 0);
                    }
                },

                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp: any) => {
                    try {
                        const v = loadValue(sp + 8);
                        const args = loadSliceOfValues(sp + 16);
                        storeValue(sp + 40, Reflect.apply(v, undefined, args));
                        mem().setUint8(sp + 48, 1);
                    } catch (err) {
                        storeValue(sp + 40, err);
                        mem().setUint8(sp + 48, 0);
                    }
                },

                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp: any) => {
                    try {
                        const v = loadValue(sp + 8);
                        const args = loadSliceOfValues(sp + 16);
                        storeValue(sp + 40, Reflect.construct(v, args));
                        mem().setUint8(sp + 48, 1);
                    } catch (err) {
                        storeValue(sp + 40, err);
                        mem().setUint8(sp + 48, 0);
                    }
                },

                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp: any) => {
                    setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },

                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp: any) => {
                    const str = encoder.encode(String(loadValue(sp + 8)));
                    storeValue(sp + 16, str);
                    setInt64(sp + 24, str.length);
                },

                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp: any) => {
                    const str = loadValue(sp + 8);
                    loadSlice(sp + 16).set(str);
                },

                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp: any) => {
                    // @ts-ignore
                    mem().setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16));
                },

                "debug": (value: any) => {
                    console.log(value);
                },
            }
        };
    }

    async run(instance: any) {
        this._inst = instance;
        this._values = [ // TODO: garbage collection
            NaN,
            undefined,
            null,
            true,
            false,
            global,
            this._inst.exports.mem,
            this,
        ];
        this._refs = new Map();
        // this._callbackShutdown = false;
        this.exited = false;

        const mem = new DataView(this._inst.exports.mem.buffer)

        // Pass command line arguments and environment variables to WebAssembly by writing them to the linear memory.
        let offset = 4096;

        const strPtr = (str: string) => {
            let ptr = offset;
            new Uint8Array(mem.buffer, offset, str.length + 1).set(encoder.encode(str + "\0"));
            offset += str.length + (8 - (str.length % 8));
            return ptr;
        };

        const argc = this.argv.length;

        const argvPtrs: any = [];
        this.argv.forEach((arg: any) => {
            argvPtrs.push(strPtr(arg));
        });

        const keys = Object.keys(this.env).sort();
        argvPtrs.push(keys.length);
        keys.forEach((key) => {
            argvPtrs.push(strPtr(`${key}=${this.env[key]}`));
        });

        const argv = offset;
        argvPtrs.forEach((ptr: any) => {
            mem.setUint32(offset, ptr, true);
            mem.setUint32(offset + 4, 0, true);
            offset += 8;
        });

        while (true) {
            const callbackPromise = new Promise((resolve) => {
                this._resolveCallbackPromise = () => {
                    if (this.exited) {
                        throw new Error("bad callback: Go program has already exited");
                    }
                    setTimeout(resolve, 0); // make sure it is asynchronous
                };
            });
            this._inst.exports.run(argc, argv);
            if (this.exited) {
                break;
            }
            await callbackPromise;
        }
    }

    static _makeCallbackHelper(id: any, pendingCallbacks: any, go: any) {
        return function() {
            pendingCallbacks.push({ id: id, args: arguments });
            go._resolveCallbackPromise();
        };
    }

    static _makeEventCallbackHelper(preventDefault: any, stopPropagation: any, stopImmediatePropagation: any, fn: any) {
        return function(event: any) {
            if (preventDefault) {
                event.preventDefault();
            }
            if (stopPropagation) {
                event.stopPropagation();
            }
            if (stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            fn(event);
        };
    }
}