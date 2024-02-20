// styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// colors
import colors from 'vuetify/util/colors'

// composables
import { createVuetify } from 'vuetify'

export default createVuetify({
  defaults: {
    VSheet: {
      color: colors.grey.darken4
    },
  }
})