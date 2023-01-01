import CardRenderer from "src/CardRenderer"
import { renderTemplateString } from "../cardSvgTemplate"

import titles from './card-properties/titles.json'
import bgs from './card-properties/bgs.json'
import colors from './card-properties/colors.json'
import frames from './card-properties/frames.json'
import icons from './card-properties/icons.json'

export type CardProperty = {
  id: number | string
  name: string
  type?: string
  darkBg?: boolean
  hex?: string
  artist?: string
  thumbnail?: string
  img?: string
  price: number
}

export default {
  renderTemplateString: (renderer: CardRenderer): Promise<string> => {
    return renderTemplateString(renderer);
  },

  cardProperties: {
    bgs: bgs as CardProperty[],
    colors: colors as CardProperty[],
    frames: frames as CardProperty[],
    icons: icons as CardProperty[],
    titles: titles as CardProperty[],
  },
}
