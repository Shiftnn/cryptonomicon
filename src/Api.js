// socket requirments
const api_key =
  "98205db68d3404a9abf3835989c2fa211682663096a066a2df58758a59fa8b65";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${api_key}`
);

// variables
const aggregateIndex = "5";
let tickersHandlers = new Map();

//socket logic
//  ↓sub add
function sendOnWS(ticker) {
  const messageToSend = JSON.stringify({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USDT`],
  });
  socket.send(messageToSend);
}

//  ↓sub remove
function removeFromWs(ticker) {
  const messageToSend = JSON.stringify({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USDT`],
  });
  socket.send(messageToSend);
}

//  ↓wait for socket to open => send sub
const subscribeToTicker = (ticker) => {
  socket.addEventListener("open", sendOnWS(ticker), { once: true });
  // if (socket.readyState === socket.OPEN) {
  //   sendOnWS(ticker);
  //   return;
  // }
};

// ↓to convert invalidSub via BTC to USD
const reconvertor = (ticker) => {
  const messageToSend = JSON.stringify({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~BTC`],
  });
  socket.send(messageToSend);
};

//  ↓sub remove compact reuse
const unSubscribeFromTicker = (ticker) => {
  removeFromWs(ticker);
};

//  ↓socket's message data handler
socket.addEventListener("message", (socketData) => {
  const {
    TYPE: type,
    PRICE: price,
    FROMSYMBOL: name,
  } = JSON.parse(socketData.data);
  // if (type !== aggregateIndex || price === undefined) {
  //   return;
  // }
  if (type !== aggregateIndex || price === undefined) {
    return;
  }
  let ticker = tickersHandlers.get(name) ?? [];
  ticker.forEach((fn) => fn(price));
});

export const subscribeToTickerOnWs = (ticker, cb) => {
  let subscribers = tickersHandlers.get(ticker) ?? [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTicker(ticker);
  // ↓checks if ticker is valid to work with

  socket.addEventListener("open", (ticker) => {
    socket.send({
      action: "SubAdd",
      subs: [`5~CCCAGG~${ticker}~USDT`],
    }),
      { once: true };
  });
  socket.addEventListener("message", (socketData) => {
    const subActivated = "SUBSCRIPTION_ALREADY_ACTIVE";
    const {
      TYPE: type,
      PARAMETER: par,
      MESSAGE: msg,
    } = JSON.parse(socketData.data);
    if (
      type === "500" &&
      par === `5~CCCAGG~${ticker}~USDT` &&
      msg !== subActivated
    ) {
      const tickers = tickersHandlers.get(ticker);
      tickers.forEach((fn) => fn("invalidSub"));
      reconvertor(ticker);
    } else {
      return;
    }
  });
};

export const unSubscribeFromTickerOnWs = (ticker) => {
  tickersHandlers.delete(ticker);
  unSubscribeFromTicker(ticker);
};
