<template>
  <div class="dropdown" :class="{ show: showDropdown }">
    <button
      id="dropdownMenuButton"
      class="btn btn-secondary dropdown-toggle"
      type="button"
      @click="showOrHideDropdown"
    >
      {{ data[activeIndexLocal] }}
    </button>
    <div
      class="dropdown-menu"
      :class="{ show: showDropdown }"
      aria-labelledby="dropdownMenuButton"
    >
      <div
        v-for="(el, idx) of data"
        :key="idx"
        class="dropdown-item"
        :class="activeIndexLocal === idx ? 'active' : ''"
        @click="selectElement(idx)"
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
  mounted() {
    setTimeout(() => {
      document.body.addEventListener('click', this.clickOnOverlay)
    }, 0)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.clickOnOverlay)
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
}
</script>

<style lang="scss"></style>
