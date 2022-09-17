<template>
  <div class="page">
    <div class="header">
      <h1>Заявки</h1>
      <div class="header__buttons">
        <button @click="toggleSettingsPopup" class="btn btn-primary">Настройки</button>
        <button @click="toggleFormPopup(undefined)" class="btn btn-success">Добавить заявку</button>
      </div>
    </div>
    <div class="requests">
      <div v-for="field in fields" :key="field._id" class="requests__table">
        <div class="table__headers">{{ field.name }}</div>
        <div v-for="request in requests" :key="request._id" class="table__cells">
          <div v-if="field.type === 'datetime-local'" class="table__cell">{{ formatDateForTable(request[field.code]) }}</div>
          <div v-else class="table__cell">{{ formatValueForTable(request[field.code]) }}</div>
        </div>
      </div>
      <div>
        <div class="header-empty"></div>
        <div v-for="request in requests" :key="request._id">
          <img src="icons/pensil.svg" alt="change" class="requests__button" @click="toggleFormPopup(request)">
        </div>
      </div>
      <div>
        <div class="header-empty"></div>
        <div v-for="request in requests" :key="request._id">
          <img src="icons/trash.svg" class="requests__button" alt="delete" @click="deleteRequest(request._id)">
        </div>
      </div>
    </div>
    <Settings v-if="this.showSettings" @toggleSettingsPopup="toggleSettingsPopup"/>
    <Form v-if="this.showForm" :request="this.request" @toggleFormPopup="toggleFormPopup" @getRequests="getRequests" />
  </div>
</template>

<script lang="ts">
import Settings from './components/Settings.vue'
import axios from 'axios'
import Form from './components/Form.vue'
import { defineComponent } from '@vue/runtime-core'
import { RequestFormData } from './models/app-models'

export default defineComponent({
  name: 'App',
  components: {
    Settings,
    Form,
  },
  data: (): RequestFormData => {
    return {
    showForm: false,
    showSettings: false,
    requests: [],
    request: undefined,
    fields: [],
    }
  },
  methods: {
    toggleFormPopup(request: Request): void {
      this.request = request
      this.showForm = !this.showForm
    },
    toggleSettingsPopup(): void {
      this.showSettings = !this.showSettings
    },
    formatValueForTable(value: any): string {
      if (typeof value === "boolean") {
        return value ? "да" : "нет"
      }
      return value;
    },
    formatDateForTable(value: string): string {
      if(value) {
        return value.replace('T', ' ')
      }
      return value
    },
    async deleteRequest(id: string): Promise<void> {
      try {
        await axios.delete('http://localhost:3000/requests', { data: { id } })
        this.getRequests()
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
    async getFields(): Promise<void> {
      try {
        const response = await axios.get('http://localhost:3000/fields')
        this.fields = response.data
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
    async getRequests(): Promise<void> {
      try {
        const response = await axios.get('http://localhost:3000/requests')
        this.requests = response.data
      } catch(e) {
        alert("Ошибка HTTP: " + e)
      }
    },
  },
  async created() {
    await this.getFields()
    await this.getRequests()
  },
})
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  font: 1rem/1.5 var(--bs-font-sans-serif);
  margin-top: 60px;
}
.background {
  position: fixed;
  background-color: rgba(49, 49, 49, 0.65);
  width:100%;
  height:100%;
  top:0;
  left:0;
}
.window {
  position: fixed;
  box-sizing: border-box;
  top: 50%;
  left: 50%;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  transform:translate(-50%,-50%);
  text-align: center;
}
.page {
  padding: 2%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.requests {
  display: flex;
  justify-content: stretch;
}
.requests__table {
  flex-grow: 1;
}
.table__headers {
  height: 40px;
  font-weight: 700;
  text-align: start;
  border-bottom: solid black 1px;
  white-space: nowrap;
  padding: 5px;
}
.header-empty {
  height: 40px;
}
.requests__button {
  width: 20px;
  cursor: pointer;
  margin: 20px 10px;
}
.table__cells {
  border-bottom: solid rgb(187, 187, 187) 1px;
}
.table__cell {
  height: 60px;
  overflow: scroll;
  max-width: 400px;
  text-align: start;
}
.header__buttons {
  display: flex;
  gap: 20px;
}
.form__buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}
.requests__buttons {
  cursor: pointer;
  align-self: center;
  justify-self: center;
}
</style>
