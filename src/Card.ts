import data, { CardProperty } from './data'
import sample from 'lodash/sample'

type CardPropertyKey = keyof typeof data.cardProperties
type CardPropertiesMap = { [prop in CardPropertyKey]: CardProperty }

const CARD_PROPERTY_REQUIREMENT = Object.keys(data.cardProperties).length

export class CardPropertyError extends Error {}

/**
 * Card
 *
 * A simple model for building a card with certain properties
 */
export default class Card {
  playerName: string
  cardProperties: CardPropertiesMap

  constructor(playerName: string, cardProperties: CardPropertiesMap) {
    this.playerName = playerName
    this.cardProperties = cardProperties
    if (Object.keys(cardProperties).length !== CARD_PROPERTY_REQUIREMENT) {
      throw new CardPropertyError('Invalid set of card properties')
    }
  }

  getIds = (): string[] => {
    return Object.entries(this.cardProperties).map(
      ([, property]) => property.id as string
    )
  }

  getPrice = () => {
    // @TODO: Fix this logic of how prices are summed using 256-bit integers
    return Object.entries(this.cardProperties)
      .reduce((sum, [, property]) => sum + (+property ? property.price : 0), 0)
      .toPrecision(2)
  }

  static createRandom = (playerName: string): Card => {
    const properties = this._sampleCardProperties()
    return new this(playerName, properties)
  }

  static _sampleCardProperties = (): CardPropertiesMap => {
    return Object.keys(data.cardProperties).reduce(
      (o, key) => ({
        ...o,
        [key as CardPropertyKey]: sample(
          data.cardProperties[key as CardPropertyKey]
        ),
      }),
      {}
    ) as CardPropertiesMap
  }
}
