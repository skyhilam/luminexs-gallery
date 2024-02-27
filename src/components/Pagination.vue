<template>
  <div class="overflow-x-scroll scrollbar-hide">
    <div class="flex items-center justify-between">
      <div class="hidden sm:block">
        <p class="text-sm text-gray-700">
          由
          <span class="font-medium">{{ meta.from }}</span>
          至
          <span class="font-medium">{{ meta.to }}</span>
          共
          <span class="font-medium">{{ meta.total }}</span>
          結果
        </p>
      </div>
      <div>
        <ul
          class="max-w-full flex items-center justify-center space-x-1 overflow-x-scroll scrollbar-hide"
          role="navigation"
          aria-label="Pagination"
        >
          <!-- 上一頁 -->
          <li>
            <button
              type="button"
              @click.prevent="switched(meta.current_page - 1)"
              class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
              :disabled="pageIsOutOfBounds(meta.current_page - 1)"
            >
              <ChevronLeftIcon  />
            </button>
          </li>

          <template v-if="section > 1">
            <li>
              <button
                type="button"
                class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
                @click.prevent="switched(1)"
              >
                1
              </button>
            </li>

            <li>
              <button
                type="button"
                class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
                @click.prevent="goBackASection"
              >
                ...
              </button>
            </li>
          </template>

          <li
            v-for="page in pages"
            :class="{ current: meta.current_page === page }"
            :key="page"
          >
            <template v-if="meta.current_page === page">
              <span
                class="py-1 px-3 block text-sm text-white rounded-md whitespace-nowrap bg-primary h-full"
                >{{ page }}</span
              >
            </template>

            <template v-else>
              <button
                type="button"
                class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
                @click.prevent="switched(page)"
              >
                {{ page }}
              </button>
            </template>
          </li>

          <template v-if="section < sections">
            <li>
              <button
                type="button"
                class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
                @click.prevent="goForwardASection"
              >
                ...
              </button>
            </li>
            <li>
              <button
                type="button"
                class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
                @click.prevent="switched(meta.last_page)"
              >
                {{ meta.last_page }}
              </button>
            </li>
          </template>

          <!-- 下一頁 -->
          <li>
            <button
              type="button"
              class="py-1 px-3 hover:bg-gray-300 block text-sm rounded-md whitespace-nowrap h-full"
              @click.prevent="switched(meta.current_page + 1)"
              :disabled="pageIsOutOfBounds(meta.current_page + 1)"
            >
              <ChevronRightIcon />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import { range } from "lodash";
import { ChevronLeftIcon, ChevronRightIcon } from "@vue-hero-icons/outline";
export default {
  components: {
    ChevronLeftIcon, ChevronRightIcon,
  },
  props: {
    meta: Object,
    pagekey: {
      type: String,
      default: "page",
    },
  },
  data() {
    return {
      numberPerSection: 7,
    };
  },
  computed: {
    section() {
      return Math.ceil(this.meta.current_page / this.numberPerSection);
    },
    sections() {
      return Math.ceil(this.meta.last_page / this.numberPerSection);
    },
    lastPage() {
      let lastPage =
        (this.section - 1) * this.numberPerSection + this.numberPerSection;

      if (this.section === this.sections) {
        lastPage = this.meta.last_page;
      }

      return lastPage;
    },
    pages() {
      return range(
        (this.section - 1) * this.numberPerSection + 1,
        this.lastPage + 1
      );
    },
  },
  mounted() {
    if (this.meta.current_page > this.meta.last_page) {
      this.switched(this.meta.last_page);
    }
  },
  methods: {
    switched(page) {
      if (this.pageIsOutOfBounds(page)) {
        return;
      }
      const query = {};
      query[this.pagekey] = page;
      this.$emit("switched", page);
    },

    pageIsOutOfBounds(page) {
      return page <= 0 || page > this.meta.last_page;
    },

    goBackASection() {
      this.switched(this.firstPageOfSection(this.section - 1));
    },

    goForwardASection() {
      this.switched(this.firstPageOfSection(this.section + 1));
    },

    firstPageOfSection(section) {
      return (section - 1) * this.numberPerSection + 1;
    },
  },
};
</script>
