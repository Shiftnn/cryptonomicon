const api_key =
  "98205db68d3404a9abf3835989c2fa211682663096a066a2df58758a59fa8b65";
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${api_key}`
);

const aggregateIndex = "5";
let tickersHandlers = new Map();

function sendOnWS(ticker) {
  const messageToSend = JSON.stringify({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
  socket.send(messageToSend);
}
function removeFromWs(ticker) {
  const messageToSend = JSON.stringify({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
  socket.send(messageToSend);
}

const subscribeToTicker = (ticker) => {
  socket.addEventListener("open", sendOnWS(ticker), { once: true });
  if (socket.readyState === socket.OPEN) {
    sendOnWS(ticker);
    return;
  }
};
const unSubscribeFromTicker = (ticker) => {
  removeFromWs(ticker);
};

socket.addEventListener("message", (socketData) => {
  const {
    TYPE: type,
    PRICE: price,
    FROMSYMBOL: name,
  } = JSON.parse(socketData.data);

  if (type !== aggregateIndex || price === undefined) {
    return;
  }

  console.log(name, price, type);
  let ticker = tickersHandlers.get(name) ?? [];
  ticker.forEach((fn) => fn(price));
});

export const subscribeToTickerOnWs = (ticker, cb) => {
  let subscribers = tickersHandlers.get(ticker) ?? [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTicker(ticker);
};
export const unSubscribeFromTickerOnWs = (ticker) => {
  tickersHandlers.delete(ticker);
  unSubscribeFromTicker(ticker);
};
