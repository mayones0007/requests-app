<template>
  <div v-if="fields" class="background"/>
    <div class="window">
      <div class="header">
        <h3>Настройка полей заявок</h3>
        <div class="header__buttons">
          <button @click="toggleCreateEditSettings" class="btn btn-outline-success">Добавить поле</button>
          <button @click="closeSettingsPopup" class="btn btn-outline-danger">Закрыть</button>
        </div>
      </div>
      <div class="table">
        <div class="table__headers">Название</div>
        <div class="table__headers">Описание</div>
        <div class="table__headers">Тип</div>
        <div class="table__headers">Обязательно</div>
        <div class="table__headers">Значения</div>
        <div class="table__headers">Значение</div>
      </div>
      <div v-for="field in this.fields" :key="field._id" :field="field" class="table">
        <div class="table__cell">{{field.name}}</div>
        <div class="table__cell">{{field.description}}</div>
        <div class="table__cell">{{field.type}}</div>
        <div class="table__cell">{{ formatValueForTable(field.required) }}</div>
        <div class="table__cell">
          <div v-for="(option, index) in field.options" :key="option">
            {{index+1}}: {{option}}
          </div>
        </div>
        <div v-if="field.type === 'datetime-local'" class="table__cell">{{formatDateForTable(field.defaultValue)}}</div>
        <div v-else class="table__cell">{{field.defaultValue}}</div>
        <img src="icons/pensil.svg" alt="change" class="requests__buttons" @click="editField(field)">
        <img src="icons/trash.svg" class="requests__buttons" alt="delete" @click="deleteField(field._id)">
      </div>
    </div>
    <CreateEditSettings v-if="showCreateEditPopup" :field="editedField" @closeForm="closeForm" @getFields="getFields"/>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import axios from 'axios'
import { SettingsComponentData, SettingsFormField } from '../models/app-models'
import CreateEditSettings from './CreateEditSettings.vue'

export default defineComponent({
  name: 'Settings',
  components: { CreateEditSettings },
  emits: {
    toggleSettingsPopup: () => true,
    getFields: () => true,
  },
  data: (): SettingsComponentData => ({
    showCreateEditPopup: false,
    editedField: undefined,
    fields: undefined,
  }),
  methods: {
    editField(field: SettingsFormField): void {
      this.editedField = field;
      this.toggleCreateEditSettings();
    },
    closeForm(): void {
      this.toggleCreateEditSettings();
      this.editedField = undefined;
    },
    toggleCreateEditSettings(): void {
      this.showCreateEditPopup = !this.showCreateEditPopup
    },
    async getFields(): Promise<void> {
      try {
        const response = await axios.get('http://localhost:3000/fields')
        this.fields = response.data
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
    async deleteField(id: string): Promise<void> {
      try {
        await axios.delete('http://localhost:3000/fields', { data: { id } })
        this.getFields()
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
    closeSettingsPopup(): void {
      this.$emit('toggleSettingsPopup')
      this.$emit('getFields')
    },
    formatValueForTable(value: any): string {
      if (typeof value === "boolean") {
        return value ? "да" : "нет"
      }
      return value
    },
    formatDateForTable(value: string): string {
      if(value) {
        return value.replace('T', ' ')
      }
      return value
    },
  },
  mounted() {
    this.getFields()
  }
})
</script>

<style scoped> 
.table {
  display: grid;
  grid-template-columns: 150px 150px 150px 150px 150px 150px 30px 30px;
  margin: 0;
}
.table__cell {
  border-bottom: solid rgb(187, 187, 187) 1px;
}
</style>
