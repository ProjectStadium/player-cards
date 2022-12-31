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
  cardProperties: {
    bgs: require('./card-properties/bgs.json') as CardProperty[],
    colors: require('./card-properties/colors.json') as CardProperty[],
    frames: require('./card-properties/frames.json') as CardProperty[],
    icons: require('./card-properties/icons.json') as CardProperty[],
    titles: require('./card-properties/titles.json') as CardProperty[],
  },
}
