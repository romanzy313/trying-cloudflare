type Options = {
  url: string;
};

type DecodedEvent<T> = {
  method: string;
  data: T;
};

function processEvent<T>(msg: string): DecodedEvent<T> | null {
  try {
    const decoded = JSON.parse(msg);
    const method = decoded["method"];
    const data = decoded["data"];

    if (!method || !data) return null;

    return {
      method,
      data,
    };
  } catch (err) {
    console.error("process event error", err);

    return null;
  }
}

export const hsWs = (opts: Options) => {
  const ws = new WebSocket(opts.url);

  ws.addEventListener("message", (ev) => {
    // const data = ev.data

    const v = processEvent(ev.data as string);

    if (!v) return;

    const { method, data } = v;

    // check our router for it
  });
  //
};
