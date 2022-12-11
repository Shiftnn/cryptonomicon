<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <input
          @keyup="similarSearch()"
          v-model="ticker"
          @keyup.enter="this.add"
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
      <h1 style="color: red" v-if="this.exist">Такой тикер уже существует</h1>
    </div>
  </div>
  <add-button @click="this.add()" />
</template>
<script>
import AddButton from "./AddButton.vue";
export default {
  async created() {
    this.BCMessageHandler;
    const pennies = await fetch(
      `https://min-api.cryptocompare.com/data/all/coinlist?summary=true`
    );
    const jsoned = await pennies.json();
    const data = await jsoned.Data;
    for (let key in data) {
      this.tokenArr.push(key);
    }
  },

  components: { AddButton },
  props: ["tickersFromParent"],
  emits: ["tickerToAdd"],
  data() {
    return {
      ticker: "",
      tokenArr: [],
      theFour: [],
      exist: false,
      tickers: this.tickersFromParent,
    };
  },

  methods: {
    add() {
      if (this.ticker) {
        if (
          this.tickers.find((t) => t.name === this.ticker.toUpperCase()) !==
          undefined
        ) {
          this.exist = true;
        } else {
          this.exist = false;
          this.$emit("tickerToAdd", this.ticker);
          this.ticker = "";
        }
      } else {
        return;
      }
    },

    selectedSimilarTick(name) {
      this.ticker = name.cur;
      this.add();
      setTimeout(() => {
        this.theFour = [name];
      }, 1);
    },

    similarSearch() {
      this.exist = null;
    },
  },

  watch: {
    ticker() {
      this.$emit("the-four", this.theFour);
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
};
</script>
