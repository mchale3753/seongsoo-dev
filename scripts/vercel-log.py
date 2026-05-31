#!/usr/bin/env python3
"""Read Vercel deployment build logs via logged-in Windows Chrome CDP."""
import json, sys, time, urllib.request
import websocket

CDP = "172.27.176.1:9223"
URL = sys.argv[1] if len(sys.argv) > 1 else "https://vercel.com/seongsoo-s-portfolio-site/seongsoo-dev/83t2qS8LcmXV98gDnjMMkaTHESjU"

def new_tab():
    req = urllib.request.Request(f"http://{CDP}/json/new?about:blank", method="PUT")
    return json.load(urllib.request.urlopen(req, timeout=10))

def close_tab(tid):
    try: urllib.request.urlopen(f"http://{CDP}/json/close/{tid}", timeout=10).read()
    except Exception: pass

t = new_tab()
ws = websocket.create_connection(t["webSocketDebuggerUrl"], timeout=30, max_size=64*1024*1024)
i = [0]
def cmd(method, params=None):
    i[0]+=1
    ws.send(json.dumps({"id":i[0],"method":method,"params":params or {}}))
    while True:
        m=json.loads(ws.recv())
        if m.get("id")==i[0]: return m
cmd("Page.enable"); cmd("Runtime.enable")
cmd("Page.navigate", {"url": URL})
time.sleep(8)  # SPA + log streaming
# grab visible text
r = cmd("Runtime.evaluate", {"expression": "document.body.innerText", "returnByValue": True})
txt = r.get("result",{}).get("result",{}).get("value","")
print(txt[:8000])
ws.close()
close_tab(t["id"])
