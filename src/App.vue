<template>
  <div class="container mx-auto flex flex-col items-center p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                @keyup="similarSearch()"
                v-model="ticker"
                @keyup.enter="add"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Например DOGE"
                autocomplete="off"
              />
            </div>
            <div
              style="
                margin-top: 5px;
                display: flex;
                gap: 5px;
                cursos: pointer;
                width: fit-content;
              "
              v-if="ticker"
            >
              <div
                @click="selectedSimilarTick(token)"
                style="
                  background: #ced3dc;
                  height: 20px;
                  min-width: 50px;
                  width: fit-content;
                  max-width: 200px;
                  border-radius: 10px;
                  color: black;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0px 10px;
                  cursor: pointer;
                "
                v-for="token in theFour"
                :key="token"
              >
                {{ token.cur }}
              </div>
            </div>
            <h1 style="color: red" v-if="exist">Такой тикер уже существует</h1>
          </div>
        </div>
        <button
          @click="add"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <div>
            <button
              v-if="curPage[0] > 0"
              @click="previousPage()"
              type="button"
              class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Назад
            </button>
            <button
              @click="nextPage()"
              v-if="originalTickets.length > curPage[1]"
              type="button"
              class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Вперед
            </button>
          </div>
          <div class="flex items-center">
            <h2 class="mx-2">Фильтр</h2>
            <input
              v-model="filterInput"
              type="text"
              class="block pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            />
          </div>
        </div>
      </section>

      <template v-if="tickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div v-for="(t, index) in tickers" :key="t.name">
            <div
              v-if="index + 1 <= 6"
              @click="select(t)"
              :class="selectedTicker === t ? 'border-4' : ''"
              class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
            >
              <div class="px-4 py-5 sm:p-6 text-center">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  {{ t.name }} - USD
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {{ t.price }}
                </dd>
              </div>
              <div class="w-full border-t border-gray-200"></div>
              <button
                @click.stop="handleDelete(t)"
                class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
              >
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#718096"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path></svg
                >Удалить
              </button>
            </div>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <section class="relative" v-if="selectedTicker">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="bar of normalizedGraph"
            :key="bar"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="selectedTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
// [x] 11. данные капают даже когда тикер не выбран | 5+
// [x] 2. При удалении тикера данные продолжают поступать до перезагрузки | 5+
// [x] 6. Наличие в состоянии ЗАВИСИМЫХ ДАННЫХ | Критичность: 5+
// [ ] 4. Запросы напрямую внутри компонента (???) | Критичность: 5
// [x] 5. Обработка ошибок API | Критичность: 5 ?
// [x] 3. Количество запросов | Критичность: 4
// [x] 8. При удалении тикера не изменяется localStorage | Критичность: 4
// [x] 1. Одинаковый код в watch | Критичность: 3 ?
// [ ] 9. localStorage и анонимные вкладки | Критичность: 3 ?
// [x] 7. График ужасно выглядит если будет много цен | Критичность: 2
// [ ] 10. Магические строки и числа (URL, 5000 миллисекунд задержки, ключ локал стораджа, количество на странице) |  Критичность: 1 ?

// ? - проблема ли ?

// Параллельно
// [x] График сломан если везде одинаковые значения

import { subscribeToTickerOnWs, unSubscribeFromTickerOnWs } from "./Api";

export default {
  async created() {
    const pennies = await fetch(
      `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
    );
    const jsoned = await pennies.json();
    const data = await jsoned.Data;
    for (let key in data) {
      this.tokenArr.push(key);
    }
    const keys = [];

    for (let i = 0; localStorage.length > i; i++) {
      keys.unshift(localStorage.key(i));
    }

    for (let i = 0; localStorage.length > i; i++) {
      if ((keys[i] !== "page") & (keys[i] !== "filter")) {
        const key = JSON.parse(localStorage.getItem(keys[i]));
        this.originalTickets.unshift(key);
        this.tickers.unshift(key);
        subscribeToTickerOnWs(keys[i], (newPrice) =>
          this.updateTicker(keys[i], newPrice)
        );
      }
    }

    this.curPage = JSON.parse(localStorage.getItem("page"));
    this.pageSetter();
    if (localStorage.getItem("filter")) {
      this.filterInput = JSON.parse(
        localStorage.getItem("filter")
      ).toLowerCase();
      this.existTicksFilter();
    } else {
      return false;
    }
  },

  name: "App",

  data() {
    return {
      ticker: "", // input ticker
      tickers: [], // all tickers
      selectedTicker: null, // ticker's graph
      graph: [], // calculated graphic of sells by last n seconds
      exist: null, // if current ticker repeats
      tokenArr: [], // pushs tokens on created
      corTokens: [], // pushed tokens on created but names only
      theFour: [], // four tickets that shows below the input ticker
      filterInput: "", // the filtration input
      originalTickets: [], // duplicated array of tickers for the filter
      curPage: [0, 6], // elements of tickers on cur page
    };
  },

  computed: {
    filterLSRemover() {
      return localStorage.removeItem("filter");
    },
    normalizedGraph() {
      let maxValue = Math.max(...this.graph);
      let minValue = Math.min(...this.graph);
      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      } else {
        return this.graph.map(
          (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
        );
      }
    },
  },

  watch: {
    normalizedGraph() {
      if (this.graph.length > 37) {
        this.graph.splice(0, 4);
        // 38
      }
    },

    tickers() {
      if (this.tickers == 0 && this.curPage[0] > 0) {
        this.curPage = [this.curPage[0] - 6, this.curPage[1] - 6];
        this.pageSetter();
        localStorage.removeItem("page");
        localStorage.setItem("page", JSON.stringify(this.curPage));
      }
    },

    selectedTicker() {
      this.graph = [];
    },

    filterInput() {
      if (this.filterInput.length > 0) {
        let words = this.originalTickets;
        let inputWord = this.filterInput;
        let spl = inputWord.toUpperCase().split("");
        this.tickers = [];
        localStorage.setItem("filter", JSON.stringify(inputWord));
        for (let i = 0; words.length > i; i++) {
          /*transfer the word*/
          let chars = 0;
          for (let c = 0; inputWord.length > c; c++) {
            // transfer the character of cur word
            let word = words[i].name.split("");
            if (spl[c] === word[c]) {
              chars += 1;
              if (chars === spl.length) {
                this.tickers.push(words[i]);
              }
            } else {
              false;
            }
          }
        }
      } else {
        this.tickers = [];
        setTimeout(() => {
          for (let i = 0; this.originalTickets.length > i; i++) {
            this.tickers.unshift(this.originalTickets[i]);
          }
        }, 100);
        this.filterLSRemover;
      }
    },

    ticker() {
      let word = this.ticker.toUpperCase().split("");
      const tokens = this.tokenArr;
      const theFour = this.theFour;
      for (let i = 0; tokens.length > i; i++) {
        let chars = 0;
        const cur = tokens[i];
        for (let c = 0; word.length > c; c++) {
          if (cur[c] === word[c]) {
            chars += 1;
            if (chars === word.length) {
              if (theFour.length > 0) {
                for (let f = 0; theFour.length > f; f++) {
                  if (cur === theFour[f].cur) {
                    return false;
                  } else {
                    this.theFour.unshift({ cur });
                    this.theFour = this.theFour.slice(0, 4);
                    break;
                  }
                }
              } else {
                this.theFour.unshift({ cur });
                this.theFour = this.theFour.slice(0, 4);
              }
            }
          }
        }
      }
    },
  },

  methods: {
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graph.push(price);
          }
          t.price = price;
        });
    },

    pageSetter() {
      const six = this.originalTickets.slice(this.curPage[0], this.curPage[1]);
      this.tickers = [...six];
    },

    nextPage() {
      let cur = this.curPage;
      this.filterInput;
      if (this.filterInput.length > 0) {
        this.curPage = [0, 6];
        this.filterInput = "";
        this.pageSetter();
        this.filterLSRemover;
      } else {
        this.curPage = [cur[0] + 6, cur[1] + 6];
        this.pageSetter();
        localStorage.removeItem("page");
        localStorage.setItem("page", JSON.stringify(this.curPage));
      }
    },

    previousPage() {
      const cur = this.curPage;
      this.filterLSRemover;
      if (cur[0] === 0) {
        this.filterInput = "";
        this.pageSetter;
        this.tickers = [...this.originalTickets];
      } else {
        this.curPage = [cur[0] - 6, cur[1] - 6];
        this.pageSetter();
        localStorage.removeItem("page");
        localStorage.setItem("page", JSON.stringify(this.curPage));
      }
      this.filterInput = "";
    },

    selectedSimilarTick(name) {
      this.ticker = name.cur;
      this.add();
      setTimeout(() => {
        this.theFour = [name];
      }, 1);
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(ticketToRemove) {
      this.tickers = this.tickers.filter((t) => t !== ticketToRemove);
      this.originalTickets = this.originalTickets.filter(
        (t) => t !== ticketToRemove
      );
      localStorage.removeItem(ticketToRemove.name);
      if (this.selectedTicker == ticketToRemove) {
        this.selectedTicker = null;
      }
      unSubscribeFromTickerOnWs(ticketToRemove.name);
    },

    similarSearch() {
      this.exist = null;
    },

    add() {
      if (this.ticker) {
        const currentTicker = {
          name: this.ticker.toUpperCase(),
          price: "",
        };
        localStorage.setItem(
          `${currentTicker.name}`,
          JSON.stringify(currentTicker)
        );
        subscribeToTickerOnWs(currentTicker.name, (newPrice) =>
          this.updateTicker(currentTicker.name, newPrice)
        );

        if (
          this.tickers.find((t) => t.name === currentTicker.name) !== undefined
        ) {
          this.exist = true;
        } else {
          this.exist = false;
          this.tickers.push(currentTicker);
          this.originalTickets.push(currentTicker);
          this.ticker = "";
        }
      } else {
        return;
      }
    },
  },
};
</script>
