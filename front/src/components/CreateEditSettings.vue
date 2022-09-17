<template>
  <div class="background">
    <div class="window">
      <h2>Поле</h2>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Название поля*</span>
        <input type="text" v-model="form.name" class="form-control">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Описание поля</span>
        <input type="text" v-model="form.description" class="form-control">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Тип поля*</span>
        <select v-model="form.type" class="form-select form-select-sm" @change="clearDefaultValue">
          <option value="text">текстовое поле</option>
          <option value="textarea">многострочное поле</option>
          <option value="checkbox">флажок</option>
          <option value="select">выпадающий список</option>
          <option value="datetime-local">дата и время</option>
        </select>
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Значения поля</span>
        <button @click="toggleSelectOptionsPopup" :disabled="form.type !== 'select'" class="form-control btn btn-outline-success">Добавить</button>
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Значение по умолчанию</span>
        <select v-if="form.type === 'checkbox'" v-model="form.defaultValue" class="form-select form-select-sm">
          <option :value="true">да</option>
          <option :value="false">нет</option>
        </select>
        <select v-else-if="form.type === 'select'" v-model="form.defaultValue" class="form-select form-select-sm">
          <option v-for="option in form.options" :key="option" :value="option">{{ option }}</option>
        </select>
        <input v-else :type="form.type" v-model="form.defaultValue" class="form-control">
      </div>
      <div class="input-group input-group-sm mb-3">
        <span class="input-group-text">Обязательное</span>
        <select v-model="form.required" class="form-select form-select-sm">
          <option :value="true">да</option>
          <option :value="false">нет</option>
        </select>
      </div>
      <div class="text-muted">*обязательно для заполнения</div>
      <div class="form__buttons">
        <button @click="saveField" :disabled="isSubmitButtonDisabled" class="btn btn-outline-success">{{ buttonName }}</button>
        <button @click="closeForm" class="btn btn-outline-danger">Закрыть</button>
      </div>
    </div>
  </div>
  <div v-if="showSelectOptionsPopup" class="background">
    <div class="window">
      <h2>Опции</h2>
      <div class="options">
        <div v-for="(option, index) in form.options" :key="option" class="values_form-input">
          <div class="option">{{ option }}</div>
          <img src="icons/trash.svg" class="requests__buttons" alt="delete" @click="deleteOption(index)">
        </div>
        <div class="input-group input-group-sm mb-3">
          <input type="text" class="form-control" v-model="newOption">
          <button @click="addOption" class="btn btn-success">Добавить</button>
        </div>
      </div>
      <button @click="toggleSelectOptionsPopup" class="btn btn-outline-danger">Закрыть</button>
    </div>
  </div>
</template>

<script lang="ts">
import { SettingsFormField, CreateEditSettingsData } from '../models/app-models'
import { defineComponent, PropType } from 'vue'
import axios from 'axios'

export default defineComponent({
props: {
  field: {
    type: Object as PropType<SettingsFormField>,
    required: false,
  },
},
emits: {
  closeForm: () => true,
  getFields: () => true,
},
data(): CreateEditSettingsData {
  return {
    form: undefined,
    showSelectOptionsPopup: false,
    newOption: '',
  }
},
computed: {
  buttonName(): string {
    return this.field ? 'Сохранить поле' : 'Добавить поле'
  },
  isSubmitButtonDisabled(): boolean {
    if (this.form?.name && this.form?.type) {
      return false
    } else {
      return true
    } 
  }
},
methods: {
  initForm(): void {
    this.form = {
      _id: '',
      name: '',
      code: '',
      description: '',
      type: '',
      required: false,
      options: [],
      defaultValue: undefined,
    }
  },
  toggleSelectOptionsPopup(): void {
    this.showSelectOptionsPopup = !this.showSelectOptionsPopup
  },
  addOption(): void {
    if (this.newOption) {
      if (this.form) { 
        this.form.options = [...this.form.options, this.newOption]
      }
      this.newOption = '';
    }
  },
  deleteOption(i: number): void{
    this.form?.options.splice(i, 1)
  },
  async saveField(): Promise<void> {
    try {
      if (this.field) {
        await axios.patch('http://localhost:3000/fields', this.form)
      } else {
        await axios.post('http://localhost:3000/fields', this.form)
      }
      await this.$emit('getFields')
      this.initForm()
      this.closeForm()
    } catch(e) {
      console.log("Ошибка HTTP: " + e)
    }
  },
  closeForm() {
    this.$emit('closeForm')
  },
  clearDefaultValue(): void {
    if (this.form) {
      this.form.defaultValue = undefined;
      this.form.options = [];
    }
  }
},

created() {
  this.initForm()
  if (this.field) {
    Object.keys(this.form!).forEach((key) => this.form![key] = this.field![key])
  }}
})
</script>

<style scoped>
.options {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
}
.values_form-input {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 20px;
}
.option {
  text-align: start;
}
</style>