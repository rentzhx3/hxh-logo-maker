import {createApp} from 'vue'
import './style.css'
import App from './App.vue'

import VueGtag from "vue-gtag";

let app = createApp(App);
if (import.meta.env.VITE_GANALYTICS_ID) {
    console.log(import.meta.env.VITE_GANALYTICS_ID);
    app.use(VueGtag, {
        config: {
            id: import.meta.env.VITE_GANALYTICS_ID,
            anonymize_ip: true,
        }
    })
}

app.mount('#app')
