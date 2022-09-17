<template>
  <div class="background">
    <div class="window">
      <h2>Заявкa</h2>
      <div v-for="field in this.fields" :key="field._id">
        <div v-if="form" class="input-group input-group-sm mb-3">
          <span v-if="field.type !== 'checkbox'" class="input-group-text">{{ formatFieldLabel(field) }}</span>
          <textarea v-if="field.type === 'textarea'" v-model="form[field.code]" :placeholder="field.description" class="form-control"/>
          <select v-else-if="field.type === 'select'" v-model="form[field.code]" class="form-select form-select-sm">
            <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
          </select>
          <div v-else-if="field.type === 'checkbox'" class="form-check">
            <input class="form-check-input" type="checkbox" :id="form[field.code]" v-model="form[field.code]">
            <label class="form-check-label" :for="form[field.code]">{{ formatFieldLabel(field) }}</label>
          </div>
          <input v-else :type="field.type" :placeholder="field.description" v-model="form[field.code]" class="form-control">
        </div>
      </div>
      <div class="text-muted">*обязательно для заполнения</div>
      <div class="form__buttons">
        <button class="btn btn-outline-success" :disabled="isSubmitButtonDisabled" @click="saveRequest">{{ saveButtonName }}</button>
        <button class="btn btn-outline-danger" @click="closeForm">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { FormData, Request, SettingsFormField } from '../models/app-models'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
props: {
  request: {
    type: Object as PropType<Request>,
    required: false,
  },
},
  emits: {
    toggleFormPopup: () => true,
    getRequests: () => true,
  },
  data: (): FormData => {
    return {
      form: undefined,
      fields: undefined,
    }
  },
  computed: {
    saveButtonName(): string {
      return this.request ? 'Сохранить заявку' : 'Добавить заявку'
    },
    isSubmitButtonDisabled(): boolean {
      return this.fields  ? this.fields.some(field => {
       return (this.form && field.required && !this.form[field.code])
      }) : false
    }
  },
  methods: {
    async getFields(): Promise<void> {
      try {
        const response = await axios.get('http://localhost:3000/fields')
        this.fields = response.data
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
    async saveRequest(): Promise<void> {
      try {
        if (this.request) {
          await axios.patch('http://localhost:3000/requests', this.form)
        } else {
          await axios.post('http://localhost:3000/requests', this.form)
        }
        this.$emit('getRequests')
        this.$emit('toggleFormPopup')
      } catch(e) {
        console.log("Ошибка HTTP: " + e)
      }
    },
    formatFieldLabel(field: SettingsFormField) : string {
      return `${field.name}${field.required ? '*' : ''}`
    },
    closeForm(){
      this.$emit('toggleFormPopup')
      this.$emit('getRequests')
    }
  },
  async created() {
    await this.getFields()
    if (!this.request) {
      this.fields?.forEach(element => {
        this.form = {
          ...this.form,
          [element.code!]: element.type === 'checkbox' ? element.defaultValue || false : element.defaultValue || undefined
        }
      })
    } else {
        this.form = this.request
    }
  },
})
</script>
