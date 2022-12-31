import path from 'path'
import type Card from './Card'
import { Canvas, Image, loadImage } from 'canvas'
import TextToSVG from 'text-to-svg'
import data from './data'

const CARD_WIDTH = 344
const CARD_HEIGHT = 476

const fontsLoaded: { [key: string]: Promise<TextToSVG> } = {}
const imagesLoaded: { [key: string]: string } = {}

/**
 * CardRenderer
 *
 * A simple modal and renderer for card data
 */
export default class CardRenderer {
  static fontRoot: string
  playerName: string
  color: string
  icon: string
  darkBg: boolean
  bgName: string
  bgArtist: string
  title: string
  background: string
  frame: string
  width: number
  height: number
  canvas: Canvas

  constructor(card: Card, scale: number = 1) {
    const { cardProperties: props } = card

    this.width = CARD_WIDTH * scale
    this.height = CARD_HEIGHT * scale
    this.color = props.colors.hex!
    this.playerName = card.playerName
    this.background = props.bgs.img!
    this.bgName = props.bgs.name!
    this.bgArtist = props.bgs.artist!
    this.icon = props.icons.img!
    this.frame = props.frames.img!
    this.title = props.titles?.name || ''
    this.darkBg = !!props.bgs.darkBg
    this.canvas = new Canvas(this.width, this.height)

    if (this.title === 'NONE') {
      this.title = ''
    }
  }

  static setFontRoot = (fontRoot: string) => {
    this.fontRoot = fontRoot
  }

  loadImage = async (input: string, w: number, h: number): Promise<string> => {
    if (!input) return ''

    if (!imagesLoaded[input]) {
      const canvas = new Canvas(w, h)
      const ctx = canvas.getContext('2d')

      ctx.drawImage(await loadImage(input), 0, 0, w, h)
      imagesLoaded[input] = canvas.toDataURL()
    }

    return imagesLoaded[input]
  }

  getFont = async (fontFile: string) => {
    if (!fontsLoaded[fontFile]) {
      fontsLoaded[fontFile] = new Promise(async (resolve, reject) => {
        TextToSVG.load(
          path.join(CardRenderer.fontRoot, fontFile),
          (err, textToSvg) => {
            if (err) return reject(err)
            return resolve(textToSvg!)
          }
        )
      })
    }

    return fontsLoaded[fontFile]
  }

  renderPlayerName = async () => {
    const svg = await this.getFont('Tungsten-Bold.ttf')
    return svg.getD(this.playerName.toUpperCase(), {
      fontSize: 38,
      x: CARD_WIDTH / 2,
      y: 320,
      anchor: 'center middle',
      attributes: {
        fill: this.textColor,
      },
    })
  }

  renderArtistName = async () => {
    const svg = await this.getFont('jb-r.ttf')
    return svg.getD(this.bgArtist.toUpperCase(), {
      fontSize: 10,
      x: 20,
      y: CARD_HEIGHT - 15,
      anchor: 'left baseline',
      attributes: {
        fill: this.textColor,
      },
    })
  }

  renderBgName = async () => {
    const svg = await this.getFont('jb-r.ttf')
    return svg.getD(this.bgName.toUpperCase(), {
      fontSize: 10,
      x: CARD_WIDTH / 2,
      y: CARD_HEIGHT - 15,
      anchor: 'center baseline',
      attributes: {
        fill: this.textColor,
      },
    })
  }

  renderTitle = async () => {
    const svg = await this.getFont('jb-im.ttf')
    return svg.getD(this.title.toUpperCase(), {
      fontSize: 18,
      x: CARD_WIDTH / 2,
      y: 348,
      anchor: 'center middle',
      attributes: {
        fill: this.captionColor,
      },
    })
  }

  get captionColor(): string {
    return this.darkBg ? '#FFF' : '#000'
  }

  get textColor(): string {
    return this.color == '#D9D9D9' ||
      this.color == '#19E6B5' ||
      this.color == '#19E62D' ||
      this.color == '#B1E619' ||
      this.color == '#E6DE19' ||
      this.color == '#ffffff' ||
      this.color == '#19DAE6'
      ? '#000'
      : '#fff'
  }

  get bgPathColor(): string {
    return this.color == '#D9D9D9' ||
      this.color == '#9F9F9F' ||
      this.color == '#FFFFFF' ||
      this.color == '#4F4F4F' ||
      this.color == '#000000'
      ? '#FFFFFF'
      : '#00000060'
  }

  async renderSvg(): Promise<string> {
    return (await data.renderTemplateString(this)).replace(/\s+/g, ' ')
  }

  async renderPng(): Promise<string> {
    const svg = await this.renderSvg()
    const canvas = new Canvas(this.width, this.height)
    const ctx = canvas.getContext('2d')
    const img = await loadImage('data:image/svg+xml;base64,' + btoa(svg))
    ctx.drawImage(img, 0, 0)

    return canvas.toDataURL('image/png')
  }
}
