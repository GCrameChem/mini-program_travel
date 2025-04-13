<template>
  <view class="datetime-picker">
    <picker
      mode="date"
      :value="value"
      :start="minDate"
      :end="maxDate"
      @change="handleChange"
    >
      <view class="picker-content">{{ value }}</view>
    </picker>
  </view>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    minDate: {
      type: String,
      default: '2020-01-01',
    },
    maxDate: {
      type: String,
      default: '2025-12-31',
    },
  },
  methods: {
    handleChange(e) {
      this.$emit('update:value', e.detail.value);
    },
  },
};
</script>

<style scoped>
.datetime-picker {
  padding: 20px;
}
.picker-content {
  font-size: 16px;
  color: #333;
}
</style>
