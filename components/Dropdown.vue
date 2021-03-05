<template>
  <div class="dropdown"  :class="{ show: showDropdown }">
    <button
      @click="showOrHideDropdown"
      class="btn btn-secondary dropdown-toggle"
      type="button"
      id="dropdownMenuButton"
    >
      {{ data[activeIndexLocal] }}
    </button>
    <div
      class="dropdown-menu"
      :class="{ show: showDropdown }"
      aria-labelledby="dropdownMenuButton"
    >
      <div
        class="dropdown-item"
        v-for="(el, idx) of data"
        @click="selectElement(idx)"
        :class="activeIndexLocal === idx ? 'active' : ''"
        :key="idx"
      >
        {{ el }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    data: {
      required: true,
    },
    activIndex: {
      required: false,
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      showDropdown: false,
      activeIndexLocal: this.activIndex,
    }
  },
  methods: {
    showOrHideDropdown(e) {
      document.querySelectorAll('.dropdown').forEach((el) => {
        el.classList.remove('show')
      })
      document.querySelectorAll('.dropdown-menu').forEach((el) => {
        el.classList.remove('show')
      })
      this.showDropdown = !this.showDropdown
    },
    clickOnOverlay(e) {
      const dropdown = e.target.closest('.dropdown')

      if (!dropdown && this.showDropdown) {
        this.showDropdown = false
      }
    },
    selectElement(idx) {
      this.showDropdown = false
      if (idx === this.activeIndexLocal) return false
      this.activeIndexLocal = idx
      this.$emit('changeSelectDropdown', idx)
    },
  },
  mounted() {
    setTimeout(() => {
      document.body.addEventListener('click', this.clickOnOverlay)
    }, 0)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.clickOnOverlay)
  },
}
</script>

<style lang="scss">
.dropdown {
}
</style>