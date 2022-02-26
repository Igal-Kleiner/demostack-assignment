import { getUniqueId } from "../utils/shared"

class LoopItem {
  id: string
  path: string
  isPlaying: boolean

  constructor(path: string) {
    this.id = getUniqueId()
    this.path = path
    this.isPlaying = false
  }

  togglePlaying():void {
    this.isPlaying = !this.isPlaying
  }
}

export default LoopItem